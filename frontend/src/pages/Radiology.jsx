import React, { useState, useEffect } from 'react';
import { 
  Scan, 
  Upload, 
  AlertTriangle, 
  Layers, 
  Eye, 
  RefreshCw
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
          // Set default for initial modality
          const initSample = data.samples.find(s => s.type === 'brain_mri') || data.samples[0];
          setSelectedSample(initSample.filename);
          setPreviewUrl(initSample.url);
        }
      })
      .catch(err => console.log('Error fetching samples:', err));
  }, []);

  // When modality changes, switch default sample
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

      let res;
      if (modality === 'chest_xray') {
        res = await analyzeXray(formData);
      } else {
        res = await analyzeMri(formData);
      }

      if (res.error) {
        setError(res.error);
        setResult(null);
      } else {
        setResult(res);
      }
    } catch (err) {
      setError(err.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const getImageStyle = () => {
    if (filterMode === 'contrast') {
      return { filter: 'contrast(165%) brightness(110%)' };
    }
    if (filterMode === 'invert') {
      return { filter: 'invert(100%) contrast(140%)' };
    }
    return {};
  };

  const currentModalitySamples = samples.filter(s => s.type === modality);

  return (
    <div className="space-y-8">
      {/* Header & Modality Switch */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Scan className="w-3.5 h-3.5" />
            PACS Medical Radiology Triage
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Radiological Imaging & Computer Vision
          </h1>
          <p className="text-sm text-slate-400">
            Intra-parenchymal focal mass localization, bilateral hemispheric asymmetry, and pulmonary consolidation.
          </p>
        </div>

        {/* Modality Selector */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900/90 border border-white/10 w-fit">
          <button
            onClick={() => handleSwitchModality('brain_mri')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              modality === 'brain_mri'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Brain MRI Studio
          </button>
          <button
            onClick={() => handleSwitchModality('chest_xray')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              modality === 'chest_xray'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Chest X-Ray Triage
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid: PACS Viewer + Clinical Findings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: PACS Viewer Canvas */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-sky-400" />
                <span>PACS Workstation Viewer</span>
                <span className="text-[10px] text-slate-500 font-mono">DICOM/256px</span>
              </span>

              {/* Windowing Filter Controls */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 text-[11px] mr-1">Window:</span>
                <button
                  type="button"
                  onClick={() => setFilterMode('normal')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
                    filterMode === 'normal'
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                      : 'bg-slate-900 text-slate-400 border-white/10'
                  }`}
                >
                  Raw
                </button>
                <button
                  type="button"
                  onClick={() => setFilterMode('contrast')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
                    filterMode === 'contrast'
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                      : 'bg-slate-900 text-slate-400 border-white/10'
                  }`}
                >
                  Contrast
                </button>
                <button
                  type="button"
                  onClick={() => setFilterMode('invert')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
                    filterMode === 'invert'
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                      : 'bg-slate-900 text-slate-400 border-white/10'
                  }`}
                >
                  Invert
                </button>
              </div>
            </div>

            {/* Display Viewport */}
            <div className="pacs-canvas aspect-square max-h-[390px] w-full flex items-center justify-center relative">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Medical Scan"
                  style={getImageStyle()}
                  className="max-h-full max-w-full object-contain select-none"
                />
              ) : (
                <div className="text-center p-8 text-slate-500">
                  <Scan className="w-12 h-12 mx-auto mb-2 opacity-40" />
                  <span>No scan loaded</span>
                </div>
              )}

              {/* Radiological Orientation Tags (R on patient right, L on patient left) */}
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-mono font-bold text-slate-500 bg-black/60 px-1 rounded border border-white/10">
                R
              </span>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-mono font-bold text-slate-500 bg-black/60 px-1 rounded border border-white/10">
                L
              </span>

              {/* Crosshair Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-sky-500/15" />
                <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-sky-500/15" />
              </div>
            </div>

            {/* Verified Clinical Samples */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Verified Clinical Reference Scans:</span>
                <span className="text-[10px] text-slate-500 font-mono">1-Click Triage</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {currentModalitySamples.map((s) => (
                  <button
                    key={s.filename}
                    onClick={() => handleSelectSample(s)}
                    className={`rounded-xl p-2.5 text-left border transition flex items-center gap-3 ${
                      selectedSample === s.filename
                        ? 'border-sky-400 bg-sky-500/10 shadow-md shadow-sky-500/20'
                        : 'border-white/10 hover:border-white/30 bg-slate-900/60'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-black border border-white/10">
                      <img src={s.url} alt={s.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-xs font-bold text-white block truncate">{s.name}</span>
                      <span className="text-[10px] text-sky-400 font-mono block truncate">{s.finding || 'Verified'}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom File Upload */}
              <div className="pt-2">
                <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-white/20 hover:border-sky-400 cursor-pointer text-xs font-semibold text-slate-400 hover:text-sky-300 transition bg-slate-900/40">
                  <Upload className="w-4 h-4 text-sky-400" />
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
              className="btn-primary w-full"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Computing Morphological & Lesion Analysis...</span>
                </>
              ) : (
                <>
                  <Scan className="w-4 h-4" />
                  <span>Run Radiological Triage</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Hospital-Grade Radiology Report */}
        <div className="lg:col-span-5 space-y-6">
          {result ? (
            <div className="glass-panel p-6 space-y-6 border-sky-500/30 bg-gradient-to-br from-slate-900/90 to-slate-950">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-400 block">
                    Radiological Assessment Report
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Protocol: {result.modality}
                  </span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  result.prediction.includes('Normal') || result.prediction === 'No Tumour'
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                }`}>
                  {result.severity}
                </span>
              </div>

              {/* Primary Diagnostic Finding */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 space-y-2">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Impression & Diagnosis
                </span>
                <div className="text-2xl font-black text-white tracking-tight">
                  {result.prediction}
                </div>
                <div className="text-xs font-semibold text-sky-400 font-mono">
                  Confidence Score: {result.confidence}%
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-white/5">
                  {result.description}
                </p>
              </div>

              {/* Softmax Probability Bars */}
              {result.probabilities && Object.keys(result.probabilities).length > 0 && (
                <div className="space-y-3 p-4 rounded-xl bg-slate-950/70 border border-white/10">
                  <div className="text-xs font-bold text-white uppercase tracking-wider">
                    Probability Distribution (Softmax):
                  </div>
                  <div className="space-y-2">
                    {Object.entries(result.probabilities).map(([cls, prob]) => (
                      <div key={cls} className="space-y-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span className={cls === result.prediction || result.prediction.includes(cls) ? 'text-sky-300 font-bold' : 'text-slate-400'}>
                            {cls}
                          </span>
                          <span className="font-mono text-slate-300">{prob}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              cls === result.prediction || result.prediction.includes(cls) ? 'bg-sky-500' : 'bg-slate-600'
                            }`}
                            style={{ width: `${prob}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantitative Biometrics */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                {result.asymmetry_index !== undefined && (
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-white/5">
                    <span className="text-slate-500 block mb-0.5">Bilateral Asymmetry</span>
                    <span className="font-bold font-mono text-white text-sm">{result.asymmetry_index}%</span>
                  </div>
                )}
                {result.contrast_ratio !== undefined && (
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-white/5">
                    <span className="text-slate-500 block mb-0.5">Tissue Variance</span>
                    <span className="font-bold font-mono text-white text-sm">{result.contrast_ratio}%</span>
                  </div>
                )}
                {result.opacity_score !== undefined && (
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-white/5">
                    <span className="text-slate-500 block mb-0.5">Lobar Opacity</span>
                    <span className="font-bold font-mono text-white text-sm">{result.opacity_score}%</span>
                  </div>
                )}
                {result.subtype && (
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-white/5">
                    <span className="text-slate-500 block mb-0.5">Consolidation Subtype</span>
                    <span className="font-bold font-mono text-teal-400 text-xs truncate block">{result.subtype}</span>
                  </div>
                )}
              </div>

              {/* Clinical Next Step */}
              <div className="p-4 rounded-xl bg-sky-950/30 border border-sky-500/20 text-xs space-y-1">
                <span className="font-bold text-sky-400 block">Radiological Recommendation:</span>
                <p className="text-slate-300 leading-relaxed">{result.action}</p>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-8 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <Layers className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">Scan Awaiting Triage</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                Click any of the verified clinical sample scans or upload your own, then click
                <strong className="text-teal-300"> Run Radiological Triage</strong> to compute lesion biometrics.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
