const Notification = require('../models/Notification')
const Course = require('../models/Course')
const User = require('../models/User')
const Batch = require('../models/Batch')

function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function toLocalDateKey(date) {
  const d = new Date(date)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function formatDateLabel(date) {
  const d = new Date(date)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  let dayLabel = d.toLocaleDateString('en-IN', { weekday: 'short' })
  if (sameDay(d, today)) dayLabel = 'Today'
  else if (sameDay(d, tomorrow)) dayLabel = 'Tomorrow'
  return {
    dayLabel,
    date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    dateKey: toLocalDateKey(d),
    time: d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }),
    endTime: null,
    tone: sameDay(d, today) ? 'today' : 'upcoming',
  }
}

function formatScheduleTimeRange(startAt, endAt, durationMinutes) {
  const start = new Date(startAt)
  const end = endAt
    ? new Date(endAt)
    : new Date(start.getTime() + (Number(durationMinutes) || 60) * 60000)
  const labels = formatDateLabel(start)
  labels.endTime = end.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })
  labels.time = `${labels.time} – ${labels.endTime}`
  return labels
}

function buildScheduleMeta(item, courseTitle) {
  const subject = item.subject || courseTitle || ''
  const parts = [subject, item.sessionType, `${item.durationMinutes || 60} min`].filter(Boolean)
  return item.meta?.trim() || parts.join(' · ')
}

async function formatScheduleDoc(item, { includeStudents = false, tutorName = null } = {}) {
  const labels = formatScheduleTimeRange(item.startAt, item.endAt, item.durationMinutes)
  let courseTitle = ''
  if (item.courseId) {
    const course = await Course.findById(item.courseId).lean()
    courseTitle = course?.title || ''
  }
  let tutor = tutorName
  if (!tutor && item.tutorId) {
    const user = await User.findById(item.tutorId).lean()
    tutor = user?.name || 'Tutor'
  }
  const payload = {
    id: item._id.toString(),
    ...labels,
    title: item.title,
    subject: item.subject || courseTitle,
    course: courseTitle,
    courseId: item.courseId?.toString(),
    tutor: tutor || '',
    tutorId: item.tutorId?.toString(),
    meta: buildScheduleMeta(item, courseTitle),
    description: item.description || '',
    meetingLink: item.meetingLink || '',
    startAt: item.startAt,
    endAt: item.endAt,
    durationMinutes: item.durationMinutes,
    sessionType: item.sessionType,
    status: item.status || 'scheduled',
    studentIds: (item.studentIds || []).map((id) => id.toString()),
    batchIds: (item.batchIds || []).map((id) => id.toString()),
  }
  if (item.batchIds?.length) {
    const batches = await Batch.find({ _id: { $in: item.batchIds } }).lean()
    payload.batchNames = batches.map((b) => b.name)
  } else {
    payload.batchNames = []
  }
  if (includeStudents && item.studentIds?.length) {
    const students = await User.find({ _id: { $in: item.studentIds } }).lean()
    payload.students = students.map((s) => ({
      id: s._id.toString(),
      name: s.name || s.email,
      email: s.email,
    }))
  }
  return payload
}

function scheduleNotificationMessage(title, startAt, action = 'scheduled') {
  const d = new Date(startAt)
  const dateStr = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  const timeStr = d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })
  if (action === 'cancelled') {
    return `Class cancelled: ${title} on ${dateStr} at ${timeStr}.`
  }
  if (action === 'updated') {
    return `Class updated: ${title} on ${dateStr} at ${timeStr}.`
  }
  return `New class scheduled: ${title} on ${dateStr} at ${timeStr}.`
}

async function notifyUsers(userIds, { role, title, message, type, scheduleId }) {
  if (!userIds.length) return
  const docs = userIds.map((userId) => ({
    userId,
    role,
    title,
    message,
    type,
    scheduleId,
    read: false,
  }))
  await Notification.insertMany(docs)
}

function batchScheduleMessage(title, startAt, batchNames, action) {
  const d = new Date(startAt)
  const dateStr = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  const timeStr = d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })
  const batchLabel = batchNames.length ? batchNames.join(', ') : 'your batch'
  if (action === 'cancelled') {
    return `Lecture cancelled for ${batchLabel}: ${title} on ${dateStr} at ${timeStr}.`
  }
  if (action === 'updated') {
    return `Lecture updated for ${batchLabel}: ${title} on ${dateStr} at ${timeStr}.`
  }
  return `New lecture scheduled for ${batchLabel}: ${title} on ${dateStr} at ${timeStr}.`
}

async function notifyScheduleEvent(
  schedule,
  { action = 'scheduled', previousStudentIds = [], batchNames = [] } = {},
) {
  const typeMap = {
    scheduled: 'schedule_created',
    updated: 'schedule_updated',
    cancelled: 'schedule_cancelled',
  }
  const type = typeMap[action] || 'schedule_created'
  const message =
    batchNames.length > 0
      ? batchScheduleMessage(schedule.title, schedule.startAt, batchNames, action)
      : scheduleNotificationMessage(schedule.title, schedule.startAt, action)
  const titleMap = {
    scheduled: batchNames.length ? 'New lecture scheduled' : 'New class scheduled',
    updated: 'Class schedule updated',
    cancelled: 'Class cancelled',
  }
  const title = titleMap[action] || 'Schedule update'

  const studentIds = (schedule.studentIds || []).map((id) => id.toString())
  const prev = previousStudentIds.map((id) => id.toString())
  const affected = [...new Set([...studentIds, ...prev])]

  if (affected.length) {
    await notifyUsers(affected, {
      role: 'learner',
      title,
      message,
      type,
      scheduleId: schedule._id,
    })
  }

  const tutorTitle =
    action === 'scheduled'
      ? 'Class scheduled'
      : action === 'updated'
        ? 'Schedule updated'
        : 'Class cancelled'
  const tutorMessage =
    action === 'scheduled'
      ? `You scheduled "${schedule.title}" successfully.`
      : action === 'updated'
        ? `You updated "${schedule.title}". Affected learners have been notified.`
        : `You cancelled "${schedule.title}". Affected learners have been notified.`

  await notifyUsers([schedule.tutorId], {
    role: 'tutor',
    title: tutorTitle,
    message: tutorMessage,
    type,
    scheduleId: schedule._id,
  })
}

function parseScheduleTimes({ date, startTime, endTime, startAt, durationMinutes }) {
  if (startAt) {
    const start = new Date(startAt)
    let end = null
    if (endTime && date) {
      end = new Date(`${date}T${endTime}`)
    } else if (durationMinutes) {
      end = new Date(start.getTime() + Number(durationMinutes) * 60000)
    }
    return { startAt: start, endAt: end, durationMinutes: Number(durationMinutes) || 60 }
  }
  if (!date || !startTime) return null
  const start = new Date(`${date}T${startTime}`)
  let end = endTime ? new Date(`${date}T${endTime}`) : null
  if (!end || end <= start) {
    end = new Date(start.getTime() + (Number(durationMinutes) || 60) * 60000)
  }
  const duration = Math.max(15, Math.round((end - start) / 60000))
  return { startAt: start, endAt: end, durationMinutes: duration }
}

module.exports = {
  formatDateLabel,
  formatScheduleTimeRange,
  formatScheduleDoc,
  notifyScheduleEvent,
  parseScheduleTimes,
  scheduleNotificationMessage,
}
