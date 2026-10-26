import React from 'react';

export default function RiskGauge({ probability = 0, isRisk = false, riskLevel = 'LOW RISK' }) {
  const prob = Math.min(100, Math.max(0, probability));
  const radius = 68;
  const strokeWidth = 9;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (prob / 100) * circumference;

  let strokeColor = '#05AD98';
  let glowColor = 'rgba(5, 173, 152, 0.25)';
  let textColor = 'text-[#05AD98]';
  let badgeBg = 'bg-[#E6F7F5] border-[#05AD98]/30 text-[#048C7A]';

  if (prob >= 70) {
    strokeColor = '#EF4444';
    glowColor = 'rgba(239, 68, 68, 0.25)';
    textColor = 'text-rose-600';
    badgeBg = 'bg-rose-50 border-rose-200 text-rose-700';
  } else if (prob >= 40) {
    strokeColor = '#F59E0B';
    glowColor = 'rgba(245, 158, 11, 0.25)';
    textColor = 'text-amber-600';
    badgeBg = 'bg-amber-50 border-amber-200 text-amber-700';
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
      <div className="relative flex items-center justify-center my-1">
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
          {/* Base track */}
          <circle
            stroke="#E5E7EB"
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
              filter: `drop-shadow(0 0 6px ${glowColor})`
            }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>

        {/* Center Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-black tracking-tight text-slate-900 font-mono">
            {prob.toFixed(1)}%
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Probability
          </span>
        </div>
      </div>

      {/* Risk Badge */}
      <div className={`mt-3 px-3 py-1 rounded-full border text-xs font-bold tracking-wide uppercase ${badgeBg}`}>
        {riskLevel}
      </div>

      <p className="text-[11px] text-slate-600 mt-2 text-center max-w-[200px] font-medium">
        {isRisk 
          ? 'Physiological biomarkers indicate elevated pathological classification.' 
          : 'Values fall within calibrated baseline physiological limits.'}
      </p>
    </div>
  );
}
