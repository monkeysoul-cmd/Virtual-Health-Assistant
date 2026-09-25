import React from 'react';
import { HeartPulse } from 'lucide-react';

/**
 * Main Hero Header section with pulsing animated badges and headline
 */
export function HeroSection() {
  return (
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

      {/* Headline */}
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
  );
}

export default HeroSection;
