# 🏗️ Architecture & Production Files/Folder Schema

## 📋 Architectural Overview

The **Virtual Health Assistant** platform adheres to an enterprise-grade, domain-driven full-stack architecture combining a high-performance **Next.js 15 (App Router)** frontend with a dedicated **Express.js (Node.js)** backend API microservice.

---

## 📂 Production Folder & File Schema

```
Virtual-Health-Assistant/
├── .github/
│   └── workflows/
│       └── ci.yml                 # Automated CI/CD pipeline (Lint, Test, Build)
├── .editorconfig                  # Universal code style formatting standards
├── ARCHITECTURE.md                # System Architecture & Folder Schema Specification
├── README.md                      # Project overview, setup, and deployment guides
├── jsconfig.json                  # Path aliases (@/features, @/services, @/schemas, etc.)
│
├── backend/                       # REST API Backend Service
│   ├── config/                    # Configuration & Database
│   │   ├── db.js                  # Persistent JSON Database Driver with atomic IO
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
│   ├── data/                      # Medical Knowledge Base & Database Storage
│   │   ├── doctorData.js          # Seed dataset of verified medical practitioners
│   │   ├── medicalCatalog.js      # Curated clinical conditions, symptoms, and care plans
│   │   └── storage/
│   │       └── appointments.json  # Persistent JSON appointment records
│   ├── middleware/                # Express Middlewares
│   │   ├── errorHandler.js        # Global error interceptor & not-found handler
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
├── src/                           # Next.js 15 App Directory
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
│   │   └── page.jsx               # Main landing & clinical interface page
│   │
│   ├── components/                # Modular Component Architecture
│   │   ├── common/                # Shared Cross-Feature Components
│   │   │   ├── LikelihoodBar.jsx  # Animated diagnostic percentage meter
│   │   │   ├── StarRating.jsx     # Star rating display
│   │   │   └── index.js
│   │   │
│   │   ├── features/              # Domain Feature Modules
│   │   │   ├── appointments/      # Specialist Booking & Scheduling
│   │   │   │   ├── DoctorDetailsDialog.jsx
│   │   │   │   └── index.js
│   │   │   ├── care-plan/         # Prescribed Care Plans, Precautions & Tests
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
│   │   │
│   │   ├── layout/                # Page Layout Structural Components
│   │   │   ├── BackgroundMesh.jsx # Ambient radial glow & mesh background
│   │   │   ├── FloatingSideGutter.jsx # Floating equipment animated cards
│   │   │   ├── HeroSection.jsx    # Hero headline, badges & pulse icon
│   │   │   ├── Footer.jsx         # Clinical disclaimer & footer
│   │   │   └── index.js
│   │   │
│   │   ├── ui/                    # Primitive Atomic UI Components (Radix/Shadcn)
│   │   │   ├── button.jsx, card.jsx, dialog.jsx, input.jsx, select.jsx...
│   │   │   └── index.js
│   │   │
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

## 🎯 Key Design Principles

1. **Separation of Concerns**: UI components never contain direct file-system dependencies or low-level transport details. They interact via the `src/services/` layer.
2. **Domain-Driven Feature Slicing**: Related components (e.g. `DoctorCard`, `DoctorDirectory`) live together in `src/components/features/` rather than in a flat root folder.
3. **Strict Validation**: All external input (symptoms, booking dates, phone numbers) is validated against Zod schemas in `src/schemas/`.
4. **Resilient Isomorphic Execution**: Services communicate with the Express backend REST API, but have automatic fallbacks for local dev or static preview environments.
5. **Zero Breaking Changes**: Legacy import paths (such as `@/lib/data` and root `@/components/*`) continue to function through backward-compatible forwarding barrels.
