import './globals.css';
import { Toaster } from '@/components/ui/toaster';

export const metadata = {
  title: 'Virtual Health Assistant — AI Symptom Checker & Doctor Finder',
  description: 'AI-powered symptom analysis, personalised recovery plans, and an intelligent doctor directory. Get instant health insights powered by Gemini AI.',
  manifest: '/manifest.json',
  keywords: ['health assistant', 'symptom checker', 'AI diagnosis', 'doctor finder', 'virtual health', 'Gemini AI'],
  themeColor: '#10b981',
  openGraph: {
    title: 'Virtual Health Assistant',
    description: 'AI-powered symptom analysis & doctor directory',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="theme-color" content="#10b981" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
