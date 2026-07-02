# 🩺 Book a Doctor

An innovative healthcare booking platform that streamlines the process of connecting patients with healthcare providers. Built with the MERN stack (MongoDB, Express.js, React.js, Node.js), the app enables users to browse doctors, schedule appointments, upload documents securely, and receive notifications — all in a user-friendly interface for patients, doctors, and admins.

**Demo:** _add your live demo link here_
**GitHub Repo:** _add your GitHub repo link here_

---

## ✨ Features

- **Doctor Browsing** — search and filter doctors by name or specialization
- **Appointment Scheduling** — patients book time slots; doctors confirm, decline, or complete appointments
- **Secure Document Uploads** — patients attach reports/prescriptions to their appointments
- **Notifications** — in-app alerts for appointment requests, confirmations, and status changes
- **Role-based Access** — separate experiences for Patients, Doctors, and Admins
- **Admin Controls** — approve/revoke doctors, view all appointments

## 🧰 Tech Stack

- **Frontend:** React.js, React Router, Axios, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT + bcrypt password hashing
- **File Uploads:** Multer

## 📁 Project Structure

```
book-a-doctor/
├── backend/
│   ├── config/          # DB connection, JWT helper, seed script
│   ├── controllers/     # Route handler logic
│   ├── middleware/      # Auth, role guard, error handling, file upload
│   ├── models/          # Mongoose schemas (User, Doctor, Appointment, Notification)
│   ├── routes/          # Express routers
│   ├── uploads/         # Uploaded documents (gitignored)
│   └── server.js        # App entry point
└── frontend/
    └── src/
        ├── api/          # Axios instance with auth interceptor
        ├── components/   # Navbar, DoctorCard, ProtectedRoute
        ├── context/       # AuthContext (login/register/logout)
        ├── pages/         # Route-level pages
        └── styles/        # Global CSS
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local instance or a free MongoDB Atlas cluster)

### 1. Backend Setup

```bash
cd backend
cp .env.example .env    # then edit MONGO_URI / JWT_SECRET as needed
npm install
npm run seed             # optional: populate demo doctors/patient/admin
npm run dev               # starts on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm start                 # starts on http://localhost:3000
```

### 3. Demo Accounts (after running `npm run seed`)

| Role    | Email                         | Password   |
|---------|--------------------------------|------------|
| Admin   | admin@bookadoctor.com          | admin123   |
| Patient | patient@bookadoctor.com        | patient123 |
| Doctor  | aisha.khan@bookadoctor.com     | doctor123  |

## 🔌 API Overview

| Method | Endpoint                          | Access        | Description                       |
|--------|------------------------------------|---------------|------------------------------------|
| POST   | /api/auth/register                 | Public        | Register as patient or doctor      |
| POST   | /api/auth/login                    | Public        | Login and receive JWT              |
| GET    | /api/doctors                       | Public        | Browse approved doctors            |
| GET    | /api/doctors/:id                   | Public        | View doctor profile                |
| PUT    | /api/doctors/me                    | Doctor        | Update own profile & availability  |
| POST   | /api/appointments                  | Patient       | Book an appointment                |
| GET    | /api/appointments/my               | Patient       | View own appointments              |
| GET    | /api/appointments/doctor           | Doctor        | View appointments for the doctor   |
| PUT    | /api/appointments/:id/status       | Doctor        | Confirm/decline/complete           |
| POST   | /api/appointments/:id/documents    | Patient       | Upload a document to an appointment|
| GET    | /api/notifications                 | Any logged in | View notifications                 |
| GET    | /api/doctors/admin/all             | Admin         | List all doctors                   |
| PUT    | /api/doctors/admin/:id/approve     | Admin         | Approve/revoke a doctor            |

## 📦 Deployment Notes

- **Backend:** deploy to Render, Railway, or Heroku. Set `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL` env vars.
- **Frontend:** deploy to Vercel or Netlify. Set `REACT_APP_API_URL` to your deployed backend URL.
- **Database:** use MongoDB Atlas for a free hosted cluster.

## 📄 License

MIT
