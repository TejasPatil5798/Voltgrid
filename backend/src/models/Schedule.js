const mongoose = require('mongoose')

const scheduleSchema = new mongoose.Schema({
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  title: { type: String, required: true, trim: true },
  subject: { type: String, default: '', trim: true },
  meta: { type: String, default: '' },
  description: { type: String, default: '' },
  meetingLink: { type: String, default: '' },
  startAt: { type: Date, required: true },
  endAt: { type: Date },
  durationMinutes: { type: Number, default: 60 },
  sessionType: { type: String, default: 'Live session' },
  studentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  batchIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Batch' }],
  status: { type: String, enum: ['scheduled', 'cancelled'], default: 'scheduled', index: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Schedule', scheduleSchema)
