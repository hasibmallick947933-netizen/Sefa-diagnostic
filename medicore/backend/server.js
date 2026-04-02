require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')

// ─── Routes ───
const authRoutes = require('./routes/auth')
const doctorRoutes = require('./routes/doctors')
const bookingRoutes = require('./routes/bookings')

const app = express()
const PORT = process.env.PORT || 5000

// ─── Security Middleware ───
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// ─── Rate Limiting ───
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { success: false, message: 'Too many requests. Please try again later.' },
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many auth attempts. Please wait 15 minutes.' },
  skipSuccessfulRequests: true,
})

app.use(globalLimiter)

// ─── Body Parsing ───
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true }))

// ─── Logging ───
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// ─── Health Check ───
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🏥 Sefa Diagnostic Centre API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  })
})

// ─── API Routes ───
app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/doctors', doctorRoutes)
app.use('/api/bookings', bookingRoutes)

// ─── 404 Handler ───
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} not found.` })
})

// ─── Global Error Handler ───
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  const statusCode = err.statusCode || 500
  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred.' : err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
})

// ─── Database Connection + Server Start ───
const startServer = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.warn('⚠️  MONGODB_URI not set. Running without database (auth/booking routes will fail).')
    } else {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
      })
      console.log('✅ MongoDB connected successfully')
    }

    app.listen(PORT, () => {
      console.log('\n' + '═'.repeat(50))
      console.log(`  🏥 Sefa Diagnostic Centre API Server`)
      console.log('═'.repeat(50))
      console.log(`  ➜ Local:   http://localhost:${PORT}`)
      console.log(`  ➜ Health:  http://localhost:${PORT}/api/health`)
      console.log(`  ➜ Env:     ${process.env.NODE_ENV || 'development'}`)
      console.log('═'.repeat(50) + '\n')
    })
  } catch (err) {
    console.error('❌ Server startup failed:', err.message)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully…')
  await mongoose.connection.close()
  process.exit(0)
})

startServer()
