const express = require('express')
const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const Contact = require('../models/Contact')
const router = express.Router()

// Ensure data directory exists for fallback storage
const dataDir = path.join(__dirname, '..', '..', 'data')
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
const contactsFile = path.join(dataDir, 'contacts.json')

router.post('/', async (req, res) => {
  try{
    const { name, email, message } = req.body
    if(!name || !email || !message) return res.status(400).json({ error: 'Missing fields' })

    // If mongoose is connected, persist to MongoDB
    if (mongoose.connection.readyState === 1) {
      const c = new Contact({ name, email, message })
      await c.save()
      return res.json({ success: true, stored: 'mongodb' })
    }

    // Fallback: append to local JSON file
    const entry = { name, email, message, createdAt: new Date().toISOString() }
    let list = []
    if (fs.existsSync(contactsFile)) {
      try { list = JSON.parse(fs.readFileSync(contactsFile,'utf8')||'[]') } catch(e){ list = [] }
    }
    list.push(entry)
    fs.writeFileSync(contactsFile, JSON.stringify(list, null, 2))
    return res.json({ success: true, stored: 'file', path: contactsFile })
  }catch(err){
    console.error('contact save error', err)
    res.status(500).json({ error: 'Failed to save contact' })
  }
})

module.exports = router
