const mongoose = require('mongoose')

const tutorProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  expertise: [{ type: String, trim: true }],
  timezone: { type: String, default: 'Asia/Kolkata (IST)' },
  weeklyHours: [{ type: String }],
  officeHours: { type: String, default: '' },
  nextOpenSlot: { type: String, default: '' },
  earningsThisMonth: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('TutorProfile', tutorProfileSchema)
