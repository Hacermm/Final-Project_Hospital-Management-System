# 🏥 NovaCare Hospital — Hospital Management System

A full-featured hospital management system built with Laravel 12 API and React. Online appointment booking, real-time messaging, voice calls, digital medical records, and an AI assistant.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Database](#-database)
- [Installation](#-installation)
- [Running the Project](#-running-the-project)
- [Demo Accounts](#-demo-accounts)
- [Security](#-security)
- [API Endpoints](#-api-endpoints)
- [Project Structure](#-project-structure)
- [Technical Highlights](#-technical-highlights)

---

## 🎯 Overview

NovaCare Hospital digitalizes the entire interaction between patients and doctors. The system supports four roles — **Patient**, **Doctor**, **Admin**, and **Super Admin** — each operating within its own permission scope.

**Problems it solves:**

| Traditional approach | NovaCare |
|---|---|
| Phone calls and queues for appointments | Online booking, available slots shown instantly |
| Paper prescriptions get lost | Digital archive with PDF download |
| Returning to the clinic for lab results | Results available in the personal dashboard |
| Waiting to ask a question | Live chat, voice call, AI assistant |

---

## ✨ Features

### 👤 Authentication & Roles
- Registration with **email verification** (signed URL)
- Password reset via **6-digit code sent by email** (valid for 10 minutes)
- Token-based authentication (Laravel Sanctum)
- Role-based access control (Spatie Permission)
- Console command for creating the initial super admin

### 📅 Appointment System
- Doctor schedule management (per weekday)
- **Automatic available-slot calculation** — the schedule is split into 30-minute slots, with booked and past slots filtered out
- Double-booking prevention (re-validated at the moment of booking)
- Status flow: `pending → confirmed → completed` / `cancelled`
- Cancelled slots become available again

### 📋 Medical Records
- Doctors write diagnoses and prescriptions (one record per appointment)
- Creating a record automatically marks the appointment as completed
- **PDF prescription generation** (DomPDF, with full Azerbaijani character support)
- PDFs are not stored in the database — generated on the fly on every request
- Lab results with file upload (private disk)

### 💬 Real-Time Communication
- **Live messaging** over WebSocket (Laravel Reverb) — no page refresh
- Unread message badges
- **Voice calls** via WebRTC peer-to-peer (audio flows directly between browsers)
- Call history (incoming/outgoing, duration, status)

### 🤖 AI Assistant
- Powered by the **Grok (xAI) API**
- **Two-tier access:** anonymous visitors get general information, while authenticated patients can ask about their own appointments and medical records
- Real database context is injected into the prompt (RAG approach) — the assistant does not hallucinate
- Constrained by a system prompt: never diagnoses, never goes off-topic

### 📊 Management
- Admin panel — CRUD for doctors, patients, and departments
- **Analytics dashboard** — monthly appointments, status distribution, per-department statistics (Recharts)
- Super admin panel — administrator account management
- Contact form message inbox

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Laravel 12 | REST API |
| Laravel Sanctum | Token authentication |
| Spatie Permission | Roles and permissions |
| Laravel Reverb | WebSocket server |
| DomPDF | PDF generation |
| MySQL / MariaDB | Database |

### Frontend
| Technology | Purpose |
|---|---|
| React + Vite | User interface |
| React Router | Routing |
| Axios | HTTP client |
| Tailwind CSS v4 | Styling |
| Laravel Echo + Pusher.js | Real-time client |
| WebRTC | Voice calls |
| Recharts | Analytics charts |

### External Services
- **Grok (xAI) API** — AI assistant
- **Gmail SMTP** — transactional email

---

## 🏗 Architecture

The project follows a **layered architecture**:

```
HTTP Request
     ↓
[ FormRequest ]  ← validation
     ↓
[ Controller ]   ← receives request, returns response
     ↓
[ Service ]      ← business logic (slot calculation, transactions)
     ↓
[ Repository ]   ← database operations
     ↓
[ Model ]        ← Eloquent ORM
     ↓
[ Resource ]     ← response formatting
```

**Benefits:**
- Controllers stay thin — request/response only
- Business logic is centralized and reusable
- Database queries are isolated
- Response format is standardized

**Example:** when booking an appointment, `AppointmentController` receives the request → `AppointmentService.create()` verifies slot availability and blocks double booking → `AppointmentRepository` persists it → `AppointmentResource` formats the response.

---

## 🗄 Database

**16 tables**, core relationships:

```
users ──1:1── doctors ──N:1── departments
  │              │
  │              ├──1:N── doctor_schedules
  │              │
  └──1:1── patients
                 │
        appointments (patient_id, doctor_id)
                 │
                 └──1:1── medical_records ──1:N── prescriptions

conversations (user_one_id, user_two_id) ──1:N── messages
call_logs (caller_id, receiver_id)
lab_tests (patient_id, doctor_id)
ai_messages (user_id)
contact_messages
```

**Design decisions:**
- The `users` table handles authentication only; profile data lives in `doctors`/`patients` (normalization)
- Roles are stored in Spatie tables (`roles`, `model_has_roles`)
- All relationships are enforced with foreign keys and `cascadeOnDelete`
- Conversations between two users are unique — no duplicate threads

---

## ⚙️ Installation

### Requirements
- PHP 8.2+
- Composer
- Node.js 18+
- MySQL / MariaDB (XAMPP)

### 1. Clone the repository
```bash
git clone https://github.com/Hacermm/Final-Project---Hospital-Management-System.git
cd Final-Project---Hospital-Management-System
```

### 2. Backend setup
```bash
cd hms-api
composer install
cp .env.example .env
php artisan key:generate
```

Configure `.env`:
```env
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

DB_CONNECTION=mysql
DB_DATABASE=hms
DB_USERNAME=root
DB_PASSWORD=

# Mail (Gmail App Password)
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="your-email@gmail.com"
MAIL_FROM_NAME="NovaCare Hospital"

# WebSocket (Reverb)
BROADCAST_CONNECTION=reverb
REVERB_APP_ID=800555
REVERB_APP_KEY=your-reverb-key
REVERB_APP_SECRET=your-reverb-secret
REVERB_HOST="localhost"
REVERB_PORT=8080
REVERB_SCHEME=http

# AI Assistant (Grok / xAI)
GROK_API_KEY=your-grok-api-key
GROK_MODEL=grok-beta
```

Set up the database:
```bash
php artisan migrate
php artisan db:seed --class=RoleSeeder
php artisan db:seed --class=DemoDataSeeder
php artisan storage:link
```

### 3. Frontend setup
```bash
cd ../hms-frontend
npm install
```

Create `.env`:
```env
VITE_REVERB_APP_KEY=your-reverb-key
VITE_REVERB_HOST=localhost
VITE_REVERB_PORT=8080
VITE_REVERB_SCHEME=http
```

---

## ▶️ Running the Project

Three terminals are required:

```bash
# Terminal 1 — API server
cd hms-api
php artisan serve
# → http://localhost:8000

# Terminal 2 — Frontend
cd hms-frontend
npm run dev
# → http://localhost:5173

# Terminal 3 — WebSocket server
cd hms-api
php artisan reverb:start
# → 0.0.0.0:8080
```

⚠️ The frontend **must** run on port **5173** — the CORS configuration is bound to it.

---

## 🔑 Demo Accounts

Password for all accounts: `password`

| Role | Email | Name |
|---|---|---|
| Super Admin | `superadmin@hms.test` | 
| Admin | `admin@hms.test` | 
| Doctor | `doctor@hms.test` | 
| Patient | `patient@hms.test` | 

Additional doctors: `leyla.h@`, `elcin.q@`, `nigar.a@`, `resad.k@`, `gunel.b@` — all `@hms.test`

**Reset the super admin:**
```bash
php artisan hms:reset-superadmin
```

---

## 🔐 Security

### Authentication
- Passwords hashed with **bcrypt**
- Sanctum token authentication
- Login blocked until the email is verified
- Password reset codes expire after 10 minutes and are rate-limited

### Authorization — two layers of defense
1. **Backend:** every route is guarded by Spatie middleware (`role:admin|super_admin`)
2. **Frontend:** `ProtectedRoute` verifies the role **against the server** (`/me`) instead of trusting localStorage

Manually editing the role in localStorage has no effect — the component fetches `/me` and validates the real role.

### Medical Confidentiality
| Resource | Visible to |
|---|---|
| Doctor and department lists | Everyone (public) |
| Patient list | Admin, doctors |
| Medical records | Only the related patient and doctor |
| Lab result files | Only the related patient and doctor |

- Lab files are stored on a **private disk** — not reachable by direct URL
- Filenames are randomized
- Downloads happen only after an authorization check

### Role Hierarchy
```
Server access (console)  →  creates Super Admin
Super Admin              →  creates Admins
Admin                    →  creates Doctors and Patients
Public registration      →  Patients only
```

No role can create an account above its own level.

### Additional Measures
- Rate limiting (login, password reset, AI requests, contact form)
- Validation on both the frontend and the backend
- File type and size restrictions on uploads
- Private WebSocket channels — only participants may subscribe

---

## 📡 API Endpoints

### Public
```
POST   /api/register
POST   /api/login
POST   /api/forgot-password
POST   /api/reset-password
GET    /api/email/verify/{id}/{hash}

GET    /api/departments
GET    /api/doctors
GET    /api/doctors/{doctor}/schedules
GET    /api/doctors/{doctor}/slots?date=YYYY-MM-DD

POST   /api/ai/public-ask
POST   /api/contact
```

### Authenticated
```
GET    /api/me
POST   /api/logout

GET    /api/appointments
POST   /api/appointments
PUT    /api/appointments/{appointment}

GET    /api/medical-records
POST   /api/medical-records
GET    /api/medical-records/{id}/pdf

GET    /api/lab-tests
POST   /api/lab-tests
GET    /api/lab-tests/{id}/download

GET    /api/conversations
POST   /api/conversations
GET    /api/conversations/{id}/messages
POST   /api/conversations/{id}/messages
GET    /api/unread-count

POST   /api/call/signal
GET    /api/call/logs

POST   /api/ai/ask
GET    /api/ai/messages
```

### Admin
```
POST   /api/doctors
PUT    /api/doctors/{doctor}
DELETE /api/doctors/{doctor}

POST   /api/patients
PUT    /api/patients/{patient}
DELETE /api/patients/{patient}

POST   /api/departments
PUT    /api/departments/{department}
DELETE /api/departments/{department}

GET    /api/analytics
GET    /api/contact-messages
```

### Super Admin
```
GET    /api/admins
POST   /api/admins
PUT    /api/admins/{user}
DELETE /api/admins/{user}
```

---

## 📁 Project Structure

```
hospital-management-system/
├── hms-api/                          # Laravel backend
│   ├── app/
│   │   ├── Console/Commands/         # hms:reset-superadmin
│   │   ├── Events/                   # MessageSent, CallSignal
│   │   ├── Http/
│   │   │   ├── Controllers/Api/      # 12 controllers
│   │   │   ├── Requests/             # FormRequest validation
│   │   │   └── Resources/            # API response formatting
│   │   ├── Models/                   # 15 Eloquent models
│   │   ├── Repositories/             # Database operations
│   │   └── Services/                 # Business logic
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/                  # RoleSeeder, DemoDataSeeder
│   ├── resources/views/pdf/          # PDF templates (Blade)
│   └── routes/
│       ├── api.php
│       └── channels.php              # WebSocket channel authorization
│
└── hms-frontend/                     # React frontend
    ├── public/
    └── src/
        ├── components/               # Navbar, ProtectedRoute, AiWidget, CallOverlay
        ├── context/                  # ThemeContext
        ├── hooks/                    # useCall (WebRTC)
        ├── lib/                      # api.js (Axios), echo.js (WebSocket)
        └── pages/
            ├── admin/                # Management pages
            ├── doctor/               # Doctor dashboard
            ├── patient/              # Patient dashboard
            └── *.jsx                 # Public pages
```

---

## 🧩 Technical Highlights

**Available-slot calculation.** The doctor's schedule for the selected weekday is loaded, split into 30-minute slots, and booked times are subtracted. For today's date, past times are filtered out as well. Cancelled appointments release their slot back into the pool.

**WebRTC and the SDP issue.** Establishing a voice call failed with `setRemoteDescription: Invalid SDP line`. The cause: Laravel's `TrimStrings` middleware was stripping the trailing line break from the SDP payload, which the WebRTC protocol requires. Fixed by excluding the `sdp` and `candidate` fields in `bootstrap/app.php`.

**Broadcast queue pitfall.** The `ShouldBroadcast` interface pushes broadcasts onto the queue. With no queue worker running, events piled up in the `jobs` table and never reached the client. Switching to `ShouldBroadcastNow` dispatches them immediately.

**Azerbaijani characters in PDFs.** DomPDF's default font does not render `ə`, `ş`, or `ğ`. Setting `font-family: DejaVu Sans` in the Blade template resolved it.

---

## 📄 License

Developed as a course final project.

---

## 👤 Author

**Hacer Mammadzada**
[GitHub](https://github.com/Hacermm)