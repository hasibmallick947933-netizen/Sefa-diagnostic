# 🏥 Sefa Diagnostic Centre — DIAGNOSTIC CENTRE & POLYCLINIC Website

A **full-stack, production-ready** healthcare platform for booking doctor appointments, scheduling diagnostic tests, and managing patient health records.

---

## 🌟 Features at a Glance

| Feature | Status |
|---|---|
| Hero section with CTA | ✅ |
| Doctor listing with filters | ✅ |
| 4-step appointment booking | ✅ |
| Diagnostic test booking with cart | ✅ |
| Home sample collection | ✅ |
| Patient dashboard (appointments + reports) | ✅ |
| Login / Signup with JWT auth | ✅ |
| Admin panel (add/edit/delete doctors) | ✅ |
| Admin bookings management | ✅ |
| Contact page with Google Maps | ✅ |
| WhatsApp booking integration | ✅ |
| Health packages section | ✅ |
| Emergency helpline banner | ✅ |
| Testimonials section | ✅ |
| Fully responsive (mobile + desktop) | ✅ |
| SEO-friendly meta tags | ✅ |
| ARIA labels for accessibility | ✅ |
| REST API with MongoDB | ✅ |
| Rate limiting & security headers | ✅ |

---

## 📁 Project Structure

```
Sefa Diagnostic Centre/
├── frontend/                  # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx     # Sticky navbar with user dropdown
│   │   │   └── Footer.jsx     # Full footer with links & contact
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Global auth state
│   │   ├── pages/
│   │   │   ├── HomePage.jsx       # Hero, stats, doctors, packages, testimonials
│   │   │   ├── DoctorsPage.jsx    # Doctor listing with search/filter
│   │   │   ├── BookAppointmentPage.jsx  # 4-step appointment flow
│   │   │   ├── DiagnosticTestsPage.jsx  # Test booking with cart
│   │   │   ├── DashboardPage.jsx  # Patient dashboard
│   │   │   ├── ContactPage.jsx    # Maps + contact form
│   │   │   ├── AuthPage.jsx       # Login / Signup
│   │   │   └── AdminPage.jsx      # Admin panel
│   │   ├── utils/
│   │   │   ├── data.js        # Dummy data (doctors, tests, testimonials)
│   │   │   └── api.js         # Axios instance with interceptors
│   │   ├── App.jsx            # Router + layout
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Tailwind + custom styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── backend/                   # Node.js + Express + MongoDB
    ├── models/
    │   ├── User.js            # Patient/Admin schema
    │   ├── Doctor.js          # Doctor schema
    │   └── Booking.js         # Appointment + DiagnosticBooking schemas
    ├── routes/
    │   ├── auth.js            # signup, login, /me, update-profile
    │   ├── doctors.js         # CRUD + availability check
    │   └── bookings.js        # Appointments + Diagnostic tests
    ├── middleware/
    │   └── auth.js            # JWT protect + role restrict
    ├── server.js              # Express app + DB connection
    ├── seed.js                # Database seeder
    ├── .env.example
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ (download: https://nodejs.org)
- **npm** v9+
- **MongoDB Atlas** free account (https://cloud.mongodb.com) — or local MongoDB

---

### 1. Clone / Download the project

```bash
git clone https://github.com/yourname/Sefa Diagnostic Centre.git
cd Sefa Diagnostic Centre
```

---

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env — add your MongoDB URI and JWT secret

# Seed the database (creates admin + 6 doctors)
node seed.js

# Start the backend server
npm run dev          # development (with nodemon)
npm start            # production
```

Backend runs at: **http://localhost:5000**

#### .env Configuration

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/Sefa Diagnostic Centre
JWT_SECRET=your_very_long_random_secret_key_here
FRONTEND_URL=http://localhost:5173
ADMIN_EMAIL=admin@Sefa Diagnostic Centre.in
ADMIN_PASSWORD=admin123
```

> **Free MongoDB**: Sign up at https://cloud.mongodb.com → Create Free Cluster (M0) → Get connection string

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Frontend runs at: **http://localhost:5173**

The Vite proxy automatically forwards `/api/*` requests to the backend.

---

### 4. Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | admin@Sefa Diagnostic Centre.in | admin123 |
| **Patient** | any email | any 4+ char password |

---

## 📡 API Reference

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | Public | Register new patient |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/auth/me` | 🔒 | Get current user |
| PATCH | `/api/auth/update-profile` | 🔒 | Update profile |

### Doctors
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/doctors` | Public | List doctors (filter: specialization, day, search) |
| GET | `/api/doctors/:id` | Public | Get doctor details |
| GET | `/api/doctors/:id/availability?date=YYYY-MM-DD` | Public | Available slots for date |
| POST | `/api/doctors` | 🔒 Admin | Add doctor |
| PATCH | `/api/doctors/:id` | 🔒 Admin | Update doctor |
| DELETE | `/api/doctors/:id` | 🔒 Admin | Deactivate doctor |

### Bookings
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/bookings/appointments` | 🔒 | Book appointment |
| GET | `/api/bookings/appointments` | 🔒 | My appointments |
| PATCH | `/api/bookings/appointments/:id/cancel` | 🔒 | Cancel appointment |
| POST | `/api/bookings/tests` | 🔒 | Book diagnostic tests |
| GET | `/api/bookings/tests` | 🔒 | My test bookings |
| PATCH | `/api/bookings/tests/:id/cancel` | 🔒 | Cancel test booking |
| PATCH | `/api/bookings/tests/:id/status` | 🔒 Admin | Update status / upload report |
| GET | `/api/bookings/stats` | 🔒 Admin | Dashboard statistics |

---

## 🗄️ Database Schema

### User
```js
{ name, email, phone, password (hashed), role, dateOfBirth,
  gender, address, bloodGroup, allergies, isActive, lastLogin }
```

### Doctor
```js
{ name, specialization, qualification, experience, image, bio,
  fee, rating, reviews, availableDays[], timeSlots[], isActive }
```

### Appointment
```js
{ bookingRef, patient (ref), doctor (ref), patientDetails{},
  date, timeSlot, status, fee, paymentStatus, prescription }
```

### DiagnosticBooking
```js
{ bookingRef, patient (ref), patientDetails{}, tests[],
  date, timeSlot, homeCollection, collectionAddress,
  homeCollectionCharge, totalAmount, status, reportUrl }
```

---

## 🚢 Deployment

### Option A: Netlify (Frontend) + Render (Backend)

#### Frontend → Netlify
1. Build: `cd frontend && npm run build`
2. Deploy the `dist/` folder to Netlify
3. Add `_redirects` file: `/* /index.html 200`
4. Set environment variable: `VITE_API_URL=https://your-backend.onrender.com`

#### Backend → Render
1. Create new **Web Service** on Render
2. Build command: `npm install`
3. Start command: `npm start`
4. Add all `.env` variables in Render's Environment tab
5. Set `FRONTEND_URL` to your Netlify URL

#### Update Vite proxy for production
In `vite.config.js`, the proxy is only for development. For production, update `api.js`:
```js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
})
```

### Option B: Railway (Full-stack)
- Connect GitHub repo to Railway
- Deploy both services with auto-detect
- Add environment variables in dashboard

### Option C: VPS / DigitalOcean
- Use `pm2` to manage the Node process
- Nginx as reverse proxy
- Let's Encrypt for SSL

---

## 🧩 Connecting Frontend to Real Backend

The frontend currently uses local dummy data for the UI demo. To connect to the real backend:

1. In `BookAppointmentPage.jsx`, replace the `handleSubmit` mock with:
```js
const res = await api.post('/bookings/appointments', {
  doctorId: selectedDoctor._id,
  date: selectedDate,
  timeSlot: selectedSlot,
  patientDetails: form,
})
```

2. In `DiagnosticTestsPage.jsx`, replace `handleBooking` with:
```js
const res = await api.post('/bookings/tests', {
  tests: cart.map(t => ({ testId: t.id, name: t.name, price: t.price, category: t.category })),
  date: selectedDate, timeSlot: selectedSlot,
  homeCollection, collectionAddress: address,
  patientDetails: form,
})
```

3. In `DashboardPage.jsx`, replace mock data with:
```js
useEffect(() => {
  api.get('/bookings/appointments').then(r => setAppointments(r.data.appointments))
  api.get('/bookings/tests').then(r => setTests(r.data.bookings))
}, [])
```

---

## 🎨 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18 + Vite |
| **Styling** | Tailwind CSS 3 |
| **Routing** | React Router v6 |
| **HTTP Client** | Axios |
| **Animations** | CSS keyframes + Tailwind |
| **Notifications** | React Hot Toast |
| **Icons** | Lucide React |
| **Backend** | Node.js + Express 4 |
| **Database** | MongoDB + Mongoose |
| **Auth** | JWT + bcryptjs |
| **Security** | Helmet, CORS, Rate limiting |
| **Fonts** | Playfair Display + DM Sans |

---

## 💡 Bonus Features Implemented

- ✅ **WhatsApp Booking** — Direct link to WhatsApp with prefilled message
- ✅ **Admin Panel** — Full CRUD for doctors, booking management
- ✅ **Home Sample Collection** — Toggle with address input + ₹100 charge
- ✅ **Health Packages** — Curated test bundles with savings
- ✅ **Emergency Banner** — Prominent 24/7 helpline display
- ✅ **Role-based Access** — Patient vs Admin routes
- ✅ **Booking References** — Unique refs (MC for appointments, DX for tests)
- ✅ **Slot Conflict Detection** — Prevents double-booking same slot

---

## 📞 Support

For questions: info@Sefa Diagnostic Centre.in | Emergency: +91 98765 43210

---

*Built with ❤️ for Sefa Diagnostic Centre DIAGNOSTIC CENTRE & POLYCLINIC*
