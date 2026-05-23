const mongoose = require('mongoose')

const STATUSES = ['On track', 'Needs review', 'At risk']

const enrollmentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  status: { type: String, enum: STATUSES, default: 'On track' },
  lastActiveAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
})

enrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true })

enrollmentSchema.statics.STATUSES = STATUSES

module.exports = mongoose.model('Enrollment', enrollmentSchema)
