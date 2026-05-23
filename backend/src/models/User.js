const mongoose = require('mongoose')

const ROLES = ['admin', 'tutor', 'learner', 'student']

const userSchema = new mongoose.Schema({
  name: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: ROLES,
    default: 'learner',
  },
  // legacy field — migrated to role on read
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
})

userSchema.statics.ROLES = ROLES

userSchema.methods.getRole = function getRole() {
  if (this.isAdmin || this.role === 'admin') return 'admin'
  if (this.role === 'student') return 'learner'
  if (this.role && ROLES.includes(this.role)) return this.role
  return 'learner'
}

module.exports = mongoose.model('User', userSchema)
