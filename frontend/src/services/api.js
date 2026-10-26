/**
 * API Service for OpenHealth AI REST Endpoints
 * Supports configurable backend URL via Vite env VITE_API_URL, defaulting to relative '/api'
 */

const BACKEND_URL = import.meta.env.VITE_API_URL || '';
const API_BASE = `${BACKEND_URL}/api`;

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function fetchSchema() {
  const res = await fetch(`${API_BASE}/schema`);
  return res.json();
}

export async function predictDisease(disease, payload) {
  const res = await fetch(`${API_BASE}/predict/${disease}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function analyzeMri(formData) {
  const res = await fetch(`${API_BASE}/mri/analyze`, {
    method: 'POST',
    body: formData
  });
  return res.json();
}

export async function analyzeXray(formData) {
  const res = await fetch(`${API_BASE}/xray/analyze`, {
    method: 'POST',
    body: formData
  });
  return res.json();
}

export async function fetchSamples() {
  const res = await fetch(`${API_BASE}/samples`);
  const data = await res.json();
  if (data.samples && BACKEND_URL) {
    data.samples = data.samples.map(s => ({
      ...s,
      url: s.url.startsWith('http') ? s.url : `${BACKEND_URL}${s.url}`
    }));
  }
  return data;
}

export async function fetchDiet(condition = 'diabetes', subtype = 'Standard Clinical') {
  const res = await fetch(`${API_BASE}/diet?condition=${encodeURIComponent(condition)}&subtype=${encodeURIComponent(subtype)}`);
  return res.json();
}

export async function fetchDietConditions() {
  const res = await fetch(`${API_BASE}/diet/conditions`);
  return res.json();
}

export async function sendChatMessage(query) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  return res.json();
}

export async function fetchMetrics() {
  const res = await fetch(`${API_BASE}/metrics`);
  return res.json();
}
