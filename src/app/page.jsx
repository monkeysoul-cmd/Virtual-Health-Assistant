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

      {/* ── Floating health icons — side gutters ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Right column — each icon a distinct but very subtle theme color */}
        <Stethoscope  className="absolute top-[8%]  right-[2%] w-9  h-9" style={{ color: 'rgba(45,212,191,0.12)', animationDelay: '0s'   }} />
        <HeartPulse   className="absolute top-[22%] right-[2%] w-8  h-8  animate-float-slow-reverse will-change-transform" style={{ color: 'rgba(251,113,133,0.10)', animationDelay: '1.2s' }} />
        <Thermometer  className="absolute top-[38%] right-[2%] w-7  h-7  animate-float             will-change-transform" style={{ color: 'rgba(251,191,36,0.09)',  animationDelay: '0.6s' }} />
        <Microscope   className="absolute top-[54%] right-[3%] w-10 h-10 animate-float-slow         will-change-transform" style={{ color: 'rgba(52,211,153,0.10)',  animationDelay: '2s'   }} />
        <FlaskConical className="absolute top-[70%] right-[2%] w-7  h-7  animate-float-slow-reverse will-change-transform" style={{ color: 'rgba(129,140,248,0.10)', animationDelay: '3s'   }} />
        <Scan         className="absolute top-[85%] right-[2%] w-8  h-8  animate-float             will-change-transform" style={{ color: 'rgba(45,212,191,0.09)',  animationDelay: '1.8s' }} />
        {/* Left column */}
        <Pill         className="absolute top-[6%]  left-[2%] w-8  h-8  animate-float-slow-reverse will-change-transform" style={{ color: 'rgba(99,102,241,0.10)',  animationDelay: '0.4s' }} />
        <Activity     className="absolute top-[20%] left-[2%] w-9  h-9  animate-float             will-change-transform" style={{ color: 'rgba(52,211,153,0.11)',  animationDelay: '1s'   }} />
        <Syringe      className="absolute top-[36%] left-[2%] w-7  h-7  animate-float-slow         will-change-transform" style={{ color: 'rgba(45,212,191,0.09)',  animationDelay: '2.2s' }} />
        <Heart        className="absolute top-[52%] left-[2%] w-8  h-8  animate-float-slow-reverse will-change-transform" style={{ color: 'rgba(251,113,133,0.09)', animationDelay: '0.8s' }} />
        <Droplets     className="absolute top-[68%] left-[2%] w-7  h-7  animate-float             will-change-transform" style={{ color: 'rgba(96,165,250,0.09)',  animationDelay: '3.5s' }} />
        <BrainCircuit className="absolute top-[83%] left-[2%] w-9  h-9  animate-float-slow         will-change-transform" style={{ color: 'rgba(167,139,250,0.09)', animationDelay: '1.5s' }} />
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
