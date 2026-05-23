const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  studentName: { type: String, default: '' },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  courseTitle: { type: String, default: '' },
  text: { type: String, required: true },
  fromRole: { type: String, enum: ['tutor', 'learner', 'student'], required: true },
  read: { type: Boolean, default: false },
  readAt: { type: Date },
  threadId: { type: String, index: true },
  attachments: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Message', messageSchema)
