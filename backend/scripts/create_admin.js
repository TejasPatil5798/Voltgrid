// Create or update a user with a specific role.
// Usage:
//   ADMIN_EMAIL=admin@example.com ADMIN_PASS=YourPass node scripts/create_admin.js
//   ADMIN_EMAIL=tutor@example.com ADMIN_PASS=YourPass ADMIN_ROLE=tutor node scripts/create_admin.js
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')
const User = require('../src/models/User')

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || ''
const email = process.env.ADMIN_EMAIL || process.argv[2]
const pass = process.env.ADMIN_PASS || process.argv[3]
const name = process.env.ADMIN_NAME || 'Admin'
const role = (process.env.ADMIN_ROLE || process.argv[4] || 'admin').toLowerCase()

if (!email || !pass) {
  console.error('Provide ADMIN_EMAIL and ADMIN_PASS via env or args')
  process.exit(1)
}

if (!User.ROLES.includes(role)) {
  console.error('ADMIN_ROLE must be one of:', User.ROLES.join(', '))
  process.exit(1)
}

async function run() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI not set in .env — create user requires MongoDB connection')
    process.exit(1)
  }
  await mongoose.connect(MONGODB_URI)
  const existing = await User.findOne({ email })
  const hash = await bcrypt.hash(pass, 10)
  if (existing) {
    existing.passwordHash = hash
    existing.role = role
    existing.isAdmin = role === 'admin'
    existing.name = name
    await existing.save()
    console.log('Updated existing user:', email, 'role:', role)
  } else {
    const u = new User({
      name,
      email,
      passwordHash: hash,
      role,
      isAdmin: role === 'admin',
    })
    await u.save()
    console.log('Created user:', email, 'role:', role)
  }
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
