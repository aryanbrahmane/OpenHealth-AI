import React from 'react';
import { 
  Activity, 
  Stethoscope, 
  Scan, 
  GraduationCap, 
  ShieldCheck, 
  ChevronRight,
  HeartPulse,
  Brain,
  Droplet,
  Dna,
  CheckCircle2,
  Database,
  ArrowUpRight
} from 'lucide-react';

export default function Dashboard({ setActiveTab, setSelectedDisease }) {
  const quickDiseases = [
    {
      id: 'diabetes',
      name: 'Diabetes Mellitus',
      category: 'Metabolic Triage',
      dataset: 'NIH / PIMA Indian Cohort',
      desc: 'Predictive screening based on glycemic variability, oral glucose tolerance, and insulin sensitivity.',
      stat: '75.3% Accuracy',
      icon: Droplet,
      accent: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    },
    {
      id: 'heart',
      name: 'Coronary Artery Disease',
      category: 'Cardiology',
      dataset: 'Cleveland Clinic Database',
      desc: 'Ischemic stenosis assessment using exercise-induced angina, thallium scintigraphy, and ST depression.',
      stat: '83.6% Accuracy',
      icon: HeartPulse,
      accent: 'text-rose-400 bg-rose-500/10 border-rose-500/20'
    },
    {
      id: 'parkinsons',
      name: 'Parkinson\'s Disease',
      category: 'Neuromotor Biomarkers',
      dataset: 'UCI Biomedical Speech Cohort',
      desc: 'Phonetic vocal dynamics analyzing fundamental frequency jitter, shimmer, and recurrence period density entropy.',
      stat: '92.3% Accuracy',
      icon: Brain,
      accent: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
    },
    {
      id: 'bcancer',
      name: 'Breast Cytopathology',
      category: 'Oncological Profiling',
      dataset: 'Wisconsin Diagnostic FNA',
      desc: 'Nuclear morphological feature analysis including mean radius, perimeter, concavity, and compactness.',
      stat: '95.6% Accuracy',
      icon: Dna,
      accent: 'text-pink-400 bg-pink-500/10 border-pink-500/20'
    },
    {
      id: 'liver',
      name: 'Hepatic Disease Profile',
      category: 'Hepatology',
      dataset: 'Indian Liver Patient Registry',
      desc: 'Serum bilirubin, alkaline phosphatase, transaminases (ALT/SGPT, AST/SGOT), and albumin/globulin ratios.',
      stat: '72.7% Accuracy',
      icon: Activity,
      accent: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      id: 'kidney',
      name: 'Chronic Kidney Disease',
      category: 'Nephrology',
      dataset: 'UCI CKD Clinical Cohort',
      desc: 'Glomerular filtration metrics, serum creatinine, microalbuminuria, hypertension history, and hematocrit.',
      stat: '100% Benchmark',
      icon: ShieldCheck,
      accent: 'text-sky-400 bg-sky-500/10 border-sky-500/20'
    }
  ];

  const handleLaunchDisease = (id) => {
    if (setSelectedDisease) setSelectedDisease(id);
    setActiveTab('diagnostics');
  };

  return (
    <div className="space-y-10">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1222] via-[#090d18] to-[#0d1c2d] border border-white/[0.08] p-8 lg:p-12 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/25 text-sky-400 text-xs font-semibold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
            Distributed Clinical AI Platform
          </div>

          <h1 className="text-3xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            High-Precision Multi-Disease Diagnostics & Clinical PACS
          </h1>

          <p className="text-slate-300 text-sm lg:text-base leading-relaxed">
            Integrating machine learning classifiers calibrated across 6 systemic medical cohorts,
            computer vision Brain MRI & Chest X-Ray radiological triage, personalized clinical nutrition,
            and an offline evidence-based clinical intelligence assistant.
          </p>

          <div className="flex flex-wrap items-center gap-3.5 pt-3">
            <button 
              onClick={() => setActiveTab('diagnostics')}
              className="btn-primary"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Launch Diagnostics Studio</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button 
              onClick={() => setActiveTab('radiology')}
              className="btn-secondary"
            >
              <Scan className="w-4 h-4 text-sky-400" />
              <span>Imaging PACS Workstation</span>
            </button>

            <button 
              onClick={() => setActiveTab('viva-metrics')}
              className="px-4 py-2.5 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 hover:bg-indigo-500/20 transition font-semibold text-xs flex items-center gap-2"
            >
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span>Viva & Research Defense</span>
            </button>
          </div>
        </div>

        {/* Subtle grid background */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-[0.04] pointer-events-none hidden lg:block bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
      </section>

      {/* 4 Performance Metric Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Tabular ML Engines</span>
            <Activity className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">6 Models</div>
          <p className="text-xs text-slate-400">Cost-sensitive balanced Random Forest classifiers</p>
        </div>

        <div className="glass-panel p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Radiology CV</span>
            <Scan className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">MRI & X-Ray</div>
          <p className="text-xs text-slate-400">Glioma, Meningioma, Pituitary & Pneumonia</p>
        </div>

        <div className="glass-panel p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Intelligence Mode</span>
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">100% Offline</div>
          <p className="text-xs text-slate-400">Zero cloud latency & total patient data confidentiality</p>
        </div>

        <div className="glass-panel p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Peak Benchmark</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono">95.6% - 100%</div>
          <p className="text-xs text-slate-400">Holdout cross-validated on UCI & Wisconsin sets</p>
        </div>
      </section>

      {/* Multi-Disease Diagnostics Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Clinical Diagnostic Pipelines</h2>
            <p className="text-xs text-slate-400">Trained and validated on verified global clinical cohorts</p>
          </div>
          <button 
            onClick={() => setActiveTab('diagnostics')} 
            className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 transition"
          >
            <span>Open All Pipelines</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickDiseases.map((d) => {
            const Icon = d.icon;
            return (
              <div 
                key={d.id} 
                onClick={() => handleLaunchDisease(d.id)}
                className="glass-panel p-5 cursor-pointer group hover:-translate-y-1 transition duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-xl border ${d.accent}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-full bg-slate-950 text-slate-300 border border-white/10">
                      {d.stat}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block mb-0.5">{d.category}</span>
                  <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition mb-1">
                    {d.name}
                  </h3>
                  <div className="text-[10px] font-mono text-slate-500 mb-2 flex items-center gap-1">
                    <Database className="w-3 h-3 text-slate-500" />
                    <span>{d.dataset}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {d.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-sky-400">
                  <span>Enter Diagnostic Assessment</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Radiology PACS Highlight Banner */}
      <section className="glass-panel p-8 bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/30 border-teal-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-teal-400 uppercase tracking-wider">
            <Scan className="w-4 h-4" />
            <span>PACS Computer Vision Workstation</span>
          </div>
          <h3 className="text-xl font-bold text-white">Brain MRI Tumour Detection & Chest X-Ray Triage</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Evaluates verified MRI scans (Glioma, Meningioma, Pituitary, Normal) and Chest X-Rays (Bacterial Pneumonia, Radiolucent Normal) with interactive PACS filters (Raw, Contrast Enhancement, Inverted Negative).
          </p>
        </div>
        <button 
          onClick={() => setActiveTab('radiology')}
          className="btn-primary flex-shrink-0"
        >
          <Scan className="w-4 h-4" />
          <span>Open Imaging PACS</span>
        </button>
      </section>
    </div>
  );
}
