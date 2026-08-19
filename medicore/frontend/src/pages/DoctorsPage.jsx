import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Star, Filter, Clock, Award } from 'lucide-react'
import { DOCTORS } from '../utils/data'
import Reveal from '../components/Reveal'
import { staggerContainer, staggerItem, hoverLift, hoverButton } from '../lib/motionVariants'

const MotionLink = motion(Link)
const SPECIALIZATIONS = ['All', ...new Set(DOCTORS.map(d => d.specialization))]

export default function DoctorsPage() {
  const [search, setSearch] = useState('')
  const [spec, setSpec] = useState('All')
  const navigate = useNavigate()

  const filtered = DOCTORS.filter(d =>
    (spec === 'All' || d.specialization === spec) &&
    (d.name.toLowerCase().includes(search.toLowerCase()) ||
     d.specialization.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <main className="pt-28 pb-16 min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <Reveal className="text-center mb-10">
          <div className="badge bg-primary-50 text-primary-700 mb-3 mx-auto">Our Specialists</div>
          <h1 className="section-title">Meet Our Expert Doctors</h1>
          <p className="section-subtitle mx-auto">
            Board-certified specialists with decades of experience. Book a consultation in minutes.
          </p>
        </Reveal>

        {/* Filters */}
        <Reveal delay={0.1} className="bg-white rounded-2xl shadow-card p-5 mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="search"
              placeholder="Search by name or specialization…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-10"
              aria-label="Search doctors"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-neutral-400" />
            <select
              value={spec}
              onChange={e => setSpec(e.target.value)}
              className="input-field w-auto min-w-[180px]"
              aria-label="Filter by specialization"
            >
              {SPECIALIZATIONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </Reveal>

        {/* Results count */}
        <p className="text-sm text-neutral-500 mb-5">
          Showing <strong className="text-neutral-700">{filtered.length}</strong> doctor{filtered.length !== 1 ? 's' : ''}
        </p>

        {/* Doctors grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map(doc => (
              <motion.article
                key={doc.id}
                layout
                variants={staggerItem}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                {...hoverLift}
                className="card p-6"
              >
                {/* Header */}
                <div className="flex gap-4 mb-4">
                  <img
                    src={doc.image}
                    alt={`Dr. ${doc.name}`}
                    className="w-20 h-20 rounded-2xl object-cover bg-primary-50 flex-shrink-0"
                    loading="lazy"
                    onError={(e) => {
                      // Real photo not uploaded yet (or failed to load) — fall back to the avatar
                      if (doc.fallbackImage && e.currentTarget.src !== doc.fallbackImage) {
                        e.currentTarget.src = doc.fallbackImage
                      }
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h2 className="font-display font-bold text-neutral-800 text-lg leading-tight">{doc.name}</h2>
                    <p className="text-primary-600 font-semibold text-sm">{doc.specialization}</p>
                    <p className="text-neutral-400 text-xs mt-0.5">{doc.qualification}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold text-neutral-700">{doc.rating}</span>
                      <span className="text-xs text-neutral-400">({doc.reviews} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-sm text-neutral-500 leading-relaxed mb-4 line-clamp-2">{doc.bio}</p>

                {/* Details */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-neutral-50 rounded-xl p-3 text-center">
                    <Award size={16} className="mx-auto text-primary-500 mb-1" />
                    <div className="text-sm font-bold text-neutral-800">{doc.experience} yrs</div>
                    <div className="text-[10px] text-neutral-400">Experience</div>
                  </div>
                  <div className="bg-neutral-50 rounded-xl p-3 text-center">
                    <Clock size={16} className="mx-auto text-teal-500 mb-1" />
                    <div className="text-sm font-bold text-neutral-800">{doc.availableDays.length} days</div>
                    <div className="text-[10px] text-neutral-400">Per week</div>
                  </div>
                </div>

                {/* Available days */}
                <div className="mb-4">
                  <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Available Days</p>
                  <div className="flex flex-wrap gap-1.5">
                    {doc.availableDays.map(day => (
                      <span key={day} className="badge bg-emerald-50 text-emerald-700 text-[10px]">{day}</span>
                    ))}
                  </div>
                </div>

                {/* Time slots preview */}
                <div className="mb-5">
                  <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Time Slots</p>
                  <div className="flex flex-wrap gap-1.5">
                    {doc.timeSlots.slice(0, 4).map(slot => (
                      <span key={slot} className="badge bg-primary-50 text-primary-700 text-[10px]">{slot}</span>
                    ))}
                    {doc.timeSlots.length > 4 && (
                      <span className="badge bg-neutral-100 text-neutral-500 text-[10px]">+{doc.timeSlots.length - 4} more</span>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <div className="flex gap-2">
                  <MotionLink
                    to={`/book-appointment?doctor=${doc.id}`}
                    className="flex-1 btn-primary text-center text-sm py-2.5"
                    aria-label={`Book appointment with ${doc.name}`}
                    {...hoverButton}
                  >
                    Book — ₹{doc.fee}
                  </MotionLink>
                  <motion.button
                    onClick={() => navigate(`/book-appointment?doctor=${doc.id}`)}
                    className="px-4 py-2.5 border border-neutral-200 hover:border-teal-300 hover:bg-teal-50 rounded-xl transition-colors text-xs font-semibold text-neutral-600"
                    aria-label="View profile"
                    {...hoverButton}
                  >
                    Profile
                  </motion.button>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-neutral-700 mb-2">No doctors found</h3>
            <p className="text-neutral-400">Try adjusting your search or filter criteria.</p>
          </motion.div>
        )}
      </div>
    </main>
  )
}
