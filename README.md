# 🩺 Virtual Health Assistant

An intelligent, AI-powered health companion built with **Next.js 15**, **React 18**, and **Google Genkit**. It empowers users to analyze symptoms through natural language, review potential medical conditions, receive tailored clinical recovery plans, consult an interactive virtual doctor assistant, and discover certified local healthcare specialists.

---

### 🔗 Live Deployment
🚀 **[Access the Live App here](https://virtual-health-assistant-beige.vercel.app/)**  
*(Hosted on Vercel)*

---

## 🛠️ Technology Stack & Badges

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Framework** | ![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=nextdotjs) ![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react) |
| **Styling & Design System** | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=flat-square&logo=tailwindcss) ![Shadcn UI](https://img.shields.io/badge/Shadcn_UI-Components-black?style=flat-square&logo=shadcnui) ![Glassmorphism](https://img.shields.io/badge/UI-Glassmorphism-emerald?style=flat-square) |
| **AI Engine & Workflow** | ![Google Genkit](https://img.shields.io/badge/Google_Genkit-1.20-4285F4?style=flat-square&logo=google) ![Gemini 2.5 Flash](https://img.shields.io/badge/Gemini_2.5_Flash-AI-ea4335?style=flat-square&logo=google-gemini) |
| **PWA & Offline Support** | ![PWA](https://img.shields.io/badge/PWA-Workbox-purple?style=flat-square&logo=pwa) ![Service Worker](https://img.shields.io/badge/Service_Worker-Offline_Cache-success?style=flat-square) |
| **Icons & Media** | ![Lucide Icons](https://img.shields.io/badge/Lucide_Icons-Graphics-indigo?style=flat-square) |
| **Deployment Platform** | ![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=flat-square&logo=vercel) |

---

## 🌟 Key Features

*   🧠 **Intelligent Symptom Analysis**: Input symptoms in natural language (e.g., *"severe headache, nausea, and sensitivity to light"*) or choose from quick-select symptom chips for rapid triage.
*   👨‍⚕️ **Interactive Floating Doctor Assistant**:
    *   *Real-Time Typewriter Feedback*: Conversational responses updating dynamically as you describe symptoms, add tags, or run assessments.
    *   *Smart Screen Boundary Clamping*: Fully draggable across the viewport with mathematical clamping that prevents the card or pill from ever clipping or overflowing off-screen.
    *   *Dynamic Scroll Docking*: Seamlessly transitions between an expanded upper-right card and a compact bottom-right floating pill when scrolling through long results or doctor directories.
    *   *Auto-Reclamping on Expand*: Intelligently lifts upward when expanded from the bottom edge to guarantee full visibility on all display sizes.
*   📋 **Structured Care & Recovery Plans**: Each assessment delivers an actionable recovery blueprint, complete with:
    *   *Primary & Differential Diagnoses*: Rated by likelihood percentages.
    *   *Prescription Directives*: Over-the-counter advice with safe usage limits.
    *   *Dietary Guidelines*: Specific foods, hydration, and nutritional advice.
    *   *Activity Adjustments*: Recommended rest schedules and exertion limits.
    *   *Emergency Red Flags*: Critical alerts signaling when immediate ER care is warranted.
*   🧪 **Diagnostic Test Suggestions**: Recommends clinical examinations (e.g., CBC, MRI, Blood Glucose) correlated with detected potential conditions.
*   🗂️ **Specialist Directory & Booking**: Search local verified physicians by area and specialty (General Medicine, Cardiology, Neurology, Pediatrics, Orthopedics, Dermatology) with an interactive appointment scheduler.
*   🛡️ **Smart Local Fallback & Offline Engine**: Built-in clinical keyword matcher ensures prompt evaluations even when offline, during network outages, or when Gemini API quotas are exhausted.
*   📱 **Progressive Web App (PWA)**: Equipped with service worker caching for quick load times and installability on desktop and mobile devices.

---

## 📸 Screenshots & User Interface

### 1️⃣ Symptom Checker Dashboard
*A sleek, dark-mode glassmorphic dashboard for logging symptoms with quick-add chips.*
![Symptom Checker Dashboard](./public/screenshots/symptom-checker.png)

### 2️⃣ Assessment Results & Actionable Recovery Checklist
*AI-driven health evaluations featuring condition likelihood meters, precautionary advice, and recommended local specialists.*
![Assessment Results](./public/screenshots/assessment-results.png)

---

## 🏗️ Project Architecture

```
Virtual-Health-Assistant/
├── public/                 # Static assets, PWA icons, manifest & service worker
├── src/
│   ├── ai/                 # Genkit AI workflows & Gemini prompt definitions
│   │   ├── flows/          # Symptom assessment flows
│   │   └── genkit.js       # Genkit initialization & plugin configs
│   ├── app/                # Next.js App Router
│   │   ├── actions.js      # Server actions (AI assessment & doctor search)
│   │   ├── globals.css     # Global styles, glassmorphism tokens & animations
│   │   ├── layout.jsx      # Root HTML layout & fonts
│   │   └── page.jsx        # Single-page application orchestrator
│   ├── components/         # Reusable UI & application components
│   │   ├── doctor-assistant.jsx        # Floating companion with boundary clamping
│   │   ├── doctor-details-dialog.jsx   # Appointment booking modal
│   │   ├── doctor-directory.jsx        # Searchable specialist directory
│   │   ├── prescribed-plan-card.jsx    # Recovery checklist & prescription card
│   │   ├── symptom-checker-form.jsx    # Primary symptom input & triage flow
│   │   ├── test-suggestions.jsx        # Recommended diagnostic tests
│   │   └── ui/                         # Shadcn/Radix UI base primitives
│   └── lib/                # Static data catalogs, conditions, specialists & utils
└── package.json            # Project manifest & scripts
```

---

## 🌍 Real-World Advantages & Healthcare Triage Impact

1.  ⏱️ **24/7 Immediate Triage**: Delivers rapid preliminary health intelligence, curbing panic and providing informed steps before visiting a clinic.
2.  🚨 **Critical Emergency Detection**: Highlights red-flag symptoms prominently, instructing patients to seek emergency medical attention without delay.
3.  📉 **Mitigating Clinic Congestion**: Filters self-limiting conditions from urgent health concerns, reducing unnecessary pressure on primary care facilities.
4.  🎓 **Empowering Health Literacy**: Translates complex medical conditions into practical lifestyle, hydration, and recovery guidelines.
5.  🗺️ **Direct Specialist Routing**: Guides patients toward the appropriate medical specialty based on their individual symptom profile.

---

## 🚀 Local Development Setup

Follow these steps to run the project locally:

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
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```
> *Tip: You can also enter and manage your Gemini API key directly from the in-app settings modal, which persists securely in your local browser storage.*

### 4. Start the Development Server
```bash
npm run dev
```
Open your browser and navigate to:
```
http://localhost:9002
```

### 5. Build for Production
To generate and test an optimized production bundle:
```bash
npm run build
npm start
```

---

## 🛡️ Medical Disclaimer
> [!IMPORTANT]
> This application is a **demonstration and educational prototype** and is **not intended to replace professional medical advice, diagnosis, or treatment**. Always seek the advice of a qualified physician or other licensed healthcare provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay seeking it because of information provided by this application.
