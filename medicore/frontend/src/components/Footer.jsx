import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300" role="contentinfo">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-teal-400 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl font-display">S</span>
              </div>
              
              <div>
                <span className="font-display text-xl font-bold text-white">Sefa</span>
              
                <div className="text-[10px] text-neutral-500 tracking-wider uppercase leading-none">DIAGNOSTIC CENTRE & POLYCLINIC</div>
              </div>
            </Link>
            <p className="text-sm text-neutral-400 leading-relaxed mb-5">
              Delivering compassionate care with cutting-edge diagnostic technology since 2005. Your health, our commitment.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, label: 'Facebook' },
                { icon: Instagram, label: 'Instagram' },
                { icon: Twitter, label: 'Twitter' },
                { icon: Youtube, label: 'YouTube' },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 bg-neutral-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { to: '/doctors', label: 'Find a Doctor' },
                { to: '/book-appointment', label: 'Book Appointment' },
                { to: '/tests', label: 'Diagnostic Tests' },
                { to: '/dashboard', label: 'Patient Portal' },
                { to: '/contact', label: 'Contact Us' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm hover:text-primary-400 transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Services</h3>
            <ul className="space-y-3">
              {['Cardiology', 'Neurology', 'Orthopedics', 'Gynecology', 'Pediatrics', 'Pathology', 'Radiology', 'General Medicine'].map(s => (
                <li key={s}>
                  <span className="text-sm flex items-center gap-2 cursor-default">
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full flex-shrink-0" />
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-teal-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm">12/A Medical Hub, Sector 5,<br />Kolkata – 700 001, West Bengal</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-teal-400 flex-shrink-0" />
                <a href="tel:+919876543210" className="text-sm hover:text-primary-400 transition-colors">+91 98765 43210</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-red-400 flex-shrink-0" />
                <div>
                  <div className="text-[10px] text-red-400 uppercase font-semibold">Emergency 24/7</div>
                  <a href="tel:+919999999999" className="text-sm hover:text-red-400 transition-colors">+91 98765 43210</a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-teal-400 flex-shrink-0" />
                <a href="mailto:info@Sefa Diagnostic Centre.in" className="text-sm hover:text-primary-400 transition-colors">info@Sefa Diagnostic Centre.in</a>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={16} className="text-teal-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <div>Mon–Sat: 7:00 AM – 9:00 PM</div>
                  <div>Sun: 8:00 AM – 2:00 PM</div>
                  <div className="text-teal-400 text-xs mt-1">Emergency: Open 24/7</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} Sefa Diagnostic Centre DIAGNOSTIC CENTRE & POLYCLINIC. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-neutral-500">
            <a href="#" className="hover:text-neutral-300 transition-colors">Privacy Policy</a>
            <span>·</span>
            <a href="#" className="hover:text-neutral-300 transition-colors">Terms of Service</a>
            <span>·</span>
            <a href="#" className="hover:text-neutral-300 transition-colors">Disclaimer</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
