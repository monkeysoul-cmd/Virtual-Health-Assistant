import { HeartPulse } from 'lucide-react';
import { SymptomCheckerForm } from '@/components/symptom-checker-form';
import { DoctorDirectory } from '@/components/doctor-directory';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 md:p-8 lg:p-12">
      <header className="w-full max-w-5xl mx-auto text-center mb-8 md:mb-12">
        <div className="flex items-center justify-center gap-3 mb-2">
          <HeartPulse className="w-10 h-10 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter font-headline">
            Virtual Health Assistant
          </h1>
        </div>
        <p className="text-muted-foreground md:text-xl/relaxed">
          Your online guide to understanding your health symptoms.
        </p>
      </header>

      <section className="w-full max-w-5xl mx-auto">
        <SymptomCheckerForm />

        <div className="w-full border-t border-border my-12 md:my-16"></div>

        <div id="doctor-directory">
          <DoctorDirectory />
        </div>
      </section>

      <footer className="w-full max-w-5xl mx-auto text-center mt-12 md:my-16 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Virtual Health Assistant. All Rights Reserved.</p>
        <p className="mt-1">
          This is a demo application and not for real medical use.
        </p>
      </footer>
    </main>
  );
}
