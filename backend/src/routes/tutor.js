const express = require('express')
const mongoose = require('mongoose')
const Course = require('../models/Course')
const Lesson = require('../models/Lesson')
const Note = require('../models/Note')
const Assignment = require('../models/Assignment')
const Quiz = require('../models/Quiz')
const Schedule = require('../models/Schedule')
const Batch = require('../models/Batch')
const Notification = require('../models/Notification')
const {
  formatBatchDoc,
  resolveScheduleStudentIds,
  notifyBatchMembership,
} = require('../lib/batchHelpers')
const Message = require('../models/Message')
const {
  formatScheduleDoc,
  notifyScheduleEvent,
  parseScheduleTimes,
} = require('../lib/scheduleHelpers')
const Enrollment = require('../models/Enrollment')
const TutorProfile = require('../models/TutorProfile')
const User = require('../models/User')
const { requireRole } = require('../middleware/auth')
const {
  sendMessage,
  listConversationsForTutor,
  getThreadMessages,
  getUnreadMessageCount,
} = require('../lib/messagingHelpers')

const router = express.Router()
const requireTutor = requireRole('tutor')

function dbReady() {
  return mongoose.connection.readyState === 1
}

function ensureDb(_req, res, next) {
  if (!dbReady()) return res.status(503).json({ error: 'Database unavailable' })
  next()
}

function tutorObjectId(req) {
  return new mongoose.Types.ObjectId(req.user.id)
}

function formatDateLabel(date) {
  const d = new Date(date)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const sameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  let dayLabel = d.toLocaleDateString('en-IN', { weekday: 'short' })
  if (sameDay(d, today)) dayLabel = 'Today'
  else if (sameDay(d, tomorrow)) dayLabel = 'Tomorrow'
  return {
    dayLabel,
    date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    time: d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }),
    tone: sameDay(d, today) ? 'today' : 'upcoming',
  }
}

function relativeTime(date) {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} min ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return new Date(date).toLocaleDateString('en-IN')
}

async function courseStudentCount(courseId) {
  return Enrollment.countDocuments({ courseId })
}

async function syncCourseModules(courseId) {
  const count = await Lesson.countDocuments({ courseId })
  await Course.findByIdAndUpdate(courseId, { moduleCount: count })
  return count
}

router.use(ensureDb, requireTutor)

router.get('/dashboard', async (req, res) => {
  try {
    const tutorId = tutorObjectId(req)
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(startOfDay)
    endOfDay.setDate(endOfDay.getDate() + 1)

    const [
      courses,
      todaysClasses,
      totalStudents,
      pendingDoubts,
      profile,
      upcomingSchedules,
    ] = await Promise.all([
      Course.find({ tutorId }).sort({ updatedAt: -1 }).lean(),
      Schedule.countDocuments({ tutorId, startAt: { $gte: startOfDay, $lt: endOfDay } }),
      Enrollment.countDocuments({ tutorId }),
      Message.countDocuments({ tutorId, fromRole: { $in: ['learner', 'student'] }, read: false }),
      TutorProfile.findOne({ userId: tutorId }).lean(),
      Schedule.find({ tutorId, startAt: { $gte: new Date() } })
        .sort({ startAt: 1 })
        .limit(1)
        .lean(),
    ])

    const courseIds = courses.map((c) => c._id)
    const lessonCounts = await Lesson.aggregate([
      { $match: { courseId: { $in: courseIds } } },
      { $group: { _id: '$courseId', count: { $sum: 1 } } },
    ])
    const lessonMap = Object.fromEntries(lessonCounts.map((l) => [String(l._id), l.count]))
    const enrollCounts = await Enrollment.aggregate([
      { $match: { courseId: { $in: courseIds } } },
      { $group: { _id: '$courseId', count: { $sum: 1 } } },
    ])
    const enrollMap = Object.fromEntries(enrollCounts.map((e) => [String(e._id), e.count]))

    const coursesWithCounts = courses.map((c) => ({
      ...c,
      id: c._id.toString(),
      students: enrollMap[c._id.toString()] || 0,
      modules: lessonMap[c._id.toString()] || c.moduleCount || 0,
      updated: c.updatedAt ? new Date(c.updatedAt).toISOString().slice(0, 10) : '',
    }))

    const nextClass = upcomingSchedules[0]
    const earnings = profile?.earningsThisMonth ?? 0

    res.json({
      success: true,
      data: {
        stats: {
          todaysClasses,
          totalLearners: totalStudents,
          pendingDoubts,
          earnings,
          earningsFormatted: `₹${earnings.toLocaleString('en-IN')}`,
          nextClassHint: nextClass
            ? `Next ${formatDateLabel(nextClass.startAt).time}`
            : 'No upcoming sessions',
        },
        courses: coursesWithCounts,
      },
    })
  } catch (err) {
    console.error('tutor dashboard error', err)
    res.status(500).json({ error: 'Failed to load dashboard' })
  }
})

router.get('/courses', async (req, res) => {
  try {
    const tutorId = tutorObjectId(req)
    const courses = await Course.find({ tutorId }).sort({ updatedAt: -1 }).lean()
    const enriched = await Promise.all(
      courses.map(async (c) => ({
        ...c,
        id: c._id.toString(),
        students: await courseStudentCount(c._id),
        modules: await Lesson.countDocuments({ courseId: c._id }),
        updated: c.updatedAt ? new Date(c.updatedAt).toISOString().slice(0, 10) : '',
      })),
    )
    res.json({ success: true, data: enriched })
  } catch (err) {
    console.error('tutor courses list error', err)
    res.status(500).json({ error: 'Failed to load courses' })
  }
})

router.post('/courses', async (req, res) => {
  try {
    const tutorId = tutorObjectId(req)
    const { title, batch, description, status } = req.body || {}
    if (!title?.trim()) return res.status(400).json({ error: 'Title is required' })
    const course = await Course.create({
      tutorId,
      title: title.trim(),
      batch: batch?.trim() || '',
      description: description?.trim() || '',
      status: Course.STATUSES.includes(status) ? status : 'Draft',
    })
    res.json({
      success: true,
      data: { ...course.toObject(), id: course._id.toString(), students: 0, modules: 0 },
    })
  } catch (err) {
    console.error('tutor create course error', err)
    res.status(500).json({ error: 'Failed to create course' })
  }
})

router.put('/courses/:id', async (req, res) => {
  try {
    const tutorId = tutorObjectId(req)
    const { title, batch, description, status } = req.body || {}
    const course = await Course.findOne({ _id: req.params.id, tutorId })
    if (!course) return res.status(404).json({ error: 'Course not found' })
    if (title?.trim()) course.title = title.trim()
    if (batch != null) course.batch = batch.trim()
    if (description != null) course.description = description.trim()
    if (status && Course.STATUSES.includes(status)) course.status = status
    await course.save()
    res.json({ success: true, data: course })
  } catch (err) {
    console.error('tutor update course error', err)
    res.status(500).json({ error: 'Failed to update course' })
  }
})

router.get('/courses/:id/content', async (req, res) => {
  try {
    const tutorId = tutorObjectId(req)
    const courseId = req.params.id
    const course = await Course.findOne({ _id: courseId, tutorId }).lean()
    if (!course) return res.status(404).json({ error: 'Course not found' })
    const [lessons, notes, assignments, quizzes] = await Promise.all([
      Lesson.find({ courseId }).sort({ order: 1, createdAt: -1 }).lean(),
      Note.find({ courseId }).sort({ createdAt: -1 }).lean(),
      Assignment.find({ courseId }).sort({ dueDate: 1 }).lean(),
      Quiz.find({ courseId }).sort({ createdAt: -1 }).lean(),
    ])
    res.json({ success: true, data: { course, lessons, notes, assignments, quizzes } })
  } catch (err) {
    console.error('tutor course content error', err)
    res.status(500).json({ error: 'Failed to load course content' })
  }
})

router.post('/lessons', async (req, res) => {
  try {
    const tutorId = tutorObjectId(req)
    const { courseId, title, videoUrl, description } = req.body || {}
    if (!courseId || !title?.trim()) {
      return res.status(400).json({ error: 'Course and title are required' })
    }
    const course = await Course.findOne({ _id: courseId, tutorId })
    if (!course) return res.status(404).json({ error: 'Course not found' })
    const lesson = await Lesson.create({
      courseId,
      tutorId,
      title: title.trim(),
      videoUrl: videoUrl?.trim() || '',
      description: description?.trim() || '',
      order: (await Lesson.countDocuments({ courseId })) + 1,
    })
    await syncCourseModules(courseId)
    res.json({ success: true, data: lesson })
  } catch (err) {
    console.error('tutor create lesson error', err)
    res.status(500).json({ error: 'Failed to upload lesson' })
  }
})

router.post('/notes', async (req, res) => {
  try {
    const tutorId = tutorObjectId(req)
    const { courseId, title, fileUrl, content } = req.body || {}
    if (!courseId || !title?.trim()) {
      return res.status(400).json({ error: 'Course and title are required' })
    }
    const course = await Course.findOne({ _id: courseId, tutorId })
    if (!course) return res.status(404).json({ error: 'Course not found' })
    const note = await Note.create({
      courseId,
      tutorId,
      title: title.trim(),
      fileUrl: fileUrl?.trim() || '',
      content: content?.trim() || '',
    })
    res.json({ success: true, data: note })
  } catch (err) {
    console.error('tutor create note error', err)
    res.status(500).json({ error: 'Failed to upload notes' })
  }
})

router.post('/assignments', async (req, res) => {
  try {
    const tutorId = tutorObjectId(req)
    const { courseId, title, description, dueDate } = req.body || {}
    if (!courseId || !title?.trim() || !dueDate) {
      return res.status(400).json({ error: 'Course, title, and due date are required' })
    }
    const course = await Course.findOne({ _id: courseId, tutorId })
    if (!course) return res.status(404).json({ error: 'Course not found' })
    const assignment = await Assignment.create({
      courseId,
      tutorId,
      title: title.trim(),
      description: description?.trim() || '',
      dueDate: new Date(dueDate),
    })
    res.json({ success: true, data: assignment })
  } catch (err) {
    console.error('tutor create assignment error', err)
    res.status(500).json({ error: 'Failed to create assignment' })
  }
})

router.post('/quizzes', async (req, res) => {
  try {
    const tutorId = tutorObjectId(req)
    const { courseId, title, maxScore, questions } = req.body || {}
    if (!courseId || !title?.trim()) {
      return res.status(400).json({ error: 'Course and title are required' })
    }
    const course = await Course.findOne({ _id: courseId, tutorId })
    if (!course) return res.status(404).json({ error: 'Course not found' })
    const quiz = await Quiz.create({
      courseId,
      tutorId,
      title: title.trim(),
      maxScore: Number(maxScore) || 100,
      questions: Array.isArray(questions) ? questions : [],
    })
    res.json({ success: true, data: quiz })
  } catch (err) {
    console.error('tutor create quiz error', err)
    res.status(500).json({ error: 'Failed to create quiz' })
  }
})

router.get('/schedule', async (req, res) => {
  try {
    const tutorId = tutorObjectId(req)
    const from = req.query.from ? new Date(req.query.from) : new Date(Date.now() - 30 * 86400000)
    const to = req.query.to ? new Date(req.query.to) : new Date(Date.now() + 120 * 86400000)
    const items = await Schedule.find({
      tutorId,
      status: { $ne: 'cancelled' },
      startAt: { $gte: from, $lte: to },
    })
      .sort({ startAt: 1 })
      .lean()
    const data = await Promise.all(items.map((item) => formatScheduleDoc(item, { includeStudents: true })))
    res.json({ success: true, data })
  } catch (err) {
    console.error('tutor schedule error', err)
    res.status(500).json({ error: 'Failed to load schedule' })
  }
})

router.post('/schedule', async (req, res) => {
  try {
    const tutorId = tutorObjectId(req)
    const body = req.body || {}
    const {
      courseId,
      title,
      subject,
      meta,
      description,
      meetingLink,
      sessionType,
      studentIds,
      batchIds,
      date,
      startTime,
      endTime,
      startAt,
      durationMinutes,
    } = body
    if (!title?.trim()) return res.status(400).json({ error: 'Class title is required' })
    const times = parseScheduleTimes({ date, startTime, endTime, startAt, durationMinutes })
    if (!times) return res.status(400).json({ error: 'Date and start time are required' })
    if (courseId) {
      const course = await Course.findOne({ _id: courseId, tutorId })
      if (!course) return res.status(404).json({ error: 'Course not found' })
    }
    const resolved = await resolveScheduleStudentIds(tutorId, batchIds, studentIds)
    const item = await Schedule.create({
      tutorId,
      courseId: courseId || undefined,
      title: title.trim(),
      subject: subject?.trim() || '',
      meta: meta?.trim() || '',
      description: description?.trim() || '',
      meetingLink: meetingLink?.trim() || '',
      startAt: times.startAt,
      endAt: times.endAt,
      durationMinutes: times.durationMinutes,
      sessionType: sessionType?.trim() || 'Live session',
      studentIds: resolved.studentIds,
      batchIds: resolved.batchIds,
      status: 'scheduled',
    })
    await notifyScheduleEvent(item, {
      action: 'scheduled',
      batchNames: resolved.batchNames,
    })
    const formatted = await formatScheduleDoc(item.toObject(), { includeStudents: true })
    res.json({ success: true, data: formatted })
  } catch (err) {
    console.error('tutor create schedule error', err)
    res.status(500).json({ error: 'Failed to create schedule item' })
  }
})

router.put('/schedule/:id', async (req, res) => {
  try {
    const tutorId = tutorObjectId(req)
    const item = await Schedule.findOne({ _id: req.params.id, tutorId })
    if (!item) return res.status(404).json({ error: 'Schedule not found' })
    const previousStudentIds = [...(item.studentIds || [])]
    const body = req.body || {}
    const times = parseScheduleTimes({
      date: body.date,
      startTime: body.startTime,
      endTime: body.endTime,
      startAt: body.startAt || item.startAt,
      durationMinutes: body.durationMinutes ?? item.durationMinutes,
    })
    if (body.title?.trim()) item.title = body.title.trim()
    if (body.subject != null) item.subject = body.subject.trim()
    if (body.meta != null) item.meta = body.meta.trim()
    if (body.description != null) item.description = body.description.trim()
    if (body.meetingLink != null) item.meetingLink = body.meetingLink.trim()
    if (body.sessionType != null) item.sessionType = body.sessionType.trim()
    if (body.courseId !== undefined) {
      if (body.courseId) {
        const course = await Course.findOne({ _id: body.courseId, tutorId })
        if (!course) return res.status(404).json({ error: 'Course not found' })
        item.courseId = body.courseId
      } else {
        item.courseId = undefined
      }
    }
    const resolved = await resolveScheduleStudentIds(
      tutorId,
      body.batchIds !== undefined ? body.batchIds : (item.batchIds || []).map(String),
      body.studentIds !== undefined ? body.studentIds : (item.studentIds || []).map(String),
    )
    item.studentIds = resolved.studentIds
    item.batchIds = resolved.batchIds
    if (times) {
      item.startAt = times.startAt
      item.endAt = times.endAt
      item.durationMinutes = times.durationMinutes
    }
    item.updatedAt = new Date()
    await item.save()
    await notifyScheduleEvent(item, {
      action: 'updated',
      previousStudentIds,
      batchNames: resolved.batchNames,
    })
    const formatted = await formatScheduleDoc(item.toObject(), { includeStudents: true })
    res.json({ success: true, data: formatted })
  } catch (err) {
    console.error('tutor update schedule error', err)
    res.status(500).json({ error: 'Failed to update schedule' })
  }
})

router.delete('/schedule/:id', async (req, res) => {
  try {
    const tutorId = tutorObjectId(req)
    const item = await Schedule.findOne({ _id: req.params.id, tutorId })
    if (!item) return res.status(404).json({ error: 'Schedule not found' })
    const previousStudentIds = [...(item.studentIds || [])]
    item.status = 'cancelled'
    item.updatedAt = new Date()
    await item.save()
    const batchDocs = item.batchIds?.length
      ? await Batch.find({ _id: { $in: item.batchIds } }).lean()
      : []
    await notifyScheduleEvent(item, {
      action: 'cancelled',
      previousStudentIds,
      batchNames: batchDocs.map((b) => b.name),
    })
    res.json({ success: true, cancelled: true })
  } catch (err) {
    console.error('tutor delete schedule error', err)
    res.status(500).json({ error: 'Failed to cancel schedule' })
  }
})

router.get('/notifications', async (req, res) => {
  try {
    const tutorId = tutorObjectId(req)
    const items = await Notification.find({ userId: tutorId, role: 'tutor' })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()
    const data = items.map((n) => ({
      id: n._id.toString(),
      title: n.title,
      message: n.message,
      read: !!n.read,
      type: n.type,
      time: relativeTime(n.createdAt),
      createdAt: n.createdAt,
    }))
    const unreadCount = data.filter((n) => !n.read).length
    res.json({ success: true, data, unreadCount })
  } catch (err) {
    console.error('tutor notifications error', err)
    res.status(500).json({ error: 'Failed to load notifications' })
  }
})

router.patch('/notifications/read-all', async (req, res) => {
  try {
    const tutorId = tutorObjectId(req)
    await Notification.updateMany({ userId: tutorId, role: 'tutor', read: false }, { read: true })
    res.json({ success: true })
  } catch (err) {
    console.error('tutor notifications read-all error', err)
    res.status(500).json({ error: 'Failed to mark notifications as read' })
  }
})

router.get('/messages/unread-count', async (req, res) => {
  try {
    const tutorId = tutorObjectId(req)
    const count = await getUnreadMessageCount('tutor', tutorId)
    res.json({ success: true, count })
  } catch (err) {
    console.error('tutor messages unread error', err)
    res.status(500).json({ error: 'Failed to load unread count' })
  }
})

router.get('/messages', async (req, res) => {
  try {
    const tutorId = tutorObjectId(req)
    const data = await listConversationsForTutor(tutorId)
    res.json({ success: true, data })
  } catch (err) {
    console.error('tutor messages error', err)
    res.status(err.status || 500).json({ error: err.message || 'Failed to load messages' })
  }
})

router.get('/messages/:threadId', async (req, res) => {
  try {
    const tutorId = tutorObjectId(req)
    const studentId = req.query.studentId
    if (!studentId) return res.status(400).json({ error: 'studentId is required' })
    const data = await getThreadMessages({
      threadId: req.params.threadId,
      viewerRole: 'tutor',
      tutorId,
      studentId,
    })
    res.json({ success: true, data })
  } catch (err) {
    console.error('tutor thread error', err)
    res.status(err.status || 500).json({ error: err.message || 'Failed to load thread' })
  }
})

router.post('/messages/reply', async (req, res) => {
  try {
    const tutorId = tutorObjectId(req)
    const { threadId, studentId, courseId, courseTitle, text } = req.body || {}
    const { message, threadId: tid } = await sendMessage({
      fromRole: 'tutor',
      tutorId,
      studentId,
      text,
      threadId,
      courseId,
      courseTitle,
    })
    res.json({ success: true, data: message, threadId: tid })
  } catch (err) {
    console.error('tutor reply error', err)
    res.status(err.status || 500).json({ error: err.message || 'Failed to send reply' })
  }
})

router.get('/batches', async (req, res) => {
  try {
    const tutorId = tutorObjectId(req)
    const list = await Batch.find({ tutorId }).sort({ createdAt: -1 }).lean()
    const data = await Promise.all(list.map((b) => formatBatchDoc(b, { includeStudents: true })))
    res.json({ success: true, data })
  } catch (err) {
    console.error('tutor batches list error', err)
    res.status(500).json({ error: 'Failed to load batches' })
  }
})

router.post('/batches', async (req, res) => {
  try {
    const tutorId = tutorObjectId(req)
    const { name, subject, description, studentIds } = req.body || {}
    if (!name?.trim()) return res.status(400).json({ error: 'Batch name is required' })
    const batch = await Batch.create({
      tutorId,
      name: name.trim(),
      subject: subject?.trim() || '',
      description: description?.trim() || '',
      studentIds: [...new Set((studentIds || []).filter(Boolean))],
    })
    const formatted = await formatBatchDoc(batch.toObject(), { includeStudents: true })
    res.json({ success: true, data: formatted })
  } catch (err) {
    console.error('tutor create batch error', err)
    res.status(500).json({ error: 'Failed to create batch' })
  }
})

router.put('/batches/:id', async (req, res) => {
  try {
    const tutorId = tutorObjectId(req)
    const batch = await Batch.findOne({ _id: req.params.id, tutorId })
    if (!batch) return res.status(404).json({ error: 'Batch not found' })
    const { name, subject, description } = req.body || {}
    if (name?.trim()) batch.name = name.trim()
    if (subject != null) batch.subject = subject.trim()
    if (description != null) batch.description = description.trim()
    batch.updatedAt = new Date()
    await batch.save()
    const formatted = await formatBatchDoc(batch.toObject(), { includeStudents: true })
    res.json({ success: true, data: formatted })
  } catch (err) {
    console.error('tutor update batch error', err)
    res.status(500).json({ error: 'Failed to update batch' })
  }
})

router.delete('/batches/:id', async (req, res) => {
  try {
    const tutorId = tutorObjectId(req)
    const batch = await Batch.findOne({ _id: req.params.id, tutorId })
    if (!batch) return res.status(404).json({ error: 'Batch not found' })
    await Batch.deleteOne({ _id: batch._id })
    res.json({ success: true, deleted: true })
  } catch (err) {
    console.error('tutor delete batch error', err)
    res.status(500).json({ error: 'Failed to delete batch' })
  }
})

router.post('/batches/:id/learners', async (req, res) => {
  try {
    const tutorId = tutorObjectId(req)
    const batch = await Batch.findOne({ _id: req.params.id, tutorId })
    if (!batch) return res.status(404).json({ error: 'Batch not found' })
    const studentId = req.body?.studentId
    if (!studentId) return res.status(400).json({ error: 'studentId is required' })
    const sid = new mongoose.Types.ObjectId(studentId)
    const exists = (batch.studentIds || []).some((id) => id.equals(sid))
    if (!exists) {
      batch.studentIds.push(sid)
      batch.updatedAt = new Date()
      await batch.save()
      await notifyBatchMembership(batch, sid, 'added')
    }
    const formatted = await formatBatchDoc(batch.toObject(), { includeStudents: true })
    res.json({ success: true, data: formatted })
  } catch (err) {
    console.error('tutor add batch learner error', err)
    res.status(500).json({ error: 'Failed to add learner to batch' })
  }
})

router.delete('/batches/:id/learners/:studentId', async (req, res) => {
  try {
    const tutorId = tutorObjectId(req)
    const batch = await Batch.findOne({ _id: req.params.id, tutorId })
    if (!batch) return res.status(404).json({ error: 'Batch not found' })
    const sid = new mongoose.Types.ObjectId(req.params.studentId)
    batch.studentIds = (batch.studentIds || []).filter((id) => !id.equals(sid))
    batch.updatedAt = new Date()
    await batch.save()
    await notifyBatchMembership(batch, sid, 'removed')
    const formatted = await formatBatchDoc(batch.toObject(), { includeStudents: true })
    res.json({ success: true, data: formatted })
  } catch (err) {
    console.error('tutor remove batch learner error', err)
    res.status(500).json({ error: 'Failed to remove learner from batch' })
  }
})

async function buildEnrollmentLearnerRows(tutorId) {
  const enrollments = await Enrollment.find({ tutorId }).sort({ lastActiveAt: -1 }).lean()
  const learnerIds = [...new Set(enrollments.map((e) => String(e.studentId)))]
  const courseIds = [...new Set(enrollments.map((e) => String(e.courseId)))]
  const [learners, courses] = await Promise.all([
    User.find({ _id: { $in: learnerIds } }).lean(),
    Course.find({ _id: { $in: courseIds } }).lean(),
  ])
  const learnerMap = Object.fromEntries(learners.map((s) => [String(s._id), s]))
  const courseMap = Object.fromEntries(courses.map((c) => [String(c._id), c]))

  return enrollments.map((e) => ({
    id: e._id.toString(),
    studentId: String(e.studentId),
    name: learnerMap[String(e.studentId)]?.name || 'Learner',
    email: learnerMap[String(e.studentId)]?.email || '',
    course: courseMap[String(e.courseId)]?.title || '',
    courseId: String(e.courseId),
    progress: e.progress,
    lastActive: relativeTime(e.lastActiveAt),
    status: e.status,
  }))
}

async function buildLearnerPoolRows(tutorId) {
  const [enrollments, batches, allLearnerUsers] = await Promise.all([
    Enrollment.find({ tutorId }).lean(),
    Batch.find({ tutorId }).select('studentIds').lean(),
    User.find({ role: { $in: ['learner', 'student'] } })
      .select('name email role')
      .sort({ name: 1 })
      .lean(),
  ])

  const courseIds = [...new Set(enrollments.map((e) => String(e.courseId)).filter(Boolean))]
  const courses = courseIds.length ? await Course.find({ _id: { $in: courseIds } }).lean() : []
  const courseMap = Object.fromEntries(courses.map((c) => [String(c._id), c.title || '']))
  const userMap = Object.fromEntries(allLearnerUsers.map((u) => [String(u._id), u]))
  const byStudent = new Map()

  for (const user of allLearnerUsers) {
    const sid = String(user._id)
    byStudent.set(sid, {
      id: sid,
      studentId: sid,
      name: user.name || 'Learner',
      email: user.email || '',
      courses: new Set(),
    })
  }

  for (const e of enrollments) {
    const sid = String(e.studentId)
    if (!sid) continue
    const existing = byStudent.get(sid) || {
      id: sid,
      studentId: sid,
      name: userMap[sid]?.name || 'Learner',
      email: userMap[sid]?.email || '',
      courses: new Set(),
    }
    const title = courseMap[String(e.courseId)]
    if (title) existing.courses.add(title)
    byStudent.set(sid, existing)
  }

  const batchOnlyIds = [...new Set(batches.flatMap((b) => (b.studentIds || []).map((id) => String(id))))]
  const missingBatchIds = batchOnlyIds.filter((sid) => !byStudent.has(sid))
  if (missingBatchIds.length) {
    const extraUsers = await User.find({ _id: { $in: missingBatchIds } }).lean()
    for (const user of extraUsers) {
      const sid = String(user._id)
      byStudent.set(sid, {
        id: sid,
        studentId: sid,
        name: user.name || 'Learner',
        email: user.email || '',
        courses: new Set(),
      })
    }
  }

  return Array.from(byStudent.values())
    .map((row) => ({
      id: row.studentId,
      studentId: row.studentId,
      name: row.name,
      email: row.email,
      course: [...row.courses].join(', '),
    }))
    .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
}

router.get('/learners', async (req, res) => {
  try {
    const tutorId = tutorObjectId(req)
    const pool = req.query.pool === 'true' || req.query.pool === '1'
    const data = pool ? await buildLearnerPoolRows(tutorId) : await buildEnrollmentLearnerRows(tutorId)
    res.json({ success: true, data })
  } catch (err) {
    console.error('tutor learners error', err)
    res.status(500).json({ error: 'Failed to load learners' })
  }
})

router.get('/students', (req, res) => res.redirect(307, '/api/tutor/learners'))

router.get('/profile', async (req, res) => {
  try {
    const tutorId = tutorObjectId(req)
    let profile = await TutorProfile.findOne({ userId: tutorId }).lean()
    if (!profile) {
      profile = await TutorProfile.create({ userId: tutorId, expertise: [] })
      profile = profile.toObject()
    }
    const user = await User.findById(tutorId).lean()
    res.json({
      success: true,
      data: {
        ...profile,
        name: user?.name,
        email: user?.email,
      },
    })
  } catch (err) {
    console.error('tutor profile error', err)
    res.status(500).json({ error: 'Failed to load profile' })
  }
})

router.put('/profile', async (req, res) => {
  try {
    const tutorId = tutorObjectId(req)
    const { name, expertise, timezone, weeklyHours, officeHours, nextOpenSlot } = req.body || {}
    if (name?.trim()) {
      await User.findByIdAndUpdate(tutorId, { name: name.trim() })
    }
    const profile = await TutorProfile.findOneAndUpdate(
      { userId: tutorId },
      {
        expertise: Array.isArray(expertise)
          ? expertise
          : typeof expertise === 'string'
            ? expertise.split(',').map((s) => s.trim()).filter(Boolean)
            : undefined,
        timezone,
        weeklyHours: Array.isArray(weeklyHours)
          ? weeklyHours
          : typeof weeklyHours === 'string'
            ? weeklyHours.split('\n').map((s) => s.trim()).filter(Boolean)
            : undefined,
        officeHours,
        nextOpenSlot,
        updatedAt: new Date(),
      },
      { upsert: true, new: true },
    ).lean()
    const user = await User.findById(tutorId).lean()
    res.json({ success: true, data: { ...profile, name: user?.name, email: user?.email } })
  } catch (err) {
    console.error('tutor profile update error', err)
    res.status(500).json({ error: 'Failed to update profile' })
  }
})

module.exports = router
