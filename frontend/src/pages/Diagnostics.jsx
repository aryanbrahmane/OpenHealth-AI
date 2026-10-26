import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  Activity, 
  RotateCcw, 
  Sparkles, 
  AlertCircle, 
  Utensils, 
  Printer, 
  ChevronRight,
  HeartPulse
} from 'lucide-react';
import RiskGauge from '../components/RiskGauge';
import { fetchSchema, predictDisease } from '../services/api';

export default function Diagnostics({ 
  selectedDisease = 'diabetes', 
  setSelectedDisease, 
  setActiveTab 
}) {
  const [schemaData, setSchemaData] = useState(null);
  const [activeDisease, setActiveDisease] = useState(selectedDisease);
  const [formValues, setFormValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedDisease && selectedDisease !== activeDisease) {
      setActiveDisease(selectedDisease);
    }
  }, [selectedDisease]);

  useEffect(() => {
    fetchSchema()
      .then(data => {
        setSchemaData(data);
        initFormForDisease(activeDisease, data.diseases);
      })
      .catch(err => {
        setError('Failed to load schema from API: ' + err.message);
      });
  }, []);

  useEffect(() => {
    if (schemaData?.diseases) {
      initFormForDisease(activeDisease, schemaData.diseases);
      setResult(null);
      setError(null);
    }
    if (setSelectedDisease) {
      setSelectedDisease(activeDisease);
    }
  }, [activeDisease]);

  const initFormForDisease = (diseaseKey, diseases) => {
    const diseaseObj = diseases[diseaseKey];
    if (!diseaseObj) return;
    const initial = {};
    diseaseObj.features.forEach(f => {
      initial[f.key] = f.default !== undefined ? f.default : 0;
    });
    setFormValues(initial);
  };

  const handleInputChange = (key, value) => {
    setFormValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApplyPreset = (presetKey) => {
    const diseaseObj = schemaData?.diseases?.[activeDisease];
    if (diseaseObj?.presets?.[presetKey]) {
      setFormValues(prev => ({
        ...prev,
        ...diseaseObj.presets[presetKey]
      }));
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await predictDisease(activeDisease, formValues);
      if (res.error) {
        setError(res.error);
        setResult(null);
      } else {
        setResult(res);
      }
    } catch (err) {
      setError('Prediction error: ' + err.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const diseaseList = schemaData?.available_conditions || [
    'diabetes', 'heart', 'parkinsons', 'bcancer', 'liver', 'kidney'
  ];

  const currentDiseaseInfo = schemaData?.diseases?.[activeDisease];
  const presets = currentDiseaseInfo?.presets || {};

  return (
    <div className="space-y-8">
      {/* Header & Disease Switcher */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F7F5] border border-[#05AD98]/30 text-[#048C7A] text-xs font-semibold uppercase tracking-wider mb-2">
              <Stethoscope className="w-3.5 h-3.5" />
              Evidence-Based Diagnostic Screener
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {currentDiseaseInfo?.name || 'Clinical Diagnostic Engine'}
            </h1>
            <p className="text-sm text-gray-500 max-w-2xl">
              {currentDiseaseInfo?.description}
            </p>
          </div>

          {/* Quick Case Presets */}
          {Object.keys(presets).length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#05AD98]" />
                <span>Simulate Case:</span>
              </span>
              {Object.keys(presets).map((pKey) => (
                <button
                  key={pKey}
                  type="button"
                  onClick={() => handleApplyPreset(pKey)}
                  className="preset-chip"
                >
                  {pKey.replace('_', ' ').toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Disease Selection Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-gray-100 border border-gray-200 overflow-x-auto">
          {diseaseList.map((dKey) => {
            const isSel = activeDisease === dKey;
            const name = schemaData?.diseases?.[dKey]?.name || dKey;
            return (
              <button
                key={dKey}
                onClick={() => setActiveDisease(dKey)}
                className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  isSel
                    ? 'bg-[#05AD98] text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                }`}
              >
                {name.replace(' Triage', '').replace(' Profile', '')}
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid: Clinical Form + Live Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Parameter Inputs */}
        <div className="lg:col-span-7 glass-panel p-6 lg:p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#05AD98]" />
                <span>Patient Biometric & Lab Parameters</span>
              </h3>
              <button
                type="button"
                onClick={() => initFormForDisease(activeDisease, schemaData?.diseases)}
                className="text-xs text-gray-500 hover:text-[#05AD98] flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentDiseaseInfo?.features.map((field) => {
                const val = formValues[field.key] !== undefined ? formValues[field.key] : field.default;

                // Select Dropdown
                if (field.options) {
                  return (
                    <div key={field.key} className="space-y-1 sm:col-span-2">
                      <label className="form-label">
                        <span>{field.label}</span>
                        <span className="form-unit">{field.unit}</span>
                      </label>
                      <select
                        value={val}
                        onChange={(e) => handleInputChange(field.key, Number(e.target.value))}
                        className="form-input bg-white cursor-pointer"
                      >
                        {field.options.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                }

                // Numeric Input with Reference Tag
                return (
                  <div key={field.key} className="p-3 rounded-xl bg-gray-50/80 border border-gray-200/80 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-gray-700 truncate" title={field.label}>
                        {field.label}
                      </span>
                      <span className="form-unit text-[10px]">{field.unit}</span>
                    </div>

                    <input
                      type="number"
                      min={field.min}
                      max={field.max}
                      step={field.step || 1}
                      value={val}
                      onChange={(e) => handleInputChange(field.key, parseFloat(e.target.value) || 0)}
                      className="form-input font-mono text-sm bg-white"
                      required
                    />

                    {field.normal && (
                      <div className="text-[10px] text-gray-500 font-mono flex items-center justify-between">
                        <span>Ref Range:</span>
                        <span className="text-[#048C7A] font-medium">{field.normal}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-end">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full sm:w-auto"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Evaluating Calibrated Model...</span>
                  </>
                ) : (
                  <>
                    <Stethoscope className="w-4 h-4" />
                    <span>Compute Diagnostic Assessment</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Panel: Output Report */}
        <div className="lg:col-span-5 space-y-6">
          {result ? (
            <div className="glass-panel p-6 space-y-6 border-[#05AD98]/40 bg-gradient-to-br from-white to-[#E6F7F5]/30">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-xs font-bold uppercase tracking-wider text-[#05AD98]">
                  Diagnostic Evaluation Summary
                </span>
                <span className="text-xs font-mono text-gray-500">
                  Calibrated Random Forest
                </span>
              </div>

              {/* Animated Risk Gauge */}
              <RiskGauge
                probability={result.probability}
                isRisk={result.is_risk}
                riskLevel={result.risk_level}
              />

              {/* Clinical Verdict */}
              <div className="p-4 rounded-xl bg-white border border-gray-200 space-y-2 shadow-xs">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
                  Pathological Verdict
                </span>
                <p className="text-sm font-bold text-gray-900">
                  {result.clinical_verdict}
                </p>
                <div className="text-xs text-gray-600 pt-2 border-t border-gray-100">
                  <span className="text-[#05AD98] font-bold">Triage Protocol: </span>
                  {result.triage_action}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveTab('diet')}
                  className="btn-secondary text-xs w-full justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Utensils className="w-3.5 h-3.5 text-[#05AD98]" />
                    <span>View Prescribed Dietary Plan</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn-secondary text-xs w-full justify-center text-gray-600 hover:text-gray-900"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Clinical Assessment Summary</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-8 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#E6F7F5] border border-[#05AD98]/30 flex items-center justify-center text-[#05AD98]">
                <HeartPulse className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Ready for Biometric Evaluation</h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                Adjust clinical biomarker sliders on the left or click any patient case preset above,
                then click <strong className="text-[#05AD98]">Compute Diagnostic Assessment</strong>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
