const mongoose = require('mongoose')
const Batch = require('../models/Batch')
const User = require('../models/User')
const Notification = require('../models/Notification')

async function formatBatchDoc(batch, { includeStudents = false } = {}) {
  const payload = {
    id: batch._id.toString(),
    name: batch.name,
    subject: batch.subject || '',
    description: batch.description || '',
    studentIds: (batch.studentIds || []).map((id) => id.toString()),
    learnerCount: (batch.studentIds || []).length,
    createdAt: batch.createdAt,
    created: batch.createdAt
      ? new Date(batch.createdAt).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      : '',
  }
  if (includeStudents && batch.studentIds?.length) {
    const students = await User.find({ _id: { $in: batch.studentIds } }).lean()
    payload.students = students.map((s) => ({
      id: s._id.toString(),
      name: s.name || s.email,
      email: s.email,
    }))
  }
  return payload
}

async function resolveScheduleStudentIds(tutorId, batchIds = [], extraStudentIds = []) {
  const normalizedBatchIds = [...new Set((batchIds || []).filter(Boolean))]
  const batches = normalizedBatchIds.length
    ? await Batch.find({ _id: { $in: normalizedBatchIds }, tutorId }).lean()
    : []
  if (normalizedBatchIds.length && batches.length !== normalizedBatchIds.length) {
    const err = new Error('One or more batches were not found')
    err.status = 404
    throw err
  }
  const fromBatches = batches.flatMap((b) => (b.studentIds || []).map((id) => id.toString()))
  const manual = (extraStudentIds || []).map((id) => String(id))
  const studentIds = [...new Set([...fromBatches, ...manual])]
  return {
    studentIds,
    batchIds: batches.map((b) => b._id),
    batchNames: batches.map((b) => b.name),
    batches,
  }
}

async function notifyUser(userId, { role, title, message, type, scheduleId, batchId }) {
  await Notification.create({
    userId,
    role,
    title,
    message,
    type,
    scheduleId,
    batchId,
    read: false,
  })
}

async function notifyBatchMembership(batch, studentId, action) {
  const isAdd = action === 'added'
  await notifyUser(studentId, {
    role: 'learner',
    title: isAdd ? 'Added to batch' : 'Removed from batch',
    message: isAdd
      ? `You have been added to ${batch.name}.`
      : `You have been removed from ${batch.name}.`,
    type: isAdd ? 'batch_added' : 'batch_removed',
    batchId: batch._id,
  })
}

module.exports = {
  formatBatchDoc,
  resolveScheduleStudentIds,
  notifyBatchMembership,
  notifyUser,
}
