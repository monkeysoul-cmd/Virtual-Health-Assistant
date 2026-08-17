'use client';
import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Activity, MessageSquare, Heart, ChevronDown, ChevronUp, X, Stethoscope } from 'lucide-react';

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
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, -50%)',
      cursor: 'default',
      zIndex: 50,
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
      zIndex: 50,
      cursor: isDragging ? 'grabbing' : 'grab',
      transition: isDragging ? 'none' : 'bottom 0.05s linear',
    };
  } else {
    containerStyle = {
      position: 'fixed',
      top: `${72 + position.y}px`,
      right: `${GAP}px`,
      transform: 'none',
      zIndex: 50,
      cursor: isDragging ? 'grabbing' : 'grab',
      transition: isDragging ? 'none' : 'top 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    };
  }

  if (!portalTarget) return null;

  return createPortal(
    <>
      {/* Dim backdrop while thinking */}
      {isThinking && <div className="thinking-backdrop" style={{ zIndex: 49 }} />}

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

                    {/* ── Male Doctor SVG ── */}
                    <svg viewBox="0 0 80 90" className="w-full h-full relative z-20 select-none" xmlns="http://www.w3.org/2000/svg">
                      {/* White coat — wider masculine shoulders */}
                      <path d="M8 90 C8 67 20 60 29 58 L40 55 L51 58 C60 60 72 67 72 90 Z" fill="#e2e8f0"/>
                      {/* Left lapel */}
                      <path d="M40 55 L27 64 L21 90" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="0.8"/>
                      {/* Right lapel */}
                      <path d="M40 55 L53 64 L59 90" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="0.8"/>
                      {/* Scrub / shirt */}
                      <path d="M27 64 L40 59 L53 64 L59 90 L21 90 Z" fill={isThinking ? '#d97706' : '#0d9488'}/>
                      {/* Neck — wider/thicker for male */}
                      <rect x="33" y="49" width="14" height="9" rx="3" fill="#c8855a"/>
                      {/* Head — square-ish jaw using a path */}
                      <path d="M24 32 C24 18 30 10 40 10 C50 10 56 18 56 32 C56 39 55 44 51 48 C47 52 43 53 40 53 C37 53 33 52 29 48 C25 44 24 39 24 32 Z" fill="#c8855a"/>
                      {/* Jaw shadow — defines the square jawline */}
                      <path d="M29 48 C32 52 40 54 51 48" stroke="#a06840" strokeWidth="1" fill="none" opacity="0.4"/>
                      {/* Short side-parted hair */}
                      {/* Main hair cap */}
                      <path d="M24.5 29 C24 17 30 9 40 9 C50 9 56 17 55.5 29 C53 21 48 17 40 17 C32 17 27 21 24.5 29 Z" fill="#1a0f07"/>
                      {/* Left side short crop line */}
                      <path d="M24.5 29 C24 33 24 37 25 41" stroke="#1a0f07" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                      {/* Right side short crop line */}
                      <path d="M55.5 29 C56 33 56 37 55 41" stroke="#1a0f07" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                      {/* Hair parting line (left side part) */}
                      <path d="M31 13 C34 11 38 10 40 9" stroke="#3a2010" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6"/>
                      {/* Ears */}
                      <ellipse cx="23.8" cy="34" rx="2.2" ry="3.2" fill="#b87448"/>
                      <ellipse cx="56.2" cy="34" rx="2.2" ry="3.2" fill="#b87448"/>
                      {/* Eyebrows — straight & thick (key male cue) */}
                      <path d="M28.5 27 L36.5 26.5" stroke="#1a0f07" strokeWidth="2.2" strokeLinecap="square" fill="none"/>
                      <path d="M43.5 26.5 L51.5 27" stroke="#1a0f07" strokeWidth="2.2" strokeLinecap="square" fill="none"/>
                      {/* Eyes — slightly narrower/harder */}
                      <ellipse cx="32.5" cy="32" rx="3.8" ry="2.6" fill="white"/>
                      <ellipse cx="47.5" cy="32" rx="3.8" ry="2.6" fill="white"/>
                      <circle cx="32.5" cy="32.3" r="2.1" fill="#1e3a5f"/>
                      <circle cx="47.5" cy="32.3" r="2.1" fill="#1e3a5f"/>
                      <circle cx="31.7" cy="31.5" r="0.72" fill="white" opacity="0.88"/>
                      <circle cx="46.7" cy="31.5" r="0.72" fill="white" opacity="0.88"/>
                      {/* Nose — wider/more defined for male */}
                      <path d="M40 33 L38.5 39" stroke="#9a6040" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
                      <path d="M40 33 L41.5 39" stroke="#9a6040" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
                      <path d="M36.5 39.5 C38 40.5 42 40.5 43.5 39.5" stroke="#9a6040" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
                      <ellipse cx="37.5" cy="39.5" rx="1.5" ry="1" fill="#9a6040" opacity="0.35"/>
                      <ellipse cx="42.5" cy="39.5" rx="1.5" ry="1" fill="#9a6040" opacity="0.35"/>
                      {/* Mouth — thinner, more neutral (male) */}
                      {isThinking
                        ? <path d="M36 44 L44 44" stroke="#f59e0b" strokeWidth="1.7" strokeLinecap="round"/>
                        : <path d="M36 44 C38 45.8 42 45.8 44 44" stroke="#8a5540" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
                      }
                      {/* Stubble dots on jaw (subtle) */}
                      <circle cx="32" cy="46" r="0.6" fill="#7a4a30" opacity="0.45"/>
                      <circle cx="36" cy="47.5" r="0.6" fill="#7a4a30" opacity="0.45"/>
                      <circle cx="40" cy="48" r="0.6" fill="#7a4a30" opacity="0.45"/>
                      <circle cx="44" cy="47.5" r="0.6" fill="#7a4a30" opacity="0.45"/>
                      <circle cx="48" cy="46" r="0.6" fill="#7a4a30" opacity="0.45"/>
                      {/* Stethoscope */}
                      <path d="M28 53 C25 48 24 44 25 41" stroke="#64748b" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
                      <path d="M52 53 C55 48 56 44 55 41" stroke="#64748b" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
                      <circle cx="25" cy="40.5" r="2" fill="#475569"/>
                      <circle cx="55" cy="40.5" r="2" fill="#475569"/>
                      <path d="M28 53 C30 58 35 61 40 62" stroke="#64748b" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
                      <path d="M52 53 C50 58 45 61 40 62" stroke="#64748b" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
                      <circle cx="40" cy="63.5" r="3.5" fill="#94a3b8" stroke="#64748b" strokeWidth="0.8"/>
                      <circle cx="40" cy="63.5" r="1.5" fill="#cbd5e1"/>
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
            {/* ── Male Mini Doctor SVG ── */}
            <svg viewBox="0 0 80 90" className="absolute inset-0 w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
              {/* Coat — wider masculine shoulders */}
              <path d="M8 90 C8 67 20 60 29 58 L40 55 L51 58 C60 60 72 67 72 90 Z" fill="#e2e8f0"/>
              <path d="M40 55 L27 64 L21 90" fill="#f1f5f9"/>
              <path d="M40 55 L53 64 L59 90" fill="#f1f5f9"/>
              <path d="M27 64 L40 59 L53 64 L59 90 L21 90 Z" fill="#0d9488"/>
              {/* Neck */}
              <rect x="33" y="49" width="14" height="9" rx="3" fill="#c8855a"/>
              {/* Head — square jaw path */}
              <path d="M24 32 C24 18 30 10 40 10 C50 10 56 18 56 32 C56 39 55 44 51 48 C47 52 43 53 40 53 C37 53 33 52 29 48 C25 44 24 39 24 32 Z" fill="#c8855a"/>
              {/* Short side-parted hair */}
              <path d="M24.5 29 C24 17 30 9 40 9 C50 9 56 17 55.5 29 C53 21 48 17 40 17 C32 17 27 21 24.5 29 Z" fill="#1a0f07"/>
              <path d="M24.5 29 C24 33 24 37 25 41" stroke="#1a0f07" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              <path d="M55.5 29 C56 33 56 37 55 41" stroke="#1a0f07" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              {/* Ears */}
              <ellipse cx="23.8" cy="34" rx="2.2" ry="3.2" fill="#b87448"/>
              <ellipse cx="56.2" cy="34" rx="2.2" ry="3.2" fill="#b87448"/>
              {/* Eyebrows — straight & thick */}
              <path d="M28.5 27 L36.5 26.5" stroke="#1a0f07" strokeWidth="2.2" strokeLinecap="square" fill="none"/>
              <path d="M43.5 26.5 L51.5 27" stroke="#1a0f07" strokeWidth="2.2" strokeLinecap="square" fill="none"/>
              {/* Eyes */}
              <ellipse cx="32.5" cy="32" rx="3.8" ry="2.6" fill="white"/>
              <ellipse cx="47.5" cy="32" rx="3.8" ry="2.6" fill="white"/>
              <circle cx="32.5" cy="32.3" r="2.1" fill="#1e3a5f"/>
              <circle cx="47.5" cy="32.3" r="2.1" fill="#1e3a5f"/>
              <circle cx="31.7" cy="31.5" r="0.72" fill="white" opacity="0.88"/>
              <circle cx="46.7" cy="31.5" r="0.72" fill="white" opacity="0.88"/>
              {/* Nose */}
              <path d="M40 33 L38.5 39" stroke="#9a6040" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
              <path d="M40 33 L41.5 39" stroke="#9a6040" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
              <path d="M36.5 39.5 C38 40.5 42 40.5 43.5 39.5" stroke="#9a6040" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
              {/* Mouth — thin/neutral */}
              <path d="M36 44 C38 45.8 42 45.8 44 44" stroke="#8a5540" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
              {/* Stubble dots */}
              <circle cx="32" cy="46" r="0.6" fill="#7a4a30" opacity="0.45"/>
              <circle cx="36" cy="47.5" r="0.6" fill="#7a4a30" opacity="0.45"/>
              <circle cx="40" cy="48" r="0.6" fill="#7a4a30" opacity="0.45"/>
              <circle cx="44" cy="47.5" r="0.6" fill="#7a4a30" opacity="0.45"/>
              <circle cx="48" cy="46" r="0.6" fill="#7a4a30" opacity="0.45"/>
              {/* Stethoscope */}
              <path d="M28 53 C25 48 24 44 25 41" stroke="#64748b" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
              <path d="M52 53 C55 48 56 44 55 41" stroke="#64748b" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
              <circle cx="25" cy="40.5" r="2" fill="#475569"/>
              <circle cx="55" cy="40.5" r="2" fill="#475569"/>
              <path d="M28 53 C30 58 35 61 40 62" stroke="#64748b" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
              <path d="M52 53 C50 58 45 61 40 62" stroke="#64748b" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
              <circle cx="40" cy="63.5" r="3.5" fill="#94a3b8" stroke="#64748b" strokeWidth="0.8"/>
              <circle cx="40" cy="63.5" r="1.5" fill="#cbd5e1"/>
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
