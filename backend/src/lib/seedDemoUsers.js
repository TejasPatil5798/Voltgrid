const bcrypt = require('bcrypt')
const User = require('../models/User')

const DEMO_PASS = process.env.DEMO_PASS || 'V0ltGridDemo!2026'

const DEMO_USERS = [
  { email: 'demo-admin@voltgridinsights.com', name: 'Demo Admin', role: 'admin' },
  { email: 'demo-tutor@voltgridinsights.com', name: 'Demo Tutor', role: 'tutor' },
  { email: 'demo-student@voltgridinsights.com', name: 'Demo Learner', role: 'learner' },
  // legacy email kept in sync
  { email: 'demo-admin@voltgrid.local', name: 'Demo Admin', role: 'admin' },
]

async function upsertUser({ email, name, role, password }) {
  const normalized = email.trim().toLowerCase()
  const hash = await bcrypt.hash(password, 10)
  const existing = await User.findOne({ email: normalized })
  if (existing) {
    existing.name = name
    existing.passwordHash = hash
    existing.role = role
    existing.isAdmin = role === 'admin'
    await existing.save()
    return 'updated'
  }
  await User.create({
    name,
    email: normalized,
    passwordHash: hash,
    role,
    isAdmin: role === 'admin',
  })
  return 'created'
}

async function seedDemoUsers() {
  const results = []
  for (const u of DEMO_USERS) {
    const action = await upsertUser({ ...u, password: DEMO_PASS })
    results.push({ email: u.email, role: u.role, action })
  }
  await User.updateMany({ role: 'student' }, { role: 'learner' })
  return results
}

module.exports = { seedDemoUsers, DEMO_USERS, DEMO_PASS }
