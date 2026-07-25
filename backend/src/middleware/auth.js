const jwt = require('jsonwebtoken')
const User = require('../models/User')

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret'

function resolveRole(user) {
  if (!user) return null
  if (user.isAdmin || user.role === 'admin') return 'admin'
  if (user.role === 'student') return 'learner'
  if (user.role && User.ROLES.includes(user.role)) return user.role
  return 'learner'
}

async function requireAuth(req, res, next) {
  const auth = req.headers.authorization || req.headers['x-access-token']
  if (!auth) return res.status(401).json({ error: 'No token provided' })
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : auth
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: resolveRole(payload),
    }
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

async function loadUserFromToken(req, res, next) {
  try {
    const auth = req.headers.authorization || req.headers['x-access-token']
    if (!auth) return res.status(401).json({ error: 'No token provided' })
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : auth
    let payload
    try {
      payload = jwt.verify(token, JWT_SECRET)
    } catch {
      return res.status(401).json({ error: 'Invalid token' })
    }
    const id = payload && payload.id
    if (!id) return res.status(401).json({ error: 'Invalid token payload' })
    const u = await User.findById(id).select('_id email name role isAdmin').lean()
    if (!u) return res.status(401).json({ error: 'User not found' })
    const role = resolveRole(u)
    req.user = { id: u._id.toString(), email: u.email, name: u.name, role }
    next()
  } catch (err) {
    console.error('loadUserFromToken error', err)
    return res.status(500).json({ error: 'Authorization failed' })
  }
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    // Trust JWT payload for role checks — avoids a Mongo round-trip on every API call
    requireAuth(req, res, () => {
      if (!req.user?.role || !allowedRoles.includes(req.user.role)) {
        const isLearner = req.user?.role === 'learner'
        const tutorOnly = allowedRoles.includes('tutor') && !allowedRoles.includes('learner')
        if (isLearner && tutorOnly) {
          return res.status(403).json({
            error: 'Students cannot create or edit courses, batches, or other tutor resources.',
          })
        }
        return res.status(403).json({ error: 'Insufficient permissions' })
      }
      next()
    })
  }
}

const requireAdmin = requireRole('admin')

module.exports = {
  requireAuth,
  requireAdmin,
  requireRole,
  loadUserFromToken,
  resolveRole,
}
