import { HeartPulse, Activity, Stethoscope, Pill, Heart, Thermometer, Syringe, Microscope, Droplets, FlaskConical, Scan, BrainCircuit } from 'lucide-react';
import { SymptomCheckerForm } from '@/components/symptom-checker-form';
import { DoctorDirectory } from '@/components/doctor-directory';

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-start py-6 md:py-12 lg:py-16 overflow-hidden bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">

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

      {/* Health-Themed Floating Icons — strictly in left & right side gutters only */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">

        {/* ── RIGHT SIDE ── */}
        <Stethoscope  className="absolute top-[8%]  right-[3%] w-11 h-11 text-teal-400/10    animate-float-slow         will-change-transform" style={{ animationDelay: '0s' }}   />
        <HeartPulse   className="absolute top-[22%] right-[3%] w-10 h-10 text-rose-400/10    animate-float-slow-reverse will-change-transform" style={{ animationDelay: '1.2s' }} />
        <Thermometer  className="absolute top-[38%] right-[3%] w-9  h-9  text-amber-400/10   animate-float             will-change-transform" style={{ animationDelay: '0.6s' }} />
        <Microscope   className="absolute top-[54%] right-[4%] w-12 h-12 text-emerald-400/10 animate-float-slow         will-change-transform" style={{ animationDelay: '2s' }}   />
        <FlaskConical className="absolute top-[70%] right-[3%] w-9  h-9  text-indigo-400/10  animate-float-slow-reverse will-change-transform" style={{ animationDelay: '3s' }}   />
        <Scan         className="absolute top-[85%] right-[3%] w-10 h-10 text-teal-300/10    animate-float             will-change-transform" style={{ animationDelay: '1.8s' }} />

        {/* ── LEFT SIDE ── */}
        <Pill         className="absolute top-[6%]  left-[3%] w-10 h-10 text-indigo-400/10  animate-float-slow-reverse will-change-transform" style={{ animationDelay: '0.4s' }} />
        <Activity     className="absolute top-[20%] left-[3%] w-11 h-11 text-emerald-400/10 animate-float             will-change-transform" style={{ animationDelay: '1s' }}   />
        <Syringe      className="absolute top-[36%] left-[3%] w-9  h-9  text-teal-300/10    animate-float-slow         will-change-transform" style={{ animationDelay: '2.2s' }} />
        <Heart        className="absolute top-[52%] left-[3%] w-10 h-10 text-rose-400/10    animate-float-slow-reverse will-change-transform" style={{ animationDelay: '0.8s' }} />
        <Droplets     className="absolute top-[68%] left-[3%] w-9  h-9  text-blue-400/10    animate-float             will-change-transform" style={{ animationDelay: '3.5s' }} />
        <BrainCircuit className="absolute top-[83%] left-[3%] w-11 h-11 text-violet-400/10  animate-float-slow         will-change-transform" style={{ animationDelay: '1.5s' }} />

      </div>

      {/* Header */}
      <header className="relative w-full text-center mb-10 md:mb-16 px-4 z-10 animate-fade-in-up">
        <div className="flex flex-col items-center justify-center gap-4 mb-3">
          {/* Animated icon container with orbit rings */}
          <div className="relative flex items-center justify-center">
            {/* Outer orbit ring */}
            <div className="absolute w-24 h-24 rounded-full border border-emerald-500/15 animate-orbit" />
            {/* Inner orbit ring */}
            <div className="absolute w-16 h-16 rounded-full border border-teal-500/20 animate-orbit-reverse" />
            {/* Core icon box */}
            <div className="relative bg-gradient-to-tr from-emerald-500/25 to-teal-500/25 p-4 rounded-3xl border border-emerald-500/25 shadow-2xl animate-neon-border shadow-emerald-500/10 z-10">
              <HeartPulse className="w-12 h-12 text-primary animate-heartbeat" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight font-headline text-gradient py-2 [animation-delay:80ms] animate-fade-in-up">
            Virtual Health Assistant
          </h1>
        </div>
        <p className="text-muted-foreground md:text-xl max-w-2xl mx-auto font-medium animate-fade-in-up [animation-delay:160ms]">
          Your intelligent online guide to understanding and monitoring symptoms.
        </p>
      </header>

      <section className="relative w-full mx-auto px-4 z-10 max-w-5xl space-y-12 animate-fade-in-up [animation-delay:200ms]">
        <SymptomCheckerForm />

        <div className="w-full glow-divider my-16" />

        <div id="doctor-directory" className="animate-fade-in-up [animation-delay:400ms]">
          <DoctorDirectory />
        </div>
      </section>

      <footer className="w-full text-center mt-12 md:my-16 text-sm text-muted-foreground px-4 animate-fade-in-up [animation-delay:600ms]">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Heart className="w-3.5 h-3.5 text-rose-500/60 animate-heartbeat" />
          <p>&copy; {new Date().getFullYear()} Virtual Health Assistant. All Rights Reserved.</p>
        </div>
        <p className="mt-1 text-xs text-slate-600">
          Demo application — not for real medical use.
        </p>
      </footer>
    </main>
  );
}
