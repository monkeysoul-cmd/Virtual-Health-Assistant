import { HeartPulse, Activity, Stethoscope, Pill, Sparkles, Heart } from 'lucide-react';
import { SymptomCheckerForm } from '@/components/symptom-checker-form';
import { DoctorDirectory } from '@/components/doctor-directory';
export default function Home() {
    return (<main className="relative flex min-h-screen flex-col items-center justify-start py-6 md:py-12 lg:py-16 overflow-hidden bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
      {/* Repeating Plus-Sign Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04] pointer-events-none z-0" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 25v10M25 30h10' stroke='%2310b981' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Dynamic Glowing Mesh Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-48 -left-48 w-[500px] h-[500px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full filter blur-[120px] animate-float-slow will-change-transform" />
        <div className="absolute top-1/3 -right-48 w-[600px] h-[600px] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full filter blur-[150px] animate-float-slow-reverse will-change-transform" />
        <div className="absolute -bottom-48 left-1/4 w-[500px] h-[500px] bg-teal-500/10 dark:bg-teal-500/5 rounded-full filter blur-[120px] animate-float-slow will-change-transform" />
      </div>

      {/* Subtle Floating Clinical Graphics */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <Stethoscope className="absolute top-24 right-[10%] w-12 h-12 text-teal-500/10 animate-float-slow will-change-transform" style={{ animationDelay: '0s' }} />
        <Pill className="absolute top-96 left-[8%] w-10 h-10 text-indigo-500/10 animate-float-slow-reverse will-change-transform" style={{ animationDelay: '2s' }} />
        <Activity className="absolute top-[60%] right-[6%] w-16 h-16 text-emerald-500/10 animate-float will-change-transform" style={{ animationDelay: '1s' }} />
        <HeartPulse className="absolute top-[80%] left-[12%] w-14 h-14 text-emerald-500/10 animate-float-slow will-change-transform" style={{ animationDelay: '3s' }} />
        <Heart className="absolute top-[40%] right-[15%] w-10 h-10 text-rose-500/5 animate-float-slow-reverse will-change-transform" style={{ animationDelay: '4s' }} />
        <Sparkles className="absolute top-72 left-[20%] w-8 h-8 text-amber-500/10 animate-float will-change-transform" style={{ animationDelay: '1.5s' }} />
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
