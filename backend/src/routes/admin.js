const express = require('express')
const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const Contact = require('../models/Contact')
const ExpertRegistration = require('../models/ExpertRegistration')
const { requireAdmin } = require('../middleware/auth')

const router = express.Router()
const dataDir = path.join(__dirname, '..', '..', 'data')

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
            const list = await ExpertRegistration.find().sort({ createdAt: -1 }).lean()
            return res.json({ success: true, source: 'mongodb', data: list })
        }
        const regsFile = path.join(dataDir, 'expert_regs.json')
        let list = []
        if (fs.existsSync(regsFile)) {
            try { list = JSON.parse(fs.readFileSync(regsFile, 'utf8') || '[]') } catch (e) { list = [] }
        }
        return res.json({ success: true, source: 'file', data: list.reverse() })
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

        const regsFile = path.join(dataDir, 'expert_regs.json')
        let list = []
        if (fs.existsSync(regsFile)) {
            try { list = JSON.parse(fs.readFileSync(regsFile, 'utf8') || '[]') } catch (e) { list = [] }
        }
        const idx = list.findIndex(x => x._id === id || x.id === id)
        if (idx === -1) return res.status(404).json({ error: 'Not found' })
        list[idx].active = active
        fs.writeFileSync(regsFile, JSON.stringify(list, null, 2))
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
         const regsFile = path.join(dataDir, 'expert_regs.json')
         let list = []
         if (fs.existsSync(regsFile)) {
             try { list = JSON.parse(fs.readFileSync(regsFile, 'utf8') || '[]') } catch (e) { list = [] }
         }
         const idx = list.findIndex(x => x._id === id || x.id === id)
         if (idx === -1) return res.status(404).json({ error: 'Not found' })
         list[idx].approved = true
         list[idx].approvedAt = new Date().toISOString()
         fs.writeFileSync(regsFile, JSON.stringify(list, null, 2))
         return res.json({ success: true, updated: true })
     } catch (err) {
         console.error('approve error', err)
         res.status(500).json({ error: 'Failed to approve' })
     }
 })

module.exports = router
