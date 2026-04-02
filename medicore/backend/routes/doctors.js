const express = require('express')
const Doctor = require('../models/Doctor')
const { protect, restrictTo } = require('../middleware/auth')

const router = express.Router()

// GET /api/doctors — list all active doctors
router.get('/', async (req, res) => {
  try {
    const { specialization, day, search } = req.query
    const filter = { isActive: true }

    if (specialization && specialization !== 'All') filter.specialization = specialization
    if (day) filter.availableDays = day
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
      ]
    }

    const doctors = await Doctor.find(filter).sort({ rating: -1 })
    res.json({ success: true, count: doctors.length, doctors })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /api/doctors/:id
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found.' })
    res.json({ success: true, doctor })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /api/doctors — admin only
router.post('/', protect, restrictTo('admin'), async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body)
    res.status(201).json({ success: true, doctor })
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message)
      return res.status(400).json({ success: false, message: messages.join('. ') })
    }
    res.status(500).json({ success: false, message: err.message })
  }
})

// PATCH /api/doctors/:id — admin only
router.patch('/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found.' })
    res.json({ success: true, doctor })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})

// DELETE /api/doctors/:id — admin only (soft delete)
router.delete('/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true })
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found.' })
    res.json({ success: true, message: 'Doctor deactivated successfully.' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /api/doctors/:id/availability — check slots for a date
router.get('/:id/availability', async (req, res) => {
  try {
    const { date } = req.query
    if (!date) return res.status(400).json({ success: false, message: 'Date is required.' })

    const doctor = await Doctor.findById(req.params.id)
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found.' })

    const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' })
    const isAvailable = doctor.availableDays.includes(dayName)

    // In production: filter out already-booked slots from Appointment collection
    const slots = isAvailable ? doctor.timeSlots : []

    res.json({ success: true, isAvailable, dayName, slots })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
