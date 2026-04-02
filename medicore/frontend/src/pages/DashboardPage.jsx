import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { Calendar, FlaskConical, Download, X, RefreshCw, Clock, CheckCircle, AlertCircle, FileText } from 'lucide-react'
import toast from 'react-hot-toast'

const MOCK_APPOINTMENTS = [
  { id: 'MC240001', doctor: 'Dr. Anika Sharma', spec: 'Cardiologist', date: '2025-04-02', time: '10:00 AM', status: 'confirmed', fee: 800 },
  { id: 'MC240002', doctor: 'Dr. Arjun Patel', spec: 'Pediatrician', date: '2025-03-28', time: '04:30 PM', status: 'completed', fee: 650 },
  { id: 'MC240003', doctor: 'Dr. Priya Nair', spec: 'Gynecologist', date: '2025-03-15', time: '09:00 AM', status: 'completed', fee: 750 },
]

const MOCK_TESTS = [
  { id: 'DX240001', tests: ['CBC', 'Blood Sugar', 'Thyroid Panel'], date: '2025-03-28', time: '08:00 AM', status: 'report_ready', total: 1180, homeCollection: true },
  { id: 'DX240002', tests: ['MRI Brain'], date: '2025-04-05', time: '11:30 AM', status: 'upcoming', total: 5500, homeCollection: false },
  { id: 'DX240003', tests: ['Lipid Profile', 'LFT', 'KFT'], date: '2025-03-10', time: '07:30 AM', status: 'report_ready', total: 1200, homeCollection: false },
]

const StatusBadge = ({ status }) => {
  const map = {
    confirmed: { label: 'Confirmed', cls: 'bg-blue-50 text-blue-700' },
    completed: { label: 'Completed', cls: 'bg-emerald-50 text-emerald-700' },
    cancelled: { label: 'Cancelled', cls: 'bg-red-50 text-red-600' },
    upcoming: { label: 'Upcoming', cls: 'bg-amber-50 text-amber-700' },
    report_ready: { label: 'Report Ready', cls: 'bg-teal-50 text-teal-700' },
    processing: { label: 'Processing', cls: 'bg-purple-50 text-purple-700' },
  }
  const s = map[status] || { label: status, cls: 'bg-neutral-100 text-neutral-600' }
  return <span className={`badge text-xs ${s.cls}`}>{s.label}</span>
}

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('appointments')
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS)
  const [tests, setTests] = useState(MOCK_TESTS)

  if (!user) {
    return (
      <main className="pt-28 pb-16 min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-neutral-800 mb-2">Sign In Required</h2>
          <p className="text-neutral-500 mb-6">Please sign in to access your patient dashboard and view your bookings.</p>
          <Link to="/login" className="btn-primary inline-flex">Sign In</Link>
        </div>
      </main>
    )
  }

  const cancelAppointment = (id) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a))
    toast.success('Appointment cancelled')
  }

  const downloadReport = (id) => {
    toast.success(`Report ${id} downloading… (demo)`)
  }

  const TABS = [
    { id: 'appointments', label: 'Appointments', icon: Calendar, count: appointments.length },
    { id: 'tests', label: 'Test Reports', icon: FlaskConical, count: tests.length },
  ]

  return (
    <main className="pt-28 pb-16 min-h-screen bg-neutral-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-primary-600 to-teal-600 rounded-3xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold font-display">Welcome back, {user.name?.split(' ')[0]}! 👋</h1>
              <p className="text-primary-100 text-sm mt-1">{user.email}</p>
            </div>
            <div className="flex gap-3">
              <Link to="/book-appointment" className="bg-white text-primary-700 hover:bg-primary-50 font-semibold px-4 py-2 rounded-xl text-sm transition-colors">
                New Appointment
              </Link>
              <Link to="/tests" className="bg-white/20 hover:bg-white/30 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors border border-white/30">
                Book Tests
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { label: 'Total Visits', value: appointments.length + tests.length },
              { label: 'Reports Ready', value: tests.filter(t => t.status === 'report_ready').length },
              { label: 'Upcoming', value: [...appointments, ...tests].filter(i => i.status === 'confirmed' || i.status === 'upcoming').length },
            ].map(s => (
              <div key={s.label} className="bg-white/15 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-primary-100">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === t.id ? 'bg-primary-600 text-white shadow-md' : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              <t.icon size={15} />
              {t.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t.id ? 'bg-white/20' : 'bg-neutral-100'}`}>{t.count}</span>
            </button>
          ))}
        </div>

        {/* Appointments tab */}
        {tab === 'appointments' && (
          <div className="space-y-4">
            {appointments.map(a => (
              <div key={a.id} className="card p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Calendar size={22} className="text-primary-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-neutral-800">{a.doctor}</h3>
                        <StatusBadge status={a.status} />
                      </div>
                      <p className="text-sm text-primary-600">{a.spec}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-neutral-500">
                        <span>📅 {new Date(a.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                        <span>⏰ {a.time}</span>
                        <span className="font-mono text-neutral-400">#{a.id}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="font-bold text-primary-600">₹{a.fee}</span>
                    {a.status === 'confirmed' && (
                      <>
                        <button onClick={() => toast('Rescheduling coming soon', { icon: '🔄' })}
                          className="p-2 rounded-xl border border-neutral-200 hover:border-teal-300 hover:bg-teal-50 transition-colors" title="Reschedule">
                          <RefreshCw size={15} className="text-teal-500" />
                        </button>
                        <button onClick={() => cancelAppointment(a.id)}
                          className="p-2 rounded-xl border border-neutral-200 hover:border-red-300 hover:bg-red-50 transition-colors" title="Cancel">
                          <X size={15} className="text-red-500" />
                        </button>
                      </>
                    )}
                    {a.status === 'completed' && (
                      <button onClick={() => toast('Prescription ready (demo)', { icon: '📋' })}
                        className="flex items-center gap-1.5 text-xs font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 px-3 py-2 rounded-xl transition-colors">
                        <FileText size={13} /> Prescription
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {appointments.length === 0 && (
              <div className="text-center py-16 text-neutral-400">
                <Calendar size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">No appointments yet.</p>
                <Link to="/book-appointment" className="btn-primary inline-flex mt-4 text-sm">Book an Appointment</Link>
              </div>
            )}
          </div>
        )}

        {/* Tests tab */}
        {tab === 'tests' && (
          <div className="space-y-4">
            {tests.map(t => (
              <div key={t.id} className="card p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FlaskConical size={22} className="text-teal-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <StatusBadge status={t.status} />
                        {t.homeCollection && <span className="badge bg-emerald-50 text-emerald-700 text-[10px]">🏠 Home Collection</span>}
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-1">
                        {t.tests.map(name => (
                          <span key={name} className="badge bg-neutral-100 text-neutral-600 text-[10px]">{name}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-neutral-500">
                        <span>📅 {new Date(t.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                        <span>⏰ {t.time}</span>
                        <span className="font-mono text-neutral-400">#{t.id}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="font-bold text-teal-600">₹{t.total.toLocaleString()}</span>
                    {t.status === 'report_ready' && (
                      <button
                        onClick={() => downloadReport(t.id)}
                        className="flex items-center gap-1.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-xl transition-colors"
                      >
                        <Download size={15} /> Download Report
                      </button>
                    )}
                    {t.status === 'upcoming' && (
                      <button onClick={() => toast('Test cancelled (demo)', { icon: '❌' })}
                        className="p-2 rounded-xl border border-neutral-200 hover:border-red-300 hover:bg-red-50 transition-colors">
                        <X size={15} className="text-red-500" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
