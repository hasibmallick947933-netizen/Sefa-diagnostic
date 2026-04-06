const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { protect } = require('../middleware/auth')

const router = express.Router()

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })

const sendTokenResponse = (user, statusCode, res) => {
  const token = signToken(user._id)
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  })
}

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required.' })
    }

    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' })
    }

    const user = await User.create({ name, email, phone, password, role: 'patient' })
    sendTokenResponse(user, 201, res)
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'Email already registered.' })
    }
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message)
      return res.status(400).json({ success: false, message: messages.join('. ') })
    }
    console.error('Signup error:', err)
    res.status(500).json({ success: false, message: 'Server error. Please try again.' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' })
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' })
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated. Contact support.' })
    }

    user.lastLogin = new Date()
    await user.save({ validateBeforeSave: false })

    sendTokenResponse(user, 200, res)
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ success: false, message: 'Server error. Please try again.' })
  }
})

// GET /api/auth/me — get current user
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, user: req.user })
})

// PATCH /api/auth/update-profile
router.patch('/update-profile', protect, async (req, res) => {
  try {
    const allowedFields = ['name', 'phone', 'dateOfBirth', 'gender', 'address', 'bloodGroup', 'allergies']
    const updates = {}
    allowedFields.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f] })

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true })
    res.json({ success: true, user })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})

module.exports = router
