const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../models/User')
const { loadUserFromToken, resolveRole } = require('../middleware/auth')
const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret'

function userPayload(user) {
  const role = typeof user.getRole === 'function' ? user.getRole() : resolveRole(user)
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    role,
  }
}

function signToken(user) {
  const payload = userPayload(user)
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' })
  return { token, user: payload }
}

router.post('/register', async (req, res) => {
  try {
    const name = req.body.name
    const email = String(req.body.email || '').trim().toLowerCase()
    const password = req.body.password
    const role = req.body.role
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' })
    const existing = await User.findOne({ email })
    if (existing) return res.status(409).json({ error: 'User exists' })
    const hash = await bcrypt.hash(password, 10)
    const assignedRole =
      role && User.ROLES.includes(role) && role !== 'admin'
        ? role === 'student'
          ? 'learner'
          : role
        : 'learner'
    const u = new User({ name, email, passwordHash: hash, role: assignedRole })
    await u.save()
    return res.json({ success: true })
  } catch (err) {
    console.error('register error', err)
    return res.status(500).json({ error: 'Registration failed' })
  }
})

function dbReady() {
  return mongoose.connection.readyState === 1
}

router.post('/login', async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase()
    const password = req.body.password
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' })
    if (!dbReady()) {
      return res.status(503).json({ error: 'Database unavailable. Check MongoDB connection.' })
    }

    // Single indexed lookup — emails are stored lowercase on register/seed
    const user = await User.findOne({ email })
      .select('_id email name passwordHash role isAdmin')
      .exec()
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })
    if (!user.passwordHash) return res.status(500).json({ error: 'User record invalid' })

    let ok = false
    try {
      ok = await bcrypt.compare(password, user.passwordHash)
    } catch (e) {
      console.error('bcrypt compare failed', e)
      return res.status(500).json({ error: 'Authentication error' })
    }
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' })

    const role = typeof user.getRole === 'function' ? user.getRole() : resolveRole(user)
    // Don't block the login response on role migration writes
    if (user.role !== role || (role === 'admin' && !user.isAdmin)) {
      User.updateOne(
        { _id: user._id },
        { $set: { role, isAdmin: role === 'admin' } },
      ).catch((err) => console.error('role migration failed', err.message))
      user.role = role
      user.isAdmin = role === 'admin'
    }

    const { token, user: profile } = signToken(user)
    return res.json({ success: true, token, user: profile })
  } catch (err) {
    console.error('login error', err && err.stack ? err.stack : err)
    return res.status(500).json({ error: 'Login failed', details: err.message })
  }
})

router.get('/me', loadUserFromToken, (req, res) => {
  return res.json({ success: true, user: req.user })
})

module.exports = router
