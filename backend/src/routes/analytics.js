const express = require('express')
const SiteStats = require('../models/SiteStats')
const Visitor = require('../models/Visitor')

const router = express.Router()

async function getOrCreateStats() {
  let stats = await SiteStats.findById('global')
  if (!stats) {
    stats = await SiteStats.create({ _id: 'global', totalVisits: 0, uniqueVisitors: 0 })
  }
  return stats
}

/** Record a visit once per browser session (frontend). Dedupes unique visitors by visitorId. */
router.post('/visit', async (req, res) => {
  try {
    const visitorId = String(req.body?.visitorId || '').trim().slice(0, 80)
    if (!visitorId) {
      return res.status(400).json({ error: 'visitorId is required' })
    }

    const now = new Date()
    let isNew = false

    try {
      await Visitor.create({ visitorId, firstSeenAt: now, lastSeenAt: now, visitCount: 1 })
      isNew = true
    } catch (err) {
      if (err?.code === 11000) {
        await Visitor.updateOne(
          { visitorId },
          { $set: { lastSeenAt: now }, $inc: { visitCount: 1 } },
        )
      } else {
        throw err
      }
    }

    const inc = { totalVisits: 1 }
    if (isNew) inc.uniqueVisitors = 1

    const stats = await SiteStats.findByIdAndUpdate(
      'global',
      { $inc: inc, $set: { updatedAt: now }, $setOnInsert: { _id: 'global' } },
      { upsert: true, new: true },
    )

    return res.json({
      success: true,
      isNew,
      totalVisits: stats.totalVisits,
      uniqueVisitors: stats.uniqueVisitors,
    })
  } catch (err) {
    console.error('analytics visit error', err)
    return res.status(500).json({ error: 'Failed to record visit' })
  }
})

router.get('/stats', async (req, res) => {
  try {
    const stats = await getOrCreateStats()
    return res.json({
      success: true,
      data: {
        totalVisits: stats.totalVisits || 0,
        uniqueVisitors: stats.uniqueVisitors || 0,
      },
    })
  } catch (err) {
    console.error('analytics stats error', err)
    return res.status(500).json({ error: 'Failed to load visit stats' })
  }
})

module.exports = router
