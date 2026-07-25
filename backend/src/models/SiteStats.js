const mongoose = require('mongoose')

const siteStatsSchema = new mongoose.Schema({
  _id: { type: String, default: 'global' },
  totalVisits: { type: Number, default: 0 },
  uniqueVisitors: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('SiteStats', siteStatsSchema)
