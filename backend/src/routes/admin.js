const express = require('express')
const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const Contact = require('../models/Contact')
const ExpertRegistration = require('../models/ExpertRegistration')
const { requireAdmin } = require('../middleware/auth')

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

function getFileRegistrationIndex(list, id) {
    if (!id) return -1
    const syntheticMatch = /^file-(\d+)$/.exec(String(id))
    if (syntheticMatch) {
        const index = Number(syntheticMatch[1])
        return Number.isInteger(index) && index >= 0 && index < list.length ? index : -1
    }
    return list.findIndex(x => x._id === id || x.id === id)
}

// List contacts (protected)
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
