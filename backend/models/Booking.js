const mongoose = require('mongoose')

// ═══ APPOINTMENT ═══
const appointmentSchema = new mongoose.Schema({
  bookingRef: {
    type: String,
    unique: true,
    default: () => 'MC' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 100),
  },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  patientDetails: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    notes: String,
  },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'],
    default: 'confirmed',
  },
  fee: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  prescription: { type: String }, // URL to prescription document
  cancelledAt: Date,
  cancelReason: String,
}, {
  timestamps: true,
})

appointmentSchema.index({ patient: 1, date: -1 })
appointmentSchema.index({ doctor: 1, date: 1 })
appointmentSchema.index({ status: 1 })

// ═══ DIAGNOSTIC BOOKING ═══
const diagnosticBookingSchema = new mongoose.Schema({
  bookingRef: {
    type: String,
    unique: true,
    default: () => 'DX' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 100),
  },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientDetails: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    age: { type: Number, required: true },
    gender: { type: String, required: true },
  },
  tests: [{
    testId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: String,
  }],
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  homeCollection: { type: Boolean, default: false },
  collectionAddress: String,
  homeCollectionCharge: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['upcoming', 'sample_collected', 'processing', 'report_ready', 'completed', 'cancelled'],
    default: 'upcoming',
  },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  reportUrl: String,
  reportUploadedAt: Date,
}, {
  timestamps: true,
})

diagnosticBookingSchema.index({ patient: 1, date: -1 })
diagnosticBookingSchema.index({ status: 1 })

const Appointment = mongoose.model('Appointment', appointmentSchema)
const DiagnosticBooking = mongoose.model('DiagnosticBooking', diagnosticBookingSchema)

module.exports = { Appointment, DiagnosticBooking }
