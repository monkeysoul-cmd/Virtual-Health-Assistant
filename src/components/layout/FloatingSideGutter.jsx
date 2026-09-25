import React from 'react';
import {
  HeartPulse, Activity, Stethoscope, Pill, Heart, Thermometer,
  Syringe, Microscope, Droplets, FlaskConical, Scan, BrainCircuit,
} from 'lucide-react';

/**
 * Animated clinical and medical equipment icons floating in side gutters (desktop only)
 */
export function FloatingSideGutter() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-60 hidden xl:block">
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
  );
}

export default FloatingSideGutter;
