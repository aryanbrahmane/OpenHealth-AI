import React from 'react';
import { ShieldCheck, Heart, Cpu, FileText } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  return (
    <footer className="mt-20 border-t border-white/10 bg-slate-950/90 text-slate-400 py-12 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-white text-base">OpenHealth AI Clinical Suite</span>
            <span className="text-xs text-sky-400 px-2 py-0.5 rounded bg-sky-950/60 border border-sky-800/60 font-mono">
              Academic v2.5
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-md">
            Developed for clinical triage research, machine learning evaluation, and academic defense.
            Not intended as a sole replacement for certified physician diagnosis.
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-400">
          <button 
            onClick={() => setActiveTab('viva-metrics')} 
            className="hover:text-indigo-400 flex items-center gap-1.5 transition text-left"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span>Viva & Model Benchmarks</span>
          </button>
          <button 
            onClick={() => setActiveTab('diagnostics')} 
            className="hover:text-sky-400 flex items-center gap-1.5 transition text-left"
          >
            <Cpu className="w-3.5 h-3.5 text-sky-400" />
            <span>Multi-Disease Suite</span>
          </button>
          <button 
            onClick={() => setActiveTab('chatbot')} 
            className="hover:text-teal-400 flex items-center gap-1.5 transition text-left"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>Local Clinical KB</span>
          </button>
        </div>
      </div>
    </footer>
  );
}

