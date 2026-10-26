import React from 'react';

export default function RiskGauge({ probability = 0, isRisk = false, riskLevel = 'LOW RISK' }) {
  const prob = Math.min(100, Math.max(0, probability));
  const radius = 68;
  const strokeWidth = 9;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (prob / 100) * circumference;

  let strokeColor = '#10b981';
  let glowColor = 'rgba(16, 185, 129, 0.3)';
  let textColor = 'text-emerald-400';
  let badgeBg = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';

  if (prob >= 70) {
    strokeColor = '#f43f5e';
    glowColor = 'rgba(244, 63, 94, 0.35)';
    textColor = 'text-rose-400';
    badgeBg = 'bg-rose-500/10 border-rose-500/30 text-rose-400';
  } else if (prob >= 40) {
    strokeColor = '#f59e0b';
    glowColor = 'rgba(245, 158, 11, 0.3)';
    textColor = 'text-amber-400';
    badgeBg = 'bg-amber-500/10 border-amber-500/30 text-amber-400';
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-950/70 rounded-2xl border border-white/[0.08] shadow-2xl relative overflow-hidden">
      <div className="relative flex items-center justify-center my-1">
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
          {/* Base track */}
          <circle
            stroke="rgba(255, 255, 255, 0.06)"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Active progress */}
          <circle
            stroke={strokeColor}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ 
              strokeDashoffset, 
              transition: 'stroke-dashoffset 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
              filter: `drop-shadow(0 0 10px ${glowColor})`
            }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>

        {/* Center Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`text-3xl font-black font-mono tracking-tight ${textColor}`}>
            {prob.toFixed(1)}%
          </span>
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
            Probability Index
          </span>
        </div>
      </div>

      <div className="mt-4 text-center">
        <span className={`inline-block px-3.5 py-1 rounded-full text-[11px] font-bold border tracking-wider uppercase ${badgeBg}`}>
          {riskLevel}
        </span>
      </div>
    </div>
  );
}
