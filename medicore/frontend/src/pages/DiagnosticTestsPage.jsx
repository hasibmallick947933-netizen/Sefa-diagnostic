import { useState } from 'react'
import { CheckCircle, Home, Clock, Search, Filter, ShoppingCart, X, ChevronRight } from 'lucide-react'
import { DIAGNOSTIC_TESTS } from '../utils/data'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const CATEGORIES = ['All', ...new Set(DIAGNOSTIC_TESTS.map(t => t.category))]

const DATES = Array.from({ length: 10 }, (_, i) => {
  const d = new Date()
  d.setDate(d.getDate() + i + 1)
  return d
})

const TIME_SLOTS = ['07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM']

export default function DiagnosticTestsPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState('')
  const [homeCollection, setHomeCollection] = useState(false)
  const [address, setAddress] = useState('')
  const [form, setForm] = useState({ name: '', phone: '', email: '', age: '', gender: '' })
  const [booked, setBooked] = useState(false)
  const [bookingRef, setBookingRef] = useState('')
  const navigate = useNavigate()

  const filtered = DIAGNOSTIC_TESTS.filter(t =>
    (category === 'All' || t.category === category) &&
    t.name.toLowerCase().includes(search.toLowerCase())
  )

  const addToCart = (test) => {
    if (cart.find(c => c.id === test.id)) {
      toast('Already in cart', { icon: '🛒' })
      return
    }
    setCart([...cart, test])
    toast.success(`${test.name} added to cart`)
  }

  const removeFromCart = (id) => setCart(cart.filter(c => c.id !== id))

  const total = cart.reduce((s, t) => s + t.price, 0)
  const homeCharge = homeCollection ? 100 : 0

  const handleBooking = () => {
    const ref = 'DX' + Date.now().toString().slice(-6)
    setBookingRef(ref)
    toast.success('Tests booked successfully!')
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
            <h2 className="text-2xl font-bold font-display text-neutral-800 mb-2">Tests Booked!</h2>
            <p className="text-neutral-500 mb-2">Booking Ref: <span className="font-mono font-bold text-primary-600">#{bookingRef}</span></p>
            {homeCollection && <p className="text-sm text-teal-600 bg-teal-50 px-4 py-2 rounded-xl mb-3">🏠 Home collection scheduled at your address</p>}
            <div className="bg-neutral-50 rounded-xl p-4 text-left space-y-2 mb-5">
              {cart.map(t => (
                <div key={t.id} className="flex justify-between text-sm">
                  <span>{t.icon} {t.name}</span><span className="font-semibold">₹{t.price}</span>
                </div>
              ))}
              {homeCollection && <div className="flex justify-between text-sm text-teal-600"><span>🚗 Home Collection</span><span>₹100</span></div>}
              <div className="border-t border-neutral-200 pt-2 flex justify-between font-bold text-base">
                <span>Total</span><span className="text-primary-600">₹{total + homeCharge}</span>
              </div>
            </div>
            <p className="text-xs text-neutral-400 mb-5">Date: {selectedDate?.toLocaleDateString('en-IN', { dateStyle: 'medium' })} at {selectedSlot}</p>
            <div className="flex gap-3">
              <button onClick={() => { setBooked(false); setCart([]); setStep(1); setSelectedDate(null); setSelectedSlot('') }} className="flex-1 btn-outline text-sm">
                Book More
              </button>
              <button onClick={() => navigate('/dashboard')} className="flex-1 btn-primary text-sm">View Dashboard</button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="pt-28 pb-16 min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="badge bg-teal-50 text-teal-700 mb-3 mx-auto">Diagnostic Services</div>
          <h1 className="section-title">Book Diagnostic Tests</h1>
          <p className="section-subtitle mx-auto">500+ tests available. NABL-certified lab. Reports online within hours.</p>
        </div>

        <div className="flex gap-6 relative">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-card p-4 mb-6 flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input type="search" placeholder="Search tests…" value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" aria-label="Search tests" />
              </div>
              <div className="flex items-center gap-2">
                <Filter size={15} className="text-neutral-400 flex-shrink-0" />
                <select value={category} onChange={e => setCategory(e.target.value)} className="input-field w-auto" aria-label="Filter by category">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Tests grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(test => {
                const inCart = cart.some(c => c.id === test.id)
                return (
                  <article key={test.id} className="card p-5 group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-3xl">{test.icon}</div>
                      <span className={`badge text-[10px] ${
                        test.category === 'MRI' ? 'bg-purple-50 text-purple-700' :
                        test.category === 'CT Scan' ? 'bg-orange-50 text-orange-700' :
                        test.category === 'Radiology' ? 'bg-blue-50 text-blue-700' :
                        'bg-teal-50 text-teal-700'
                      }`}>{test.category}</span>
                    </div>
                    <h3 className="font-semibold text-neutral-800 mb-1 text-sm">{test.name}</h3>
                    <p className="text-xs text-neutral-500 mb-3 line-clamp-2">{test.description}</p>

                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <Clock size={11} className="text-teal-500" /> Report: {test.duration}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">📋 {test.preparation}</span>
                      </div>
                      {test.homeCollection && (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-600">
                          <Home size={11} /> Home collection available
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary-600">₹{test.price}</span>
                      <button
                        onClick={() => inCart ? removeFromCart(test.id) : addToCart(test)}
                        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all ${
                          inCart
                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                            : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                        }`}
                        aria-label={inCart ? 'Remove from cart' : 'Add to cart'}
                      >
                        {inCart ? (<><X size={12} /> Remove</>) : (<><ShoppingCart size={12} /> Add</>)}
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>

          {/* Cart sidebar (desktop) */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="card p-5 sticky top-28">
              <h3 className="font-bold text-neutral-800 mb-4 flex items-center gap-2">
                <ShoppingCart size={18} className="text-primary-600" />
                Cart ({cart.length})
              </h3>

              {cart.length === 0 ? (
                <div className="text-center py-8 text-neutral-400">
                  <ShoppingCart size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No tests added yet</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2 mb-4 max-h-64 overflow-y-auto scrollbar-hide">
                    {cart.map(test => (
                      <div key={test.id} className="flex items-center gap-2 p-2.5 bg-neutral-50 rounded-xl">
                        <span className="text-lg">{test.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-neutral-700 truncate">{test.name}</p>
                          <p className="text-xs text-primary-600">₹{test.price}</p>
                        </div>
                        <button onClick={() => removeFromCart(test.id)} className="text-neutral-300 hover:text-red-400 transition-colors">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Home collection */}
                  <label className="flex items-center gap-2.5 p-3 bg-emerald-50 rounded-xl cursor-pointer mb-4">
                    <input type="checkbox" checked={homeCollection} onChange={e => setHomeCollection(e.target.checked)} className="w-4 h-4 rounded text-teal-600" />
                    <div>
                      <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1"><Home size={11} /> Home Collection</p>
                      <p className="text-[10px] text-emerald-600">+₹100 | Technician visits home</p>
                    </div>
                  </label>

                  {/* Date selection */}
                  {!selectedDate ? (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-neutral-600 mb-2">Select Date</p>
                      <div className="grid grid-cols-5 gap-1.5">
                        {DATES.slice(0,10).map(date => (
                          <button key={date.toDateString()} onClick={() => setSelectedDate(date)}
                            className="p-2 rounded-lg text-center text-[10px] border border-neutral-200 hover:border-primary-400 hover:bg-primary-50 transition-all">
                            <div className="font-bold">{date.getDate()}</div>
                            <div className="opacity-60">{date.toLocaleDateString('en-US', { month: 'short' })}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-neutral-600">Date: {selectedDate.toLocaleDateString('en-IN', { dateStyle: 'medium' })}</p>
                        <button onClick={() => { setSelectedDate(null); setSelectedSlot('') }} className="text-xs text-red-400 hover:underline">Change</button>
                      </div>
                      {!selectedSlot ? (
                        <div>
                          <p className="text-xs font-semibold text-neutral-600 mb-2">Select Time</p>
                          <div className="grid grid-cols-3 gap-1.5">
                            {TIME_SLOTS.map(slot => (
                              <button key={slot} onClick={() => setSelectedSlot(slot)}
                                className="text-[10px] font-medium py-1.5 px-1 rounded-lg border border-neutral-200 hover:border-primary-400 hover:bg-primary-50 transition-all">
                                {slot}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-xs bg-primary-50 px-3 py-2 rounded-xl">
                          <span className="text-primary-700 font-semibold">⏰ {selectedSlot}</span>
                          <button onClick={() => setSelectedSlot('')} className="text-red-400 hover:underline">Change</button>
                        </div>
                      )}
                    </div>
                  )}

                  {homeCollection && (
                    <textarea className="input-field text-xs mb-3 min-h-[60px] resize-none" placeholder="Enter your full address for home collection…"
                      value={address} onChange={e => setAddress(e.target.value)} />
                  )}

                  {/* Patient form */}
                  {selectedSlot && (
                    <div className="space-y-2 mb-4">
                      <input className="input-field text-xs" placeholder="Patient name *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                      <input className="input-field text-xs" placeholder="Phone *" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                      <input className="input-field text-xs" placeholder="Age *" type="number" value={form.age} onChange={e => setForm({...form, age: e.target.value})} />
                      <select className="input-field text-xs" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                        <option value="">Gender *</option>
                        <option>Male</option><option>Female</option><option>Other</option>
                      </select>
                    </div>
                  )}

                  <div className="border-t border-neutral-100 pt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-neutral-500">Tests ({cart.length})</span><span>₹{total}</span>
                    </div>
                    {homeCollection && <div className="flex justify-between text-sm mb-1 text-teal-600"><span>Home Collection</span><span>₹100</span></div>}
                    <div className="flex justify-between font-bold text-base mb-3">
                      <span>Total</span><span className="text-primary-600">₹{total + homeCharge}</span>
                    </div>
                    <button
                      onClick={handleBooking}
                      disabled={!selectedDate || !selectedSlot || !form.name || !form.phone || !form.age || !form.gender || (homeCollection && !address)}
                      className="w-full btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Confirm Booking
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile cart button */}
        {cart.length > 0 && (
          <div className="lg:hidden fixed bottom-6 left-4 right-4 z-40">
            <button
              onClick={() => setShowCart(true)}
              className="w-full btn-primary flex items-center justify-between px-5 py-4 text-base shadow-2xl"
            >
              <span className="flex items-center gap-2"><ShoppingCart size={18} /> {cart.length} test{cart.length > 1 ? 's' : ''} selected</span>
              <span>₹{total} <ChevronRight size={18} className="inline" /></span>
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
