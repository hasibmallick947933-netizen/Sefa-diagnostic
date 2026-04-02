import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import DoctorsPage from './pages/DoctorsPage'
import BookAppointmentPage from './pages/BookAppointmentPage'
import DiagnosticTestsPage from './pages/DiagnosticTestsPage'
import DashboardPage from './pages/DashboardPage'
import ContactPage from './pages/ContactPage'
import AuthPage from './pages/AuthPage'
import AdminPage from './pages/AdminPage'

function AppShell() {
  const location = useLocation()
  const hideFooter = ['/login', '/signup'].includes(location.pathname)

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 page-enter">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/book-appointment" element={<BookAppointmentPage />} />
          <Route path="/tests" element={<DiagnosticTestsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/my-bookings" element={<DashboardPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center min-h-[60vh] pt-28">
              <div className="text-6xl mb-4">🏥</div>
              <h1 className="text-3xl font-bold text-neutral-800 mb-2">Page Not Found</h1>
              <p className="text-neutral-500 mb-6">The page you are looking for doesn't exist.</p>
              <a href="/" className="btn-primary">Back to Home</a>
            </div>
          } />
        </Routes>
      </div>
      {!hideFooter && <Footer />}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '13px',
              borderRadius: '12px',
              padding: '12px 16px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
            },
            success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  )
}
