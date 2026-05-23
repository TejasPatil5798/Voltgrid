const express = require('express')
const mongoose = require('mongoose')
const Schedule = require('../models/Schedule')
const Batch = require('../models/Batch')
const Notification = require('../models/Notification')
const Enrollment = require('../models/Enrollment')
const Course = require('../models/Course')
const Lesson = require('../models/Lesson')
const User = require('../models/User')
const Message = require('../models/Message')
const { requireRole } = require('../middleware/auth')
const { formatScheduleDoc } = require('../lib/scheduleHelpers')
const {
  sendMessage,
  listConversationsForLearner,
  getThreadMessages,
  getUnreadMessageCount,
} = require('../lib/messagingHelpers')

const router = express.Router()
const requireLearner = requireRole('learner', 'student')

function dbReady() {
  return mongoose.connection.readyState === 1
}

function ensureDb(_req, res, next) {
  if (!dbReady()) return res.status(503).json({ error: 'Database unavailable' })
  next()
}

function learnerObjectId(req) {
  return new mongoose.Types.ObjectId(req.user.id)
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

router.use(ensureDb, requireLearner)

function denyCourseBatchWrites(_req, res) {
  res.status(403).json({
    error: 'Students cannot create or edit courses and batches.',
  })
}

router.get('/courses', async (req, res) => {
  try {
    const studentId = learnerObjectId(req)
    const enrollments = await Enrollment.find({ studentId }).sort({ lastActiveAt: -1 }).lean()
    if (!enrollments.length) return res.json({ success: true, data: [] })

    const courseIds = enrollments.map((e) => e.courseId)
    const tutorIds = [...new Set(enrollments.map((e) => e.tutorId))]
    const [courses, tutors, moduleRows] = await Promise.all([
      Course.find({ _id: { $in: courseIds } }).lean(),
      User.find({ _id: { $in: tutorIds } }).select('name').lean(),
      Lesson.aggregate([
        { $match: { courseId: { $in: courseIds } } },
        { $group: { _id: '$courseId', count: { $sum: 1 } } },
      ]),
    ])

    const courseMap = Object.fromEntries(courses.map((c) => [String(c._id), c]))
    const tutorMap = Object.fromEntries(tutors.map((t) => [String(t._id), t.name || 'Tutor']))
    const modulesMap = Object.fromEntries(moduleRows.map((r) => [String(r._id), r.count]))

    const data = enrollments.map((e) => {
      const courseId = String(e.courseId)
      const course = courseMap[courseId]
      const modulesTotal = modulesMap[courseId] || course?.moduleCount || 0
      const progress = e.progress ?? 0
      return {
        id: courseId,
        title: course?.title || 'Course',
        batch: course?.batch || '',
        tutor: tutorMap[String(e.tutorId)] || 'Tutor',
        progress,
        status: e.status,
        modulesTotal,
        modulesDone: Math.min(modulesTotal, Math.round((progress / 100) * modulesTotal)),
        readOnly: true,
      }
    })

    res.json({ success: true, data })
  } catch (err) {
    console.error('learner courses error', err)
    res.status(500).json({ error: 'Failed to load courses' })
  }
})

router.get('/batches', async (req, res) => {
  try {
    const studentId = learnerObjectId(req)
    const batches = await Batch.find({ studentIds: studentId }).sort({ name: 1 }).lean()
    const tutorIds = [...new Set(batches.map((b) => b.tutorId))]
    const tutors = tutorIds.length
      ? await User.find({ _id: { $in: tutorIds } }).select('name').lean()
      : []
    const tutorMap = Object.fromEntries(tutors.map((t) => [String(t._id), t.name || 'Tutor']))

    const data = batches.map((b) => ({
      id: b._id.toString(),
      name: b.name,
      subject: b.subject || '',
      description: b.description || '',
      tutor: tutorMap[String(b.tutorId)] || 'Tutor',
      readOnly: true,
    }))

    res.json({ success: true, data })
  } catch (err) {
    console.error('learner batches error', err)
    res.status(500).json({ error: 'Failed to load batches' })
  }
})

router.post('/courses', denyCourseBatchWrites)
router.put('/courses/:id', denyCourseBatchWrites)
router.patch('/courses/:id', denyCourseBatchWrites)
router.delete('/courses/:id', denyCourseBatchWrites)
router.post('/batches', denyCourseBatchWrites)
router.put('/batches/:id', denyCourseBatchWrites)
router.patch('/batches/:id', denyCourseBatchWrites)
router.delete('/batches/:id', denyCourseBatchWrites)
router.post('/batches/:id/learners', denyCourseBatchWrites)
router.delete('/batches/:id/learners/:studentId', denyCourseBatchWrites)

router.get('/schedule', async (req, res) => {
  try {
    const studentId = learnerObjectId(req)
    const from = req.query.from ? new Date(req.query.from) : new Date(Date.now() - 7 * 86400000)
    const to = req.query.to ? new Date(req.query.to) : new Date(Date.now() + 120 * 86400000)
    const memberBatchIds = await Batch.find({ studentIds: studentId }).distinct('_id')
    const items = await Schedule.find({
      status: { $ne: 'cancelled' },
      startAt: { $gte: from, $lte: to },
      $or: [{ studentIds: studentId }, { batchIds: { $in: memberBatchIds } }],
    })
      .sort({ startAt: 1 })
      .lean()
    const data = await Promise.all(items.map((item) => formatScheduleDoc(item)))
    res.json({ success: true, data })
  } catch (err) {
    console.error('learner schedule error', err)
    res.status(500).json({ error: 'Failed to load schedule' })
  }
})

router.get('/dashboard', async (req, res) => {
  try {
    const studentId = learnerObjectId(req)
    const enrollments = await Enrollment.find({ studentId }).lean()
    const memberBatchIds = await Batch.find({ studentIds: studentId }).distinct('_id')
    const upcoming = await Schedule.find({
      status: { $ne: 'cancelled' },
      startAt: { $gte: new Date() },
      $or: [{ studentIds: studentId }, { batchIds: { $in: memberBatchIds } }],
    })
      .sort({ startAt: 1 })
      .limit(5)
      .lean()
    const upcomingClasses = await Promise.all(upcoming.map((item) => formatScheduleDoc(item)))
    const unreadCount = await Notification.countDocuments({
      userId: studentId,
      role: { $in: ['learner', 'student'] },
      read: false,
    })
    res.json({
      success: true,
      data: {
        enrolledCount: enrollments.length,
        upcomingCount: upcomingClasses.length,
        unreadNotifications: unreadCount,
        upcomingClasses,
      },
    })
  } catch (err) {
    console.error('learner dashboard error', err)
    res.status(500).json({ error: 'Failed to load dashboard' })
  }
})

router.get('/notifications', async (req, res) => {
  try {
    const studentId = learnerObjectId(req)
    const items = await Notification.find({
      userId: studentId,
      role: { $in: ['learner', 'student'] },
    })
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
    console.error('learner notifications error', err)
    res.status(500).json({ error: 'Failed to load notifications' })
  }
})

router.patch('/notifications/read-all', async (req, res) => {
  try {
    const studentId = learnerObjectId(req)
    await Notification.updateMany(
      { userId: studentId, role: { $in: ['learner', 'student'] }, read: false },
      { read: true },
    )
    res.json({ success: true })
  } catch (err) {
    console.error('learner notifications read-all error', err)
    res.status(500).json({ error: 'Failed to mark notifications as read' })
  }
})

router.get('/messages/unread-count', async (req, res) => {
  try {
    const studentId = learnerObjectId(req)
    const count = await getUnreadMessageCount('learner', studentId)
    res.json({ success: true, count })
  } catch (err) {
    console.error('learner messages unread error', err)
    res.status(500).json({ error: 'Failed to load unread count' })
  }
})

router.get('/messages', async (req, res) => {
  try {
    const studentId = learnerObjectId(req)
    const data = await listConversationsForLearner(studentId)
    res.json({ success: true, data })
  } catch (err) {
    console.error('learner messages error', err)
    res.status(err.status || 500).json({ error: err.message || 'Failed to load messages' })
  }
})

router.get('/messages/:threadId', async (req, res) => {
  try {
    const studentId = learnerObjectId(req)
    const tutorId = req.query.tutorId
    if (!tutorId) return res.status(400).json({ error: 'tutorId is required' })
    const data = await getThreadMessages({
      threadId: req.params.threadId,
      viewerRole: 'learner',
      tutorId,
      studentId,
    })
    res.json({ success: true, data })
  } catch (err) {
    console.error('learner thread error', err)
    res.status(err.status || 500).json({ error: err.message || 'Failed to load thread' })
  }
})

router.post('/messages', async (req, res) => {
  try {
    const studentId = learnerObjectId(req)
    const { text, threadId, courseId, tutorId, courseTitle } = req.body || {}
    const user = await User.findById(studentId).lean()
    const { message, threadId: tid } = await sendMessage({
      fromRole: 'learner',
      tutorId,
      studentId,
      text,
      threadId,
      courseId,
      courseTitle,
      studentName: user?.name,
    })
    res.json({ success: true, data: message, threadId: tid })
  } catch (err) {
    console.error('learner send message error', err)
    res.status(err.status || 500).json({ error: err.message || 'Failed to send message' })
  }
})

module.exports = router
