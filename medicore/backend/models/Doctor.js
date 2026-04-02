const mongoose = require('mongoose')

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  specialization: { type: String, required: true },
  qualification: { type: String, required: true },
  experience: { type: Number, required: true, min: 0 },
  image: { type: String, default: 'https://api.dicebear.com/7.x/personas/svg?seed=doctor' },
  bio: { type: String, maxlength: 500 },
  fee: { type: Number, required: true, min: 0 },
  rating: { type: Number, default: 4.5, min: 1, max: 5 },
  reviews: { type: Number, default: 0 },
  availableDays: {
    type: [String],
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },
  timeSlots: [String],
  isActive: { type: Boolean, default: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // if doctor has portal access
}, {
  timestamps: true,
})

doctorSchema.index({ specialization: 1 })
doctorSchema.index({ isActive: 1 })

module.exports = mongoose.model('Doctor', doctorSchema)
