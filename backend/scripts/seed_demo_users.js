const mongoose = require('mongoose')
const dotenv = require('dotenv')
const { seedDemoUsers, DEMO_PASS } = require('../src/lib/seedDemoUsers')

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || ''

async function run() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI not set in backend/.env')
    process.exit(1)
  }
  await mongoose.connect(MONGODB_URI)
  console.log('Connected to MongoDB')
  const results = await seedDemoUsers()
  for (const r of results) console.log(`${r.action}: ${r.email} (${r.role})`)
  console.log('\nDemo password for all accounts:', DEMO_PASS)
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
