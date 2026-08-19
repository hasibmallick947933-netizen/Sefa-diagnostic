import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Star, ChevronRight, Shield, Clock, Award, Users, FlaskConical, Home, Phone, CheckCircle } from 'lucide-react'
import { DOCTORS, SERVICES, TESTIMONIALS, HEALTH_PACKAGES } from '../utils/data'
import Reveal from '../components/Reveal'
import { staggerContainer, staggerItem, hoverLift, hoverButton } from '../lib/motionVariants'

const MotionLink = motion(Link)

const STATS = [
  { icon: Users, value: '50,000+', label: 'Happy Patients', color: 'text-primary-600' },
  { icon: Award, value: '25+', label: 'Specialist Doctors', color: 'text-teal-600' },
  { icon: FlaskConical, value: '500+', label: 'Diagnostic Tests', color: 'text-emerald-600' },
  { icon: Clock, value: '18+', label: 'Years of Excellence', color: 'text-primary-600' },
]

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      {/* Emergency Banner */}
      <div className="bg-red-600 text-white text-center py-2.5 px-4 text-sm font-medium flex items-center justify-center gap-3 mt-[72px] md:mt-[92px]">
        <span className="animate-pulse w-2 h-2 bg-white rounded-full"></span>
        🚨 Emergency Helpline Active 24/7 —
        <a href="tel:+919999999999" className="underline font-bold hover:no-underline">+91 98765 43210</a>
        <span className="hidden sm:inline">| Ambulance: Dial 102</span>
      </div>

      {/* ═══ HERO ═══ */}
      <section className="relative bg-mesh min-h-[calc(100vh-120px)] flex items-center overflow-hidden py-16">
        {/* Background circles */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary-100 rounded-full opacity-40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-teal-100 rounded-full opacity-40 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* ✨ Animated Clinic Name */}
            <motion.div
              className="mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h2 className="text-5xl sm:text-6xl lg:text-6xl font-bold font-display tracking-tight"
                style={{
                  background: 'linear-gradient(90deg, #0ea5e9, #14b8a6, #0ea5e9)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'shimmer 3s linear infinite'
                }}>
                Sefa Diagnostic Centre
              </h2>
              <p className="text-sm font-semibold tracking-[0.3em] text-teal-600 uppercase mt-1 animate-pulse">
                & Polyclinic
              </p>
            </motion.div>

            <motion.div
              className="inline-flex items-center gap-2 bg-primary-50 border border-primary-100 text-primary-700 text-xs font-semibold px-4 py-2 rounded-full mb-6"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              NABL Accredited Diagnostic Center
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-neutral-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              Your Health,{' '}
              <span className="text-gradient block">Our Priority</span>
            </motion.h1>

            <motion.p
              className="text-lg text-neutral-500 mb-8 max-w-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              Expert specialists, advanced diagnostics, and compassionate care — all under one roof. Book consultations, schedule tests, and receive reports swiftly.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-3 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              <MotionLink to="/book-appointment" className="btn-primary flex items-center gap-2 text-base" {...hoverButton}>
                Book Appointment <ArrowRight size={18} />
              </MotionLink>
              <MotionLink to="/tests" className="btn-outline flex items-center gap-2 text-base" {...hoverButton}>
                Book a Test
              </MotionLink>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              className="flex flex-wrap gap-4"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              transition={{ delayChildren: 0.55 }}
            >
              {[
                { icon: Shield, text: 'NABL & ISO Certified' },
                { icon: Clock, text: 'Reports in 4–6 Hours' },
                { icon: Home, text: 'Home Collection Available' },
              ].map(({ icon: Icon, text }) => (
                <motion.div key={text} variants={staggerItem} className="flex items-center gap-2 text-sm text-neutral-600">
                  <Icon size={15} className="text-teal-500" />
                  {text}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — floating card */}
          <motion.div
            className="relative flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative">
              {/* Main card */}
              <motion.div
                className="card p-6 w-full max-w-sm shadow-2xl"
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <FlaskConical size={24} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-800">Quick Book</p>
                    <p className="text-xs text-neutral-400">Available for today</p>
                  </div>
                </div>

                <motion.div
                  className="space-y-3 mb-5"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="show"
                  transition={{ delayChildren: 0.6 }}
                >
                  {[
                    { icon: '🩸', name: 'Blood Test (CBC)', time: 'Today, 9:00 AM', price: '₹350' },
                    { icon: '🧠', name: 'MRI Brain', time: 'Today, 11:30 AM', price: '₹5500' },
                    { icon: '❤️', name: 'ECG (Cardiology)', time: 'Today, 2:00 PM', price: '₹250' },
                  ].map(item => (
                    <motion.div key={item.name} variants={staggerItem} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                      <span className="text-xl">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-neutral-700 truncate">{item.name}</p>
                        <p className="text-[10px] text-neutral-400">{item.time}</p>
                      </div>
                      <span className="text-xs font-bold text-primary-600">{item.price}</span>
                    </motion.div>
                  ))}
                </motion.div>

                <Link to="/tests" className="btn-primary w-full text-center block text-sm">
                  Book Now →
                </Link>
              </motion.div>

              {/* Floating badges */}
              <div className="absolute -top-4 -left-6 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-float">
                ✅ 50,000+ Reports Delivered
              </div>
              <motion.div
                className="absolute -bottom-4 -right-4 glass rounded-xl px-4 py-2 shadow-lg"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.9, type: 'spring', stiffness: 200 }}
              >
                <div className="flex items-center gap-1.5">
                  <div className="flex -space-x-1">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full bg-primary-100 border-2 border-white" />
                    ))}
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-neutral-800">4.9</span>
                    <span className="text-neutral-400"> rating</span>
                  </div>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => <Star key={i} size={10} className="text-amber-400 fill-amber-400" />)}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="bg-gradient-to-r from-primary-700 to-teal-600 py-12">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {STATS.map(({ icon: Icon, value, label }) => (
            <motion.div key={label} variants={staggerItem} className="text-center text-white">
              <Icon size={28} className="mx-auto mb-2 opacity-80" />
              <div className="text-3xl font-bold font-display">{value}</div>
              <div className="text-sm text-primary-100 mt-1">{label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══ SERVICES ═══ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Reveal className="text-center mb-12">
            <div className="badge bg-primary-50 text-primary-700 mb-4">Our Specialties</div>
            <h2 className="section-title">Comprehensive Medical Services</h2>
            <p className="section-subtitle mx-auto">
              From primary consultations to advanced diagnostics — everything you need for complete healthcare.
            </p>
          </Reveal>
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {SERVICES.map(service => (
              <motion.div
                key={service.title}
                variants={staggerItem}
                {...hoverLift}
                className="card p-5 text-center cursor-default"
              >
                <div className="text-3xl mb-3">{service.icon}</div>
                <h3 className="font-semibold text-neutral-800 text-sm mb-1">{service.title}</h3>
                <p className="text-xs text-neutral-400">{service.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ DOCTORS ═══ */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Reveal className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4" as="div">
            <div>
              <div className="badge bg-teal-50 text-teal-700 mb-3">Meet Our Experts</div>
              <h2 className="section-title">Renowned Specialist Doctors</h2>
            </div>
            <Link to="/doctors" className="flex items-center gap-2 text-primary-600 font-semibold hover:gap-3 transition-all">
              View All Doctors <ChevronRight size={18} />
            </Link>
          </Reveal>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
          >
            {DOCTORS.slice(0, 3).map(doc => (
              <motion.div key={doc.id} variants={staggerItem} {...hoverLift} className="card p-5">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-16 h-16 rounded-2xl object-cover bg-primary-50"
                    loading="lazy"
                    onError={(e) => {
                      if (doc.fallbackImage && e.currentTarget.src !== doc.fallbackImage) {
                        e.currentTarget.src = doc.fallbackImage
                      }
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-neutral-800 truncate">{doc.name}</h3>
                    <p className="text-xs text-primary-600 font-medium">{doc.specialization}</p>
                    <p className="text-xs text-neutral-400">{doc.qualification}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-neutral-500 mb-4">
                  <span>⏳ {doc.experience} yrs exp</span>
                  <div className="flex items-center gap-1">
                    <Star size={11} className="text-amber-400 fill-amber-400" />
                    <span className="font-semibold">{doc.rating}</span>
                    <span>({doc.reviews})</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {doc.availableDays.slice(0, 3).map(day => (
                    <span key={day} className="badge bg-emerald-50 text-emerald-700 text-[10px]">{day.slice(0,3)}</span>
                  ))}
                </div>
                <Link
                  to={`/book-appointment?doctor=${doc.id}`}
                  className="w-full btn-primary text-center block text-sm py-2.5"
                >
                  Book Consultation — ₹{doc.fee}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ HEALTH PACKAGES ═══ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Reveal className="text-center mb-12">
            <div className="badge bg-emerald-50 text-emerald-700 mb-4">Health Packages</div>
            <h2 className="section-title">Preventive Health Checkups</h2>
            <p className="section-subtitle mx-auto">Curated packages for complete wellness monitoring at unbeatable prices.</p>
          </Reveal>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
          >
            {HEALTH_PACKAGES.map(pkg => (
              <motion.div
                key={pkg.id}
                variants={staggerItem}
                {...hoverLift}
                className={`card p-6 relative ${pkg.popular ? 'ring-2 ring-primary-500' : ''}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary-600 text-white text-xs font-bold px-4 py-1 rounded-full">MOST POPULAR</span>
                  </div>
                )}
                <h3 className="font-display text-xl font-bold text-neutral-800 mb-2">{pkg.name}</h3>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold text-primary-600">₹{pkg.price.toLocaleString()}</span>
                  <span className="text-neutral-400 line-through text-sm">₹{pkg.originalPrice.toLocaleString()}</span>
                </div>
                <div className="text-xs text-emerald-600 font-semibold mb-4">
                  Save ₹{(pkg.originalPrice - pkg.price).toLocaleString()} ({Math.round((1 - pkg.price/pkg.originalPrice)*100)}% off)
                </div>
                <div className="text-sm text-neutral-500 mb-4">{pkg.tests} Parameters Covered</div>
                <ul className="space-y-2 mb-6">
                  {pkg.includes.map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm text-neutral-600">
                      <CheckCircle size={14} className="text-teal-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to="/tests" className={`block text-center text-sm py-2.5 rounded-xl font-semibold transition-all ${pkg.popular ? 'btn-primary' : 'btn-outline'}`}>
                  Book This Package
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="py-20 bg-gradient-to-br from-primary-50 via-white to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Reveal className="text-center mb-12">
            <div className="badge bg-amber-50 text-amber-700 mb-4">Patient Stories</div>
            <h2 className="section-title">What Our Patients Say</h2>
            <p className="section-subtitle mx-auto">Real experiences from real patients who trusted Sefa Diagnostic Centre.</p>
          </Reveal>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
          >
            {TESTIMONIALS.map(t => (
              <motion.div key={t.id} variants={staggerItem} {...hoverLift} className="card p-5">
                <div className="flex gap-0.5 mb-3">
                  {Array(t.rating).fill(0).map((_, i) => (
                    <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed mb-4 italic">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-3 border-t border-neutral-100">
                  <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full bg-neutral-100" />
                  <div>
                    <p className="text-sm font-semibold text-neutral-800">{t.name}</p>
                    <p className="text-xs text-neutral-400">{t.date}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ CTA BANNER ═══ */}
      <section className="py-16 bg-gradient-to-r from-primary-700 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'white\' fill-opacity=\'0.4\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/svg%3E")'}} />
        <Reveal className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white font-display mb-4">
            Start Your Health Journey Today
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
            Book a consultation or diagnostic test in under 2 minutes. Same-day appointments available.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <MotionLink to="/book-appointment" className="bg-white text-primary-700 hover:bg-primary-50 font-bold px-8 py-3.5 rounded-xl transition-colors shadow-lg" {...hoverButton}>
              Book Appointment
            </MotionLink>
            <motion.a
              href="https://wa.me/919876543210?text=Hi, I'd like to book a test at Sefa Diagnostic Centre"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-3.5 rounded-xl transition-colors shadow-lg flex items-center gap-2"
              {...hoverButton}
            >
              <Phone size={18} /> WhatsApp Booking
            </motion.a>
          </div>
        </Reveal>
      </section>
    </main>
  )
}
