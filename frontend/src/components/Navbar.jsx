import React from 'react';
import { 
  Activity, 
  Stethoscope, 
  Scan, 
  Utensils, 
  MessageSquare, 
  GraduationCap
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, systemOnline }) {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: Activity },
    { id: 'diagnostics', label: 'Diagnostics', icon: Stethoscope },
    { id: 'radiology', label: 'Imaging PACS', icon: Scan },
    { id: 'diet', label: 'Clinical Diet', icon: Utensils },
    { id: 'chatbot', label: 'Medical AI', icon: MessageSquare },
    { 
      id: 'viva-metrics', 
      label: 'Viva & Research', 
      icon: GraduationCap, 
      highlight: true 
    },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#090d16]/85 border-b border-white/[0.08] px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Identity */}
        <div 
          onClick={() => setActiveTab('dashboard')} 
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-sky-400 to-teal-400 p-[1px] shadow-lg shadow-sky-500/20 group-hover:shadow-sky-500/40 transition duration-300">
            <div className="w-full h-full bg-[#0a0f1d] rounded-[11px] flex items-center justify-center">
              <Activity className="w-5 h-5 text-sky-400 group-hover:scale-110 transition duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[17px] tracking-tight text-white group-hover:text-sky-300 transition">
                OpenHealth<span className="text-sky-400">AI</span>
              </span>
              <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/20">
                CLINICAL PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Multi-Disease Diagnostic & Triage Platform
            </p>
          </div>
        </div>

        {/* Navigation Floating Tabs */}
        <nav className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/60 border border-white/[0.06] overflow-x-auto max-w-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? item.highlight
                      ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                      : 'bg-sky-500/15 text-sky-300 border border-sky-500/30 shadow-sm'
                    : item.highlight
                    ? 'text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 border border-transparent'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? (item.highlight ? 'text-indigo-400' : 'text-sky-400') : ''}`} />
                <span>{item.label}</span>
                {item.highlight && (
                  <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-indigo-500/30 text-indigo-200">
                    Defense
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Engine Status Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-white/10 text-xs font-medium">
          <span className={`w-2 h-2 rounded-full ${systemOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <span className="text-slate-300 text-[11px] font-mono">
            {systemOnline ? '6 ML Engines Ready' : 'Connecting...'}
          </span>
        </div>
      </div>
    </header>
  );
}
