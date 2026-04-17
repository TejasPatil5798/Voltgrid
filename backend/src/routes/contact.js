const express = require('express')
const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const nodemailer = require('nodemailer')
const Contact = require('../models/Contact')
const router = express.Router()

// Ensure data directory exists for fallback storage
const dataDir = path.join(__dirname, '..', '..', 'data')
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
const contactsFile = path.join(dataDir, 'contacts.json')

function getMailTransport() {
  const host = process.env.SMTP_HOST || ''
  const port = Number(process.env.SMTP_PORT || 587)
  const user = process.env.SMTP_USER || ''
  const pass = process.env.SMTP_PASS || ''

  if (!host || !user || !pass) return null

  return nodemailer.createTransport({
    host,
    port,
    secure: String(process.env.SMTP_SECURE || '').toLowerCase() === 'true' || port === 465,
    auth: { user, pass },
  })
}

async function sendContactEmail({ name, email, subject, message }) {
  const transporter = getMailTransport()
  if (!transporter) {
    return { emailed: false, error: 'Email service is not configured on the server.' }
  }

  const mailTo = process.env.CONTACT_FORM_TO || 'contact@voltgridinsights.com'
  const mailFrom = process.env.CONTACT_FORM_FROM || process.env.SMTP_USER || 'contact@voltgridinsights.com'
  const resolvedSubject = subject || 'Website contact enquiry'

  try {
    await transporter.sendMail({
      from: mailFrom,
      to: mailTo,
      replyTo: email,
      subject: `Contact Form: ${resolvedSubject}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Subject: ${resolvedSubject}`,
        '',
        'Message:',
        message,
      ].join('\n'),
    })

    return { emailed: true }
  } catch (err) {
    console.error('contact email error', err)
    return {
      emailed: false,
      error: 'Email delivery failed. Check SMTP settings, mailbox password, and whether SMTP AUTH is enabled for the account.',
    }
  }
}

router.post('/', async (req, res) => {
  try{
    const { name, email, message } = req.body
    const subject = (req.body.subject || '').trim()
    if(!name || !email || !message) return res.status(400).json({ error: 'Missing fields' })

    // If mongoose is connected, persist to MongoDB
    if (mongoose.connection.readyState === 1) {
      const c = new Contact({ name, email, subject, message })
      await c.save()
      const mailResult = await sendContactEmail({ name, email, subject, message })
      if (!mailResult.emailed) {
        return res.status(500).json({ success: false, stored: 'mongodb', emailed: false, error: mailResult.error })
      }
      return res.json({ success: true, stored: 'mongodb', emailed: true })
    }

    // Fallback: append to local JSON file
    const entry = { name, email, subject, message, createdAt: new Date().toISOString() }
    let list = []
    if (fs.existsSync(contactsFile)) {
      try { list = JSON.parse(fs.readFileSync(contactsFile,'utf8')||'[]') } catch(e){ list = [] }
    }
    list.push(entry)
    fs.writeFileSync(contactsFile, JSON.stringify(list, null, 2))
    const mailResult = await sendContactEmail({ name, email, subject, message })
    if (!mailResult.emailed) {
      return res.status(500).json({ success: false, stored: 'file', emailed: false, path: contactsFile, error: mailResult.error })
    }
    return res.json({ success: true, stored: 'file', emailed: true, path: contactsFile })
  }catch(err){
    console.error('contact save error', err)
    res.status(500).json({ error: 'Failed to process contact request' })
  }
})

module.exports = router
