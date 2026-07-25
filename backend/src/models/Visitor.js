const mongoose = require('mongoose')

const visitorSchema = new mongoose.Schema({
  visitorId: { type: String, required: true, unique: true, index: true },
  firstSeenAt: { type: Date, default: Date.now },
  lastSeenAt: { type: Date, default: Date.now },
  visitCount: { type: Number, default: 1 },
})

module.exports = mongoose.model('Visitor', visitorSchema)
