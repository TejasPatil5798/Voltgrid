const express = require('express')
const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const nodemailer = require('nodemailer')
const Contact = require('../models/Contact')
const router = express.Router()

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

async function saveContactEntry(entry) {
  if (mongoose.connection.readyState === 1) {
    const c = new Contact(entry)
    await c.save()
    return { stored: 'mongodb' }
  }

  const fileEntry = {
    ...entry,
    createdAt: entry.createdAt || new Date().toISOString(),
  }
  let list = []
  if (fs.existsSync(contactsFile)) {
    try {
      list = JSON.parse(fs.readFileSync(contactsFile, 'utf8') || '[]')
    } catch {
      list = []
    }
  }
  list.push(fileEntry)
  fs.writeFileSync(contactsFile, JSON.stringify(list, null, 2))
  return { stored: 'file', path: contactsFile }
}

router.post('/google', async (req, res) => {
  try {
    const entry = {
      name: '(Google Form)',
      email: 'google-form@voltgrid.local',
      subject: 'Contact Us',
      message: 'Submitted via embedded Google Form on the Contact page.',
      source: 'google_form',
    }
    const result = await saveContactEntry(entry)
    return res.json({ success: true, ...result })
  } catch (err) {
    console.error('google contact track error', err)
    res.status(500).json({ error: 'Failed to record contact submission' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body
    const subject = (req.body.subject || '').trim()
    if (!name || !email || !message) return res.status(400).json({ error: 'Missing fields' })

    const entry = { name, email, subject, message, source: 'website' }
    const saveResult = await saveContactEntry(entry)
    const mailResult = await sendContactEmail({ name, email, subject, message })

    return res.json({
      success: true,
      stored: saveResult.stored,
      emailed: mailResult.emailed,
      emailError: mailResult.emailed ? undefined : mailResult.error,
    })
  } catch (err) {
    console.error('contact save error', err)
    res.status(500).json({ error: 'Failed to process contact request' })
  }
})

module.exports = router
