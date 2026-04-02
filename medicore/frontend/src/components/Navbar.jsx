import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Menu, X, Phone, ChevronDown, User, LogOut,
  Calendar, FlaskConical, LayoutDashboard, Settings
} from 'lucide-react'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/doctors', label: 'Doctors' },
  { to: '/tests', label: 'Diagnostics' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdown, setDropdown] = useState(false)
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    logout()
    setDropdown(false)
    navigate('/')
  }

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-lg py-2' : 'bg-white/95 py-3'
      }`}
      role="banner"
    >
      {/* Top bar */}
      <div className="bg-primary-700 text-white text-xs py-1.5 px-4 hidden md:flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span>📍 Ranihati-Amta Road, RANIHATI M. PLAZA MARKET (NEAR OF STATE BANK OF INDIA), Ranihati, West Bengal 711331 – 700 001</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="tel:+918420580021" className="flex items-center gap-1 hover:text-primary-200 transition-colors">
            <Phone size={12} /> +91 8420580021
          </a>
          <span>|</span>
          <span>⏰ Mon–Sat: 7:00 AM – 9:00 PM</span>
        </div>
      </div>

      {/* Main nav */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5" aria-label="Sefa Diagnostic Centre Home">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg font-display">S</span>
          </div>
          <div>
            <span className="font-display text-xl font-bold text-primary-800">Sefa</span>
          
            <div className="text-[10px] text-neutral-500 font-body leading-none tracking-wider uppercase">DIAGNOSTIC CENTRE & POLYCLINIC</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Main navigation">
          {NAV_LINKS.map(link => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <Link to="/book-appointment" className="btn-primary text-sm py-2.5">
            Book Appointment
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdown(!dropdown)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 transition-all"
                aria-expanded={dropdown}
                aria-haspopup="true"
              >
                <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center">
                  <User size={14} className="text-primary-600" />
                </div>
                <span className="text-sm font-medium text-neutral-700">{user.name?.split(' ')[0]}</span>
                <ChevronDown size={14} className={`text-neutral-400 transition-transform ${dropdown ? 'rotate-180' : ''}`} />
              </button>

              {dropdown && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-neutral-100 py-2 z-50 animate-fade-in">
                  <div className="px-4 py-2 border-b border-neutral-100 mb-1">
                    <p className="text-xs text-neutral-400">Signed in as</p>
                    <p className="text-sm font-semibold text-neutral-700 truncate">{user.name}</p>
                  </div>
                  <Link to="/dashboard" onClick={() => setDropdown(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-600 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                    <LayoutDashboard size={15} /> Dashboard
                  </Link>
                  <Link to="/my-bookings" onClick={() => setDropdown(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-600 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                    <Calendar size={15} /> My Bookings
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setDropdown(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-600 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                      <Settings size={15} /> Admin Panel
                    </Link>
                  )}
                  <hr className="my-1 border-neutral-100" />
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-outline text-sm py-2.5">
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white border-t border-neutral-100 shadow-xl animate-slide-up">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {NAV_LINKS.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive ? 'bg-primary-50 text-primary-600' : 'text-neutral-600 hover:bg-neutral-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="pt-3 space-y-2 border-t border-neutral-100">
              <Link to="/book-appointment" onClick={() => setOpen(false)} className="btn-primary block text-center text-sm">
                Book Appointment
              </Link>
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setOpen(false)} className="btn-outline block text-center text-sm">
                    Dashboard
                  </Link>
                  <button onClick={() => { handleLogout(); setOpen(false) }} className="w-full text-sm text-red-500 font-semibold py-2 hover:underline">
                    Sign Out
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setOpen(false)} className="btn-outline block text-center text-sm">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
