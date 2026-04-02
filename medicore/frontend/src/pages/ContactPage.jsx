import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setSent(true)
    toast.success('Message sent successfully!')
  }

  return (
    <main className="pt-28 pb-16 min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="badge bg-primary-50 text-primary-700 mb-3 mx-auto">Get In Touch</div>
          <h1 className="section-title">Contact Sefa Diagnostic Centre</h1>
          <p className="section-subtitle mx-auto">We're here to assist you. Reach out for appointments, queries, or emergencies.</p>
        </div>

        {/* Contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            { icon: MapPin, color: 'primary', title: 'Our Location', content: '12/A Medical Hub, Sector 5,\nKolkata – 700 001, WB', action: null },
            { icon: Phone, color: 'teal', title: 'Phone Numbers', content: '+91 98765 43210\nEmergency: +91 98765 43210', action: 'tel:+919876543210' },
            { icon: Mail, color: 'emerald', title: 'Email Address', content: 'info@Sefa Diagnostic Centre.in\nreports@Sefa Diagnostic Centre.in', action: 'mailto:info@Sefa Diagnostic Centre.in' },
            { icon: Clock, color: 'primary', title: 'Working Hours', content: 'Mon–Sat: 7AM – 9PM\nSun: 8AM – 2PM', action: null },
          ].map(card => (
            <div key={card.title} className="card p-5 text-center">
              <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3 bg-${card.color}-50`}>
                <card.icon size={22} className={`text-${card.color}-600`} />
              </div>
              <h3 className="font-semibold text-neutral-800 mb-1 text-sm">{card.title}</h3>
              {card.action ? (
                <a href={card.action} className="text-xs text-neutral-500 hover:text-primary-600 transition-colors whitespace-pre-line">{card.content}</a>
              ) : (
                <p className="text-xs text-neutral-500 whitespace-pre-line">{card.content}</p>
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Map */}
          <div>
            <h2 className="text-xl font-bold text-neutral-800 mb-4">Find Us on Map</h2>
            <div className="card overflow-hidden aspect-video">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3683.9834043853!2d88.3632!3d22.5726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0277c2cd2d0c73%3A0x1d0e5bd7f0d5e7c!2sKolkata%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Sefa Diagnostic Centre Location - Kolkata"
                aria-label="Google Maps showing Sefa Diagnostic Centre Diagnostic Center location"
              />
            </div>
            <div className="card p-4 mt-4 bg-red-50 border border-red-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone size={18} className="text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-red-700">Emergency Helpline — 24/7</p>
                  <a href="tel:+919999999999" className="text-xl font-bold text-red-600 hover:underline">+91 98765 43210</a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div>
            <h2 className="text-xl font-bold text-neutral-800 mb-4">Send Us a Message</h2>
            {sent ? (
              <div className="card p-8 text-center">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={36} className="text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-neutral-800 mb-2">Message Sent!</h3>
                <p className="text-neutral-500 text-sm mb-5">We'll get back to you within 24 hours. For urgent matters, please call our helpline.</p>
                <button onClick={() => setSent(false)} className="btn-outline text-sm">Send Another Message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="card p-6 space-y-4" noValidate>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-1.5" htmlFor="c-name">Full Name *</label>
                    <input id="c-name" className="input-field" placeholder="Your full name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-1.5" htmlFor="c-phone">Phone *</label>
                    <input id="c-phone" className="input-field" placeholder="+91 98765 43210" type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-1.5" htmlFor="c-email">Email Address *</label>
                  <input id="c-email" className="input-field" placeholder="your@email.com" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-1.5" htmlFor="c-subject">Subject</label>
                  <select id="c-subject" className="input-field" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}>
                    <option value="">Select a topic…</option>
                    <option>Appointment Inquiry</option>
                    <option>Test/Report Query</option>
                    <option>Billing & Payments</option>
                    <option>General Feedback</option>
                    <option>Partnership / Corporate</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-1.5" htmlFor="c-message">Message *</label>
                  <textarea
                    id="c-message"
                    className="input-field min-h-[130px] resize-y"
                    placeholder="Describe your query or concern in detail…"
                    value={form.message}
                    onChange={e => setForm({...form, message: e.target.value})}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !form.name || !form.email || !form.phone || !form.message}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending…</>
                  ) : (
                    <><Send size={16} /> Send Message</>
                  )}
                </button>
                <p className="text-xs text-neutral-400 text-center">We typically respond within 2–4 business hours.</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
