const mongoose = require('mongoose')
const Message = require('../models/Message')
const Conversation = require('../models/Conversation')
const Notification = require('../models/Notification')
const Enrollment = require('../models/Enrollment')
const Batch = require('../models/Batch')
const Course = require('../models/Course')
const User = require('../models/User')
const { notifyUser } = require('./batchHelpers')

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

function buildThreadId(tutorId, studentId, courseId) {
  const coursePart = courseId ? String(courseId) : 'general'
  return `thread-${coursePart}-${studentId}`
}

async function getAllowedStudentIdsForTutor(tutorId) {
  const tid = new mongoose.Types.ObjectId(tutorId)
  const [fromEnrollments, batches] = await Promise.all([
    Enrollment.find({ tutorId: tid }).distinct('studentId'),
    Batch.find({ tutorId: tid }).select('studentIds').lean(),
  ])
  const fromBatches = batches.flatMap((b) => (b.studentIds || []).map((id) => String(id)))
  return [...new Set([...fromEnrollments.map(String), ...fromBatches])]
}

async function getAllowedTutorIdsForStudent(studentId) {
  const sid = new mongoose.Types.ObjectId(studentId)
  const [fromEnrollments, batches] = await Promise.all([
    Enrollment.find({ studentId: sid }).distinct('tutorId'),
    Batch.find({ studentIds: sid }).distinct('tutorId'),
  ])
  return [...new Set([...fromEnrollments, ...batches].map(String))]
}

async function assertTutorCanMessageStudent(tutorId, studentId) {
  const allowed = await getAllowedStudentIdsForTutor(tutorId)
  if (!allowed.includes(String(studentId))) {
    const err = new Error('You can only message learners in your courses or batches')
    err.status = 403
    throw err
  }
}

async function assertStudentCanMessageTutor(studentId, tutorId) {
  const allowed = await getAllowedTutorIdsForStudent(studentId)
  if (!allowed.includes(String(tutorId))) {
    const err = new Error('You can only message your assigned tutors')
    err.status = 403
    throw err
  }
}

async function upsertConversation({
  threadId,
  tutorId,
  studentId,
  courseId,
  courseTitle,
  lastMessage,
  fromRole,
}) {
  const inc =
    fromRole === 'tutor'
      ? { 'unreadCounts.learner': 1 }
      : { 'unreadCounts.tutor': 1 }

  return Conversation.findOneAndUpdate(
    { threadId },
    {
      $set: {
        threadId,
        tutorId,
        studentId,
        participantIds: [tutorId, studentId],
        courseId: courseId || undefined,
        courseTitle: courseTitle || '',
        lastMessage: lastMessage.slice(0, 500),
        lastMessageAt: new Date(),
        updatedAt: new Date(),
      },
      $setOnInsert: { createdAt: new Date() },
      $inc: inc,
    },
    { upsert: true, new: true },
  )
}

async function notifyNewMessage({ receiverId, receiverRole, senderName }) {
  await notifyUser(receiverId, {
    role: receiverRole,
    title: 'New message',
    message: `New message from ${senderName}`,
    type: 'message_received',
  })
}

async function sendMessage({
  fromRole,
  tutorId,
  studentId,
  text,
  threadId,
  courseId,
  courseTitle,
  studentName,
}) {
  const trimmed = text?.trim()
  if (!trimmed) {
    const err = new Error('Message text is required')
    err.status = 400
    throw err
  }

  const tutorOid = new mongoose.Types.ObjectId(tutorId)
  const studentOid = new mongoose.Types.ObjectId(studentId)

  if (fromRole === 'tutor') {
    await assertTutorCanMessageStudent(tutorId, studentId)
  } else {
    await assertStudentCanMessageTutor(studentId, tutorId)
  }

  const finalThreadId = threadId || buildThreadId(tutorId, studentId, courseId)
  const senderId = fromRole === 'tutor' ? tutorOid : studentOid
  const receiverId = fromRole === 'tutor' ? studentOid : tutorOid
  const receiverRole = fromRole === 'tutor' ? 'learner' : 'tutor'

  const [sender, receiver] = await Promise.all([
    User.findById(senderId).select('name').lean(),
    User.findById(receiverId).select('name').lean(),
  ])

  const message = await Message.create({
    tutorId: tutorOid,
    studentId: studentOid,
    senderId,
    receiverId,
    studentName: studentName || (fromRole === 'learner' ? sender?.name : receiver?.name) || 'Learner',
    courseId: courseId || undefined,
    courseTitle: courseTitle || '',
    text: trimmed,
    fromRole: fromRole === 'student' ? 'learner' : fromRole,
    read: false,
    threadId: finalThreadId,
  })

  await upsertConversation({
    threadId: finalThreadId,
    tutorId: tutorOid,
    studentId: studentOid,
    courseId,
    courseTitle,
    lastMessage: trimmed,
    fromRole: fromRole === 'student' ? 'learner' : fromRole,
  })

  await notifyNewMessage({
    receiverId,
    receiverRole,
    senderName: sender?.name || (fromRole === 'tutor' ? 'Tutor' : 'Learner'),
  })

  return { message, threadId: finalThreadId }
}

async function listConversationsForTutor(tutorId) {
  const allowedStudentIds = await getAllowedStudentIdsForTutor(tutorId)
  if (!allowedStudentIds.length) return []

  const studentOids = allowedStudentIds.map((id) => new mongoose.Types.ObjectId(id))
  const [conversations, students] = await Promise.all([
    Conversation.find({
      tutorId,
      studentId: { $in: studentOids },
    })
      .sort({ lastMessageAt: -1 })
      .lean(),
    User.find({ _id: { $in: studentOids } }).select('name email role').lean(),
  ])

  const studentMap = Object.fromEntries(students.map((s) => [String(s._id), s]))
  const convByStudent = Object.fromEntries(conversations.map((c) => [String(c.studentId), c]))

  const rows = allowedStudentIds.map((sid) => {
    const student = studentMap[sid]
    const conv = convByStudent[sid]
    if (conv) {
      return formatConversationRow(conv, {
        peerId: sid,
        peerName: student?.name || 'Learner',
        peerRole: 'learner',
        unread: conv.unreadCounts?.tutor || 0,
        viewerRole: 'tutor',
      })
    }
    return {
      id: buildThreadId(tutorId, sid, null),
      threadId: buildThreadId(tutorId, sid, null),
      peerId: sid,
      peerName: student?.name || 'Learner',
      peerRole: 'learner',
      course: '',
      preview: 'Start a conversation',
      time: 'Now',
      unread: 0,
      unreadCount: 0,
      tutorId: String(tutorId),
      studentId: sid,
      courseId: null,
      lastMessageAt: null,
    }
  })

  return rows.sort((a, b) => {
    if ((b.unreadCount || 0) !== (a.unreadCount || 0)) {
      return (b.unreadCount || 0) - (a.unreadCount || 0)
    }
    return new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0)
  })
}

async function listConversationsForLearner(studentId) {
  const allowedTutorIds = await getAllowedTutorIdsForStudent(studentId)
  if (!allowedTutorIds.length) return []

  const [conversations, tutors, enrollment] = await Promise.all([
    Conversation.find({ studentId }).sort({ lastMessageAt: -1 }).lean(),
    User.find({ _id: { $in: allowedTutorIds } }).select('name email').lean(),
    Enrollment.findOne({ studentId }).sort({ lastActiveAt: -1 }).lean(),
  ])

  const tutorMap = Object.fromEntries(tutors.map((t) => [String(t._id), t]))
  const rows = []

  for (const tid of allowedTutorIds) {
    const conv = conversations.find((c) => String(c.tutorId) === tid)
    const tutor = tutorMap[tid]
    if (conv) {
      rows.push(
        formatConversationRow(conv, {
          peerId: tid,
          peerName: tutor?.name || 'Tutor',
          peerRole: 'tutor',
          unread: conv.unreadCounts?.learner || 0,
          viewerRole: 'learner',
        }),
      )
    } else {
      const courseId = enrollment?.tutorId?.toString() === tid ? enrollment.courseId : null
      let courseTitle = ''
      if (courseId) {
        const course = await Course.findById(courseId).select('title').lean()
        courseTitle = course?.title || ''
      }
      const threadId = buildThreadId(tid, studentId, courseId)
      rows.push({
        id: threadId,
        threadId,
        peerId: tid,
        peerName: tutor?.name || 'Tutor',
        peerRole: 'tutor',
        course: courseTitle,
        preview: 'Start a conversation with your tutor',
        time: 'Now',
        unread: 0,
        unreadCount: 0,
        tutorId: tid,
        studentId: String(studentId),
        courseId: courseId ? String(courseId) : null,
        lastMessageAt: null,
      })
    }
  }

  return rows.sort((a, b) => (b.unreadCount || 0) - (a.unreadCount || 0))
}

function formatConversationRow(conv, { peerId, peerName, peerRole, unread, viewerRole }) {
  return {
    id: conv.threadId,
    threadId: conv.threadId,
    conversationId: conv._id?.toString(),
    peerId,
    peerName,
    peerRole,
    from: peerName,
    course: conv.courseTitle || '',
    preview: conv.lastMessage || 'No messages yet',
    time: relativeTime(conv.lastMessageAt),
    lastMessageAt: conv.lastMessageAt,
    unread: unread > 0,
    unreadCount: unread,
    tutorId: String(conv.tutorId),
    studentId: String(conv.studentId),
    courseId: conv.courseId ? String(conv.courseId) : null,
    viewerRole,
  }
}

async function getThreadMessages({ threadId, viewerRole, tutorId, studentId }) {
  const query = { threadId }
  if (viewerRole === 'tutor') {
    query.tutorId = new mongoose.Types.ObjectId(tutorId)
    await assertTutorCanMessageStudent(tutorId, studentId)
  } else {
    query.studentId = new mongoose.Types.ObjectId(studentId)
    await assertStudentCanMessageTutor(studentId, tutorId)
  }

  const messages = await Message.find(query).sort({ createdAt: 1 }).lean()

  const markFrom =
    viewerRole === 'tutor' ? ['learner', 'student'] : ['tutor']

  await Message.updateMany(
    { ...query, fromRole: { $in: markFrom }, read: false },
    { read: true, readAt: new Date() },
  )

  const incField =
    viewerRole === 'tutor' ? 'unreadCounts.tutor' : 'unreadCounts.learner'
  await Conversation.updateOne({ threadId }, { $set: { [incField]: 0 } })

  return messages.map((msg) => ({
    id: msg._id.toString(),
    conversationId: threadId,
    senderId: String(msg.senderId || (msg.fromRole === 'tutor' ? msg.tutorId : msg.studentId)),
    receiverId: String(msg.receiverId || (msg.fromRole === 'tutor' ? msg.studentId : msg.tutorId)),
    text: msg.text,
    fromRole: msg.fromRole,
    read: !!msg.read,
    readAt: msg.readAt,
    createdAt: msg.createdAt,
    time: relativeTime(msg.createdAt),
  }))
}

async function getUnreadMessageCount(viewerRole, userId) {
  if (viewerRole === 'tutor') {
    const convs = await Conversation.find({ tutorId: userId }).lean()
    return convs.reduce((sum, c) => sum + (c.unreadCounts?.tutor || 0), 0)
  }
  const convs = await Conversation.find({ studentId: userId }).lean()
  return convs.reduce((sum, c) => sum + (c.unreadCounts?.learner || 0), 0)
}

module.exports = {
  relativeTime,
  buildThreadId,
  getAllowedStudentIdsForTutor,
  getAllowedTutorIdsForStudent,
  sendMessage,
  listConversationsForTutor,
  listConversationsForLearner,
  getThreadMessages,
  getUnreadMessageCount,
}
