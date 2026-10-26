import React, { useState, useEffect } from 'react';
import { 
  Scan, 
  Upload, 
  AlertTriangle, 
  Layers, 
  Eye, 
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { analyzeMri, analyzeXray, fetchSamples } from '../services/api';

export default function Radiology() {
  const [modality, setModality] = useState('brain_mri');
  const [samples, setSamples] = useState([]);
  const [selectedSample, setSelectedSample] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [filterMode, setFilterMode] = useState('normal'); // 'normal' | 'contrast' | 'invert'
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Load curated sample scans
  useEffect(() => {
    fetchSamples()
      .then(data => {
        if (data.samples && data.samples.length > 0) {
          setSamples(data.samples);
          const initSample = data.samples.find(s => s.type === 'brain_mri') || data.samples[0];
          setSelectedSample(initSample.filename);
          setPreviewUrl(initSample.url);
        }
      })
      .catch(err => console.log('Error fetching samples:', err));
  }, []);

  const handleSwitchModality = (newMod) => {
    setModality(newMod);
    setResult(null);
    setSelectedFile(null);
    setError(null);
    const matching = samples.find(s => s.type === newMod);
    if (matching) {
      setSelectedSample(matching.filename);
      setPreviewUrl(matching.url);
    }
  };

  const handleSelectSample = (sample) => {
    setSelectedSample(sample.filename);
    setSelectedFile(null);
    setPreviewUrl(sample.url);
    setResult(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setSelectedSample(null);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleRunAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('file', selectedFile);
      } else if (selectedSample) {
        formData.append('sample_name', selectedSample);
      } else {
        throw new Error('Please select or upload a radiological scan.');
      }

      const res = modality === 'brain_mri' 
        ? await analyzeMri(formData) 
        : await analyzeXray(formData);

      if (res.error) {
        setError(res.error);
        setResult(null);
      } else {
        setResult(res);
      }
    } catch (err) {
      setError(err.message || 'Radiological processing failed');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const getImageStyle = () => {
    if (filterMode === 'contrast') return { filter: 'contrast(175%) brightness(110%)' };
    if (filterMode === 'invert') return { filter: 'invert(100%)' };
    return {};
  };

  const currentModalitySamples = samples.filter(s => s.type === modality);

  return (
    <div className="space-y-8">
      {/* Header & Modality Switch */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CCFBF1] border border-[#0D9488]/30 text-[#0F766E] text-xs font-bold uppercase tracking-wider mb-2">
            <Scan className="w-3.5 h-3.5 text-[#F97316]" />
            PACS Medical Radiology Triage
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Radiological Imaging & Computer Vision
          </h1>
          <p className="text-sm text-slate-500">
            Intra-parenchymal focal mass localization, bilateral hemispheric asymmetry, and pulmonary consolidation.
          </p>
        </div>

        {/* Modality Selector */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 w-fit">
          <button
            onClick={() => handleSwitchModality('brain_mri')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              modality === 'brain_mri'
                ? 'bg-[#0D9488] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Brain MRI Studio
          </button>
          <button
            onClick={() => handleSwitchModality('chest_xray')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              modality === 'chest_xray'
                ? 'bg-[#0D9488] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Chest X-Ray Triage
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid: PACS Viewer + Clinical Findings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: PACS Viewer Canvas */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#0D9488]" />
                <span>PACS Workstation Viewer</span>
                <span className="text-[10px] text-slate-400 font-mono">DICOM/256px</span>
              </span>

              {/* Windowing Filter Controls */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500 text-[11px] mr-1">Window:</span>
                <button
                  type="button"
                  onClick={() => setFilterMode('normal')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${
                    filterMode === 'normal'
                      ? 'bg-[#0D9488] text-white border-[#0D9488]'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  Raw
                </button>
                <button
                  type="button"
                  onClick={() => setFilterMode('contrast')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${
                    filterMode === 'contrast'
                      ? 'bg-[#0D9488] text-white border-[#0D9488]'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  Contrast
                </button>
                <button
                  type="button"
                  onClick={() => setFilterMode('invert')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${
                    filterMode === 'invert'
                      ? 'bg-[#0D9488] text-white border-[#0D9488]'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  Invert
                </button>
              </div>
            </div>

            {/* Display Viewport */}
            <div className="pacs-canvas aspect-square max-h-97.5 w-full flex items-center justify-center relative">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Medical Scan"
                  style={getImageStyle()}
                  className="max-h-full max-w-full object-contain select-none"
                />
              ) : (
                <div className="text-center p-8 text-slate-400">
                  <Scan className="w-12 h-12 mx-auto mb-2 opacity-40 text-slate-400" />
                  <span>No scan loaded</span>
                </div>
              )}

              {/* Radiological Orientation Tags */}
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-mono font-bold text-slate-300 bg-black/80 px-1.5 py-0.5 rounded border border-white/20">
                R
              </span>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-mono font-bold text-slate-300 bg-black/80 px-1.5 py-0.5 rounded border border-white/20">
                L
              </span>

              {/* Crosshair Overlay with Soft Glow */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-0 right-0 h-px bg-[#0D9488]/40 shadow-xs shadow-[#0D9488]" />
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#0D9488]/40 shadow-xs shadow-[#0D9488]" />
              </div>
            </div>

            {/* Verified Clinical Samples */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
                  <span>Verified Clinical Reference Scans:</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">1-Click Triage</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {currentModalitySamples.map((s) => (
                  <button
                    key={s.filename}
                    onClick={() => handleSelectSample(s)}
                    className={`rounded-xl p-2.5 text-left border transition flex items-center gap-3 ${
                      selectedSample === s.filename
                        ? 'border-[#0D9488] bg-[#CCFBF1] shadow-xs ring-1 ring-[#0D9488]/30'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-black border border-slate-200">
                      <img src={s.url} alt={s.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-xs font-bold text-slate-900 block truncate">{s.name}</span>
                      <span className="text-[10px] text-[#0D9488] font-mono block truncate font-bold">{s.finding || 'Verified'}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom File Upload */}
              <div className="pt-2">
                <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-slate-300 hover:border-[#0D9488] cursor-pointer text-xs font-semibold text-slate-600 hover:text-[#0D9488] transition bg-slate-50/50">
                  <Upload className="w-4 h-4 text-[#0D9488]" />
                  <span>{selectedFile ? selectedFile.name : `Or Upload Custom ${modality === 'chest_xray' ? 'Chest X-Ray' : 'Brain MRI'} (JPG / PNG)`}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <button
              onClick={handleRunAnalysis}
              disabled={loading}
              className="btn-pop w-full text-base py-3.5 shadow-md shadow-[#F97316]/20"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Computing Morphological & Lesion Analysis...</span>
                </>
              ) : (
                <>
                  <Scan className="w-5 h-5" />
                  <span>Run Radiological Triage</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Hospital-Grade Radiology Report */}
        <div className="lg:col-span-5 space-y-6">
          {result ? (
            <div className="glass-panel p-6 space-y-6 border-[#0D9488]/30 bg-linear-to-br from-white to-[#CCFBF1]/25 shadow-lg">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0D9488] block">
                    Radiological Assessment Report
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Protocol: {result.modality}
                  </span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  result.prediction.includes('Normal') || result.prediction === 'No Tumour'
                    ? 'bg-[#CCFBF1] text-[#0F766E] border-[#0D9488]/30'
                    : 'bg-[#FFEDD5] text-[#C2410C] border-[#F97316]/30'
                }`}>
                  {result.severity}
                </span>
              </div>

              {/* Primary Diagnostic Finding */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 shadow-xs">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Impression & Diagnosis
                </span>
                <div className="text-2xl font-black text-slate-900 tracking-tight">
                  {result.prediction}
                </div>
                <div className="text-xs font-bold text-[#EA580C] font-mono">
                  Confidence Score: {result.confidence}%
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                  {result.description}
                </p>
              </div>

              {/* Softmax Probability Bars */}
              {result.probabilities && Object.keys(result.probabilities).length > 0 && (
                <div className="space-y-3 p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Probability Distribution (Softmax):
                  </div>
                  <div className="space-y-2">
                    {Object.entries(result.probabilities).map(([cls, prob]) => {
                      const isChosen = cls === result.prediction || result.prediction.includes(cls);
                      return (
                        <div key={cls} className="space-y-1">
                          <div className="flex justify-between text-xs font-medium">
                            <span className={isChosen ? 'text-[#0D9488] font-black' : 'text-slate-600'}>
                              {cls}
                            </span>
                            <span className={`font-mono font-bold ${isChosen ? 'text-[#EA580C]' : 'text-slate-500'}`}>
                              {prob}%
                            </span>
                          </div>
                          <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${
                                isChosen 
                                  ? 'bg-linear-to-r from-[#0D9488] to-[#F97316]' 
                                  : 'bg-slate-300'
                              }`}
                              style={{ width: `${prob}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantitative Biometrics */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                {result.asymmetry_index !== undefined && (
                  <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-xs">
                    <span className="text-slate-500 block mb-0.5">Bilateral Asymmetry</span>
                    <span className="font-bold font-mono text-slate-900 text-sm">{result.asymmetry_index}%</span>
                  </div>
                )}
                {result.contrast_ratio !== undefined && (
                  <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-xs">
                    <span className="text-slate-500 block mb-0.5">Tissue Variance</span>
                    <span className="font-bold font-mono text-slate-900 text-sm">{result.contrast_ratio}%</span>
                  </div>
                )}
                {result.opacity_score !== undefined && (
                  <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-xs">
                    <span className="text-slate-500 block mb-0.5">Lobar Opacity</span>
                    <span className="font-bold font-mono text-slate-900 text-sm">{result.opacity_score}%</span>
                  </div>
                )}
                {result.subtype && (
                  <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-xs">
                    <span className="text-slate-500 block mb-0.5">Consolidation Subtype</span>
                    <span className="font-bold font-mono text-[#0D9488] text-xs truncate block">{result.subtype}</span>
                  </div>
                )}
              </div>

              {/* Clinical Next Step */}
              <div className="p-4 rounded-xl bg-[#CCFBF1]/70 border border-[#0D9488]/30 text-xs space-y-1">
                <span className="font-bold text-[#0F766E] block">Radiological Recommendation:</span>
                <p className="text-slate-700 leading-relaxed">{result.action}</p>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-8 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#CCFBF1] border border-[#0D9488]/30 flex items-center justify-center text-[#0D9488]">
                <Layers className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Scan Awaiting Triage</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Click any of the verified clinical sample scans or upload your own, then click
                <strong className="text-[#EA580C]"> Run Radiological Triage</strong> to compute lesion biometrics.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
