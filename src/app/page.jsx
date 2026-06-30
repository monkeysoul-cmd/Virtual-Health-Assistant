import { HeartPulse } from 'lucide-react';
import { SymptomCheckerForm } from '@/components/symptom-checker-form';
import { DoctorDirectory } from '@/components/doctor-directory';
export default function Home() {
    return (<main className="relative flex min-h-screen flex-col items-center justify-start py-6 md:py-12 lg:py-16 overflow-hidden">
      {/* Dynamic Glowing Mesh Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-48 -left-48 w-[500px] h-[500px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full filter blur-[120px] animate-float-slow" />
        <div className="absolute top-1/3 -right-48 w-[600px] h-[600px] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full filter blur-[150px] animate-float-slow-reverse" />
        <div className="absolute -bottom-48 left-1/4 w-[500px] h-[500px] bg-teal-500/10 dark:bg-teal-500/5 rounded-full filter blur-[120px] animate-float-slow" />
      </div>

      <header className="relative w-full text-center mb-10 md:mb-16 px-4 z-10 animate-fade-in-up">
        <div className="flex flex-col items-center justify-center gap-4 mb-3">
          <div className="bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 p-4 rounded-3xl border border-emerald-500/20 shadow-2xl animate-float shadow-emerald-500/10">
            <HeartPulse className="w-12 h-12 text-primary"/>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight font-headline text-gradient py-2">
            Virtual Health Assistant
          </h1>
        </div>
        <p className="text-muted-foreground md:text-xl max-w-2xl mx-auto font-medium">
          Your intelligent online guide to understanding and monitoring symptoms.
        </p>
      </header>

      <section className="relative w-full mx-auto px-4 z-10 max-w-5xl space-y-12 animate-fade-in-up [animation-delay:200ms]">
        <SymptomCheckerForm />

        <div className="w-full border-t border-border/40 my-16"></div>

        <div id="doctor-directory" className="animate-fade-in-up [animation-delay:400ms]">
          <DoctorDirectory />
        </div>
      </section>

      <footer className="w-full text-center mt-12 md:my-16 text-sm text-muted-foreground px-4">
        <p>&copy; {new Date().getFullYear()} Virtual Health Assistant. All Rights Reserved.</p>
        <p className="mt-1">
          This is a demo application and not for real medical use.
        </p>
      </footer>
    </main>);
}
