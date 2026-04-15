const express = require('express')
const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const ExpertRegistration = require('../models/ExpertRegistration')
const cloudinary = require('cloudinary').v2
const router = express.Router()

if (process.env.CLOUDINARY_URL) {
  try {
    cloudinary.config({ cloudinary_url: process.env.CLOUDINARY_URL })
  } catch (e) { console.warn('Cloudinary config failed', e) }
}

// Sample experts list (static). Replace or seed from DB if desired.
const sampleExperts = [

]

// GET /api/experts - return list of experts
router.get('/', async (req, res) => {
  try {
    let approved = []
    if (mongoose.connection.readyState === 1) {
      approved = await ExpertRegistration.find({ approved: true, active: { $ne: false } }).sort({ approvedAt: -1 }).lean()
    } else {
      const dataDir = path.join(__dirname, '..', '..', 'data')
      const file = path.join(dataDir, 'expert_regs.json')
      if (fs.existsSync(file)) {
        try { const list = JSON.parse(fs.readFileSync(file, 'utf8') || '[]'); approved = list.filter(x => x.approved && x.active !== false) } catch (e) { approved = [] }
      }
    }

    // map approved registrations to expert-like objects (include full public fields)
    const approvedExperts = approved.map((a, i) => ({
      id: a._id || a.id || ('r' + i),
      name: a.name,
      title: a.title || '',
      yearsExperience: a.yearsExperience || '',
      domains: a.domains || [],
      keySpecialisation: a.keySpecialisation || '',
      profileSummary: a.profileSummary || '',
      profilePhotoUrl: a.profilePhotoUrl || '/experts/default.jpg',
      organization: a.organization || '',
      contactNumber: a.contactNumber || '',
      linkedin: a.linkedin || '',
      createdAt: a.createdAt || a.approvedAt || null,
      approved: !!a.approved
    }))
    return res.json([...sampleExperts, ...approvedExperts])
  } catch (err) {
    console.error('experts list error', err)
    return res.json(sampleExperts)
  }
})

// POST /api/experts/register - save a registration
router.post('/register', async (req, res) => {
  try {
    const body = req.body || {}
    const { expertId, name, email } = body
    if (!name || !email) return res.status(400).json({ error: 'Missing fields' })

    const payload = {
      expertId: body.expertId,
      name: body.name,
      email: body.email,
      title: body.title,
      yearsExperience: body.yearsExperience,
      domains: Array.isArray(body.domains) ? body.domains : (body.domains ? [body.domains] : []),
      keySpecialisation: body.keySpecialisation,
      profileSummary: body.profileSummary,
      profilePhotoUrl: body.profilePhotoUrl,
      organization: body.organization,
      contactNumber: body.contactNumber,
      detailedExperience: body.detailedExperience,
      linkedin: body.linkedin,
      consentDisplay: !!body.consentDisplay,
      consentAccurate: !!body.consentAccurate,
      consentReviewed: !!body.consentReviewed,
      message: body.message
    }

    if (typeof body.active === 'boolean') payload.active = body.active

    // If Cloudinary configured and client submitted a data URL for the photo, upload it
    if (process.env.CLOUDINARY_URL && payload.profilePhotoUrl && typeof payload.profilePhotoUrl === 'string' && payload.profilePhotoUrl.startsWith('data:')) {
      try {
        const uploadRes = await cloudinary.uploader.upload(payload.profilePhotoUrl, { folder: 'voltgrid/experts', resource_type: 'image' })
        if (uploadRes && uploadRes.secure_url) payload.profilePhotoUrl = uploadRes.secure_url
      } catch (e) {
        console.warn('Cloudinary upload failed, keeping data URL', e)
      }
    }

    if (mongoose.connection.readyState === 1) {
      const reg = new ExpertRegistration(payload)
      await reg.save()
      console.log('Saved expert registration to MongoDB:', reg._id)
      return res.json({ success: true, stored: 'mongodb' })
    }

    // fallback to file
    const dataDir = path.join(__dirname, '..', '..', 'data')
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
    const file = path.join(dataDir, 'expert_regs.json')
    let list = []
    if (fs.existsSync(file)) {
      try { list = JSON.parse(fs.readFileSync(file, 'utf8') || '[]') } catch (e) { list = [] }
    }
    const record = Object.assign({}, payload, { active: payload.active !== false, createdAt: new Date().toISOString() })
    list.push(record)
    fs.writeFileSync(file, JSON.stringify(list, null, 2))
    console.log('Saved expert registration to file:', file)
    return res.json({ success: true, stored: 'file', path: file })
  } catch (err) {
    console.error('expert register error', err)
    res.status(500).json({ error: 'Failed to register' })
  }
})

module.exports = router
