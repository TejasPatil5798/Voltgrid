const mongoose = require('mongoose')

const STATUSES = ['Draft', 'Live', 'Scheduled']

const courseSchema = new mongoose.Schema({
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true },
  batch: { type: String, default: '', trim: true },
  description: { type: String, default: '' },
  status: { type: String, enum: STATUSES, default: 'Draft' },
  moduleCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

courseSchema.pre('save', function preSave(next) {
  this.updatedAt = new Date()
  next()
})

courseSchema.statics.STATUSES = STATUSES

module.exports = mongoose.model('Course', courseSchema)
