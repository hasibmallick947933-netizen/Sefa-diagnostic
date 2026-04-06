const express = require('express')
const { Appointment, DiagnosticBooking } = require('../models/Booking')
const Doctor = require('../models/Doctor')
const { protect, restrictTo } = require('../middleware/auth')

const router = express.Router()

// ═══════════════════════════════════════════
// APPOINTMENT ROUTES
// ═══════════════════════════════════════════

// POST /api/bookings/appointments — create appointment
router.post('/appointments', protect, async (req, res) => {
  try {
    const { doctorId, date, timeSlot, patientDetails } = req.body

    if (!doctorId || !date || !timeSlot || !patientDetails) {
      return res.status(400).json({ success: false, message: 'All booking details are required.' })
    }

    const doctor = await Doctor.findById(doctorId)
    if (!doctor || !doctor.isActive) {
      return res.status(404).json({ success: false, message: 'Doctor not found or unavailable.' })
    }

    // Check slot availability
    const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' })
    if (!doctor.availableDays.includes(dayName)) {
      return res.status(400).json({ success: false, message: `Doctor is not available on ${dayName}.` })
    }

    // Check for duplicate booking
    const conflict = await Appointment.findOne({
      doctor: doctorId,
      date: new Date(date),
      timeSlot,
      status: { $nin: ['cancelled'] },
    })
    if (conflict) {
      return res.status(409).json({ success: false, message: 'This time slot is already booked. Please choose another.' })
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      date: new Date(date),
      timeSlot,
      patientDetails,
      fee: doctor.fee,
      status: 'confirmed',
    })

    const populated = await appointment.populate('doctor', 'name specialization image')

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully!',
      appointment: populated,
    })
  } catch (err) {
    console.error('Appointment booking error:', err)
    res.status(500).json({ success: false, message: 'Booking failed. Please try again.' })
  }
})

// GET /api/bookings/appointments — my appointments
router.get('/appointments', protect, async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { patient: req.user._id }
    const { status, page = 1, limit = 10 } = req.query
    if (status) filter.status = status

    const skip = (Number(page) - 1) * Number(limit)
    const [appointments, total] = await Promise.all([
      Appointment.find(filter)
        .populate('doctor', 'name specialization image')
        .sort({ date: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Appointment.countDocuments(filter),
    ])

    res.json({ success: true, appointments, total, page: Number(page), pages: Math.ceil(total / Number(limit)) })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// PATCH /api/bookings/appointments/:id/cancel
router.patch('/appointments/:id/cancel', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      patient: req.user._id,
    })

    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found.' })
    if (appointment.status === 'cancelled') return res.status(400).json({ success: false, message: 'Already cancelled.' })
    if (appointment.status === 'completed') return res.status(400).json({ success: false, message: 'Cannot cancel a completed appointment.' })

    // Check 2-hour cancellation policy
    const appointmentTime = new Date(appointment.date)
    const twoHoursBefore = new Date(appointmentTime.getTime() - 2 * 60 * 60 * 1000)
    if (new Date() > twoHoursBefore) {
      return res.status(400).json({ success: false, message: 'Cancellation not allowed within 2 hours of appointment.' })
    }

    appointment.status = 'cancelled'
    appointment.cancelledAt = new Date()
    appointment.cancelReason = req.body.reason || 'Cancelled by patient'
    await appointment.save()

    res.json({ success: true, message: 'Appointment cancelled successfully.', appointment })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ═══════════════════════════════════════════
// DIAGNOSTIC BOOKING ROUTES
// ═══════════════════════════════════════════

// POST /api/bookings/tests — book diagnostic tests
router.post('/tests', protect, async (req, res) => {
  try {
    const { tests, date, timeSlot, homeCollection, collectionAddress, patientDetails } = req.body

    if (!tests?.length || !date || !timeSlot || !patientDetails) {
      return res.status(400).json({ success: false, message: 'Tests, date, time slot, and patient details are required.' })
    }

    if (homeCollection && !collectionAddress) {
      return res.status(400).json({ success: false, message: 'Collection address is required for home collection.' })
    }

    const homeCollectionCharge = homeCollection ? 100 : 0
    const totalAmount = tests.reduce((sum, t) => sum + t.price, 0) + homeCollectionCharge

    const booking = await DiagnosticBooking.create({
      patient: req.user._id,
      tests,
      date: new Date(date),
      timeSlot,
      homeCollection: !!homeCollection,
      collectionAddress: homeCollection ? collectionAddress : undefined,
      homeCollectionCharge,
      totalAmount,
      patientDetails,
      status: 'upcoming',
    })

    res.status(201).json({
      success: true,
      message: 'Tests booked successfully!',
      booking,
    })
  } catch (err) {
    console.error('Test booking error:', err)
    res.status(500).json({ success: false, message: 'Booking failed. Please try again.' })
  }
})

// GET /api/bookings/tests — my test bookings
router.get('/tests', protect, async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { patient: req.user._id }
    const { status } = req.query
    if (status) filter.status = status

    const bookings = await DiagnosticBooking.find(filter).sort({ date: -1 })
    res.json({ success: true, bookings })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// PATCH /api/bookings/tests/:id/cancel
router.patch('/tests/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await DiagnosticBooking.findOne({ _id: req.params.id, patient: req.user._id })
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' })
    if (['cancelled', 'completed'].includes(booking.status)) {
      return res.status(400).json({ success: false, message: `Cannot cancel a ${booking.status} booking.` })
    }
    booking.status = 'cancelled'
    await booking.save()
    res.json({ success: true, message: 'Test booking cancelled.', booking })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ═══════════════════════════════════════════
// ADMIN ROUTES
// ═══════════════════════════════════════════

// PATCH /api/bookings/tests/:id/status — admin updates test status / uploads report
router.patch('/tests/:id/status', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { status, reportUrl } = req.body
    const update = { status }
    if (reportUrl) { update.reportUrl = reportUrl; update.reportUploadedAt = new Date() }

    const booking = await DiagnosticBooking.findByIdAndUpdate(req.params.id, update, { new: true })
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' })
    res.json({ success: true, booking })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// PATCH /api/bookings/appointments/:id/status — admin updates appointment status
router.patch('/appointments/:id/status', protect, restrictTo('admin'), async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found.' })
    res.json({ success: true, appointment })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /api/bookings/stats — admin dashboard stats
router.get('/stats', protect, restrictTo('admin'), async (req, res) => {
  try {
    const [totalAppointments, totalTests, confirmedAppts, reportReadyTests] = await Promise.all([
      Appointment.countDocuments(),
      DiagnosticBooking.countDocuments(),
      Appointment.countDocuments({ status: 'confirmed' }),
      DiagnosticBooking.countDocuments({ status: 'report_ready' }),
    ])

    res.json({
      success: true,
      stats: { totalAppointments, totalTests, confirmedAppts, reportReadyTests },
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
