const mongoose = require('mongoose')

const conversationSchema = new mongoose.Schema({
  threadId: { type: String, required: true, unique: true, index: true },
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  participantIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  courseTitle: { type: String, default: '' },
  lastMessage: { type: String, default: '' },
  lastMessageAt: { type: Date, default: Date.now },
  unreadCounts: {
    tutor: { type: Number, default: 0 },
    learner: { type: Number, default: 0 },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

conversationSchema.pre('save', function preSave(next) {
  this.updatedAt = new Date()
  next()
})

module.exports = mongoose.model('Conversation', conversationSchema)
