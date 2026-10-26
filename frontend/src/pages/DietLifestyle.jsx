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
  Moon
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Utensils className="w-3.5 h-3.5" />
            Clinical Nutrition & Lifestyle Engine
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Personalized Clinical Dietary Protocols
          </h1>
          <p className="text-sm text-slate-400">
            Evidence-based nutritional schedules and clinical precautions tailored to systemic pathologies.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="btn-secondary text-xs w-fit"
        >
          <Printer className="w-3.5 h-3.5 text-sky-400" />
          <span>Print Clinical Diet Prescription</span>
        </button>
      </div>

      {/* Disease Selection Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10">
        {conditions.map((c) => {
          const isSel = selectedCondition === c.key;
          return (
            <button
              key={c.key}
              onClick={() => setSelectedCondition(c.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isSel
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-105'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-white/5'
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
          <div className="glass-panel p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/30 border-emerald-500/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Targeted Pathological Protocol
                </span>
                <h2 className="text-2xl font-black text-white mt-1">
                  {plan.title}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Clinical classification: <strong className="text-slate-200">{plan.condition_name}</strong>
                </p>
              </div>

              {/* Subtype selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Regimen Phase:</span>
                <select
                  value={subtype}
                  onChange={(e) => setSubtype(e.target.value)}
                  className="bg-slate-950 border border-white/10 text-xs rounded-lg px-3 py-1.5 text-slate-200 font-medium"
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
            <div className="glass-panel p-6 space-y-4 border-emerald-500/20">
              <div className="flex items-center gap-2 text-emerald-400 pb-3 border-b border-white/10">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <h3 className="text-base font-bold text-white">Beneficial Foods to Prioritize</h3>
              </div>
              <ul className="space-y-3">
                {plan.foods_to_eat?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Foods to Avoid */}
            <div className="glass-panel p-6 space-y-4 border-rose-500/20">
              <div className="flex items-center gap-2 text-rose-400 pb-3 border-b border-white/10">
                <XCircle className="w-5 h-5 flex-shrink-0" />
                <h3 className="text-base font-bold text-white">Foods & Compounds to Restrict</h3>
              </div>
              <ul className="space-y-3">
                {plan.foods_to_avoid?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Daily 4-Meal Plan Grid */}
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
              <Clock className="w-5 h-5 text-sky-400" />
              <span>Evidence-Based 24-Hour Meal Schedule</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
                  <Sun className="w-4 h-4" />
                  <span>Breakfast (08:00)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {plan.meal_plan?.breakfast}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs uppercase tracking-wider">
                  <Coffee className="w-4 h-4" />
                  <span>Lunch (13:00)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {plan.meal_plan?.lunch}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-orange-400 font-semibold text-xs uppercase tracking-wider">
                  <Sunset className="w-4 h-4" />
                  <span>Afternoon Snack (16:30)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {plan.meal_plan?.snack}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
                  <Moon className="w-4 h-4" />
                  <span>Dinner (19:30)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {plan.meal_plan?.dinner}
                </p>
              </div>
            </div>
          </div>

          {/* Clinical Precautions */}
          <div className="glass-panel p-6 space-y-3 bg-gradient-to-br from-slate-900 to-amber-950/20 border-amber-500/20">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              <span>Mandatory Clinical Precautions & Monitoring</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {plan.precautions?.map((p, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-950/50 border border-white/5 text-xs text-slate-300 flex items-start gap-2">
                  <span className="font-bold text-amber-400 font-mono">0{idx + 1}.</span>
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

