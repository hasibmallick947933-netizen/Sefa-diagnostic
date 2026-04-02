import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { CheckCircle, User, Calendar, Clock, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { DOCTORS } from '../utils/data'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const STEPS = ['Select Doctor', 'Choose Date & Time', 'Patient Details', 'Confirm']

const today = new Date()
const DATES = Array.from({ length: 14 }, (_, i) => {
  const d = new Date(today)
  d.setDate(today.getDate() + i + 1)
  return d
})

export default function BookAppointmentPage() {
  const [params] = useSearchParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', email: user?.email || '', age: '', gender: '', notes: '' })
  const [booked, setBooked] = useState(false)
  const [bookingRef, setBookingRef] = useState('')

  const doctorId = Number(params.get('doctor'))
  useEffect(() => {
    if (doctorId) {
      const doc = DOCTORS.find(d => d.id === doctorId)
      if (doc) { setSelectedDoctor(doc); setStep(1) }
    }
  }, [doctorId])

  const getAvailableSlots = () => {
    if (!selectedDoctor || !selectedDate) return []
    const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' })
    if (!selectedDoctor.availableDays.includes(dayName)) return []
    return selectedDoctor.timeSlots
  }

  const handleSubmit = async () => {
    const ref = 'MC' + Date.now().toString().slice(-6)
    setBookingRef(ref)
    // In real app: POST to /api/appointments
    toast.success('Appointment booked successfully!')
    setBooked(true)
  }

  if (booked) {
    return (
      <main className="pt-28 pb-16 min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="card p-8 text-center">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={42} className="text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold font-display text-neutral-800 mb-2">Appointment Confirmed!</h2>
            <p className="text-neutral-500 mb-6">Your appointment has been booked successfully.</p>

            <div className="bg-neutral-50 rounded-2xl p-5 text-left space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Booking Ref</span>
                <span className="font-mono font-bold text-primary-600">#{bookingRef}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Doctor</span>
                <span className="font-semibold">{selectedDoctor?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Specialization</span>
                <span>{selectedDoctor?.specialization}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Date</span>
                <span className="font-semibold">{selectedDate?.toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Time</span>
                <span className="font-semibold">{selectedSlot}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Patient</span>
                <span>{form.name}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-neutral-200 pt-3 mt-1">
                <span className="text-neutral-500">Consultation Fee</span>
                <span className="font-bold text-primary-600">₹{selectedDoctor?.fee}</span>
              </div>
            </div>

            <p className="text-xs text-neutral-400 mb-6">📱 A confirmation SMS has been sent to {form.phone}</p>

            <div className="flex gap-3">
              <button onClick={() => { setBooked(false); setStep(0); setSelectedDoctor(null); setSelectedDate(null); setSelectedSlot(null) }}
                className="flex-1 btn-outline text-sm py-2.5">
                Book Another
              </button>
              <button onClick={() => navigate('/dashboard')} className="flex-1 btn-primary text-sm py-2.5">
                View Bookings
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="pt-28 pb-16 min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="section-title">Book an Appointment</h1>
          <p className="section-subtitle mx-auto">Complete the steps below to schedule your consultation.</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`flex items-center gap-2 ${i <= step ? 'text-primary-600' : 'text-neutral-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  i < step ? 'bg-primary-600 text-white' :
                  i === step ? 'bg-primary-600 text-white ring-4 ring-primary-100' :
                  'bg-neutral-200 text-neutral-400'
                }`}>
                  {i < step ? <CheckCircle size={16} /> : i + 1}
                </div>
                <span className="hidden sm:block text-xs font-semibold">{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-8 sm:w-16 h-0.5 mx-2 transition-all ${i < step ? 'bg-primary-500' : 'bg-neutral-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* ─── STEP 0: Select Doctor ─── */}
        {step === 0 && (
          <div>
            <h2 className="text-xl font-bold text-neutral-800 mb-5">Choose a Doctor</h2>
            <div className="grid gap-4">
              {DOCTORS.map(doc => (
                <div
                  key={doc.id}
                  onClick={() => { setSelectedDoctor(doc); setStep(1) }}
                  className={`card p-5 cursor-pointer hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-4 ${selectedDoctor?.id === doc.id ? 'ring-2 ring-primary-500' : ''}`}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select ${doc.name}`}
                  onKeyDown={e => e.key === 'Enter' && (setSelectedDoctor(doc), setStep(1))}
                >
                  <img src={doc.image} alt={doc.name} className="w-16 h-16 rounded-xl bg-primary-50 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-neutral-800">{doc.name}</h3>
                        <p className="text-sm text-primary-600">{doc.specialization}</p>
                        <p className="text-xs text-neutral-400">{doc.experience} yrs experience</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-lg font-bold text-neutral-800">₹{doc.fee}</div>
                        <div className="flex items-center gap-1 justify-end">
                          <Star size={11} className="text-amber-400 fill-amber-400" />
                          <span className="text-xs text-neutral-500">{doc.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {doc.availableDays.map(d => <span key={d} className="badge bg-emerald-50 text-emerald-700 text-[10px]">{d.slice(0,3)}</span>)}
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-neutral-300 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── STEP 1: Date & Time ─── */}
        {step === 1 && selectedDoctor && (
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-neutral-100">
              <img src={selectedDoctor.image} alt={selectedDoctor.name} className="w-12 h-12 rounded-xl bg-primary-50" />
              <div>
                <h2 className="font-semibold text-neutral-800">{selectedDoctor.name}</h2>
                <p className="text-sm text-primary-600">{selectedDoctor.specialization}</p>
              </div>
            </div>

            <h3 className="font-semibold text-neutral-700 mb-4 flex items-center gap-2"><Calendar size={16} /> Select Date</h3>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-6">
              {DATES.map(date => {
                const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
                const isAvailable = selectedDoctor.availableDays.includes(dayName)
                const isSelected = selectedDate?.toDateString() === date.toDateString()
                return (
                  <button
                    key={date.toDateString()}
                    disabled={!isAvailable}
                    onClick={() => { setSelectedDate(date); setSelectedSlot(null) }}
                    className={`p-2.5 rounded-xl text-center transition-all text-xs font-medium border ${
                      isSelected ? 'bg-primary-600 border-primary-600 text-white shadow-md' :
                      isAvailable ? 'bg-white border-neutral-200 hover:border-primary-300 hover:bg-primary-50 text-neutral-700 cursor-pointer' :
                      'bg-neutral-50 border-neutral-100 text-neutral-300 cursor-not-allowed'
                    }`}
                    aria-label={`${date.toLocaleDateString('en-IN', { dateStyle: 'medium' })} ${isAvailable ? '' : '(unavailable)'}`}
                  >
                    <div className="font-bold text-sm">{date.getDate()}</div>
                    <div className="text-[10px] opacity-70">{date.toLocaleDateString('en-US', { month: 'short' })}</div>
                    <div className="text-[10px] opacity-70">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                  </button>
                )
              })}
            </div>

            {selectedDate && (
              <>
                <h3 className="font-semibold text-neutral-700 mb-3 flex items-center gap-2"><Clock size={16} /> Select Time Slot</h3>
                {getAvailableSlots().length > 0 ? (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {getAvailableSlots().map(slot => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                          selectedSlot === slot
                            ? 'bg-primary-600 border-primary-600 text-white shadow-md'
                            : 'bg-white border-neutral-200 hover:border-primary-300 hover:bg-primary-50 text-neutral-700'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-amber-600 bg-amber-50 px-4 py-3 rounded-xl mb-4">Doctor is unavailable on this date. Please choose another date.</p>
                )}
              </>
            )}

            <div className="flex gap-3 pt-4 border-t border-neutral-100">
              <button onClick={() => setStep(0)} className="btn-outline flex items-center gap-2 text-sm">
                <ChevronLeft size={16} /> Back
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={!selectedDate || !selectedSlot}
                className="flex-1 btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 2: Patient Details ─── */}
        {step === 2 && (
          <div className="card p-6">
            <h2 className="text-xl font-bold text-neutral-800 mb-6 flex items-center gap-2"><User size={20} /> Patient Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Full Name *</label>
                <input className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Patient full name" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Phone Number *</label>
                <input className="input-field" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+91 98765 43210" type="tel" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Email Address</label>
                <input className="input-field" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="patient@email.com" type="email" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Age *</label>
                <input className="input-field" value={form.age} onChange={e => setForm({...form, age: e.target.value})} placeholder="Age in years" type="number" min="1" max="120" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Gender *</label>
                <select className="input-field" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})} required>
                  <option value="">Select gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                  <option>Prefer not to say</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Symptoms / Notes (optional)</label>
              <textarea
                className="input-field min-h-[100px] resize-y"
                value={form.notes}
                onChange={e => setForm({...form, notes: e.target.value})}
                placeholder="Brief description of symptoms or reason for visit…"
              />
            </div>

            <div className="flex gap-3 pt-5 border-t border-neutral-100 mt-5">
              <button onClick={() => setStep(1)} className="btn-outline flex items-center gap-2 text-sm">
                <ChevronLeft size={16} /> Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!form.name || !form.phone || !form.age || !form.gender}
                className="flex-1 btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Review Booking <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 3: Confirm ─── */}
        {step === 3 && (
          <div className="card p-6">
            <h2 className="text-xl font-bold text-neutral-800 mb-6">Review & Confirm</h2>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-primary-50 rounded-2xl p-4">
                <h3 className="text-xs font-bold text-primary-700 uppercase tracking-wider mb-3">Doctor Details</h3>
                <div className="flex items-center gap-3">
                  <img src={selectedDoctor?.image} alt="" className="w-12 h-12 rounded-xl" />
                  <div>
                    <p className="font-semibold text-neutral-800">{selectedDoctor?.name}</p>
                    <p className="text-sm text-primary-600">{selectedDoctor?.specialization}</p>
                  </div>
                </div>
              </div>
              <div className="bg-teal-50 rounded-2xl p-4">
                <h3 className="text-xs font-bold text-teal-700 uppercase tracking-wider mb-3">Appointment Slot</h3>
                <div className="flex items-center gap-2 text-teal-800">
                  <Calendar size={16} />
                  <span className="font-semibold">{selectedDate?.toLocaleDateString('en-IN', { dateStyle: 'full' })}</span>
                </div>
                <div className="flex items-center gap-2 text-teal-800 mt-1">
                  <Clock size={16} />
                  <span className="font-semibold">{selectedSlot}</span>
                </div>
              </div>
            </div>

            <div className="bg-neutral-50 rounded-2xl p-4 mb-6">
              <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">Patient Information</h3>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <span className="text-neutral-500">Name:</span><span className="font-medium">{form.name}</span>
                <span className="text-neutral-500">Phone:</span><span className="font-medium">{form.phone}</span>
                <span className="text-neutral-500">Email:</span><span className="font-medium">{form.email || '—'}</span>
                <span className="text-neutral-500">Age / Gender:</span><span className="font-medium">{form.age} yrs / {form.gender}</span>
                {form.notes && <><span className="text-neutral-500 col-span-2 mt-1">Notes:</span><span className="font-medium col-span-2 text-xs">{form.notes}</span></>}
              </div>
            </div>

            <div className="flex items-center justify-between bg-primary-600 text-white rounded-2xl px-5 py-4 mb-6">
              <span className="font-semibold">Consultation Fee</span>
              <span className="text-2xl font-bold font-display">₹{selectedDoctor?.fee}</span>
            </div>

            <p className="text-xs text-neutral-400 mb-4">
              💡 Payment can be made at the center or via UPI/Card upon arrival. Cancellation is free up to 2 hours before the appointment.
            </p>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="btn-outline flex items-center gap-2 text-sm">
                <ChevronLeft size={16} /> Edit
              </button>
              <button onClick={handleSubmit} className="flex-1 btn-primary text-sm">
                ✅ Confirm Appointment
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
