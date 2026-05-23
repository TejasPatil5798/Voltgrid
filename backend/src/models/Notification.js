const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  role: { type: String, enum: ['tutor', 'learner', 'student'], required: true },
  title: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  read: { type: Boolean, default: false, index: true },
  type: {
    type: String,
    enum: [
      'schedule_created',
      'schedule_updated',
      'schedule_cancelled',
      'schedule_reminder',
      'batch_added',
      'batch_removed',
      'message_received',
    ],
    default: 'schedule_created',
  },
  scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Schedule' },
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' },
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Notification', notificationSchema)
