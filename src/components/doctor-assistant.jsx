'use client';
import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Activity, MessageSquare, Heart, ChevronDown, ChevronUp, X } from 'lucide-react';

const INDIAN_DOCTOR_NAMES = [
  'Dr. Aarav Mehta', 'Dr. Priya Sharma', 'Dr. Amit Patel', 'Dr. Sneha Reddy',
  'Dr. Sanjay Sen', 'Dr. Neha Gupta', 'Dr. Vikram Malhotra', 'Dr. Kavita Joshi',
  'Dr. Anil Verma', 'Dr. Divya Iyer',
];

export function DoctorAssistant({ state = 'idle', details = '', doctorName = 'Dr. Amit Patel' }) {
  const [bubbleText, setBubbleText]         = useState('');
  const [displayedText, setDisplayedText]   = useState('');
  const [isOpen, setIsOpen]                 = useState(true);
  const [position, setPosition]             = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging]         = useState(false);
  const [dragStart, setDragStart]           = useState({ x: 0, y: 0 });
  const [userClosed, setUserClosed]         = useState(false);
  const [isScrolled, setIsScrolled]         = useState(false);
  const [scrollY, setScrollY]               = useState(0);
  const [viewport, setViewport]             = useState({ width: 1440, height: 900 });
  const [portalTarget, setPortalTarget]     = useState(null);
  const [prevState, setPrevState]           = useState(state);

  useEffect(() => { setPortalTarget(document.body); }, []);

  /* ── Drag handlers ── */
  const handleMouseDown = (e) => {
    if (state === 'thinking') return;
    if (e.target.closest('button') || e.target.closest('svg') || e.target.closest('a')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, position]);

  /* ── Scroll tracking ── */
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isScrolled && state !== 'thinking') setIsOpen(false);
    else if (!isScrolled && !userClosed) setIsOpen(true);
  }, [isScrolled, userClosed, state]);

  /* ── Viewport tracking ── */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /* ── Bubble text by state ── */
  useEffect(() => {
    const messages = {
      typing:   'I am listening closely. Please describe your symptoms in detail, including how long they have persisted.',
      adding:   details ? `"${details}" has been added to your symptom checklist. Any other symptoms to include?` : 'Symptom recorded. Please continue describing any other discomfort.',
      thinking: details ? `Analysing: "${details}". Cross-referencing our clinical database to build your recovery plan…` : 'Analysing your symptoms against our medical database. Just a moment.',
      success:  'Assessment complete. I have highlighted the most probable conditions and recommended next steps below.',
      cleared:  'Your symptom checklist has been cleared. How are you feeling today?',
      booking:  'Connecting you with a specialist. Please select a convenient appointment date and time.',
      idle:     'Hello! I am your Virtual Health Assistant. Select or describe your symptoms and I will prepare a full assessment.',
    };
    setBubbleText(messages[state] || messages.idle);
  }, [state, details]);

  /* ── Typewriter effect ── */
  useEffect(() => {
    let current = '';
    let index   = 0;
    setDisplayedText('');
    const interval = setInterval(() => {
      if (index < bubbleText.length) {
        current += bubbleText.charAt(index);
        setDisplayedText(current);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 10);
    return () => clearInterval(interval);
  }, [bubbleText]);

  /* ── Auto-open on state change ── */
  useEffect(() => {
    if (state !== 'idle') { setIsOpen(true); setUserClosed(false); }
  }, [state]);

  const isThinking = state === 'thinking';
  const isMobile   = viewport.width < 1024;
  const GAP        = isMobile ? 12 : 20;

  /* ── Container position style ── */
  let containerStyle;
  if (isThinking) {
    containerStyle = {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      cursor: 'default',
      transition: 'top 0.4s cubic-bezier(0.16, 1, 0.3, 1), left 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    };
  } else if (isScrolled) {
    const floatOffset = Math.sin(scrollY * 0.015) * 5;
    containerStyle = {
      position: 'fixed',
      bottom: `${GAP + floatOffset}px`,
      right: `${GAP}px`,
      top: 'auto',
      transform: 'none',
      cursor: isDragging ? 'grabbing' : 'grab',
      transition: isDragging ? 'none' : 'bottom 0.05s linear',
    };
  } else {
    containerStyle = {
      position: 'fixed',
      top: `${72 + position.y}px`,
      right: `${GAP}px`,
      transform: 'none',
      cursor: isDragging ? 'grabbing' : 'grab',
      transition: isDragging ? 'none' : 'top 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    };
  }

  if (!portalTarget) return null;

  return createPortal(
    <>
      {/* Dim backdrop while thinking */}
      {isThinking && <div className="thinking-backdrop" />}

      <div
        onMouseDown={!isScrolled && !isThinking ? handleMouseDown : undefined}
        style={containerStyle}
        className={`z-50 flex flex-col items-end gap-3 select-none ${isOpen ? 'w-[290px]' : 'w-auto'}`}
      >
        {isOpen ? (
          /* ── Expanded Card ── */
          <div className="w-full rounded-3xl border border-white/12 overflow-hidden bg-slate-950/90 backdrop-blur-2xl shadow-[0_24px_60px_rgba(0,0,0,0.6),0_0_0_1px_rgba(16,185,129,0.08)] transition-all duration-300 animate-fade-in-up">

            {/* Top accent strip */}
            <div className={`h-[2px] ${isThinking ? 'bg-gradient-to-r from-amber-500 via-orange-400 to-amber-500' : 'bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500'}`} />

            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {/* Status dot with pulse ring */}
                  <div className="relative flex items-center justify-center w-4 h-4">
                    <span className={`absolute w-4 h-4 rounded-full opacity-40 animate-pulse-ring ${isThinking ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                    <span className={`relative w-2 h-2 rounded-full ${isThinking ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isThinking ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {isThinking ? 'Analysing…' : 'Online'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-emerald-500/10 border border-emerald-500/15 px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <Activity className="w-2.5 h-2.5 animate-pulse" />
                    {doctorName}
                  </div>
                  <button
                    onClick={() => { setIsOpen(false); setUserClosed(true); }}
                    className="w-6 h-6 rounded-full hover:bg-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-colors"
                    aria-label="Minimise"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Speech bubble */}
              <div className="relative bg-white/4 border border-white/8 rounded-2xl p-3 mb-4 text-[11px] leading-relaxed text-slate-300 min-h-[72px] shadow-sm">
                {/* Tail */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[7px] border-t-white/8" />
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="font-medium">
                    {displayedText}
                    <span className="animate-pulse font-bold text-emerald-400 ml-0.5">|</span>
                  </div>
                </div>
              </div>

              {/* Doctor Avatar */}
              <div className={`flex justify-center ${state === 'idle' ? 'animate-doctor-bounce' : ''} ${isThinking ? 'animate-pulse' : ''}`}>
                <div className="relative w-20 h-20">
                  {/* Glow ring behind avatar */}
                  <div className={`absolute inset-0 rounded-full blur-md opacity-40 ${isThinking ? 'bg-amber-400/30' : 'bg-emerald-400/20'}`} />
                  <div className="relative w-full h-full rounded-full bg-slate-900/80 border border-white/10 shadow-[inset_0_4px_10px_rgba(0,0,0,0.7)] overflow-hidden flex items-center justify-center">
                    {/* Holographic radial bg */}
                    <div className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_30%_30%,rgba(16,185,129,0.12),transparent_70%)]" />

                    {/* Scan line when thinking */}
                    {isThinking && (
                      <div className="absolute left-3 right-3 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_8px_rgba(16,185,129,1)] animate-scan-line pointer-events-none z-30" />
                    )}

                    {/* ── Premium Doctor SVG ── */}
                    <svg viewBox="0 0 80 96" className="w-[72px] h-[86px] relative z-20 select-none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        {/* Skin gradient — warm 3D sphere shading */}
                        <radialGradient id="d-skin" cx="38%" cy="32%" r="58%">
                          <stop offset="0%"   stopColor="#ffe8d6" />
                          <stop offset="55%"  stopColor="#f4c5a8" />
                          <stop offset="100%" stopColor="#d4956a" />
                        </radialGradient>
                        {/* Hair gradient */}
                        <linearGradient id="d-hair" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%"   stopColor="#2d1b0e" />
                          <stop offset="60%"  stopColor="#1a0f07" />
                          <stop offset="100%" stopColor="#0d0703" />
                        </linearGradient>
                        {/* White coat */}
                        <linearGradient id="d-coat" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%"   stopColor="#f8fafc" />
                          <stop offset="50%"  stopColor="#e2e8f0" />
                          <stop offset="100%" stopColor="#cbd5e1" />
                        </linearGradient>
                        {/* Teal scrub shirt */}
                        <linearGradient id="d-scrub" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%"   stopColor="#0d9488" />
                          <stop offset="100%" stopColor="#0f766e" />
                        </linearGradient>
                        {/* Chrome stethoscope tube */}
                        <linearGradient id="d-stet" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%"   stopColor="#475569" />
                          <stop offset="45%"  stopColor="#94a3b8" />
                          <stop offset="100%" stopColor="#334155" />
                        </linearGradient>
                        {/* Head mirror disc */}
                        <radialGradient id="d-mirror" cx="30%" cy="28%" r="70%">
                          <stop offset="0%"   stopColor="#ffffff" />
                          <stop offset="35%"  stopColor="#e2e8f0" />
                          <stop offset="100%" stopColor="#64748b" />
                        </radialGradient>
                        {/* Cheek blush */}
                        <radialGradient id="d-blush" cx="50%" cy="50%" r="50%">
                          <stop offset="0%"   stopColor="#f9a8b4" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#f9a8b4" stopOpacity="0" />
                        </radialGradient>
                        <filter id="d-shadow" x="-15%" y="-15%" width="130%" height="130%">
                          <feDropShadow dx="0" dy="1.5" stdDeviation="1.8" floodColor="#000" floodOpacity="0.28" />
                        </filter>
                        <filter id="d-glow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="1" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>

                      {/* ── Body / White coat base ── */}
                      <path d="M8 96 C8 76, 18 70, 26 68 L38 65 L54 68 C62 70, 72 76, 72 96 Z"
                        fill="url(#d-coat)" filter="url(#d-shadow)" />

                      {/* Coat lapels */}
                      <path d="M38 65 L28 74 L24 96" fill="white" stroke="#cbd5e1" strokeWidth="0.5" />
                      <path d="M38 65 L48 74 L52 96" fill="white" stroke="#cbd5e1" strokeWidth="0.5" />

                      {/* Teal scrub visible under coat */}
                      <path d="M28 74 L38 70 L48 74 L52 96 L24 96 Z" fill="url(#d-scrub)" />

                      {/* Coat shadow fold lines */}
                      <path d="M24 75 C22 82, 20 90, 18 96" stroke="#94a3b8" strokeWidth="0.6" fill="none" opacity="0.6" />
                      <path d="M52 75 C54 82, 56 90, 58 96" stroke="#94a3b8" strokeWidth="0.6" fill="none" opacity="0.6" />

                      {/* ── Neck ── */}
                      <path d="M33 56 C33 56, 32 61, 30 65 L38 67 L46 65 C44 61, 43 56, 43 56 Z"
                        fill="#ebbfa0" />

                      {/* Collar/shirt */}
                      <path d="M30 65 C32 63, 38 62, 46 65 L48 68 L28 68 Z" fill="#0d9488" />

                      {/* ── Head ── */}
                      <ellipse cx="39" cy="34" rx="15" ry="17" fill="url(#d-skin)" filter="url(#d-shadow)" />
                      {/* Ear left */}
                      <ellipse cx="24.5" cy="34" rx="2.2" ry="3.2" fill="#e8b491" />
                      <ellipse cx="24.8" cy="34" rx="1.1" ry="2" fill="#d4956a" />
                      {/* Ear right */}
                      <ellipse cx="53.5" cy="34" rx="2.2" ry="3.2" fill="#e8b491" />
                      <ellipse cx="53.2" cy="34" rx="1.1" ry="2" fill="#d4956a" />

                      {/* Cheek blush */}
                      <ellipse cx="28" cy="37" rx="4.5" ry="3" fill="url(#d-blush)" />
                      <ellipse cx="50" cy="37" rx="4.5" ry="3" fill="url(#d-blush)" />

                      {/* ── Hair ── */}
                      {/* Hair cap base */}
                      <path d="M24.5 29 C24 20, 28 14, 39 14 C50 14, 54 20, 53.5 29 C50 22, 44 20, 39 20 C34 20, 28 22, 24.5 29 Z"
                        fill="url(#d-hair)" filter="url(#d-shadow)" />
                      {/* Side burn lines */}
                      <path d="M24.5 29 C24 32, 24 35, 24.5 37" stroke="#2d1b0e" strokeWidth="1.2" fill="none" opacity="0.5" />
                      <path d="M53.5 29 C54 32, 54 35, 53.5 37" stroke="#2d1b0e" strokeWidth="1.2" fill="none" opacity="0.5" />
                      {/* Hair highlight */}
                      <path d="M32 16 C35 14.5, 41 14, 44 16" stroke="#5c3317" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />

                      {/* ── Head mirror ── */}
                      <circle cx="40" cy="21" r="4.5" fill="url(#d-mirror)" stroke="#94a3b8" strokeWidth="0.7" filter="url(#d-glow)" />
                      {/* Mirror hole */}
                      <circle cx="40" cy="21" r="1.1" fill="#0f172a" opacity="0.6" />
                      {/* Mirror highlight */}
                      <circle cx="38.5" cy="19.5" r="1" fill="white" opacity="0.85" />

                      {/* ── Eyebrows ── */}
                      <path d="M29.5 29 C30.5 28, 33 27.5, 34.5 28.5" stroke="#2d1b0e" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                      <path d="M43.5 28.5 C45 27.5, 47.5 28, 48.5 29" stroke="#2d1b0e" strokeWidth="1.5" strokeLinecap="round" fill="none" />

                      {/* ── Eyes ── */}
                      {/* Eye whites */}
                      <ellipse cx="32" cy="33" rx="4" ry="2.8" fill="white" stroke="#64748b" strokeWidth="0.5" />
                      <ellipse cx="46" cy="33" rx="4" ry="2.8" fill="white" stroke="#64748b" strokeWidth="0.5" />
                      {/* Irises */}
                      <circle cx="32" cy="33.3" r="2.1" fill="#1e3a5f" />
                      <circle cx="46" cy="33.3" r="2.1" fill="#1e3a5f" />
                      {/* Pupils */}
                      <circle cx="32" cy="33.3" r="1.1" fill="#0a0a12" />
                      <circle cx="46" cy="33.3" r="1.1" fill="#0a0a12" />
                      {/* Eye highlights */}
                      <circle cx="31.2" cy="32.5" r="0.55" fill="white" opacity="0.95" />
                      <circle cx="45.2" cy="32.5" r="0.55" fill="white" opacity="0.95" />
                      {/* Upper eyelid line */}
                      <path d="M28 31.5 C29 30, 32 29.8, 36 31.5" stroke="#334155" strokeWidth="0.7" fill="none" />
                      <path d="M42 31.5 C43 30, 46 29.8, 50 31.5" stroke="#334155" strokeWidth="0.7" fill="none" />
                      {/* Lower lash hint */}
                      <path d="M28.2 34.8 C30 35.5, 34 35.5, 35.8 34.8" stroke="#94a3b8" strokeWidth="0.5" fill="none" opacity="0.5" />
                      <path d="M42.2 34.8 C44 35.5, 48 35.5, 49.8 34.8" stroke="#94a3b8" strokeWidth="0.5" fill="none" opacity="0.5" />

                      {/* ── Nose ── */}
                      <path d="M39 34 L37.5 40 C37.5 40, 38.5 41.5, 39 41.5 C39.5 41.5, 40.5 40, 40.5 40 Z"
                        stroke="#c8856a" strokeWidth="0.8" fill="none" strokeLinecap="round" />
                      <ellipse cx="37" cy="40.5" rx="1.5" ry="1" fill="#c8856a" opacity="0.4" />
                      <ellipse cx="41" cy="40.5" rx="1.5" ry="1" fill="#c8856a" opacity="0.4" />

                      {/* ── Mouth ── */}
                      {state === 'thinking'
                        ? <path d="M35 45 L43 45" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
                        : <>
                            {/* Upper lip */}
                            <path d="M35 44 C36.5 43, 38 43.5, 39 44 C40 43.5, 41.5 43, 43 44"
                              stroke="#b06060" strokeWidth="0.8" fill="none" />
                            {/* Smile */}
                            <path d="M35 44 C36.5 47, 41.5 47, 43 44"
                              fill="#fbb6b6" stroke="#b06060" strokeWidth="0.7" />
                            {/* Teeth hint */}
                            <path d="M36.5 44.5 L41.5 44.5" stroke="white" strokeWidth="0.9" strokeLinecap="round" opacity="0.6" />
                          </>
                      }

                      {/* ── Stethoscope ── */}
                      {/* Ear tubes arcing over shoulders */}
                      <path d="M29 56 C26 52, 24 48, 23 44" stroke="url(#d-stet)" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                      <path d="M49 56 C52 52, 54 48, 55 44" stroke="url(#d-stet)" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                      {/* Ear tips */}
                      <circle cx="23" cy="43.5" r="2" fill="#64748b" stroke="#94a3b8" strokeWidth="0.6" />
                      <circle cx="55" cy="43.5" r="2" fill="#64748b" stroke="#94a3b8" strokeWidth="0.6" />
                      {/* Chest tube going to diaphragm */}
                      <path d="M29 56 C30 61, 34 65, 38 67" stroke="url(#d-stet)" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                      <path d="M49 56 C48 61, 44 65, 38 67" stroke="url(#d-stet)" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                      <path d="M38 67 L38 72" stroke="url(#d-stet)" strokeWidth="2" fill="none" />
                      {/* Diaphragm (chest piece) */}
                      <circle cx="38" cy="73.5" r="3.8" fill="url(#d-mirror)" stroke="#64748b" strokeWidth="0.8" filter="url(#d-glow)" />
                      <circle cx="38" cy="73.5" r="2" fill="#94a3b8" />
                      <circle cx="37" cy="72.5" r="0.8" fill="white" opacity="0.7" />
                    </svg>
                  </div>

                  {/* Heartbeat indicator */}
                  <div className="absolute -bottom-1 right-0 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-full p-1.5 shadow-lg shadow-rose-500/30 border border-rose-400/50 z-30">
                    <Heart className="w-2.5 h-2.5 fill-white animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ── Minimised Pill ── */
          <button
            onClick={() => { setIsOpen(true); setUserClosed(false); }}
            className="flex items-center gap-2.5 bg-slate-950/95 hover:bg-slate-900 border border-white/10 hover:border-emerald-500/40 pl-1 pr-4 py-1 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.6)] group transition-all duration-200 hover:scale-[1.04] hover:shadow-[0_12px_40px_rgba(16,185,129,0.18)]"
            aria-label="Expand Assistant"
          >
            {/* Mini avatar */}
            <div className="relative flex-shrink-0 w-10 h-10 rounded-full bg-slate-900 border border-white/10 overflow-hidden flex items-center justify-center">
            {/* ── Premium Mini Doctor SVG ── */}
            <svg viewBox="0 0 80 96" className="absolute inset-0 w-full h-full z-10 select-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="m-skin" cx="38%" cy="32%" r="58%">
                  <stop offset="0%"   stopColor="#ffe8d6" />
                  <stop offset="55%"  stopColor="#f4c5a8" />
                  <stop offset="100%" stopColor="#d4956a" />
                </radialGradient>
                <linearGradient id="m-hair" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%"   stopColor="#2d1b0e" />
                  <stop offset="100%" stopColor="#0d0703" />
                </linearGradient>
                <linearGradient id="m-coat" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%"   stopColor="#f8fafc" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </linearGradient>
                <linearGradient id="m-scrub" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#0d9488" />
                  <stop offset="100%" stopColor="#0f766e" />
                </linearGradient>
                <radialGradient id="m-mirror" cx="30%" cy="28%" r="70%">
                  <stop offset="0%"   stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#64748b" />
                </radialGradient>
              </defs>
              {/* Body */}
              <path d="M10 96 C10 76, 20 70, 28 68 L38 65 L52 68 C60 70, 70 76, 70 96 Z" fill="url(#m-coat)" />
              <path d="M38 65 L29 74 L25 96" fill="white" />
              <path d="M38 65 L47 74 L51 96" fill="white" />
              <path d="M29 74 L38 70 L47 74 L51 96 L25 96 Z" fill="url(#m-scrub)" />
              {/* Neck */}
              <path d="M34 56 C34 60, 32 64, 30 67 L38 69 L46 67 C44 64, 42 60, 42 56 Z" fill="#ebbfa0" />
              {/* Head */}
              <ellipse cx="39" cy="33" rx="15" ry="17" fill="url(#m-skin)" />
              {/* Ears */}
              <ellipse cx="24.5" cy="33" rx="2" ry="3" fill="#e8b491" />
              <ellipse cx="53.5" cy="33" rx="2" ry="3" fill="#e8b491" />
              {/* Hair */}
              <path d="M24.5 28 C24 19, 28 13, 39 13 C50 13, 54 19, 53.5 28 C50 21, 44 19, 39 19 C34 19, 28 21, 24.5 28 Z" fill="url(#m-hair)" />
              {/* Head mirror */}
              <circle cx="40" cy="20" r="4" fill="url(#m-mirror)" stroke="#94a3b8" strokeWidth="0.6" />
              <circle cx="40" cy="20" r="1" fill="#0f172a" opacity="0.5" />
              <circle cx="38.5" cy="18.5" r="0.8" fill="white" opacity="0.9" />
              {/* Eyebrows */}
              <path d="M29.5 27.5 C31 26.5, 33 26, 34.5 27" stroke="#2d1b0e" strokeWidth="1.3" strokeLinecap="round" fill="none" />
              <path d="M43.5 27 C45 26, 47 26.5, 48.5 27.5" stroke="#2d1b0e" strokeWidth="1.3" strokeLinecap="round" fill="none" />
              {/* Eyes */}
              <ellipse cx="32" cy="32" rx="3.8" ry="2.6" fill="white" />
              <ellipse cx="46" cy="32" rx="3.8" ry="2.6" fill="white" />
              <circle cx="32" cy="32.2" r="1.9" fill="#1e3a5f" />
              <circle cx="46" cy="32.2" r="1.9" fill="#1e3a5f" />
              <circle cx="32" cy="32.2" r="1" fill="#070d18" />
              <circle cx="46" cy="32.2" r="1" fill="#070d18" />
              <circle cx="31.2" cy="31.3" r="0.5" fill="white" opacity="0.95" />
              <circle cx="45.2" cy="31.3" r="0.5" fill="white" opacity="0.95" />
              {/* Nose */}
              <path d="M39 33 L37.8 38.5 C38.5 40, 39.5 40, 40.2 38.5 Z" stroke="#c8856a" strokeWidth="0.7" fill="none" strokeLinecap="round" />
              {/* Smile */}
              <path d="M34.5 43 C36 46.5, 42 46.5, 43.5 43" stroke="#b06060" strokeWidth="1" fill="none" strokeLinecap="round" />
            </svg>
              {/* Online dot */}
              <div className="absolute top-0.5 right-0.5 h-2.5 w-2.5 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse" />
            </div>

            {/* Label */}
            <div className="flex flex-col items-start">
              <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1">
                <span className="w-1 h-1 bg-emerald-400 rounded-full" />
                Assistant
              </span>
              <span className="text-[11px] font-semibold text-slate-100 group-hover:text-white whitespace-nowrap transition-colors leading-tight">
                {doctorName}
              </span>
            </div>
          </button>
        )}
      </div>
    </>,
    portalTarget
  );
}
