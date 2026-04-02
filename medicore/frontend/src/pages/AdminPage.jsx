import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { Plus, Edit2, Trash2, Save, X, Users, Calendar, FlaskConical, TrendingUp, Check } from 'lucide-react'
import { DOCTORS } from '../utils/data'
import toast from 'react-hot-toast'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const ALL_SLOTS = ['08:00 AM','08:30 AM','09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','02:00 PM','02:30 PM','03:00 PM','03:30 PM','04:00 PM','04:30 PM','05:00 PM','05:30 PM','06:00 PM']

const STATS = [
  { label: 'Total Appointments', value: '1,284', change: '+12%', icon: Calendar, color: 'primary' },
  { label: 'Active Doctors', value: '24', change: '+2', icon: Users, color: 'teal' },
  { label: 'Tests Booked', value: '3,891', change: '+8%', icon: FlaskConical, color: 'emerald' },
  { label: 'Revenue (Month)', value: '₹4.2L', change: '+18%', icon: TrendingUp, color: 'primary' },
]

export default function AdminPage() {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()

  const [doctors, setDoctors] = useState(DOCTORS)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [newDoc, setNewDoc] = useState({
    name: '', specialization: '', experience: '', qualification: '', fee: '',
    bio: '', availableDays: [], timeSlots: [], rating: 4.8, reviews: 0,
    image: 'https://api.dicebear.com/7.x/personas/svg?seed=new'
  })
  const [tab, setTab] = useState('doctors')

  if (!isAdmin) {
    return (
      <main className="pt-28 pb-16 min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-neutral-800 mb-2">Admin Access Required</h2>
          <p className="text-neutral-500 mb-6">This area is restricted to administrators only.</p>
          <div className="flex gap-3 justify-center">
            <Link to="/login" className="btn-primary text-sm">Sign In as Admin</Link>
            <Link to="/" className="btn-outline text-sm">Go Home</Link>
          </div>
        </div>
      </main>
    )
  }

  const startEdit = (doc) => {
    setEditingId(doc.id)
    setEditForm({ ...doc })
  }

  const saveEdit = () => {
    setDoctors(prev => prev.map(d => d.id === editingId ? { ...editForm } : d))
    setEditingId(null)
    toast.success('Doctor updated successfully!')
  }

  const deleteDoctor = (id) => {
    if (!window.confirm('Delete this doctor?')) return
    setDoctors(prev => prev.filter(d => d.id !== id))
    toast.success('Doctor removed')
  }

  const addDoctor = () => {
    if (!newDoc.name || !newDoc.specialization) { toast.error('Name and specialization required'); return }
    const doc = { ...newDoc, id: Date.now(), experience: Number(newDoc.experience), fee: Number(newDoc.fee) }
    setDoctors(prev => [...prev, doc])
    setShowAdd(false)
    setNewDoc({ name: '', specialization: '', experience: '', qualification: '', fee: '', bio: '', availableDays: [], timeSlots: [], rating: 4.8, reviews: 0, image: 'https://api.dicebear.com/7.x/personas/svg?seed=new' })
    toast.success('Doctor added successfully!')
  }

  const toggleDay = (form, setForm, day) => {
    const days = form.availableDays.includes(day)
      ? form.availableDays.filter(d => d !== day)
      : [...form.availableDays, day]
    setForm({ ...form, availableDays: days })
  }

  const toggleSlot = (form, setForm, slot) => {
    const slots = form.timeSlots.includes(slot)
      ? form.timeSlots.filter(s => s !== slot)
      : [...form.timeSlots, slot]
    setForm({ ...form, timeSlots: slots })
  }

  const MOCK_BOOKINGS = [
    { id: 'MC240101', patient: 'Meera Krishnaswamy', doctor: 'Dr. Anika Sharma', date: '2025-04-02', time: '10:00 AM', status: 'confirmed', type: 'appointment' },
    { id: 'DX240201', patient: 'Rohit Agarwal', doctor: '—', date: '2025-04-03', time: '08:00 AM', status: 'upcoming', type: 'test', tests: 'CBC, Thyroid' },
    { id: 'MC240102', patient: 'Vikram Joshi', doctor: 'Dr. Arjun Patel', date: '2025-04-01', time: '04:30 PM', status: 'completed', type: 'appointment' },
    { id: 'DX240202', patient: 'Sunita Rao', doctor: '—', date: '2025-03-30', time: '09:00 AM', status: 'report_ready', type: 'test', tests: 'MRI Brain' },
  ]

  return (
    <main className="pt-28 pb-16 min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display text-neutral-800">Admin Panel</h1>
            <p className="text-neutral-500 text-sm mt-1">Manage doctors, bookings, and clinic operations</p>
          </div>
          <div className="flex items-center gap-2 bg-primary-50 border border-primary-100 px-4 py-2 rounded-xl">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm text-primary-700 font-semibold">Admin: {user?.name}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map(s => (
            <div key={s.label} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${s.color}-50`}>
                  <s.icon size={20} className={`text-${s.color}-600`} />
                </div>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{s.change}</span>
              </div>
              <div className="text-2xl font-bold text-neutral-800">{s.value}</div>
              <div className="text-xs text-neutral-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { id: 'doctors', label: 'Manage Doctors', icon: Users },
            { id: 'bookings', label: 'Bookings', icon: Calendar },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === t.id ? 'bg-primary-600 text-white' : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'}`}>
              <t.icon size={15} /> {t.label}
            </button>
          ))}
        </div>

        {/* ─── DOCTORS TAB ─── */}
        {tab === 'doctors' && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-neutral-800">Doctors ({doctors.length})</h2>
              <button onClick={() => setShowAdd(!showAdd)} className="btn-primary flex items-center gap-2 text-sm">
                <Plus size={16} /> Add Doctor
              </button>
            </div>

            {/* Add Doctor Form */}
            {showAdd && (
              <div className="card p-6 mb-6 border-2 border-primary-100">
                <h3 className="font-bold text-neutral-800 mb-4 flex items-center gap-2"><Plus size={16} className="text-primary-600" /> New Doctor</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div><label className="block text-xs font-semibold text-neutral-600 mb-1">Full Name *</label>
                    <input className="input-field text-sm" value={newDoc.name} onChange={e => setNewDoc({...newDoc, name: e.target.value})} placeholder="Dr. Full Name" /></div>
                  <div><label className="block text-xs font-semibold text-neutral-600 mb-1">Specialization *</label>
                    <input className="input-field text-sm" value={newDoc.specialization} onChange={e => setNewDoc({...newDoc, specialization: e.target.value})} placeholder="Cardiologist" /></div>
                  <div><label className="block text-xs font-semibold text-neutral-600 mb-1">Qualification</label>
                    <input className="input-field text-sm" value={newDoc.qualification} onChange={e => setNewDoc({...newDoc, qualification: e.target.value})} placeholder="MBBS, MD..." /></div>
                  <div><label className="block text-xs font-semibold text-neutral-600 mb-1">Experience (years)</label>
                    <input className="input-field text-sm" type="number" value={newDoc.experience} onChange={e => setNewDoc({...newDoc, experience: e.target.value})} placeholder="10" /></div>
                  <div><label className="block text-xs font-semibold text-neutral-600 mb-1">Consultation Fee (₹)</label>
                    <input className="input-field text-sm" type="number" value={newDoc.fee} onChange={e => setNewDoc({...newDoc, fee: e.target.value})} placeholder="700" /></div>
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-neutral-600 mb-2">Available Days</label>
                  <div className="flex flex-wrap gap-2">
                    {DAYS.map(day => (
                      <button key={day} type="button" onClick={() => toggleDay(newDoc, setNewDoc, day)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${newDoc.availableDays.includes(day) ? 'bg-primary-600 text-white border-primary-600' : 'border-neutral-200 text-neutral-600 hover:border-primary-300'}`}>
                        {day.slice(0,3)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-neutral-600 mb-2">Time Slots</label>
                  <div className="flex flex-wrap gap-2">
                    {ALL_SLOTS.map(slot => (
                      <button key={slot} type="button" onClick={() => toggleSlot(newDoc, setNewDoc, slot)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${newDoc.timeSlots.includes(slot) ? 'bg-teal-500 text-white border-teal-500' : 'border-neutral-200 text-neutral-600 hover:border-teal-300'}`}>
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={addDoctor} className="btn-primary flex items-center gap-2 text-sm"><Save size={14} /> Save Doctor</button>
                  <button onClick={() => setShowAdd(false)} className="btn-outline flex items-center gap-2 text-sm"><X size={14} /> Cancel</button>
                </div>
              </div>
            )}

            {/* Doctors list */}
            <div className="space-y-4">
              {doctors.map(doc => (
                <div key={doc.id} className="card p-5">
                  {editingId === doc.id && editForm ? (
                    /* Edit mode */
                    <div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <div><label className="block text-xs font-semibold text-neutral-600 mb-1">Name</label>
                          <input className="input-field text-sm" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} /></div>
                        <div><label className="block text-xs font-semibold text-neutral-600 mb-1">Specialization</label>
                          <input className="input-field text-sm" value={editForm.specialization} onChange={e => setEditForm({...editForm, specialization: e.target.value})} /></div>
                        <div><label className="block text-xs font-semibold text-neutral-600 mb-1">Experience (yrs)</label>
                          <input className="input-field text-sm" type="number" value={editForm.experience} onChange={e => setEditForm({...editForm, experience: Number(e.target.value)})} /></div>
                        <div><label className="block text-xs font-semibold text-neutral-600 mb-1">Fee (₹)</label>
                          <input className="input-field text-sm" type="number" value={editForm.fee} onChange={e => setEditForm({...editForm, fee: Number(e.target.value)})} /></div>
                        <div><label className="block text-xs font-semibold text-neutral-600 mb-1">Qualification</label>
                          <input className="input-field text-sm" value={editForm.qualification} onChange={e => setEditForm({...editForm, qualification: e.target.value})} /></div>
                      </div>
                      <div className="mb-3">
                        <label className="block text-xs font-semibold text-neutral-600 mb-2">Available Days</label>
                        <div className="flex flex-wrap gap-2">
                          {DAYS.map(day => (
                            <button key={day} type="button" onClick={() => toggleDay(editForm, setEditForm, day)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${editForm.availableDays.includes(day) ? 'bg-primary-600 text-white border-primary-600' : 'border-neutral-200 text-neutral-600'}`}>
                              {day.slice(0,3)}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-xs font-semibold text-neutral-600 mb-2">Time Slots</label>
                        <div className="flex flex-wrap gap-1.5">
                          {ALL_SLOTS.map(slot => (
                            <button key={slot} type="button" onClick={() => toggleSlot(editForm, setEditForm, slot)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${editForm.timeSlots.includes(slot) ? 'bg-teal-500 text-white border-teal-500' : 'border-neutral-200 text-neutral-600'}`}>
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={saveEdit} className="btn-primary flex items-center gap-2 text-sm"><Save size={14} /> Save Changes</button>
                        <button onClick={() => setEditingId(null)} className="btn-outline flex items-center gap-2 text-sm"><X size={14} /> Cancel</button>
                      </div>
                    </div>
                  ) : (
                    /* View mode */
                    <div className="flex items-center gap-4 flex-wrap">
                      <img src={doc.image} alt={doc.name} className="w-14 h-14 rounded-xl bg-primary-50 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-neutral-800">{doc.name}</h3>
                          <span className="badge bg-primary-50 text-primary-700 text-[10px]">{doc.specialization}</span>
                        </div>
                        <p className="text-xs text-neutral-500">{doc.qualification} · {doc.experience} yrs · ₹{doc.fee}</p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {doc.availableDays.map(d => <span key={d} className="badge bg-emerald-50 text-emerald-700 text-[10px]">{d.slice(0,3)}</span>)}
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => startEdit(doc)} className="p-2 rounded-xl border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 transition-colors" title="Edit">
                          <Edit2 size={15} className="text-primary-500" />
                        </button>
                        <button onClick={() => deleteDoctor(doc.id)} className="p-2 rounded-xl border border-neutral-200 hover:border-red-300 hover:bg-red-50 transition-colors" title="Delete">
                          <Trash2 size={15} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── BOOKINGS TAB ─── */}
        {tab === 'bookings' && (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-100">
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Booking ID</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Patient</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Type</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  {MOCK_BOOKINGS.map(b => (
                    <tr key={b.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-5 py-4 font-mono text-xs text-neutral-500">#{b.id}</td>
                      <td className="px-5 py-4">
                        <div className="font-medium text-neutral-800">{b.patient}</div>
                        <div className="text-xs text-neutral-400">{b.doctor !== '—' ? b.doctor : b.tests}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`badge text-[10px] ${b.type === 'appointment' ? 'bg-primary-50 text-primary-700' : 'bg-teal-50 text-teal-700'}`}>
                          {b.type === 'appointment' ? '👨‍⚕️ Appointment' : '🧪 Diagnostic'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-neutral-600">
                        {new Date(b.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })} · {b.time}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`badge text-[10px] ${
                          b.status === 'confirmed' ? 'bg-blue-50 text-blue-700' :
                          b.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                          b.status === 'upcoming' ? 'bg-amber-50 text-amber-700' :
                          'bg-teal-50 text-teal-700'
                        }`}>
                          {b.status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button onClick={() => toast(`Booking ${b.id} marked complete`, { icon: '✅' })}
                          className="p-1.5 rounded-lg hover:bg-emerald-50 transition-colors" title="Mark complete">
                          <Check size={14} className="text-emerald-500" />
                        </button>
                        <button onClick={() => toast(`Booking ${b.id} cancelled`, { icon: '❌' })}
                          className="p-1.5 rounded-lg hover:bg-red-50 transition-colors ml-1" title="Cancel">
                          <X size={14} className="text-red-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
