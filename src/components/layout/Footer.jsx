import React from 'react';
import { Heart } from 'lucide-react';

/**
 * Site footer with clinical disclaimer
 */
export function Footer() {
  return (
    <footer className="relative w-full z-10 border-t border-white/5 py-6 text-center">
      <div className="flex items-center justify-center gap-2 text-sm text-slate-700">
        <Heart className="w-3.5 h-3.5 text-rose-500/50 animate-heartbeat" />
        <span>© {new Date().getFullYear()} Virtual Health Assistant — Demo only, not for real medical use.</span>
      </div>
    </footer>
  );
}

export default Footer;
