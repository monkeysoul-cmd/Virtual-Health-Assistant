'use client';
import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Activity, MessageSquare, Heart, ChevronDown, ChevronUp, UserCheck } from 'lucide-react';

const INDIAN_DOCTOR_NAMES = [
  'Dr. Aarav Mehta',
  'Dr. Priya Sharma',
  'Dr. Amit Patel',
  'Dr. Sneha Reddy',
  'Dr. Sanjay Sen',
  'Dr. Neha Gupta',
  'Dr. Vikram Malhotra',
  'Dr. Kavita Joshi',
  'Dr. Anil Verma',
  'Dr. Divya Iyer'
];

export function DoctorAssistant({ state = 'idle', details = '', doctorName = 'Dr. Amit Patel' }) {
  const [bubbleText, setBubbleText] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [userClosed, setUserClosed] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [viewport, setViewport] = useState({ width: 1440, height: 900 });
  // Portal target — only available after mount (client-side)
  const [portalTarget, setPortalTarget] = useState(null);

  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  const handleMouseDown = (e) => {
    if (state === 'thinking') return;
    if (e.target.closest('button') || e.target.closest('svg') || e.target.closest('a')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

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

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Don't collapse the window while actively analyzing — keep it open and centered
    if (isScrolled && state !== 'thinking') {
      setIsOpen(false);
    } else if (!isScrolled && !userClosed) {
      setIsOpen(true);
    }
  }, [isScrolled, userClosed, state]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setViewport({ width: window.innerWidth, height: window.innerHeight });
      };
      window.addEventListener('resize', handleResize);
      handleResize(); // Initial calculation
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Optimize and check spelling of dialog responses
  useEffect(() => {
    let text = '';
    switch (state) {
      case 'typing':
        text = "I am listening closely. Please describe your symptoms in detail, including how long they have persisted.";
        break;
      case 'adding':
        text = details 
          ? `I have successfully added "${details}" to your symptoms checklist. Are there any other symptoms you would like to include?`
          : "Symptom recorded. Please continue describing any other discomfort you are experiencing.";
        break;
      case 'thinking':
        text = details
          ? `Analyzing your symptom(s): "${details}". Cross-referencing against our advanced clinical database to construct a recovery plan.`
          : "Analyzing your symptoms against our medical database. This will only take a moment.";
        break;
      case 'success':
        text = "The assessment is complete. I have highlighted the most probable conditions and listed recommended next steps below.";
        break;
      case 'cleared':
        text = "The symptom checklist has been cleared. How are you feeling today?";
        break;
      case 'booking':
        text = "Connecting you with a specialist. Please select a convenient appointment date and time.";
        break;
      case 'idle':
      default:
        text = "Hello! I am your Virtual Health Assistant. Please select your symptoms or describe them in the text area, and I will prepare an assessment.";
        break;
    }
    setBubbleText(text);
  }, [state, details]);

  // Typewriter effect for dialog
  useEffect(() => {
    let currentText = '';
    let index = 0;
    setDisplayedText('');
    const interval = setInterval(() => {
      if (index < bubbleText.length) {
        currentText += bubbleText.charAt(index);
        setDisplayedText(currentText);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 15);
    return () => clearInterval(interval);
  }, [bubbleText]);

  // Trigger expansion when states change to draw user attention
  useEffect(() => {
    if (state !== 'idle') {
      setIsOpen(true);
      setUserClosed(false);
    }
  }, [state]);

  const isThinking = state === 'thinking';
  const isMobile = viewport.width < 1024;
  const GAP = isMobile ? 12 : 20;

  // Build inline style depending on state
  let containerStyle;

  if (isThinking) {
    // Center the full card on screen while analyzing
    containerStyle = {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      cursor: 'default',
      transition: 'top 0.4s cubic-bezier(0.16, 1, 0.3, 1), left 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    };
  } else if (isScrolled) {
    // Subtle floating: bottom offset oscillates gently with scrollY
    const floatOffset = Math.sin(scrollY * 0.015) * 6; // ±6px sine wave
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
    // Default: top-right expanded card
    containerStyle = {
      position: 'fixed',
      top: `${4 + position.y}px`,
      right: `${GAP}px`,
      transform: 'none',
      cursor: isDragging ? 'grabbing' : 'grab',
      transition: isDragging ? 'none' : 'top 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    };
  }





  // Only render after client-side mount so portal target exists
  if (!portalTarget) return null;

  return createPortal(
    <>
      {/* Dim backdrop behind card while analyzing */}
      {isThinking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 pointer-events-none transition-opacity duration-300" />
      )}
      <div
        onMouseDown={!isScrolled && !isThinking ? handleMouseDown : undefined}
        style={containerStyle}
        className={`z-50 flex flex-col items-end gap-3 select-none ${
          isOpen ? 'w-[280px]' : 'w-auto'
        }`}
      >

      {/* Floating expanded dialogue card */}
      {isOpen ? (
        <div className="w-full glass-card p-4 rounded-3xl border border-white/15 flex flex-col items-center justify-between relative overflow-hidden bg-slate-950/85 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300 animate-fade-in-up">
          {/* Neon gradient mesh behind header */}
          <div className="absolute -top-10 -left-10 w-28 h-28 bg-emerald-500/10 rounded-full filter blur-2xl pointer-events-none" />

          {/* Header Panel */}
          <div className="w-full flex items-center justify-between mb-4 border-b border-white/10 pb-2.5 z-10">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  state === 'thinking' ? 'bg-amber-400' : 'bg-emerald-400'
                }`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  state === 'thinking' ? 'bg-amber-500' : 'bg-emerald-500'
                }`}></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {state === 'thinking' ? 'Analyzing' : 'Ready'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                <Activity className="w-2.5 h-2.5 animate-pulse" />
                <span>{doctorName}</span>
              </div>
              <button 
                onClick={() => {
                  setIsOpen(false);
                  setUserClosed(true);
                }}
                className="text-slate-400 hover:text-white hover:bg-white/10 p-1 rounded-full transition-colors"
                aria-label="Minimize Assistant"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Speech Bubble */}
          <div className="w-full relative bg-white/5 border border-white/10 p-2.5 rounded-2xl mb-3 text-[11px] leading-relaxed text-slate-200 min-h-[70px] z-10 shadow-sm">
            <div className="absolute -bottom-2.5 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white/5" />
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-t-[9px] border-t-white/10 z-[-1]" />
            
            <div className="flex items-start gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="font-semibold text-slate-200">
                {displayedText}
                <span className="animate-pulse font-bold text-emerald-400 ml-0.5">|</span>
              </div>
            </div>
          </div>

          {/* Real 3D Vector Mascot Viewport wrapped to prevent heart clipping */}
          <div className={`relative w-24 h-24 ${
            state === 'idle' ? 'animate-doctor-bounce' : ''
          } ${
            state === 'thinking' ? 'animate-pulse' : ''
          }`}>
            <div className="w-full h-full rounded-full bg-slate-950/60 border border-white/10 shadow-[inset_0_4px_10px_rgba(0,0,0,0.8),_0_0_20px_rgba(16,185,129,0.15)] overflow-hidden flex items-center justify-center p-2">
              {/* 3D Holographic grid backdrop */}
              <div className="absolute inset-1 rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent opacity-60 pointer-events-none" />
              
              {state === 'thinking' && (
                <div className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_10px_rgba(16,185,129,1)] animate-scan-line pointer-events-none z-30" />
              )}

              {/* Realistic 3D Styled SVG */}
              <svg viewBox="0 0 64 64" className="w-20 h-20 relative z-20 select-none">
              <defs>
                {/* SVG shadow filter */}
                <filter id="svg-shadow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#000" floodOpacity="0.3" />
                </filter>
                
                {/* Head 3D Skin Radial Gradient */}
                <radialGradient id="skin-3d" cx="40%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#ffeedd" />
                  <stop offset="65%" stopColor="#ffd2bd" />
                  <stop offset="100%" stopColor="#e8a384" />
                </radialGradient>

                {/* Shading neck */}
                <linearGradient id="neck-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#cca08d" />
                  <stop offset="100%" stopColor="#ffd2bd" />
                </linearGradient>

                {/* 3D Coat Linear Gradient */}
                <linearGradient id="coat-3d" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="40%" stopColor="#f8fafc" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </linearGradient>

                {/* Stethoscope tube metallic grad */}
                <linearGradient id="metal-tube" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#475569" />
                  <stop offset="50%" stopColor="#94a3b8" />
                  <stop offset="100%" stopColor="#334155" />
                </linearGradient>

                {/* Metallic Head Mirror */}
                <radialGradient id="mirror-3d" cx="30%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="40%" stopColor="#94a3b8" />
                  <stop offset="100%" stopColor="#475569" />
                </radialGradient>
              </defs>

              {/* Head Base */}
              <circle cx="32" cy="26" r="10.5" fill="url(#skin-3d)" filter="url(#svg-shadow)" />

              {/* Ears */}
              <circle cx="21" cy="26" r="2.2" fill="#ffd2bd" />
              <circle cx="43" cy="26" r="2.2" fill="#ffd2bd" />

              {/* Neck */}
              <path d="M28 34.5 C28 34.5, 32 37.5, 36 34.5 L35 37 L29 37 Z" fill="url(#neck-grad)" />

              {/* 3D Hair layer */}
              <path d="M21 24 C20 18, 25 14, 32 14 C39 14, 44 18, 43 24 C41 21.5, 37 21, 32 21 C27 21, 23 21.5, 21 24 Z" fill="#1e293b" filter="url(#svg-shadow)" />

              {/* Doctor mirror reflector */}
              <path d="M23.5 20 C23.5 20, 32 18.5, 40.5 20" stroke="#475569" strokeWidth="2.2" strokeLinecap="round" fill="none" />
              <circle cx="32" cy="18.5" r="4" fill="url(#mirror-3d)" stroke="#cbd5e1" strokeWidth="0.8" filter="url(#svg-shadow)" />
              <circle cx="30.5" cy="17" r="1" fill="#fff" opacity="0.8" />

              {/* Smart Glasses */}
              <path d="M23.5 25.5 C23.5 25.5, 27 24, 28.5 25.5 M31.5 25.5 C31.5 25.5, 33 24, 36.5 25.5" stroke="#334155" strokeWidth="1.2" fill="none" />
              <circle cx="26" cy="26" r="3.5" stroke="#334155" strokeWidth="1.2" fill="rgba(255,255,255,0.25)" filter="url(#svg-shadow)" />
              <circle cx="38" cy="26" r="3.5" stroke="#334155" strokeWidth="1.2" fill="rgba(255,255,255,0.25)" filter="url(#svg-shadow)" />
              <line x1="29.5" y1="26" x2="34.5" y2="26" stroke="#334155" strokeWidth="1" />

              {/* Eyes with blink anim */}
              <g className="animate-doctor-blink" style={{ transformOrigin: '32px 26px' }}>
                <circle cx="26" cy="26" r="1.5" fill="#0f172a" />
                <circle cx="25.5" cy="25.5" r="0.5" fill="#ffffff" />
                <circle cx="38" cy="26" r="1.5" fill="#0f172a" />
                <circle cx="37.5" cy="25.5" r="0.5" fill="#ffffff" />
              </g>

              {/* Nose Shading */}
              <path d="M32 25 L32 29.5 L30.5 29.5" stroke="#cca08d" strokeWidth="1" strokeLinecap="round" fill="none" />

              {/* Smile / Serious */}
              {state === 'thinking' ? (
                <path d="M29.5 32 L34.5 32" stroke="#e11d48" strokeWidth="1.5" strokeLinecap="round" />
              ) : (
                <path d="M29 31 C29 31, 32 34, 35 31" stroke="#e11d48" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              )}

              {/* Shoulders / Torso */}
              <path d="M14 55 C14 46, 20 44, 23 44 L41 44 C44 44, 50 46, 50 55 Z" fill="url(#coat-3d)" filter="url(#svg-shadow)" />
              
              {/* Teal Inner Shirt */}
              <path d="M25 44 L39 44 L35 37 L29 37 Z" fill="#0f766e" />

              {/* Metallic Stethoscope around neck */}
              <path d="M24 35.5 C24 35.5, 25 43.5, 32 43.5 C39 43.5, 40 35.5, 40 35.5" stroke="url(#metal-tube)" strokeWidth="2" strokeLinecap="round" fill="none" />
              <path d="M32 43.5 L32 47.5" stroke="url(#metal-tube)" strokeWidth="1.8" fill="none" />
              <circle cx="32" cy="49" r="3.2" fill="url(#mirror-3d)" stroke="#cbd5e1" strokeWidth="0.8" filter="url(#svg-shadow)" />

              {/* Coat collar folds for 3D overlay */}
              <path d="M20 44 L25 37 L29 44 Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.8" />
              <path d="M44 44 L39 37 L35 44 Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.8" />
            </svg>
            </div>

            {/* Glowing heartbeat indicator (placed outside overflow-hidden to prevent clipping) */}
            <div className="absolute -bottom-1 right-0.5 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-full p-1.5 shadow-lg shadow-rose-500/30 border border-rose-400 z-30">
              <Heart className="w-2.5 h-2.5 fill-white animate-pulse" />
            </div>
          </div>
        </div>
      ) : (
        /* Minimized Pill Bubble — avatar + doctor name at bottom-right */
        <button 
          onClick={() => {
            setIsOpen(true);
            setUserClosed(false);
          }}
          className="flex items-center gap-2.5 bg-slate-950/95 hover:bg-slate-900 border border-emerald-500/30 pl-1 pr-4 py-1 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.6),_0_0_0_1px_rgba(16,185,129,0.1)] group transition-all duration-300 hover:scale-[1.04] hover:border-emerald-500/60 hover:shadow-[0_12px_40px_rgba(16,185,129,0.2)]"
          aria-label="Expand Assistant"
        >
          {/* Avatar circle */}
          <div className="relative flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 border border-white/10 shadow-inner overflow-hidden">
            <svg viewBox="0 0 64 64" className="w-9 h-9 relative z-10 select-none">
              <circle cx="32" cy="26" r="10.5" fill="#ffd2bd" />
              <path d="M21 24 C20 18, 25 14, 32 14 C39 14, 44 18, 43 24 C41 21.5, 37 21, 32 21 C27 21, 23 21.5, 21 24 Z" fill="#1e293b" />
              <path d="M23.5 25.5 C23.5 25.5, 27 24, 28.5 25.5 M31.5 25.5 C31.5 25.5, 33 24, 36.5 25.5" stroke="#334155" strokeWidth="1.2" fill="none" />
              <circle cx="26" cy="26" r="3.5" stroke="#334155" strokeWidth="1.2" fill="rgba(255,255,255,0.2)" />
              <circle cx="38" cy="26" r="3.5" stroke="#334155" strokeWidth="1.2" fill="rgba(255,255,255,0.2)" />
              <circle cx="26" cy="26" r="1" fill="#0f172a" />
              <circle cx="38" cy="26" r="1" fill="#0f172a" />
              <path d="M29 31 C29 31, 32 34, 35 31" stroke="#e11d48" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <path d="M14 55 C14 46, 20 44, 23 44 L41 44 C44 44, 50 46, 50 55 Z" fill="#ffffff" />
            </svg>
            {/* Online indicator */}
            <div className="absolute top-0 right-0 h-2.5 w-2.5 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse" />
          </div>

          {/* Doctor name label */}
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
