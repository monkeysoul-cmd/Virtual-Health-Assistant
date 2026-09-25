'use client';
import React, { useEffect, useState } from 'react';

/**
 * Animated Diagnostic Likelihood Progress Bar
 * @param {{ value: number, color?: 'emerald' | 'amber' | 'rose' }} props
 */
export function LikelihoodBar({ value, color = 'emerald' }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(value), 80);
    return () => clearTimeout(timer);
  }, [value]);

  const colorMap = {
    emerald: 'from-emerald-500 to-teal-400',
    amber: 'from-amber-500 to-yellow-400',
    rose: 'from-rose-500 to-red-400',
  };

  return (
    <div className="likelihood-bar-track w-full mt-1.5 h-1.5 bg-slate-800 rounded-full overflow-hidden">
      <div
        className={`likelihood-bar-fill h-full rounded-full bg-gradient-to-r ${colorMap[color] || colorMap.emerald}`}
        style={{ width: `${width}%`, transition: 'width 0.9s cubic-bezier(0.16, 1, 0.3, 1)' }}
      />
    </div>
  );
}

export default LikelihoodBar;
