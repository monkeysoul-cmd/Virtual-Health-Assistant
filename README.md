# 🩺 Virtual Health Assistant

An intelligent, enterprise-grade AI-powered healthcare companion built with **Next.js 15 (App Router)**, **React 18**, **Express.js**, and **Google Gemini 2.5 Flash**. It empowers users to analyze symptoms through natural language, review potential medical conditions, receive tailored clinical recovery plans, schedule conflict-free appointments with certified local specialists, and consult an interactive virtual doctor assistant.

---

### 🔗 Live Deployment
🚀 **[Access the Live App here](https://virtual-health-assistant-beige.vercel.app/)**  
*(Hosted on Vercel)*

---

## 🛠️ Technology Stack & Badges

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Framework** | ![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=nextdotjs) ![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react) |
| **Architecture Pattern** | ![Architecture](https://img.shields.io/badge/Pattern-Domain--Driven_Feature--Sliced-emerald?style=flat-square) ![Validation](https://img.shields.io/badge/Schema-Zod_3.24-blue?style=flat-square) |
| **Backend API & Server** | ![Express.js](https://img.shields.io/badge/Express.js-4.21-black?style=flat-square&logo=express) ![Node.js](https://img.shields.io/badge/Node.js-20+-green?style=flat-square&logo=nodedotjs) ![REST API](https://img.shields.io/badge/REST-API-orange?style=flat-square) |
| **Styling & Design System** | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=flat-square&logo=tailwindcss) ![Shadcn UI](https://img.shields.io/badge/Shadcn_UI-Components-black?style=flat-square&logo=shadcnui) ![Glassmorphism](https://img.shields.io/badge/UI-Glassmorphism-emerald?style=flat-square) |
| **AI Engine & Workflow** | ![Gemini 2.5 Flash](https://img.shields.io/badge/Gemini_2.5_Flash-AI-ea4335?style=flat-square&logo=google-gemini) ![Google Genkit](https://img.shields.io/badge/Google_Genkit-1.20-4285F4?style=flat-square&logo=google) |
| **Data Persistence** | ![JSON Store](https://img.shields.io/badge/Storage-Persistent_JSON_Store-blue?style=flat-square) ![Atomic IO](https://img.shields.io/badge/I%2FO-Atomic_File_IO-brightgreen?style=flat-square) |
| **CI / CD Pipeline** | ![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?style=flat-square&logo=githubactions) ![Integration Tests](https://img.shields.io/badge/Tests-17_Passing-brightgreen?style=flat-square) |
| **PWA & Offline Support** | ![PWA](https://img.shields.io/badge/PWA-Workbox-purple?style=flat-square&logo=pwa) ![Service Worker](https://img.shields.io/badge/Service_Worker-Offline_Cache-success?style=flat-square) |
| **Icons & Media** | ![Lucide Icons](https://img.shields.io/badge/Lucide_Icons-Graphics-indigo?style=flat-square) |
| **Deployment Platform** | ![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=flat-square&logo=vercel) |

---

## 🌟 Key Features

*   🧠 **Intelligent Dual-Engine Symptom Analysis**: Input symptoms in natural language (e.g., *"severe headache, nausea, and sensitivity to light"*) or choose from quick-select symptom chips. Powered by **Gemini 2.5 Flash** with an automatic sub-15ms fallback to a 37+ condition clinical keyword matching engine.
*   👨‍⚕️ **Interactive Floating Doctor Assistant**:
    *   *Real-Time Typewriter Feedback*: Conversational responses updating dynamically as you describe symptoms, add tags, or run assessments.
    *   *Smart Screen Boundary Clamping*: Fully draggable across the viewport with mathematical clamping that prevents clipping off-screen.
    *   *Dynamic Scroll Docking*: Seamlessly transitions between an expanded upper-right card and a compact bottom-right floating pill when scrolling.
    *   *Auto-Reclamping on Expand*: Intelligently lifts upward when expanded near the bottom edge.
*   📋 **Structured Care & Recovery Plans**: Each assessment delivers an actionable recovery blueprint, complete with:
    *   *Primary & Differential Diagnoses*: Rated by likelihood percentages.
    *   *Prescription Directives*: Over-the-counter advice with safe usage limits.
    *   *Dietary Guidelines*: Specific foods, hydration, and nutritional advice.
    *   *Activity Adjustments*: Recommended rest schedules and exertion limits.
    *   *Emergency Red Flags*: Critical alerts signaling when immediate ER care is warranted.
*   🧪 **Diagnostic Test Suggestions**: Correlates detected conditions with relevant clinical examinations (e.g., CBC, MRI, Blood Glucose, RIDT).
*   🗂️ **Specialist Directory & Persistent Scheduling**:
    *   *Specialist Search*: Filter verified doctors across 7+ specialties and major Indian metropolitan hubs.
    *   *Conflict-Free Booking*: Real-time slot availability checking that blocks double-booking conflicts.
    *   *Persistent Confirmation*: Generates unique booking reference IDs (`VHA-XXXXXX`) stored persistently in the database.
*   💬 **Virtual Doctor AI Chatbot**: Real-time conversational triage with Dr. Amit Patel persona for lifestyle, medication, and symptom inquiries.
*   🛡️ **Production-Ready Backend API**: Complete modular Express server with request logging, sliding-window rate limiting, input sanitization, and health diagnostics.
*   📱 **Progressive Web App (PWA)**: Equipped with service worker caching for offline readiness and native-like desktop and mobile installation.

---

## 📸 Screenshots & User Interface

### 1️⃣ Symptom Checker Dashboard
*A sleek, dark-mode glassmorphic dashboard for logging symptoms with quick-add chips.*
![Symptom Checker Dashboard](./public/screenshots/symptom-checker.png)

### 2️⃣ Assessment Results & Actionable Recovery Checklist
*AI-driven health evaluations featuring condition likelihood meters, precautionary advice, and recommended local specialists.*
![Assessment Results](./public/screenshots/assessment-results.png)

---

## 🏗️ Production-Grade Files & Folder Schema

The project follows a **domain-driven, feature-sliced architecture** ensuring clean separation of concerns, testability, and strict input validation:

```
Virtual-Health-Assistant/
├── .github/
│   └── workflows/
│       └── ci.yml                 # Automated CI/CD pipeline (Lint, Test, Build)
├── .editorconfig                  # Team formatting standards (indentation, charset)
├── ARCHITECTURE.md                # In-depth architectural decision records (ADR)
├── jsconfig.json                  # Path aliases (@/features, @/services, @/schemas, etc.)
│
├── backend/                       # REST API Backend Service (Express.js)
│   ├── config/                    # Configuration & Database
│   │   ├── db.js                  # Persistent JSON Database Driver (atomic IO)
│   │   └── index.js               # Environment configuration loader
│   ├── constants/                 # Core Constants & Dictionaries
│   │   ├── httpCodes.js           # Standardized HTTP status codes
│   │   └── messages.js            # Clinical & system message constants
│   ├── controllers/               # Request Controllers
│   │   ├── appointmentController.js
│   │   ├── chatController.js
│   │   ├── doctorController.js
│   │   ├── healthController.js
│   │   └── symptomController.js
│   ├── data/                      # Medical Knowledge Base & Storage
│   │   ├── doctorData.js          # Seed dataset of verified medical practitioners
│   │   ├── medicalCatalog.js      # Curated clinical conditions, symptoms & care plans
│   │   └── storage/
│   │       └── appointments.json  # Persistent JSON appointment records
│   ├── middleware/                # Express Middlewares
│   │   ├── errorHandler.js        # Global error interceptor & 404 router
│   │   ├── logger.js              # HTTP request timing & IP logger
│   │   ├── rateLimiter.js         # Sliding-window rate limiter
│   │   └── validate.js            # Request schema validator
│   ├── routes/                    # API Route Handlers
│   │   ├── appointmentRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── doctorRoutes.js
│   │   ├── healthRoutes.js
│   │   ├── index.js               # Master router mounting /api/*
│   │   └── symptomRoutes.js
│   ├── services/                  # Business Logic Layer
│   │   ├── aiService.js           # Google Gemini AI communication & fallback
│   │   ├── appointmentService.js  # Booking conflict detection & scheduling
│   │   ├── chatService.js         # Dr. Amit Patel conversational assistant
│   │   ├── doctorService.js       # Directory search, filtering & availability
│   │   └── symptomService.js      # Symptom analysis & clinical triage
│   ├── test/                      # Automated Integration & Unit Tests
│   │   └── api.test.js            # End-to-end API test suite (17 test cases)
│   ├── utils/                     # Backend Utilities
│   │   └── apiResponse.js         # Standardized JSend API response builder
│   ├── package.json               # Backend dependencies
│   └── server.js                  # Express HTTP server entry point
│
├── src/                           # Modern Next.js 15 App Directory
│   ├── ai/                        # Genkit & LLM Flows
│   │   ├── flows/
│   │   │   └── symptom-checker-assessment.js
│   │   ├── dev.js
│   │   └── genkit.js
│   │
│   ├── app/                       # Next.js App Router
│   │   ├── actions.js             # Server actions bridging UI to service layer
│   │   ├── globals.css            # Tailwind design tokens, keyframes & animations
│   │   ├── layout.jsx             # Root layout with fonts, metadata, providers
│   │   └── page.jsx               # Composed landing & clinical interface
│   │
│   ├── components/                # Modular Component Architecture
│   │   ├── common/                # Shared Cross-Feature Components
│   │   │   ├── LikelihoodBar.jsx  # Animated diagnostic percentage meter
│   │   │   ├── StarRating.jsx     # Star rating display
│   │   │   └── index.js
│   │   ├── features/              # Domain Feature Modules
│   │   │   ├── appointments/      # Specialist Booking & Scheduling
│   │   │   │   ├── DoctorDetailsDialog.jsx
│   │   │   │   └── index.js
│   │   │   ├── care-plan/         # Prescribed Plans, Precautions & Tests
│   │   │   │   ├── PrecautionaryAdvice.jsx
│   │   │   │   ├── PrescribedPlanCard.jsx
│   │   │   │   ├── TestSuggestions.jsx
│   │   │   │   └── index.js
│   │   │   ├── doctor-assistant/  # Floating AI Doctor (Dr. Amit Patel)
│   │   │   │   ├── DoctorAssistant.jsx
│   │   │   │   └── index.js
│   │   │   ├── doctor-directory/  # Specialist Directory & Search
│   │   │   │   ├── DoctorCard.jsx
│   │   │   │   ├── DoctorDirectory.jsx
│   │   │   │   └── index.js
│   │   │   └── symptom-checker/   # Natural Language Clinical Triage
│   │   │       ├── SymptomCheckerForm.jsx
│   │   │       └── index.js
│   │   ├── layout/                # Page Layout Structural Components
│   │   │   ├── BackgroundMesh.jsx # Ambient radial glow & mesh background
│   │   │   ├── FloatingSideGutter.jsx # Floating equipment animated cards
│   │   │   ├── HeroSection.jsx    # Hero headline, badges & pulse icon
│   │   │   ├── Footer.jsx         # Clinical disclaimer & footer
│   │   │   └── index.js
│   │   ├── ui/                    # Primitive Atomic UI Components (Radix/Shadcn)
│   │   └── index.js               # Master Components Barrel Export
│   │
│   ├── config/                    # Configuration & Environment Validation
│   │   ├── env.js                 # Environment variable validation & fallback defaults
│   │   ├── site.js                # App brand metadata, SEO, and navigation links
│   │   └── index.js
│   │
│   ├── data/                      # Modular Domain Data & Catalogs
│   │   ├── carePlans.js           # Treatment blueprints, dietary, activity, precautions
│   │   ├── conditions.js          # Clinical conditions & specialty mappings
│   │   ├── doctors.js             # Certified specialists directory
│   │   ├── symptoms.js            # Symptoms taxonomy & quick-add chips
│   │   └── index.js               # Unified data barrel
│   │
│   ├── hooks/                     # Custom React Hooks
│   │   ├── use-mobile.jsx         # Responsive viewport detection
│   │   ├── use-toast.js           # Toast notification dispatch hook
│   │   └── index.js
│   │
│   ├── schemas/                   # Zod Validation Schemas
│   │   ├── appointmentSchema.js   # Booking payload validation
│   │   ├── doctorSchema.js        # Doctor query and profile schema
│   │   ├── symptomSchema.js       # Symptom query & assessment schema
│   │   └── index.js
│   │
│   ├── services/                  # Business Logic & Transport Client Layer
│   │   ├── api/
│   │   │   └── apiClient.js       # Universal fetch client with timeouts & error wrapping
│   │   ├── appointmentService.js  # Isomorphic appointment scheduler
│   │   ├── doctorService.js       # Doctor search & directory matching
│   │   ├── symptomService.js      # Symptom assessment orchestrator
│   │   └── index.js
│   │
│   └── utils/                     # Pure Reusable Utility Functions
│       ├── cn.js                  # Tailwind class merge utility
│       ├── formatters.js          # Phone, date, and reference code formatters
│       └── index.js
```

---

## 📡 Backend REST API Reference

The backend operates as an independent REST API service under the `/api` namespace:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Healthcheck, uptime, memory & AI service status |
| `GET` | `/api/health/info` | Catalog statistics & feature capabilities |
| `POST` | `/api/symptoms/assess` | AI clinical triage + recovery blueprint + test suggestions |
| `GET` | `/api/symptoms/catalog` | Categorized symptom chips taxonomy |
| `GET` | `/api/symptoms/conditions` | Supported medical conditions and mapped symptoms |
| `GET` | `/api/symptoms/tests/:condition` | Clinical examinations suggested for a condition |
| `GET` | `/api/doctors` | Query verified doctors (`?specialty=`, `?area=`, `?city=`) |
| `GET` | `/api/doctors/:id` | Doctor profile and credentials |
| `GET` | `/api/doctors/:id/slots` | Slot availability on specific date (`?date=YYYY-MM-DD`) |
| `POST` | `/api/doctors/search` | AI-assisted doctor search by area & specialty |
| `GET` | `/api/doctors/specialties` | Medical specialties directory with practitioner counts |
| `POST` | `/api/appointments` | Book appointment (prevents double-booking) |
| `GET` | `/api/appointments` | List appointments (`?patientPhone=...&status=...`) |
| `GET` | `/api/appointments/:id` | Lookup appointment by confirmation reference |
| `PATCH`| `/api/appointments/:id/cancel` | Cancel a scheduled appointment |
| `POST` | `/api/chat` | Virtual doctor conversational consultation |

*For complete request/response schemas and curl examples, see [backend/README.md](./backend/README.md).*

---

## 🚀 Local Development Setup

Follow these steps to run the frontend and backend locally:

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)

### 2. Clone the Repository & Install Dependencies
```bash
git clone https://github.com/monkeysoul-cmd/Virtual-Health-Assistant.git
cd Virtual-Health-Assistant
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory (or copy from `.env.example`):
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
PORT=5000
```
> *Tip: You can also enter and manage your Gemini API key directly from the in-app settings modal, which persists securely in your local browser storage.*

### 4. Start the Application

#### Option A: Run the Next.js Frontend
```bash
npm run dev
```
Open your browser and navigate to: `http://localhost:9002`

#### Option B: Run the Express Backend Server
```bash
# Production mode
npm run backend

# Watch mode (auto-reload on edits)
npm run backend:dev
```
Backend API will be accessible at: `http://localhost:5000`

---

## 🧪 Running Automated Tests

Run the built-in 17-point backend integration test suite:
```bash
node backend/test/api.test.js
```

**Test Suite Coverage:**
```
🚀 Starting Virtual Health Assistant Backend Test Suite...
  ✅ PASS: GET / returns online status
  ✅ PASS: GET /api/health returns healthy
  ✅ PASS: GET /api/health/info returns doctor catalog stats
  ✅ PASS: GET /api/symptoms/catalog returns symptoms list
  ✅ PASS: GET /api/symptoms/conditions returns conditions
  ✅ PASS: GET /api/symptoms/tests/:condition returns diagnostic tests
  ✅ PASS: POST /api/symptoms/assess returns conditions with prescribed care plan
  ✅ PASS: GET /api/doctors filters by specialty
  ✅ PASS: GET /api/doctors/1 returns Dr. Priya Sharma
  ✅ PASS: GET /api/doctors/specialties returns specialties list
  ✅ PASS: GET /api/doctors/1/slots returns slot availability
  ✅ PASS: POST /api/doctors/search finds doctors in Indirapuram
  ✅ PASS: POST /api/appointments confirms booking and generates reference code
  ✅ PASS: POST /api/appointments prevents double-booking on same slot and date
  ✅ PASS: GET /api/appointments/:id retrieves booked appointment
  ✅ PASS: PATCH /api/appointments/:id/cancel successfully marks appointment cancelled
  ✅ PASS: POST /api/chat receives clinical conversational response from Dr. Patel

======================================================
📊 Test Results: 17 Passed, 0 Failed
======================================================
```

---

## 🌍 Real-World Advantages & Healthcare Triage Impact

1.  ⏱️ **24/7 Immediate Triage**: Delivers rapid preliminary health intelligence, curbing panic and providing informed steps before visiting a clinic.
2.  🚨 **Critical Emergency Detection**: Highlights red-flag symptoms prominently, instructing patients to seek emergency medical attention without delay.
3.  📉 **Mitigating Clinic Congestion**: Filters self-limiting conditions from urgent health concerns, reducing unnecessary pressure on primary care facilities.
4.  🎓 **Empowering Health Literacy**: Translates complex medical conditions into practical lifestyle, hydration, and recovery guidelines.
5.  🗺️ **Direct Specialist Routing**: Guides patients toward the appropriate medical specialty based on their individual symptom profile.

---

## 🛡️ Medical Disclaimer
> [!IMPORTANT]
> This application is a **demonstration and educational prototype** and is **not intended to replace professional medical advice, diagnosis, or treatment**. Always seek the advice of a qualified physician or other licensed healthcare provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay seeking it because of information provided by this application.
