const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json({ limit: '12mb' }))
app.use(express.urlencoded({ limit: '12mb', extended: true }))

const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI || ''
const JWT_SECRET = process.env.JWT_SECRET || ''

app.get('/api/status', (req, res) => res.json({ status: 'ok' }))

app.use('/api/contact', require('./routes/contact'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/experts', require('./routes/experts'))
app.use('/api/admin', require('./routes/admin'))
app.use('/api/tutor', require('./routes/tutor'))
app.use('/api/learner', require('./routes/learner'))
app.use('/api/analytics', require('./routes/analytics'))

async function connectAndSeed() {
  if (!MONGODB_URI) {
    console.warn('MONGODB_URI not set - database features disabled')
    return
  }
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('MongoDB connected')
    if (process.env.SEED_DEMO_USERS !== 'false') {
      try {
        const { seedDemoUsers, DEMO_PASS } = require('./lib/seedDemoUsers')
        const results = await seedDemoUsers()
        console.log('Demo users ready (password: ' + DEMO_PASS + ')')
        for (const r of results) console.log('  -', r.email, '(' + r.role + ')', r.action)
      } catch (seedErr) {
        console.error('Demo user seed failed:', seedErr.message)
      }
      try {
        const { seedTutorDemo } = require('./lib/seedTutorDemo')
        const tutorSeed = await seedTutorDemo()
        if (tutorSeed.seeded) {
          console.log('Tutor demo data seeded (' + tutorSeed.courses + ' courses)')
        }
      } catch (seedErr) {
        console.error('Tutor demo seed failed:', seedErr.message)
      }
    }
  } catch (err) {
    console.error('MongoDB connection failed — login and user features will not work', err.message)
  }
}

async function start() {
  if (!JWT_SECRET) console.warn('JWT_SECRET not set - using default insecure secret')

  // Accept HTTP immediately so login is not blocked by seed / slow DB connect
  app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`))
  connectAndSeed().catch((err) => console.error('Startup DB init failed', err))
}

start()
