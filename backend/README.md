# 🩺 Virtual Health Assistant — Backend API

A high-performance, modular Node.js/Express backend service powering the Virtual Health Assistant. It provides AI-assisted clinical triage, structured recovery blueprints, verified doctor directory search, conflict-free appointment scheduling, and interactive virtual doctor dialogue.

---

## 🏗️ Architecture & Directory Structure

All backend code, models, controllers, routes, and services are cleanly organized inside the `backend/` directory:

```
backend/
├── server.js                     # Main Express server entrypoint & graceful shutdown
├── package.json                  # Backend dependencies, metadata & scripts
├── .env.example                  # Environment configuration template
│
├── config/
│   ├── index.js                  # Central configuration loader (port, CORS, Gemini API)
│   └── db.js                     # Persistent JSON database driver with atomic file writes
│
├── data/
│   ├── doctorData.js             # Verified Indian & regional specialists directory
│   ├── medicalCatalog.js         # 37+ conditions, symptoms, precautions, diagnostic tests & plans
│   └── storage/                  # Persistent data directory
│       └── appointments.json     # Persisted confirmed appointments
│
├── middleware/
│   ├── logger.js                 # HTTP request duration & colored status logger
│   ├── errorHandler.js           # Standardized JSON error response contract
│   ├── validate.js               # Payload validation & sanitization
│   └── rateLimiter.js            # Sliding-window rate limiter protecting AI quotas
│
├── services/
│   ├── aiService.js              # Native Google Gemini 2.5 Flash API client
│   ├── symptomService.js         # AI clinical triage + weighted rule-based fallback matcher
│   ├── doctorService.js          # Doctor filtering, area matching & slot calculation
│   ├── appointmentService.js     # Booking creation, reference code generator & conflict checks
│   └── chatService.js            # Dr. Amit Patel conversational virtual doctor assistant
│
├── controllers/
│   ├── healthController.js       # Healthcheck & catalog statistics
│   ├── symptomController.js      # Symptom evaluation & taxonomy endpoints
│   ├── doctorController.js       # Doctor directory, search & availability endpoints
│   ├── appointmentController.js  # Booking, lookup & cancellation endpoints
│   └── chatController.js         # Conversational doctor chat endpoint
│
├── routes/
│   ├── index.js                  # Master router mounting all sub-routes at /api
│   ├── healthRoutes.js           # /api/health
│   ├── symptomRoutes.js          # /api/symptoms
│   ├── doctorRoutes.js           # /api/doctors
│   ├── appointmentRoutes.js      # /api/appointments
│   └── chatRoutes.js             # /api/chat
│
└── test/
    └── api.test.js               # Comprehensive 17-point automated API test suite
```

---

## ⚡ Quick Start

### 1. Configure Environment Variables
Copy `.env.example` to `.env` in the `backend/` directory or root workspace:
```bash
PORT=5000
HOST=0.0.0.0
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

### 2. Run the Server
From the root workspace:
```bash
npm run backend          # Run production server
npm run backend:dev      # Run with auto-reload (watch mode)
```

Or directly inside `backend/`:
```bash
cd backend
npm start
```

Default URL: `http://localhost:5000`

---

## 🧪 Running Automated Tests

Run the built-in 17-point test suite:
```bash
npm test --prefix backend
# or
node backend/test/api.test.js
```

---

## 📡 API Reference & Endpoints

### 1. System Health & Diagnostics

#### `GET /`
Returns server operational status and top-level sitemap.

#### `GET /api/health`
Healthcheck returning server memory, uptime, and AI status.
```json
{
  "success": true,
  "status": "healthy",
  "uptimeSeconds": 120,
  "services": {
    "geminiAi": true,
    "database": "connected"
  }
}
```

#### `GET /api/health/info`
Catalog summary and feature capability flags.

---

### 2. Symptom Assessment & Clinical Triage

#### `POST /api/symptoms/assess`
Performs comprehensive AI analysis on user symptoms with automatic fallback to the local keyword matching engine.

**Request Body:**
```json
{
  "symptoms": "severe throbbing one-sided headache with nausea and light sensitivity",
  "apiKey": "optional_override_key"
}
```

**Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "source": "gemini-ai",
    "conditions": [
      {
        "condition": "Migraine",
        "likelihood": 90,
        "specialty": "Neurologist",
        "precautions": [
          "Rest in a quiet, dark room.",
          "Apply cold compresses to your forehead or temples.",
          "Drink plenty of water to maintain hydration."
        ],
        "prescribedPlan": {
          "medicationAdvice": "Over-the-counter pain relievers (NSAIDs) may alleviate acute attacks.",
          "dietaryGuidelines": [
            "Maintain consistent meal times.",
            "Avoid trigger foods like aged cheeses or artificial sweeteners."
          ],
          "activityLevel": "Refrain from strenuous exertion; rest in dim lighting.",
          "warningSigns": [
            "Sudden thunderclap headache.",
            "Neurological deficits like limb weakness or speech loss."
          ]
        },
        "recommendedTests": [
          {
            "name": "Clinical Neurological Exam",
            "description": "Evaluates reflexes, cranial nerves, and coordination.",
            "recommended": true
          }
        ]
      }
    ]
  }
}
```

#### `GET /api/symptoms/catalog`
Returns pre-categorized symptom chips for rapid triage UI chips.

#### `GET /api/symptoms/conditions`
Lists all recognized medical conditions and their associated symptom profiles.

#### `GET /api/symptoms/tests/:condition`
Retrieves suggested diagnostic laboratory or radiology tests for a given condition.

---

### 3. Doctor Directory & Search

#### `GET /api/doctors`
Returns list of verified doctors. Supports query parameters:
- `specialty` (e.g. `Cardiologist`, `Neurologist`, `Pediatrician`)
- `area` (e.g. `Indirapuram`, `Vaishali`, `Bandra`)
- `city` (e.g. `Delhi`, `Mumbai`, `Bangalore`)
- `limit` (default: 50)
- `offset` (default: 0)

#### `GET /api/doctors/:id`
Retrieves detailed profile, qualification, clinic hospital, consultation fee, and available slots.

#### `GET /api/doctors/:id/slots?date=YYYY-MM-DD`
Calculates available appointment slots for a specific date, cross-referencing against booked appointments in the database.

#### `POST /api/doctors/search`
Searches doctors using AI location generation or weighted multi-factor matching (area, specialty, name).

**Request Body:**
```json
{
  "area": "Indirapuram",
  "specialty": "Cardiologist"
}
```

#### `GET /api/doctors/specialties`
Returns all medical specialties with practitioner counts.

---

### 4. Appointment Booking & Management

#### `POST /api/appointments`
Schedules an appointment. Prevents double-booking conflicts on the same doctor, date, and slot.

**Request Body:**
```json
{
  "doctorId": "1",
  "doctorName": "Dr. Priya Sharma",
  "patientName": "Aarav Sharma",
  "patientPhone": "+91 98765 43210",
  "patientEmail": "aarav@example.com",
  "date": "2026-09-25",
  "timeSlot": "10:00 AM",
  "symptoms": "Mild chest tightness and palpitation",
  "notes": "First time visit"
}
```

**Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Appointment successfully confirmed and scheduled.",
  "data": {
    "id": "VHA-77GQTU",
    "doctorId": "1",
    "doctorName": "Dr. Priya Sharma",
    "doctorSpecialty": "Cardiologist",
    "patientName": "Aarav Sharma",
    "date": "2026-09-25",
    "timeSlot": "10:00 AM",
    "status": "confirmed",
    "bookedAt": "2026-09-24T15:54:17.000Z"
  }
}
```

#### `GET /api/appointments`
Filters appointments by query parameters: `?patientPhone=...&doctorId=...&status=...&date=...`.

#### `GET /api/appointments/:id`
Retrieves appointment details by reference code (e.g. `VHA-77GQTU`).

#### `PATCH /api/appointments/:id/cancel`
Cancels a scheduled appointment with a cancellation reason.

---

### 5. Virtual Doctor Assistant Chat

#### `POST /api/chat`
Conversational clinical triage with Dr. Amit Patel AI persona.

**Request Body:**
```json
{
  "message": "What should I eat when experiencing acid reflux?",
  "history": [
    { "role": "user", "content": "I have heartburn after dinner" },
    { "role": "model", "content": "I understand how uncomfortable that is..." }
  ]
}
```

**Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "reply": "For acid reflux, focus on non-acidic foods such as oatmeal, ginger tea, steamed vegetables, and lean poultry...",
    "source": "gemini-ai"
  }
}
```

---

## 🛡️ Reliability & Offline Resiliency

1. **Dual-Engine Triage**: When Google Gemini API is unavailable, quota-exhausted, or network is down, the system switches in **< 15ms** to the rule-based clinical scoring algorithm.
2. **Persistent Storage**: Confirmed bookings persist cleanly in `backend/data/storage/appointments.json` across server restarts.
3. **Double-Booking Shield**: Rejects conflicting appointments with an HTTP `409 Conflict` and descriptive error message.
4. **Rate Limiting**: Sliding window in-memory rate limiter safeguards AI quotas against spam.
