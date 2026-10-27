/**
 * API Service for OpenHealth AI REST Endpoints
 * Sanitizes base URL to prevent double slashes and normalizes image URLs
 */

const rawUrl = (import.meta.env.VITE_API_URL || '').trim();
// Strip trailing slashes so `${BACKEND_URL}/api` is always clean
const BACKEND_URL = rawUrl.replace(/\/+$/, '');
const API_BASE = BACKEND_URL ? `${BACKEND_URL}/api` : '/api';

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
    data.samples = data.samples.map(s => {
      const cleanUrl = s.url.startsWith('/') ? s.url : `/${s.url}`;
      return {
        ...s,
        url: s.url.startsWith('http') ? s.url : `${BACKEND_URL}${cleanUrl}`
      };
    });
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
