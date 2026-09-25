/**
 * Site Metadata & Global Brand Configuration
 */

export const siteConfig = {
  name: 'Virtual Health Assistant',
  shortName: 'VHA',
  description: 'AI-powered clinical triage, disease risk assessment, personalized recovery plans, and doctor directory.',
  url: 'https://virtual-health-assistant-beige.vercel.app',
  ogImage: '/icon.png',
  author: 'Virtual Health Assistant Team',
  disclaimer: 'Virtual Health Assistant provides general informational health triage and is not a substitute for professional clinical medical advice, emergency care, or diagnosis.',
  links: {
    github: 'https://github.com/monkeysoul-cmd/Virtual-Health-Assistant',
    docs: '/api/health/info',
  },
  assistant: {
    defaultDoctorName: 'Dr. Amit Patel',
    specialty: 'Clinical Medical Consultant',
    initialGreeting: 'Hello! I am your AI Virtual Health Assistant. Describe your symptoms above or select a quick tag, and I will generate a personalized recovery blueprint.',
  },
  theme: {
    primaryColor: '#10b981', // emerald-500
    accentColor: '#14b8a6',  // teal-500
    backgroundColor: '#020617', // slate-950
  }
};

export default siteConfig;
