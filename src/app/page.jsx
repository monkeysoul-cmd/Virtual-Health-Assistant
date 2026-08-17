import {
  HeartPulse, Activity, Stethoscope, Pill, Heart, Thermometer,
  Syringe, Microscope, Droplets, FlaskConical, Scan, BrainCircuit,
} from 'lucide-react';
import { SymptomCheckerForm } from '@/components/symptom-checker-form';
import { DoctorDirectory } from '@/components/doctor-directory';

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-start overflow-hidden bg-slate-950">

      {/* ── Background mesh ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 25v10M25 30h10' stroke='%2310b981' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}
        />
        <div className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-emerald-500/8 rounded-full filter blur-[140px] animate-float-slow will-change-transform" />
        <div className="absolute top-1/3 -right-48 w-[700px] h-[700px] bg-indigo-500/6 rounded-full filter blur-[160px] animate-float-slow-reverse will-change-transform" />
        <div className="absolute -bottom-48 left-1/4 w-[500px] h-[500px] bg-teal-500/6 rounded-full filter blur-[120px] animate-float-slow will-change-transform" />
      </div>

      {/* ── Floating health icons & medical equipment — side gutters ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-60">
        {/* Right column — medical equipment floating cards */}
        <div className="absolute top-[8%] right-[1.5%] lg:right-[2%] xl:right-[3%] p-2 sm:p-2.5 rounded-2xl bg-slate-900/35 border border-teal-500/15 shadow-[0_0_15px_rgba(20,184,166,0.1)] backdrop-blur-xs animate-float will-change-transform" style={{ animationDelay: '0s' }}>
          <Stethoscope className="w-6 h-6 sm:w-7 sm:h-7 xl:w-8 xl:h-8 text-teal-300/60 drop-shadow-[0_0_6px_rgba(45,212,191,0.3)]" />
        </div>
        <div className="absolute top-[23%] right-[1.5%] lg:right-[2.5%] xl:right-[3.5%] p-2 sm:p-2.5 rounded-2xl bg-slate-900/35 border border-rose-500/15 shadow-[0_0_15px_rgba(244,63,94,0.1)] backdrop-blur-xs animate-float-slow-reverse will-change-transform" style={{ animationDelay: '1.2s' }}>
          <HeartPulse className="w-6 h-6 sm:w-7 sm:h-7 xl:w-8 xl:h-8 text-rose-300/60 drop-shadow-[0_0_6px_rgba(251,113,133,0.3)]" />
        </div>
        <div className="absolute top-[39%] right-[1.5%] lg:right-[2%] xl:right-[3%] p-2 sm:p-2.5 rounded-2xl bg-slate-900/35 border border-amber-500/15 shadow-[0_0_15px_rgba(245,158,11,0.1)] backdrop-blur-xs animate-float will-change-transform" style={{ animationDelay: '0.6s' }}>
          <Thermometer className="w-5 h-5 sm:w-6 sm:h-6 xl:w-7 xl:h-7 text-amber-300/60 drop-shadow-[0_0_6px_rgba(251,191,36,0.3)]" />
        </div>
        <div className="absolute top-[55%] right-[1.5%] lg:right-[2.5%] xl:right-[3.5%] p-2 sm:p-2.5 rounded-2xl bg-slate-900/35 border border-emerald-500/15 shadow-[0_0_15px_rgba(16,185,129,0.1)] backdrop-blur-xs animate-float-slow will-change-transform" style={{ animationDelay: '2s' }}>
          <Microscope className="w-7 h-7 sm:w-8 sm:h-8 xl:w-9 xl:h-9 text-emerald-300/60 drop-shadow-[0_0_6px_rgba(52,211,153,0.3)]" />
        </div>
        <div className="absolute top-[71%] right-[1.5%] lg:right-[2%] xl:right-[3%] p-2 sm:p-2.5 rounded-2xl bg-slate-900/35 border border-indigo-500/15 shadow-[0_0_15px_rgba(99,102,241,0.1)] backdrop-blur-xs animate-float-slow-reverse will-change-transform" style={{ animationDelay: '3s' }}>
          <FlaskConical className="w-5 h-5 sm:w-6 sm:h-6 xl:w-7 xl:h-7 text-indigo-300/60 drop-shadow-[0_0_6px_rgba(129,140,248,0.3)]" />
        </div>
        <div className="absolute top-[86%] right-[1.5%] lg:right-[2.5%] xl:right-[3.5%] p-2 sm:p-2.5 rounded-2xl bg-slate-900/35 border border-cyan-500/15 shadow-[0_0_15px_rgba(6,182,212,0.1)] backdrop-blur-xs animate-float will-change-transform" style={{ animationDelay: '1.8s' }}>
          <Scan className="w-6 h-6 sm:w-7 sm:h-7 xl:w-8 xl:h-8 text-cyan-300/60 drop-shadow-[0_0_6px_rgba(34,211,238,0.3)]" />
        </div>

        {/* Left column — medical equipment floating cards */}
        <div className="absolute top-[6%] left-[1.5%] lg:left-[2%] xl:left-[3%] p-2 sm:p-2.5 rounded-2xl bg-slate-900/35 border border-indigo-500/15 shadow-[0_0_15px_rgba(99,102,241,0.1)] backdrop-blur-xs animate-float-slow-reverse will-change-transform" style={{ animationDelay: '0.4s' }}>
          <Pill className="w-6 h-6 sm:w-7 sm:h-7 xl:w-8 xl:h-8 text-indigo-300/60 drop-shadow-[0_0_6px_rgba(129,140,248,0.3)]" />
        </div>
        <div className="absolute top-[20%] left-[1.5%] lg:left-[2.5%] xl:left-[3.5%] p-2 sm:p-2.5 rounded-2xl bg-slate-900/35 border border-emerald-500/15 shadow-[0_0_15px_rgba(16,185,129,0.1)] backdrop-blur-xs animate-float will-change-transform" style={{ animationDelay: '1s' }}>
          <Activity className="w-7 h-7 sm:w-8 sm:h-8 xl:w-9 xl:h-9 text-emerald-300/60 drop-shadow-[0_0_6px_rgba(52,211,153,0.3)]" />
        </div>
        <div className="absolute top-[36%] left-[1.5%] lg:left-[2%] xl:left-[3%] p-2 sm:p-2.5 rounded-2xl bg-slate-900/35 border border-teal-500/15 shadow-[0_0_15px_rgba(20,184,166,0.1)] backdrop-blur-xs animate-float-slow will-change-transform" style={{ animationDelay: '2.2s' }}>
          <Syringe className="w-5 h-5 sm:w-6 sm:h-6 xl:w-7 xl:h-7 text-teal-300/60 drop-shadow-[0_0_6px_rgba(45,212,191,0.3)]" />
        </div>
        <div className="absolute top-[52%] left-[1.5%] lg:left-[2.5%] xl:left-[3.5%] p-2 sm:p-2.5 rounded-2xl bg-slate-900/35 border border-rose-500/15 shadow-[0_0_15px_rgba(244,63,94,0.1)] backdrop-blur-xs animate-float-slow-reverse will-change-transform" style={{ animationDelay: '0.8s' }}>
          <Heart className="w-6 h-6 sm:w-7 sm:h-7 xl:w-8 xl:h-8 text-rose-300/60 drop-shadow-[0_0_6px_rgba(251,113,133,0.3)]" />
        </div>
        <div className="absolute top-[68%] left-[1.5%] lg:left-[2%] xl:left-[3%] p-2 sm:p-2.5 rounded-2xl bg-slate-900/35 border border-blue-500/15 shadow-[0_0_15px_rgba(59,130,246,0.1)] backdrop-blur-xs animate-float will-change-transform" style={{ animationDelay: '3.5s' }}>
          <Droplets className="w-5 h-5 sm:w-6 sm:h-6 xl:w-7 xl:h-7 text-blue-300/60 drop-shadow-[0_0_6px_rgba(96,165,250,0.3)]" />
        </div>
        <div className="absolute top-[83%] left-[1.5%] lg:left-[2.5%] xl:left-[3.5%] p-2 sm:p-2.5 rounded-2xl bg-slate-900/35 border border-violet-500/15 shadow-[0_0_15px_rgba(139,92,246,0.1)] backdrop-blur-xs animate-float-slow will-change-transform" style={{ animationDelay: '1.5s' }}>
          <BrainCircuit className="w-7 h-7 sm:w-8 sm:h-8 xl:w-9 xl:h-9 text-violet-300/60 drop-shadow-[0_0_6px_rgba(167,139,250,0.3)]" />
        </div>
      </div>

      {/* ══════════════════════════════════════════
          HERO SECTION
         ══════════════════════════════════════════ */}
      <section className="relative w-full pt-16 pb-10 px-4 z-10 text-center">
        {/* Hero glow orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/6 rounded-full filter blur-[100px] pointer-events-none animate-float-slow" />
        <div className="absolute top-10 left-1/2 -translate-x-1/3 w-[400px] h-[250px] bg-indigo-500/5 rounded-full filter blur-[80px] pointer-events-none animate-float-slow-reverse" />

        {/* Animated hero icon */}
        <div className="relative flex items-center justify-center mb-6 animate-fade-in-up">
          <div className="absolute w-24 h-24 rounded-full border border-emerald-500/10 animate-orbit" />
          <div className="absolute w-16 h-16 rounded-full border border-teal-500/12 animate-orbit-reverse" />
          <div className="absolute w-20 h-20 rounded-full bg-emerald-500/8 animate-pulse-ring" />
          <div className="absolute w-20 h-20 rounded-full bg-emerald-500/6 animate-pulse-ring" style={{ animationDelay: '0.6s' }} />
          <div className="relative z-10 bg-gradient-to-tr from-emerald-500/20 to-teal-500/15 p-5 rounded-3xl border border-emerald-500/25 shadow-2xl animate-neon-border">
            <HeartPulse className="w-10 h-10 text-emerald-400 animate-heartbeat" />
          </div>
        </div>

        {/* Headline — no "Your", no badge */}
        <div className="animate-fade-in-up" style={{ animationDelay: '60ms' }}>
          <h1 className="font-headline font-extrabold tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.06] max-w-4xl mx-auto">
            <span className="headline-gradient">Virtual</span>
            <span className="text-white"> Health Assistant</span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="mt-4 text-slate-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed font-medium animate-fade-in-up" style={{ animationDelay: '120ms' }}>
          AI-powered symptom analysis, personalised recovery plans,
          and an intelligent doctor directory — all in one place.
        </p>
      </section>

      {/* ══════════════════════════════════════════
          SYMPTOM CHECKER SECTION
         ══════════════════════════════════════════ */}
      <section id="checker" className="relative w-full max-w-5xl mx-auto px-4 pb-12 z-10">
        <div className="animate-fade-in-up [animation-delay:80ms]">
          <SymptomCheckerForm />
        </div>
      </section>

      {/* Glowing divider */}
      <div className="w-full max-w-5xl mx-auto px-4 z-10">
        <div className="glow-divider" />
      </div>

      {/* ══════════════════════════════════════════
          DOCTOR DIRECTORY SECTION
         ══════════════════════════════════════════ */}
      <section id="doctor-directory" className="relative w-full max-w-5xl mx-auto px-4 py-12 z-10">
        <div className="animate-fade-in-up [animation-delay:100ms]">
          <DoctorDirectory />
        </div>
      </section>

      {/* Minimal footer line */}
      <footer className="relative w-full z-10 border-t border-white/5 py-6 text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-slate-700">
          <Heart className="w-3.5 h-3.5 text-rose-500/50 animate-heartbeat" />
          <span>© {new Date().getFullYear()} Virtual Health Assistant — Demo only, not for real medical use.</span>
        </div>
      </footer>
    </div>
  );
}
