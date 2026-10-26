import React, { useState, useEffect } from 'react';
import { 
  Utensils, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  Printer, 
  Coffee, 
  Sun, 
  Sunset, 
  Moon,
  Sparkles
} from 'lucide-react';
import { fetchDiet, fetchDietConditions } from '../services/api';

export default function DietLifestyle({ defaultCondition = 'diabetes' }) {
  const [conditions, setConditions] = useState([]);
  const [selectedCondition, setSelectedCondition] = useState(defaultCondition);
  const [subtype, setSubtype] = useState('Standard Clinical');
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDietConditions()
      .then(data => {
        if (data.conditions) setConditions(data.conditions);
      })
      .catch(err => console.log('Error loading conditions:', err));
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchDiet(selectedCondition, subtype)
      .then(data => setPlan(data))
      .catch(err => console.log('Error loading diet plan:', err))
      .finally(() => setLoading(false));
  }, [selectedCondition, subtype]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CCFBF1] border border-[#0D9488]/30 text-[#0F766E] text-xs font-bold uppercase tracking-wider mb-2">
            <Utensils className="w-3.5 h-3.5 text-[#F97316]" />
            Clinical Nutrition & Lifestyle Engine
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Personalized Clinical Dietary Protocols
          </h1>
          <p className="text-sm text-slate-500">
            Evidence-based nutritional schedules and clinical precautions tailored to systemic pathologies.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="btn-secondary text-xs w-fit"
        >
          <Printer className="w-3.5 h-3.5 text-[#0D9488]" />
          <span>Print Clinical Diet Prescription</span>
        </button>
      </div>

      {/* Disease Selection Pills with Standout Accent */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {conditions.map((c) => {
          const isSel = selectedCondition === c.key;
          return (
            <button
              key={c.key}
              onClick={() => setSelectedCondition(c.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isSel
                  ? 'bg-linear-to-r from-[#0D9488] to-[#0F766E] text-white shadow-md shadow-[#0D9488]/20 scale-105'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {c.subtitle || c.title.split(' ')[0]}
            </button>
          );
        })}
      </div>

      {/* Plan Display */}
      {plan && (
        <div className="space-y-8">
          {/* Plan Title Banner */}
          <div className="glass-panel p-6 bg-linear-to-r from-white via-slate-50 to-[#CCFBF1]/30 border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-[#0F766E] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
                  Targeted Pathological Protocol
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">
                  {plan.title}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Clinical classification: <strong className="text-slate-700">{plan.condition_name}</strong>
                </p>
              </div>

              {/* Subtype selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">Regimen Phase:</span>
                <select
                  value={subtype}
                  onChange={(e) => setSubtype(e.target.value)}
                  className="bg-white border border-slate-300 text-xs rounded-lg px-3 py-1.5 text-slate-800 font-semibold focus:outline-none focus:border-[#0D9488]"
                >
                  <option value="Standard Clinical">Standard Clinical</option>
                  <option value="Acute Recovery Phase">Acute Recovery Phase</option>
                  <option value="Long-term Maintenance">Long-term Maintenance</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2-Column: Foods to Eat vs Foods to Avoid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Foods to Eat */}
            <div className="glass-panel p-6 space-y-4 border-[#0D9488]/30 bg-white border-t-4 border-t-[#0D9488] shadow-sm">
              <div className="flex items-center gap-2 text-[#0D9488] pb-3 border-b border-slate-100">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <h3 className="text-base font-bold text-slate-900">Beneficial Foods to Prioritize</h3>
              </div>
              <ul className="space-y-3">
                {plan.foods_to_eat?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488] mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Foods to Avoid */}
            <div className="glass-panel p-6 space-y-4 border-rose-200 bg-white border-t-4 border-t-rose-500 shadow-sm">
              <div className="flex items-center gap-2 text-rose-600 pb-3 border-b border-slate-100">
                <XCircle className="w-5 h-5 shrink-0" />
                <h3 className="text-base font-bold text-slate-900">Foods & Compounds to Restrict</h3>
              </div>
              <ul className="space-y-3">
                {plan.foods_to_avoid?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Daily 4-Meal Plan Grid */}
          <div className="glass-panel p-6 space-y-4 bg-white shadow-sm">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <Clock className="w-5 h-5 text-[#0D9488]" />
              <span>Evidence-Based 24-Hour Meal Schedule</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 hover:border-[#F97316]/50 transition">
                <div className="flex items-center gap-2 text-[#EA580C] font-bold text-xs uppercase tracking-wider">
                  <Sun className="w-4 h-4 text-[#F97316]" />
                  <span>Breakfast (08:00)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {plan.meal_plan?.breakfast}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 hover:border-[#0D9488]/50 transition">
                <div className="flex items-center gap-2 text-[#0D9488] font-bold text-xs uppercase tracking-wider">
                  <Coffee className="w-4 h-4 text-[#0D9488]" />
                  <span>Lunch (13:00)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {plan.meal_plan?.lunch}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 hover:border-[#F97316]/50 transition">
                <div className="flex items-center gap-2 text-[#EA580C] font-bold text-xs uppercase tracking-wider">
                  <Sunset className="w-4 h-4 text-[#F97316]" />
                  <span>Afternoon Snack (16:30)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {plan.meal_plan?.snack}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 hover:border-[#0D9488]/50 transition">
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                  <Moon className="w-4 h-4" />
                  <span>Dinner (19:30)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {plan.meal_plan?.dinner}
                </p>
              </div>
            </div>
          </div>

          {/* Clinical Precautions with Warm Amber/Coral Accent */}
          <div className="glass-panel p-6 space-y-3 bg-[#FFEDD5]/40 border border-[#F97316]/30 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#EA580C]" />
              <span>Mandatory Clinical Precautions & Monitoring</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {plan.precautions?.map((p, idx) => (
                <div key={idx} className="p-3.5 rounded-lg bg-white border border-[#F97316]/20 text-xs text-slate-700 flex items-start gap-2.5 shadow-xs">
                  <span className="font-bold text-[#EA580C] font-mono text-xs">0{idx + 1}.</span>
                  <span className="leading-relaxed">{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
