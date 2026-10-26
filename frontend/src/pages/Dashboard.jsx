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
  ArrowUpRight,
  Sparkles,
  Zap
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
      accent: 'text-[#0D9488] bg-[#CCFBF1] border-[#0D9488]/30',
      tagColor: 'bg-teal-50 text-[#0F766E] border-teal-200'
    },
    {
      id: 'heart',
      name: 'Coronary Artery Disease',
      category: 'Cardiology',
      dataset: 'Cleveland Clinic Database',
      desc: 'Ischemic stenosis assessment using exercise-induced angina, thallium scintigraphy, and ST depression.',
      stat: '83.6% Accuracy',
      icon: HeartPulse,
      accent: 'text-[#EA580C] bg-[#FFEDD5] border-[#F97316]/30',
      tagColor: 'bg-orange-50 text-[#C2410C] border-orange-200'
    },
    {
      id: 'parkinsons',
      name: 'Parkinson\'s Disease',
      category: 'Neuromotor Biomarkers',
      dataset: 'UCI Biomedical Speech Cohort',
      desc: 'Phonetic vocal dynamics analyzing fundamental frequency jitter, shimmer, and recurrence period density entropy.',
      stat: '92.3% Accuracy',
      icon: Brain,
      accent: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      tagColor: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    },
    {
      id: 'bcancer',
      name: 'Breast Cytopathology',
      category: 'Oncological Profiling',
      dataset: 'Wisconsin Diagnostic FNA',
      desc: 'Nuclear morphological feature analysis including mean radius, perimeter, concavity, and compactness.',
      stat: '95.6% Accuracy',
      icon: Dna,
      accent: 'text-pink-600 bg-pink-50 border-pink-200',
      tagColor: 'bg-pink-50 text-pink-700 border-pink-200'
    },
    {
      id: 'liver',
      name: 'Hepatic Disease Profile',
      category: 'Hepatology',
      dataset: 'Indian Liver Patient Registry',
      desc: 'Serum bilirubin, alkaline phosphatase, transaminases (ALT/SGPT, AST/SGOT), and albumin/globulin ratios.',
      stat: '72.7% Accuracy',
      icon: Activity,
      accent: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      id: 'kidney',
      name: 'Chronic Kidney Disease',
      category: 'Nephrology',
      dataset: 'UCI CKD Clinical Cohort',
      desc: 'Glomerular filtration metrics, serum creatinine, microalbuminuria, hypertension history, and hematocrit.',
      stat: '100% Benchmark',
      icon: ShieldCheck,
      accent: 'text-[#0D9488] bg-[#CCFBF1] border-[#0D9488]/30',
      tagColor: 'bg-teal-50 text-[#0F766E] border-teal-200'
    }
  ];

  const handleLaunchDisease = (id) => {
    if (setSelectedDisease) setSelectedDisease(id);
    setActiveTab('diagnostics');
  };

  return (
    <div className="space-y-10">
      {/* Dynamic Hero Banner with Coral Pulse Badge */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-white via-slate-50 to-[#CCFBF1]/40 border border-slate-200/90 p-8 lg:p-12 shadow-sm">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#F97316]/30 shadow-xs text-[#C2410C] text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#F97316] animate-ping" />
            <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
            Distributed Clinical AI Platform
          </div>

          <h1 className="text-3xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            High-Precision Multi-Disease <span className="text-[#0D9488]">Diagnostics</span> & <span className="text-[#EA580C]">Clinical PACS</span>
          </h1>

          <p className="text-slate-600 text-sm lg:text-base leading-relaxed">
            Integrating machine learning classifiers calibrated across 6 systemic medical cohorts,
            computer vision Brain MRI & Chest X-Ray radiological triage, personalized clinical nutrition,
            and an offline evidence-based clinical intelligence assistant.
          </p>

          <div className="flex flex-wrap items-center gap-3.5 pt-3">
            <button 
              onClick={() => setActiveTab('diagnostics')}
              className="btn-pop"
            >
              <Zap className="w-4 h-4 text-white" />
              <span>Launch Diagnostics Studio</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button 
              onClick={() => setActiveTab('radiology')}
              className="btn-primary"
            >
              <Scan className="w-4 h-4 text-white" />
              <span>Imaging PACS Workstation</span>
            </button>

            <button 
              onClick={() => setActiveTab('viva-metrics')}
              className="btn-secondary"
            >
              <GraduationCap className="w-4 h-4 text-[#0D9488]" />
              <span>Viva & Research Defense</span>
            </button>
          </div>
        </div>

        {/* Ambient background glow & grid */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#0D9488]/10 blur-3xl pointer-events-none" />
        <div className="absolute right-10 -bottom-20 w-80 h-80 rounded-full bg-[#F97316]/10 blur-3xl pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-[0.06] pointer-events-none hidden lg:block bg-[radial-gradient(#0D9488_1px,transparent_1px)] [background-size:16px_16px]" />
      </section>

      {/* 4 Performance Metric Cards with Warm/Cool Dynamics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 space-y-2 border-l-4 border-l-[#0D9488]">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Tabular ML Engines</span>
            <div className="p-1.5 rounded-lg bg-[#CCFBF1] text-[#0D9488]">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">6 Models</div>
          <p className="text-xs text-slate-500">Cost-sensitive balanced Random Forest classifiers</p>
        </div>

        <div className="glass-panel p-5 space-y-2 border-l-4 border-l-[#F97316]">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Radiology CV</span>
            <div className="p-1.5 rounded-lg bg-[#FFEDD5] text-[#EA580C]">
              <Scan className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">MRI & X-Ray</div>
          <p className="text-xs text-slate-500">Glioma, Meningioma, Pituitary & Pneumonia</p>
        </div>

        <div className="glass-panel p-5 space-y-2 border-l-4 border-l-indigo-500">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Intelligence Mode</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">100% Offline</div>
          <p className="text-xs text-slate-500">Zero cloud latency & total patient data confidentiality</p>
        </div>

        <div className="glass-panel p-5 space-y-2 border-l-4 border-l-[#10B981]">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Peak Benchmark</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#0D9488] font-mono">95.6% - 100%</div>
          <p className="text-xs text-slate-500">Holdout cross-validated on UCI & Wisconsin sets</p>
        </div>
      </section>

      {/* Multi-Disease Diagnostics Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Clinical Diagnostic Pipelines</h2>
            <p className="text-xs text-slate-500">Trained and validated on verified global clinical cohorts</p>
          </div>
          <button 
            onClick={() => setActiveTab('diagnostics')} 
            className="text-xs text-[#0D9488] hover:text-[#0F766E] font-bold flex items-center gap-1 transition"
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
                    <span className={`text-[11px] font-bold font-mono px-2.5 py-0.5 rounded-full border ${d.tagColor}`}>
                      {d.stat}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold text-[#0D9488] uppercase tracking-wider block mb-0.5">{d.category}</span>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0D9488] transition mb-1">
                    {d.name}
                  </h3>
                  <div className="text-[10px] font-mono text-slate-500 mb-2 flex items-center gap-1 font-medium">
                    <Database className="w-3 h-3 text-slate-500" />
                    <span>{d.dataset}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {d.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0D9488] group-hover:text-[#EA580C] transition">
                  <span>Enter Diagnostic Assessment</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Radiology PACS Highlight Banner with Warm Coral Accent Button */}
      <section className="glass-panel p-8 bg-linear-to-r from-slate-900 via-slate-900 to-[#042F2E] border-slate-800 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#5EEAD4] uppercase tracking-wider">
            <Scan className="w-4 h-4 text-[#F97316]" />
            <span>PACS Computer Vision Workstation</span>
          </div>
          <h3 className="text-xl font-bold text-white">Brain MRI Tumour Detection & Chest X-Ray Triage</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Evaluates verified MRI scans (Glioma, Meningioma, Pituitary, Normal) and Chest X-Rays (Bacterial Pneumonia, Radiolucent Normal) with interactive PACS filters (Raw, Contrast Enhancement, Inverted Negative).
          </p>
        </div>
        <button 
          onClick={() => setActiveTab('radiology')}
          className="btn-pop shrink-0"
        >
          <Scan className="w-4 h-4" />
          <span>Open Imaging PACS</span>
        </button>
      </section>
    </div>
  );
}
