import React from 'react';
import { 
  Activity, 
  Stethoscope, 
  Scan, 
  Utensils, 
  MessageSquare, 
  GraduationCap,
  Sparkles
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
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/95 border-b border-slate-200/90 shadow-xs px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Identity with Pulse Indicator */}
        <div 
          onClick={() => setActiveTab('dashboard')} 
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-[#0D9488] via-[#0F766E] to-[#2DD4BF] p-[1.5px] shadow-md shadow-[#0D9488]/25 group-hover:shadow-[#0D9488]/40 transition duration-300">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-[#0D9488] group-hover:scale-110 transition duration-300" />
              </div>
            </div>
            {/* Standout Coral Pulse Dot */}
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F97316] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#F97316] ring-2 ring-white" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[17px] tracking-tight text-slate-900 group-hover:text-[#0D9488] transition">
                OpenHealth<span className="text-[#0D9488]">AI</span>
              </span>
              <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#CCFBF1] text-[#0F766E] border border-[#0D9488]/30">
                CLINICAL PRO
              </span>
              <span className="hidden xl:inline-flex items-center gap-1 text-[9px] font-extrabold tracking-wider px-2 py-0.5 rounded-md bg-[#FFEDD5] text-[#C2410C] border border-[#F97316]/30">
                <Sparkles className="w-2.5 h-2.5 text-[#F97316]" />
                LIVE ML
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Multi-Disease Diagnostic & PACS Triage Platform
            </p>
          </div>
        </div>

        {/* Navigation Floating Tabs */}
        <nav className="flex items-center gap-1 p-1 rounded-xl bg-slate-100/90 border border-slate-200 overflow-x-auto max-w-full">
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
                      ? 'bg-linear-to-r from-[#0F172A] to-[#1E293B] text-white shadow-sm font-bold'
                      : 'bg-[#0D9488] text-white shadow-sm font-bold'
                    : item.highlight
                    ? 'text-slate-700 hover:text-[#0D9488] hover:bg-white/80 border border-transparent'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? (item.highlight ? 'text-[#F97316]' : 'text-white') : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.highlight && !isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* System Status Pill */}
        <div className="hidden md:flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold">
            <span className={`w-2 h-2 rounded-full ${systemOnline ? 'bg-[#0D9488] ring-4 ring-[#0D9488]/20 animate-pulse' : 'bg-[#F97316]'}`} />
            <span className={systemOnline ? 'text-slate-700' : 'text-[#EA580C]'}>
              {systemOnline ? '6 ML Models Active' : 'Connecting Engine...'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
