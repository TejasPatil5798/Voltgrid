const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  fileUrl: { type: String, default: '' },
  content: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Note', noteSchema)
