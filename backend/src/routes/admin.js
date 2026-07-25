const express = require('express')
const fs = require('fs')
const path = require('path')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const Contact = require('../models/Contact')
const ExpertRegistration = require('../models/ExpertRegistration')
const User = require('../models/User')
const TutorProfile = require('../models/TutorProfile')
const Course = require('../models/Course')
const SiteStats = require('../models/SiteStats')
const { requireAdmin, resolveRole } = require('../middleware/auth')

const router = express.Router()
const dataDir = path.join(__dirname, '..', '..', 'data')
const regsFile = path.join(dataDir, 'expert_regs.json')

function loadFileRegistrations() {
    let list = []
    if (fs.existsSync(regsFile)) {
        try { list = JSON.parse(fs.readFileSync(regsFile, 'utf8') || '[]') } catch (e) { list = [] }
    }
    return list
}

function saveFileRegistrations(list) {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
    fs.writeFileSync(regsFile, JSON.stringify(list, null, 2))
}

function dbReady() {
    return mongoose.connection.readyState === 1
}

function formatPortalUser(doc) {
    const role = resolveRole(doc)
    const normalized = role === 'student' ? 'learner' : role
    return {
        id: doc._id.toString(),
        name: doc.name || '',
        email: doc.email,
        role: normalized,
        createdAt: doc.createdAt,
        created: doc.createdAt
            ? new Date(doc.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
              })
            : '',
    }
}

function normalizePortalRole(role) {
    const r = String(role || '').toLowerCase()
    if (r === 'student') return 'learner'
    if (r === 'tutor' || r === 'learner') return r
    return null
}

async function ensureTutorProfile(userId) {
    const exists = await TutorProfile.findOne({ userId })
    if (!exists) await TutorProfile.create({ userId })
}

function getFileRegistrationIndex(list, id) {
    if (!id) return -1
    const syntheticMatch = /^file-(\d+)$/.exec(String(id))
    if (syntheticMatch) {
        const index = Number(syntheticMatch[1])
        return Number.isInteger(index) && index >= 0 && index < list.length ? index : -1
    }
    return list.findIndex(x => x._id === id || x.id === id)
}

// List contacts (admin only)
 router.get('/contacts', requireAdmin, async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            const list = await Contact.find().sort({ createdAt: -1 }).lean()
            return res.json({ success: true, source: 'mongodb', data: list })
        }
        const contactsFile = path.join(dataDir, 'contacts.json')
        let list = []
        if (fs.existsSync(contactsFile)) {
            try { list = JSON.parse(fs.readFileSync(contactsFile, 'utf8') || '[]') } catch (e) { list = [] }
        }
        return res.json({ success: true, source: 'file', data: list.reverse() })
    } catch (err) {
        console.error('admin contacts error', err)
        res.status(500).json({ error: 'Failed to load contacts' })
    }
})

router.get('/visits', requireAdmin, async (req, res) => {
    try {
        if (!dbReady()) {
            return res.json({ success: true, data: { totalVisits: 0, uniqueVisitors: 0 } })
        }
        let stats = await SiteStats.findById('global').lean()
        if (!stats) {
            stats = { totalVisits: 0, uniqueVisitors: 0 }
        }
        return res.json({
            success: true,
            data: {
                totalVisits: stats.totalVisits || 0,
                uniqueVisitors: stats.uniqueVisitors || 0,
            },
        })
    } catch (err) {
        console.error('admin visits error', err)
        res.status(500).json({ error: 'Failed to load visit stats' })
    }
})

// List expert registrations (protected)
 // List expert registrations (admin only)
router.get('/registrations', requireAdmin, async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            const list = await ExpertRegistration.find({ adminHidden: { $ne: true } }).sort({ createdAt: -1 }).lean()
            return res.json({ success: true, source: 'mongodb', data: list })
        }
        const list = loadFileRegistrations().filter((item) => item.adminHidden !== true)
        const normalized = list.map((item, index) => ({
            ...item,
            id: item.id || item._id || `file-${index}`,
        }))
        return res.json({ success: true, source: 'file', data: normalized.reverse() })
    } catch (err) {
        console.error('admin regs error', err)
        res.status(500).json({ error: 'Failed to load registrations' })
    }
 })

// Toggle active/inactive on a registration (admin only)
router.post('/registrations/:id/active', requireAdmin, async (req, res) => {
    try {
        const id = req.params.id
        const active = !!req.body?.active

        if (mongoose.connection.readyState === 1) {
            const reg = await ExpertRegistration.findById(id)
            if (!reg) return res.status(404).json({ error: 'Not found' })
            reg.active = active
            await reg.save()
            return res.json({ success: true, updated: true, active })
        }

        const list = loadFileRegistrations()
        const idx = getFileRegistrationIndex(list, id)
        if (idx === -1) return res.status(404).json({ error: 'Not found' })
        list[idx].active = active
        saveFileRegistrations(list)
        return res.json({ success: true, updated: true, active })
    } catch (err) {
        console.error('active toggle error', err)
        res.status(500).json({ error: 'Failed to update active status' })
    }
})

 // Approve a registration (admin only)
 router.post('/registrations/:id/approve', requireAdmin, async (req, res) => {
     try {
         const id = req.params.id
         if (mongoose.connection.readyState === 1) {
             const reg = await ExpertRegistration.findById(id)
             if (!reg) return res.status(404).json({ error: 'Not found' })
             reg.approved = true
             reg.approvedAt = new Date()
             reg.approvedBy = req.user.id
             await reg.save()
             return res.json({ success: true, updated: true })
         }

         // file fallback: toggle approved flag
         const list = loadFileRegistrations()
         const idx = getFileRegistrationIndex(list, id)
         if (idx === -1) return res.status(404).json({ error: 'Not found' })
         list[idx].approved = true
         list[idx].approvedAt = new Date().toISOString()
         saveFileRegistrations(list)
         return res.json({ success: true, updated: true })
     } catch (err) {
         console.error('approve error', err)
         res.status(500).json({ error: 'Failed to approve' })
     }
 })

router.get('/users', requireAdmin, async (req, res) => {
    try {
        if (!dbReady()) return res.status(503).json({ error: 'Database unavailable' })
        const roleFilter = String(req.query.role || '').toLowerCase()
        let query = { role: { $in: ['tutor', 'learner', 'student'] } }
        if (roleFilter === 'tutor') query = { role: 'tutor' }
        if (roleFilter === 'learner') query = { role: { $in: ['learner', 'student'] } }
        const users = await User.find(query).sort({ createdAt: -1 }).lean()
        res.json({ success: true, data: users.map(formatPortalUser) })
    } catch (err) {
        console.error('admin list users error', err)
        res.status(500).json({ error: 'Failed to load users' })
    }
})

router.post('/users', requireAdmin, async (req, res) => {
    try {
        if (!dbReady()) return res.status(503).json({ error: 'Database unavailable' })
        const role = normalizePortalRole(req.body?.role)
        const name = String(req.body?.name || '').trim()
        const email = String(req.body?.email || '').trim().toLowerCase()
        const password = req.body?.password
        if (!role) return res.status(400).json({ error: 'Role must be tutor or learner' })
        if (!email) return res.status(400).json({ error: 'Email is required' })
        if (!password || String(password).length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' })
        }
        const existing = await User.findOne({ email })
        if (existing) return res.status(409).json({ error: 'A user with this email already exists' })
        const hash = await bcrypt.hash(String(password), 10)
        const user = await User.create({
            name: name || (role === 'tutor' ? 'Tutor' : 'Learner'),
            email,
            passwordHash: hash,
            role,
            isAdmin: false,
        })
        if (role === 'tutor') await ensureTutorProfile(user._id)
        res.json({ success: true, data: formatPortalUser(user.toObject()) })
    } catch (err) {
        console.error('admin create user error', err)
        res.status(500).json({ error: 'Failed to create user' })
    }
})

router.put('/users/:id', requireAdmin, async (req, res) => {
    try {
        if (!dbReady()) return res.status(503).json({ error: 'Database unavailable' })
        const user = await User.findById(req.params.id)
        if (!user) return res.status(404).json({ error: 'User not found' })
        const currentRole = resolveRole(user)
        if (currentRole === 'admin') {
            return res.status(403).json({ error: 'Admin accounts cannot be edited here' })
        }
        const body = req.body || {}
        if (body.name != null) user.name = String(body.name).trim()
        if (body.email != null) {
            const email = String(body.email).trim().toLowerCase()
            if (!email) return res.status(400).json({ error: 'Email is required' })
            const dup = await User.findOne({ email, _id: { $ne: user._id } })
            if (dup) return res.status(409).json({ error: 'Email already in use' })
            user.email = email
        }
        if (body.role != null) {
            const nextRole = normalizePortalRole(body.role)
            if (!nextRole) return res.status(400).json({ error: 'Role must be tutor or learner' })
            user.role = nextRole
            user.isAdmin = false
            if (nextRole === 'tutor') await ensureTutorProfile(user._id)
        }
        if (body.password) {
            if (String(body.password).length < 6) {
                return res.status(400).json({ error: 'Password must be at least 6 characters' })
            }
            user.passwordHash = await bcrypt.hash(String(body.password), 10)
        }
        await user.save()
        res.json({ success: true, data: formatPortalUser(user.toObject()) })
    } catch (err) {
        console.error('admin update user error', err)
        res.status(500).json({ error: 'Failed to update user' })
    }
})

router.delete('/users/:id', requireAdmin, async (req, res) => {
    try {
        if (!dbReady()) return res.status(503).json({ error: 'Database unavailable' })
        const targetId = req.params.id
        if (req.user?.id === targetId) {
            return res.status(403).json({ error: 'You cannot delete your own account' })
        }
        const user = await User.findById(targetId)
        if (!user) return res.status(404).json({ error: 'User not found' })
        const role = resolveRole(user)
        if (role === 'admin') return res.status(403).json({ error: 'Admin accounts cannot be deleted' })
        if (role === 'tutor') {
            const courseCount = await Course.countDocuments({ tutorId: user._id })
            if (courseCount > 0) {
                return res.status(409).json({
                    error: 'This tutor has courses. Remove or reassign their courses before deleting the account.',
                })
            }
            await TutorProfile.deleteOne({ userId: user._id })
        }
        await User.deleteOne({ _id: user._id })
        res.json({ success: true, deleted: true })
    } catch (err) {
        console.error('admin delete user error', err)
        res.status(500).json({ error: 'Failed to delete user' })
    }
})

router.delete('/registrations/:id', requireAdmin, async (req, res) => {
    try {
        const id = req.params.id
        if (mongoose.connection.readyState === 1) {
            const reg = await ExpertRegistration.findById(id)
            if (!reg) return res.status(404).json({ error: 'Not found' })
            reg.adminHidden = true
            reg.adminHiddenAt = new Date()
            await reg.save()
            return res.json({ success: true, hidden: true })
        }

        const list = loadFileRegistrations()
        const idx = getFileRegistrationIndex(list, id)
        if (idx === -1) return res.status(404).json({ error: 'Not found' })
        list[idx].adminHidden = true
        list[idx].adminHiddenAt = new Date().toISOString()
        saveFileRegistrations(list)
        return res.json({ success: true, hidden: true })
    } catch (err) {
        console.error('hide registration error', err)
        res.status(500).json({ error: 'Failed to hide registration' })
    }
})

module.exports = router
