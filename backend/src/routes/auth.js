const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret'

router.post('/register', async (req, res) => {
  try{
    const { name, email, password } = req.body
    if(!email || !password) return res.status(400).json({ error: 'Missing fields' })
    const existing = await User.findOne({ email })
    if(existing) return res.status(409).json({ error: 'User exists' })
    const hash = await bcrypt.hash(password, 10)
    const u = new User({ name, email, passwordHash: hash })
    await u.save()
    return res.json({ success: true })
  }catch(err){
    console.error('register error', err)
    return res.status(500).json({ error: 'Registration failed' })
  }
})

router.post('/login', async (req, res) => {
  try{
    const { email, password } = req.body
    if(!email || !password) return res.status(400).json({ error: 'Missing fields' })
    const user = await User.findOne({ email })
    if(!user) return res.status(401).json({ error: 'Invalid credentials' })
    if(!user.passwordHash) return res.status(500).json({ error: 'User record invalid' })
    let ok = false
    try{ ok = await bcrypt.compare(password, user.passwordHash) }catch(e){
      console.error('bcrypt compare failed', e)
      return res.status(500).json({ error: 'Authentication error' })
    }
    if(!ok) return res.status(401).json({ error: 'Invalid credentials' })
    const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '1d' })
    return res.json({ success: true, token })
  }catch(err){
    console.error('login error', err && err.stack ? err.stack : err)
    return res.status(500).json({ error: 'Login failed', details: err.message })
  }
})

module.exports = router
