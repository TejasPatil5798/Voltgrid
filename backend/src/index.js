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

// Simple status route
app.get('/api/status', (req, res) => res.json({ status: 'ok' }))

// Mount API routes
app.use('/api/contact', require('./routes/contact'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/experts', require('./routes/experts'))
app.use('/api/admin', require('./routes/admin'))

// Connect to MongoDB
async function start() {
    if (!JWT_SECRET) console.warn('JWT_SECRET not set - using default insecure secret')

    if (!MONGODB_URI) {
        console.warn('MONGODB_URI not set - database features disabled')
    } else {
        try {
            await mongoose.connect(MONGODB_URI)
        } catch (err) {
            console.error('MongoDB connection failed - continuing with file-based fallbacks', err)
        }
    }

    app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`))
    return
    try {
        if (!MONGODB_URI) console.warn('MONGODB_URI not set — database features disabled')
        else await mongoose.connect(MONGODB_URI)

        if (!JWT_SECRET) console.warn('JWT_SECRET not set — using default insecure secret')

        // mount auth routes
        app.use('/api/auth', require('./routes/auth'))
        // mount experts route
        app.use('/api/experts', require('./routes/experts'))
        // mount admin routes (protected)
        app.use('/api/admin', require('./routes/admin'))
        // other API routes mounted elsewhere (contact route already mounted)

        app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`))
    } catch (err) {
        console.error('Failed to start server', err)
        process.exit(1)
    }
}

start()
