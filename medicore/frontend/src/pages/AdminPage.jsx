import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { Plus, Edit2, Trash2, Save, X, Users, Calendar, FlaskConical, TrendingUp, Check, Loader2 } from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const ALL_SLOTS = ['08:00 AM','08:30 AM','09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','02:00 PM','02:30 PM','03:00 PM','03:30 PM','04:00 PM','04:30 PM','05:00 PM','05:30 PM','06:00 PM']

const EMPTY_DOC = {
  name: '', specialization: '', experience: '', qualification: '', fee: '',
  bio: '', availableDays: [], timeSlots: [], rating: 4.8, reviews: 0,
  image: 'https://api.dicebear.com/7.x/personas/svg?seed=new'
}

export default function AdminPage() {
  const { user, isAdmin } = useAuth()

  const [doctors, setDoctors] = useState([])
  const [loadingDoctors, setLoadingDoctors] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [newDoc, setNewDoc] = useState(EMPTY_DOC)
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState('doctors')

  // ─── Bookings state ───
  const [appointments, setAppointments] = useState([])
  const [testBookings, setTestBookings] = useState([])
  const [loadingBookings, setLoadingBookings] = useState(false)
  const [stats, setStats] = useState(null)

  // ─── Fetch doctors ───
  useEffect(() => {
    fetchDoctors()
    fetchStats()
  }, [])

  useEffect(() => {
    if (tab === 'bookings') fetchBookings()
  }, [tab])

  const fetchDoctors = async () => {
    try {
      setLoadingDoctors(true)
      const { data } = await api.get('/doctors')
      setDoctors(data.doctors)
    } catch {
      toast.error('Failed to load doctors')
    } finally {
      setLoadingDoctors(false)
    }
  }

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/bookings/stats')
      setStats(data.stats)
    } catch {}
  }

  const fetchBookings = async () => {
    try {
      setLoadingBookings(true)
      const [apptRes, testRes] = await Promise.all([
        api.get('/bookings/appointments'),
        api.get('/bookings/tests'),
      ])
      setAppointments(apptRes.data.appointments)
      setTestBookings(testRes.data.bookings)
    } catch {
      toast.error('Failed to load bookings')
    } finally {
      setLoadingBookings(false)
    }
  }

  // ─── Guard ───
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

  // ─── Doctor CRUD ───
  const startEdit = (doc) => {
    setEditingId(doc._id)
    setEditForm({ ...doc })
  }

  const saveEdit = async () => {
    try {
      setSaving(true)
      const { data } = await api.patch(`/doctors/${editingId}`, editForm)
      setDoctors(prev => prev.map(d => d._id === editingId ? data.doctor : d))
      setEditingId(null)
      toast.success('Doctor updated successfully!')
    } catch {
      toast.error('Failed to update doctor')
    } finally {
      setSaving(false)
    }
  }

  const deleteDoctor = async (id) => {
    if (!window.confirm('Deactivate this doctor?')) return
    try {
      await api.delete(`/doctors/${id}`)
      setDoctors(prev => prev.filter(d => d._id !== id))
      toast.success('Doctor deactivated')
    } catch {
      toast.error('Failed to deactivate doctor')
    }
  }

  const addDoctor = async () => {
    if (!newDoc.name || !newDoc.specialization) {
      toast.error('Name and specialization required')
      return
    }
    try {
      setSaving(true)
      const payload = { ...newDoc, experience: Number(newDoc.experience), fee: Number(newDoc.fee) }
      const { data } = await api.post('/doctors', payload)
      setDoctors(prev => [...prev, data.doctor])
      setShowAdd(false)
      setNewDoc(EMPTY_DOC)
      toast.success('Doctor added successfully!')
    } catch {
      toast.error('Failed to add doctor')
    } finally {
      setSaving(false)
    }
  }

  const updateBookingStatus = async (type, id, status) => {
    try {
      const endpoint = type === 'appointment'
        ? `/bookings/appointments/${id}/status`
        : `/bookings/tests/${id}/status`
      await api.patch(endpoint, { status })
      if (type === 'appointment') {
        setAppointments(prev => prev.map(a => a._id === id ? { ...a, status } : a))
      } else {
        setTestBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b))
      }
      toast.success('Status updated!')
    } catch {
      toast.error('Failed to update status')
    }
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

  const STAT_CARDS = [
    { label: 'Total Appointments', value: stats?.totalAppointments ?? '—', icon: Calendar, color: 'primary' },
    { label: 'Active Doctors', value: doctors.length || '—', icon: Users, color: 'teal' },
    { label: 'Tests Booked', value: stats?.totalTests ?? '—', icon: FlaskConical, color: 'emerald' },
    { label: 'Confirmed Appts', value: stats?.confirmedAppts ?? '—', icon: TrendingUp, color: 'primary' },
  ]

  const allBookings = [
    ...appointments.map(a => ({ ...a, bookingType: 'appointment' })),
    ...testBookings.map(b => ({ ...b, bookingType: 'test' })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date))

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
          {STAT_CARDS.map(s => (
            <div key={s.label} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${s.color}-50`}>
                  <s.icon size={20} className={`text-${s.color}-600`} />
                </div>
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
              <t.icon size={15} />{t.label}
            </button>
          ))}
        </div>

        {/* ─── DOCTORS TAB ─── */}
        {tab === 'doctors' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-neutral-700">Doctors ({doctors.length})</h2>
              <button onClick={() => setShowAdd(!showAdd)}
                className="btn-primary flex items-center gap-2 text-sm">
                <Plus size={15} /> Add Doctor
              </button>
            </div>

            {/* Add form */}
            {showAdd && (
              <div className="card p-6 mb-4 border-2 border-primary-100">
                <h3 className="font-semibold text-neutral-800 mb-4">New Doctor</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {[
                    { label: 'Name', key: 'name' },
                    { label: 'Specialization', key: 'specialization' },
                    { label: 'Qualification', key: 'qualification' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-xs font-semibold text-neutral-600 mb-1">{f.label}</label>
                      <input className="input-field text-sm" value={newDoc[f.key]}
                        onChange={e => setNewDoc({ ...newDoc, [f.key]: e.target.value })} />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">Experience (yrs)</label>
                    <input className="input-field text-sm" type="number" value={newDoc.experience}
                      onChange={e => setNewDoc({ ...newDoc, experience: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">Fee (₹)</label>
                    <input className="input-field text-sm" type="number" value={newDoc.fee}
                      onChange={e => setNewDoc({ ...newDoc, fee: e.target.value })} />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="block text-xs font-semibold text-neutral-600 mb-2">Bio</label>
                  <textarea className="input-field text-sm" rows={2} value={newDoc.bio}
                    onChange={e => setNewDoc({ ...newDoc, bio: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="block text-xs font-semibold text-neutral-600 mb-2">Available Days</label>
                  <div className="flex flex-wrap gap-2">
                    {DAYS.map(day => (
                      <button key={day} type="button" onClick={() => toggleDay(newDoc, setNewDoc, day)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${newDoc.availableDays.includes(day) ? 'bg-primary-600 text-white border-primary-600' : 'border-neutral-200 text-neutral-600'}`}>
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-neutral-600 mb-2">Time Slots</label>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_SLOTS.map(slot => (
                      <button key={slot} type="button" onClick={() => toggleSlot(newDoc, setNewDoc, slot)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${newDoc.timeSlots.includes(slot) ? 'bg-teal-500 text-white border-teal-500' : 'border-neutral-200 text-neutral-600'}`}>
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={addDoctor} disabled={saving}
                    className="btn-primary flex items-center gap-2 text-sm">
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Add Doctor
                  </button>
                  <button onClick={() => setShowAdd(false)} className="btn-outline flex items-center gap-2 text-sm">
                    <X size={14} /> Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Doctor list */}
            {loadingDoctors ? (
              <div className="flex justify-center py-16">
                <Loader2 size={32} className="animate-spin text-primary-500" />
              </div>
            ) : (
              <div className="space-y-3">
                {doctors.map(doc => (
                  <div key={doc._id} className="card p-5">
                    {editingId === doc._id ? (
                      <div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                          {[
                            { label: 'Name', key: 'name' },
                            { label: 'Specialization', key: 'specialization' },
                            { label: 'Qualification', key: 'qualification' },
                          ].map(f => (
                            <div key={f.key}>
                              <label className="block text-xs font-semibold text-neutral-600 mb-1">{f.label}</label>
                              <input className="input-field text-sm" value={editForm[f.key]}
                                onChange={e => setEditForm({ ...editForm, [f.key]: e.target.value })} />
                            </div>
                          ))}
                          <div>
                            <label className="block text-xs font-semibold text-neutral-600 mb-1">Experience (yrs)</label>
                            <input className="input-field text-sm" type="number" value={editForm.experience}
                              onChange={e => setEditForm({ ...editForm, experience: Number(e.target.value) })} />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-neutral-600 mb-1">Fee (₹)</label>
                            <input className="input-field text-sm" type="number" value={editForm.fee}
                              onChange={e => setEditForm({ ...editForm, fee: Number(e.target.value) })} />
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="block text-xs font-semibold text-neutral-600 mb-2">Available Days</label>
                          <div className="flex flex-wrap gap-2">
                            {DAYS.map(day => (
                              <button key={day} type="button" onClick={() => toggleDay(editForm, setEditForm, day)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${editForm.availableDays.includes(day) ? 'bg-primary-600 text-white border-primary-600' : 'border-neutral-200 text-neutral-600'}`}>
                                {day.slice(0, 3)}
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
                          <button onClick={saveEdit} disabled={saving}
                            className="btn-primary flex items-center gap-2 text-sm">
                            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save Changes
                          </button>
                          <button onClick={() => setEditingId(null)} className="btn-outline flex items-center gap-2 text-sm">
                            <X size={14} /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4 flex-wrap">
                        <img src={doc.image} alt={doc.name} className="w-14 h-14 rounded-xl bg-primary-50 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-neutral-800">{doc.name}</h3>
                            <span className="badge bg-primary-50 text-primary-700 text-[10px]">{doc.specialization}</span>
                          </div>
                          <p className="text-xs text-neutral-500">{doc.qualification} · {doc.experience} yrs · ₹{doc.fee}</p>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {doc.availableDays.map(d => (
                              <span key={d} className="badge bg-emerald-50 text-emerald-700 text-[10px]">{d.slice(0, 3)}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button onClick={() => startEdit(doc)}
                            className="p-2 rounded-xl border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 transition-colors">
                            <Edit2 size={15} className="text-primary-500" />
                          </button>
                          <button onClick={() => deleteDoctor(doc._id)}
                            className="p-2 rounded-xl border border-neutral-200 hover:border-red-300 hover:bg-red-50 transition-colors">
                            <Trash2 size={15} className="text-red-500" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── BOOKINGS TAB ─── */}
        {tab === 'bookings' && (
          <div className="card overflow-hidden">
            {loadingBookings ? (
              <div className="flex justify-center py-16">
                <Loader2 size={32} className="animate-spin text-primary-500" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-100">
                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-neutral-500 uppercase">Booking ID</th>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-neutral-500 uppercase">Patient</th>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-neutral-500 uppercase">Type</th>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-neutral-500 uppercase">Date & Time</th>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-neutral-500 uppercase">Status</th>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-neutral-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50">
                    {allBookings.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-12 text-neutral-400">No bookings yet</td></tr>
                    ) : allBookings.map(b => (
                      <tr key={b._id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-5 py-4 font-mono text-xs text-neutral-500">#{b.bookingRef}</td>
                        <td className="px-5 py-4">
                          <div className="font-medium text-neutral-800">{b.patientDetails?.name}</div>
                          <div className="text-xs text-neutral-400">{b.bookingType === 'appointment' ? b.doctor?.name : b.tests?.map(t => t.name).join(', ')}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`badge text-[10px] ${b.bookingType === 'appointment' ? 'bg-primary-50 text-primary-700' : 'bg-teal-50 text-teal-700'}`}>
                            {b.bookingType === 'appointment' ? '👨‍⚕️ Appointment' : '🧪 Diagnostic'}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-xs text-neutral-600">
                          {new Date(b.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })} · {b.timeSlot}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`badge text-[10px] ${
                            b.status === 'confirmed' ? 'bg-blue-50 text-blue-700' :
                            b.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                            b.status === 'upcoming' ? 'bg-amber-50 text-amber-700' :
                            b.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                            'bg-teal-50 text-teal-700'
                          }`}>
                            {b.status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                          </span>
                        </td>
                        <td className="px-5 py-4 flex gap-1">
                          <button onClick={() => updateBookingStatus(b.bookingType, b._id, 'completed')}
                            className="p-1.5 rounded-lg hover:bg-emerald-50 transition-colors" title="Mark complete">
                            <Check size={14} className="text-emerald-500" />
                          </button>
                          <button onClick={() => updateBookingStatus(b.bookingType, b._id, 'cancelled')}
                            className="p-1.5 rounded-lg hover:bg-red-50 transition-colors" title="Cancel">
                            <X size={14} className="text-red-500" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
