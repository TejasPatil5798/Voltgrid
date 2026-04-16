const mongoose = require('mongoose')

const expertRegistrationSchema = new mongoose.Schema({
  expertId: { type: String, required: false },
  name: { type: String, required: true },
  email: { type: String, required: true },
  title: { type: String, required: false },
  yearsExperience: { type: Number, required: false },
  domains: { type: [String], required: false },
  keySpecialisation: { type: String, required: false },
  profileSummary: { type: String, required: false },
  profilePhotoUrl: { type: String, required: false },
  organization: { type: String, required: false },
  contactNumber: { type: String, required: false },
  detailedExperience: { type: String, required: false },
  linkedin: { type: String, required: false },
  consentDisplay: { type: Boolean, default: false },
  consentAccurate: { type: Boolean, default: false },
  consentReviewed: { type: Boolean, default: false },
  message: { type: String, required: false },
  active: { type: Boolean, default: true },
  adminHidden: { type: Boolean, default: false },
  adminHiddenAt: { type: Date, required: false },
  approved: { type: Boolean, default: false },
  approvedAt: { type: Date },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('ExpertRegistration', expertRegistrationSchema)
