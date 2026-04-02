import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AuthPage() {
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
  const { login } = useAuth()
  const navigate = useNavigate()

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === 'signup') {
        if (form.password !== form.confirmPassword) {
          toast.error('Passwords do not match')
          setLoading(false)
          return
        }
        if (form.password.length < 6) {
          toast.error('Password must be at least 6 characters')
          setLoading(false)
          return
        }
        // Simulate signup → real: POST /api/auth/signup
        await new Promise(r => setTimeout(r, 1000))
        const user = { name: form.name, email: form.email, phone: form.phone, role: 'patient', id: Date.now() }
        login(user, 'demo_token_' + Date.now())
        toast.success('Account created successfully! Welcome to Sefa Diagnostic Centre 🎉')
        navigate('/dashboard')
      } else {
        // Demo: admin@Sefa Diagnostic Centre.in / admin123 → admin; any other → patient
        await new Promise(r => setTimeout(r, 800))
        if (form.email === 'admin@Sefa Diagnostic Centre.in' && form.password === 'admin123') {
          login({ name: 'Admin', email: form.email, role: 'admin', id: 0 }, 'admin_token')
          toast.success('Welcome back, Admin!')
          navigate('/admin')
        } else if (form.email && form.password.length >= 4) {
          login({ name: form.email.split('@')[0], email: form.email, role: 'patient', id: Date.now() }, 'demo_token_' + Date.now())
          toast.success('Signed in successfully!')
          navigate('/dashboard')
        } else {
          toast.error('Invalid credentials. Try any email with 4+ char password.')
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-mesh flex items-center justify-center px-4 py-16 pt-28">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl font-display">M</span>
            </div>
            <div className="text-left">
              <div>
                <span className="font-display text-2xl font-bold text-primary-800">Medi</span>
                <span className="font-display text-2xl font-bold text-teal-600">Core</span>
              </div>
              <div className="text-[10px] text-neutral-400 tracking-wider uppercase">DIAGNOSTIC CENTRE & POLYCLINIC</div>
            </div>
          </Link>
          <h1 className="text-2xl font-bold font-display text-neutral-800">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            {mode === 'login' ? 'Sign in to access your health dashboard' : 'Join Sefa Diagnostic Centre for seamless healthcare'}
          </p>
        </div>

        {/* Demo hint */}
        {mode === 'login' && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 text-xs text-amber-700 flex items-start gap-2">
            <span className="mt-0.5">💡</span>
            <div>
              <strong>Demo credentials:</strong> Use any email + 4+ char password to login as patient.<br />
              Admin: <code className="bg-amber-100 px-1 rounded">admin@Sefa Diagnostic Centre.in</code> / <code className="bg-amber-100 px-1 rounded">admin123</code>
            </div>
          </div>
        )}

        {/* Form card */}
        <div className="card p-7 shadow-card-hover">
          {/* Tab toggle */}
          <div className="flex bg-neutral-100 rounded-xl p-1 mb-6">
            {['login', 'signup'].map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  mode === m ? 'bg-white text-primary-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Signup-only fields */}
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-1.5" htmlFor="auth-name">Full Name *</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      id="auth-name"
                      className="input-field pl-10"
                      placeholder="Your full name"
                      value={form.name}
                      onChange={update('name')}
                      required
                      autoComplete="name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-1.5" htmlFor="auth-phone">Phone Number *</label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      id="auth-phone"
                      className="input-field pl-10"
                      placeholder="+91 98765 43210"
                      type="tel"
                      value={form.phone}
                      onChange={update('phone')}
                      required
                      autoComplete="tel"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1.5" htmlFor="auth-email">Email Address *</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  id="auth-email"
                  className="input-field pl-10"
                  placeholder="your@email.com"
                  type="email"
                  value={form.email}
                  onChange={update('email')}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1.5" htmlFor="auth-password">Password *</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  id="auth-password"
                  className="input-field pl-10 pr-10"
                  placeholder={mode === 'signup' ? 'Min. 6 characters' : 'Your password'}
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={update('password')}
                  required
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Confirm password (signup only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1.5" htmlFor="auth-confirm">Confirm Password *</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    id="auth-confirm"
                    className="input-field pl-10"
                    placeholder="Re-enter password"
                    type={showPass ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={update('confirmPassword')}
                    required
                    autoComplete="new-password"
                  />
                  {form.confirmPassword && (
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
                      {form.confirmPassword === form.password
                        ? <CheckCircle size={15} className="text-emerald-500" />
                        : <span className="text-red-400 text-xs">✗</span>}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Forgot password (login only) */}
            {mode === 'login' && (
              <div className="text-right">
                <button type="button" className="text-xs text-primary-600 hover:underline">
                  Forgot password?
                </button>
              </div>
            )}

            {/* Terms (signup only) */}
            {mode === 'signup' && (
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" required className="mt-0.5 w-4 h-4 rounded text-primary-600" />
                <span className="text-xs text-neutral-500">
                  I agree to Sefa Diagnostic Centre's{' '}
                  <a href="#" className="text-primary-600 hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>
                </span>
              </label>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 text-base py-3.5 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* OR divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-neutral-100" />
            <span className="text-xs text-neutral-400 font-medium">or continue with</span>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>

          {/* Social login (demo) */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Google', emoji: '🔵' },
              { label: 'Phone OTP', emoji: '📱' },
            ].map(s => (
              <button
                key={s.label}
                type="button"
                onClick={() => toast('Social login coming soon', { icon: s.emoji })}
                className="flex items-center justify-center gap-2 px-4 py-2.5 border border-neutral-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-all text-sm font-medium text-neutral-600"
              >
                <span>{s.emoji}</span> {s.label}
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-sm text-neutral-400 mt-5">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-primary-600 font-semibold hover:underline"
          >
            {mode === 'login' ? 'Sign up for free' : 'Sign in'}
          </button>
        </p>
      </div>
    </main>
  )
}
