import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-headline',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const viewport = {
  themeColor: '#10b981',
};

export const metadata = {
  title: 'Virtual Health Assistant — AI Symptom Checker & Doctor Finder',
  description: 'AI-powered symptom analysis, personalised recovery plans, and an intelligent doctor directory. Get instant health insights powered by Gemini AI.',
  manifest: '/manifest.json',
  keywords: ['health assistant', 'symptom checker', 'AI diagnosis', 'doctor finder', 'virtual health', 'Gemini AI'],
  openGraph: {
    title: 'Virtual Health Assistant',
    description: 'AI-powered symptom analysis & doctor directory',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`dark ${outfit.variable} ${plusJakartaSans.variable}`}>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
