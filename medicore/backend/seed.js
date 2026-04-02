/**
 * Sefa Diagnostic Centre Database Seeder
 * Run: node seed.js
 * Clears existing data and seeds doctors + admin user
 */

require('dotenv').config()
const mongoose = require('mongoose')
const User = require('./models/User')
const Doctor = require('./models/Doctor')

const DOCTORS_SEED = [
  {
    name: 'Dr. Anika Sharma',
    specialization: 'Cardiologist',
    experience: 14,
    image: 'https://api.dicebear.com/7.x/personas/svg?seed=anika&backgroundColor=b6e3f4',
    qualification: 'MBBS, MD (Cardiology), DM',
    fee: 800,
    rating: 4.9,
    reviews: 312,
    bio: 'Specialist in interventional cardiology with expertise in echocardiography and cardiac catheterization.',
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    timeSlots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '04:00 PM', '04:30 PM', '05:00 PM'],
  },
  {
    name: 'Dr. Rahul Mehta',
    specialization: 'Neurologist',
    experience: 11,
    image: 'https://api.dicebear.com/7.x/personas/svg?seed=rahul&backgroundColor=c0aede',
    qualification: 'MBBS, MD, DM (Neurology)',
    fee: 900,
    rating: 4.8,
    reviews: 248,
    bio: 'Expert in treating epilepsy, stroke, Parkinson\'s, and other complex neurological disorders.',
    availableDays: ['Tuesday', 'Thursday', 'Saturday'],
    timeSlots: ['10:00 AM', '10:30 AM', '11:00 AM', '02:00 PM', '02:30 PM', '03:00 PM'],
  },
  {
    name: 'Dr. Priya Nair',
    specialization: 'Gynecologist',
    experience: 9,
    image: 'https://api.dicebear.com/7.x/personas/svg?seed=priya&backgroundColor=ffd5dc',
    qualification: 'MBBS, MS (Obstetrics & Gynaecology)',
    fee: 750,
    rating: 4.9,
    reviews: 421,
    bio: 'Dedicated to women\'s health with expertise in high-risk pregnancies and laparoscopic surgeries.',
    availableDays: ['Monday', 'Tuesday', 'Thursday', 'Saturday'],
    timeSlots: ['09:00 AM', '09:30 AM', '10:00 AM', '02:00 PM', '02:30 PM', '03:00 PM', '04:00 PM'],
  },
  {
    name: 'Dr. Suresh Kumar',
    specialization: 'Orthopedic Surgeon',
    experience: 16,
    image: 'https://api.dicebear.com/7.x/personas/svg?seed=suresh&backgroundColor=d1f4d0',
    qualification: 'MBBS, MS (Orthopaedics), DNB',
    fee: 850,
    rating: 4.7,
    reviews: 185,
    bio: 'Pioneering joint replacement and sports injury management with 16+ years of surgical experience.',
    availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
    timeSlots: ['08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '04:00 PM', '04:30 PM'],
  },
  {
    name: 'Dr. Fatima Sheikh',
    specialization: 'Dermatologist',
    experience: 7,
    image: 'https://api.dicebear.com/7.x/personas/svg?seed=fatima&backgroundColor=ffd5dc',
    qualification: 'MBBS, MD (Dermatology)',
    fee: 700,
    rating: 4.8,
    reviews: 293,
    bio: 'Expert in cosmetic dermatology, skin cancer screening, and advanced laser treatments.',
    availableDays: ['Tuesday', 'Wednesday', 'Friday'],
    timeSlots: ['10:00 AM', '10:30 AM', '11:00 AM', '05:00 PM', '05:30 PM', '06:00 PM'],
  },
  {
    name: 'Dr. Arjun Patel',
    specialization: 'Pediatrician',
    experience: 12,
    image: 'https://api.dicebear.com/7.x/personas/svg?seed=arjun&backgroundColor=b6e3f4',
    qualification: 'MBBS, MD (Pediatrics), Fellowship NICU',
    fee: 650,
    rating: 4.9,
    reviews: 517,
    bio: 'Compassionate care for children from neonates to adolescents, with NICU specialization.',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timeSlots: ['09:00 AM', '09:30 AM', '10:00 AM', '04:00 PM', '04:30 PM', '05:00 PM'],
  },
]

async function seed() {
  try {
    console.log('🌱 Connecting to MongoDB…')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected.')

    // Clear existing data
    await Promise.all([User.deleteMany(), Doctor.deleteMany()])
    console.log('🗑️  Cleared existing data.')

    // Create admin user
    const admin = await User.create({
      name: 'Sefa Diagnostic Centre Admin',
      email: process.env.ADMIN_EMAIL || 'admin@Sefa Diagnostic Centre.in',
      phone: '9876543210',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'admin',
    })
    console.log(`👤 Admin created: ${admin.email}`)

    // Seed doctors
    const doctors = await Doctor.insertMany(DOCTORS_SEED)
    console.log(`👨‍⚕️  ${doctors.length} doctors seeded.`)

    console.log('\n✨ Database seeded successfully!')
    console.log('─'.repeat(40))
    console.log(`Admin Email:    ${admin.email}`)
    console.log(`Admin Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`)
    console.log('─'.repeat(40))

    process.exit(0)
  } catch (err) {
    console.error('❌ Seed error:', err)
    process.exit(1)
  }
}

seed()
