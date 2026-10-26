import React from 'react';
import { ShieldCheck, Cpu, FileText } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  return (
    <footer className="mt-20 border-t border-gray-200 bg-white text-gray-600 py-12 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-gray-900 text-base">OpenHealth AI Clinical Suite</span>
            <span className="text-xs text-[#048C7A] px-2 py-0.5 rounded bg-[#E6F7F5] border border-[#05AD98]/30 font-mono font-medium">
              Academic v2.5
            </span>
          </div>
          <p className="text-xs text-gray-500 max-w-md">
            Developed for clinical triage research, machine learning evaluation, and academic defense.
            Not intended as a sole replacement for certified physician diagnosis.
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs text-gray-600">
          <button 
            onClick={() => setActiveTab('viva-metrics')} 
            className="hover:text-[#05AD98] flex items-center gap-1.5 transition text-left"
          >
            <FileText className="w-3.5 h-3.5 text-[#05AD98]" />
            <span>Viva & Model Benchmarks</span>
          </button>
          <button 
            onClick={() => setActiveTab('diagnostics')} 
            className="hover:text-[#05AD98] flex items-center gap-1.5 transition text-left"
          >
            <Cpu className="w-3.5 h-3.5 text-[#05AD98]" />
            <span>Multi-Disease Suite</span>
          </button>
          <button 
            onClick={() => setActiveTab('chatbot')} 
            className="hover:text-[#05AD98] flex items-center gap-1.5 transition text-left"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#05AD98]" />
            <span>Local Clinical KB</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
