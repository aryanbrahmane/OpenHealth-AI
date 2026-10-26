/**
 * API Service for OpenHealth AI REST Endpoints
 */

const API_BASE = '/api';

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
  return res.json();
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

