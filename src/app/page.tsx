import { HeartPulse } from 'lucide-react';
import { SymptomCheckerForm } from '@/components/symptom-checker-form';
import { DoctorDirectory } from '@/components/doctor-directory';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-0 w-full">
      <header className="w-full mx-auto text-center py-12 md:py-16 bg-background/60 backdrop-blur-sm border-b border-border mb-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <HeartPulse className="w-12 h-12 text-primary" />
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter font-headline">
            Virtual Health Assistant
          </h1>
        </div>
        <p className="text-muted-foreground md:text-2xl/relaxed max-w-3xl mx-auto">
          Your professional online guide to understanding health symptoms and finding expert care.
        </p>
      </header>

      <div className="w-full px-0">
        <SymptomCheckerForm />
      </div>

      <div className="w-full border-t border-border my-12 md:my-16"></div>

      <div id="doctor-directory" className="w-full px-0">
        <DoctorDirectory />
      </div>

      <footer className="w-full mx-auto text-center py-12 text-sm text-muted-foreground bg-background/40 backdrop-blur-sm border-t border-border mt-16">
        <p className="text-base font-semibold text-foreground">&copy; {new Date().getFullYear()} Virtual Health Assistant</p>
        <p className="mt-1">
          Professional health insights powered by local records. This is a demo application.
        </p>
      </footer>
    </main>
  );
}