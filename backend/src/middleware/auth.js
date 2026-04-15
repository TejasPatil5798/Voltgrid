const jwt = require('jsonwebtoken')
const User = require('../models/User')

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret'

async function requireAuth(req, res, next){
  const auth = req.headers.authorization || req.headers['x-access-token']
  if(!auth) return res.status(401).json({ error: 'No token provided' })
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : auth
  try{
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload
    next()
  }catch(err){
    return res.status(401).json({ error: 'Invalid token' })
  }
}

// require both valid token and isAdmin=true in database
async function requireAdmin(req, res, next){
  try{
    await requireAuth(req, res, async ()=>{})
    const id = req.user && req.user.id
    if(!id) return res.status(401).json({ error: 'Invalid token payload' })
    const u = await User.findById(id).lean()
    if(!u || !u.isAdmin) return res.status(403).json({ error: 'Admin required' })
    req.user = { id: u._id.toString(), email: u.email, name: u.name }
    next()
  }catch(err){
    console.error('requireAdmin error', err)
    return res.status(500).json({ error: 'Authorization failed' })
  }
}

module.exports = { requireAuth, requireAdmin }
