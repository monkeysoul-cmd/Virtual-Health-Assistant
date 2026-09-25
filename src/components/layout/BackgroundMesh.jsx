import React from 'react';

/**
 * Ambient background mesh with radial gradients and floating glow orbs
 */
export function BackgroundMesh() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black" />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 25v10M25 30h10' stroke='%2310b981' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      />
      <div className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-emerald-500/8 rounded-full filter blur-[140px] animate-float-slow will-change-transform" />
      <div className="absolute top-1/3 -right-48 w-[700px] h-[700px] bg-indigo-500/6 rounded-full filter blur-[160px] animate-float-slow-reverse will-change-transform" />
      <div className="absolute -bottom-48 left-1/4 w-[500px] h-[500px] bg-teal-500/6 rounded-full filter blur-[120px] animate-float-slow will-change-transform" />
    </div>
  );
}

export default BackgroundMesh;
