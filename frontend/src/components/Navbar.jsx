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
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/95 border-b border-gray-200/80 shadow-xs px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Identity */}
        <div 
          onClick={() => setActiveTab('dashboard')} 
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-[#05AD98] via-[#048C7A] to-[#8AE2D8] p-[1.5px] shadow-md shadow-[#05AD98]/20 group-hover:shadow-[#05AD98]/40 transition duration-300">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <Activity className="w-5 h-5 text-[#05AD98] group-hover:scale-110 transition duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[17px] tracking-tight text-gray-900 group-hover:text-[#05AD98] transition">
                OpenHealth<span className="text-[#05AD98]">AI</span>
              </span>
              <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#E6F7F5] text-[#048C7A] border border-[#05AD98]/30">
                CLINICAL PRO
              </span>
            </div>
            <p className="text-[11px] text-gray-500 font-medium hidden sm:block">
              Multi-Disease Diagnostic & Triage Platform
            </p>
          </div>
        </div>

        {/* Navigation Floating Tabs */}
        <nav className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 border border-gray-200 overflow-x-auto max-w-full">
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
                      ? 'bg-white text-[#05AD98] shadow-sm border border-gray-200 font-bold'
                      : 'bg-white text-[#05AD98] shadow-sm border border-gray-200 font-bold'
                    : item.highlight
                    ? 'text-gray-600 hover:text-[#05AD98] hover:bg-white/60 border border-transparent'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/60 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#05AD98]' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* System Status Pill */}
        <div className="hidden md:flex items-center gap-2.5 pl-2 border-l border-gray-200">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-xs font-semibold">
            <span className={`w-2 h-2 rounded-full ${systemOnline ? 'bg-[#05AD98] ring-4 ring-[#05AD98]/20 animate-pulse' : 'bg-rose-500'}`} />
            <span className={systemOnline ? 'text-gray-700' : 'text-rose-600'}>
              {systemOnline ? '6 ML Models Active' : 'Connecting Engine...'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
