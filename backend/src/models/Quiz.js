const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String }],
  correctIndex: { type: Number, default: 0 },
})

const quizSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  questions: [questionSchema],
  maxScore: { type: Number, default: 100 },
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Quiz', quizSchema)
