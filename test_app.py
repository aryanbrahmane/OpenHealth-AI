#!python3.12
"""
Comprehensive Integration & REST API Test Suite for OpenHealth AI Full-Stack
"""

import sys
import os
import json
import warnings
warnings.filterwarnings('ignore')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(BASE_DIR, 'backend')
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from app import app

client = app.test_client()

print("=" * 65)
print("RUNNING OPENHEALTH AI FULL-STACK INTEGRATION TESTS")
print("=" * 65)

# 1. Health check
res = client.get('/api/health')
assert res.status_code == 200, f"Health check failed: {res.status_code}"
data = res.get_json()
assert data['status'] == 'online', "Backend not reported online"
assert len(data['models_loaded']) == 6, f"Expected 6 models, got {len(data['models_loaded'])}"
print(f"[PASS] 1. Backend Health Check (200 OK, {len(data['models_loaded'])} models loaded)")

# 2. Schema check
res = client.get('/api/schema')
assert res.status_code == 200
schema = res.get_json()
assert 'diabetes' in schema['diseases']
assert 'heart' in schema['diseases']
print("[PASS] 2. Disease Schema & Biomarker Configurations (200 OK)")

# 3. Multi-Disease Predictions
test_cases = [
    ('diabetes', {'pregnancies': 6, 'Glucose': 160, 'BloodPressure': 80, 'skin_thickness': 32, 'insulin': 180, 'BMI': 34.2, 'DiabetesPedigreeFunction': 0.65, 'Age': 45}),
    ('heart', {'age': 55, 'sex': 1, 'cp': 0, 'trestbps': 140, 'chol': 250, 'fbs': 0, 'restecg': 1, 'thalach': 130, 'exang': 1, 'oldpeak': 2.0, 'slope': 1, 'ca': 1, 'thal': 2}),
    ('parkinsons', {'MDVPFO': 119.992, 'MDVPFHI': 157.302, 'MDVPFLO': 74.997, 'MDVPJ': 0.00784, 'RPDE': 0.514783, 'DFA': 0.815285, 'spread2': 0.366482, 'D2': 2.501442}),
    ('bcancer', {'mean_radius': 17.99, 'mean_texture': 20.38, 'mean_perimeter': 122.8, 'mean_area': 1001.0, 'mean_smoothness': 0.118, 'mean_compactness': 0.277, 'mean_concavity': 0.300, 'mean_concave_points': 0.147, 'mean_symmetry': 0.241, 'mean_fractal_dimension': 0.078}),
    ('liver', {'age': 58, 'gender': 1, 'total_bilirubin': 4.5, 'direct_bilirubin': 2.1, 'alkaline_phosphotase': 380, 'alamine_aminotransferase': 115, 'aspartate_aminotransferase': 140, 'total_proteins': 5.8, 'albumin': 2.4, 'albumin_globulin_ratio': 0.7}),
    ('kidney', {'age': 62, 'bp': 95, 'sg': 1.010, 'al': 3, 'su': 2, 'bgr': 210, 'bu': 92, 'sc': 3.4, 'hemo': 9.4, 'pcv': 29, 'htn': 1, 'dm': 1})
]

for idx, (disease, payload) in enumerate(test_cases, start=3):
    res = client.post(f'/api/predict/{disease}', json=payload)
    assert res.status_code == 200, f"{disease} failed: {res.status_code}"
    pred_res = res.get_json()
    assert 'probability' in pred_res and 'risk_level' in pred_res
    print(f"[PASS] {idx}. Prediction: {disease.capitalize()} (Prob: {pred_res['probability']}%, Level: {pred_res['risk_level']})")

# 9. Brain MRI Scan
res = client.post('/api/mri/analyze', json={'sample_name': 'mri_glioma_tumor.jpg'})
assert res.status_code == 200, f"MRI failed: {res.status_code}"
mri_res = res.get_json()
assert 'prediction' in mri_res and 'confidence' in mri_res
print(f"[PASS] 9. Brain MRI Computer Vision (Result: {mri_res['prediction']}, Confidence: {mri_res['confidence']}%)")

# 10. Chest X-Ray Scan
res = client.post('/api/xray/analyze', json={'sample_name': 'xray_pneumonia_bacterial.jpeg'})
assert res.status_code == 200, f"X-Ray failed: {res.status_code}"
xray_res = res.get_json()
assert 'prediction' in xray_res
print(f"[PASS] 10. Chest X-Ray Triage (Result: {xray_res['prediction']}, Confidence: {xray_res['confidence']}%)")

# 11. Clinical Diet Engine
res = client.get('/api/diet?condition=heart&subtype=Standard+Clinical')
assert res.status_code == 200
diet_res = res.get_json()
assert 'foods_to_eat' in diet_res and 'meal_plan' in diet_res
print(f"[PASS] 11. Clinical Diet & DASH Nutrition Engine (Title: {diet_res['title']})")

# 12. Local Clinical Chatbot (Zero Gemini key needed)
res = client.post('/api/chat', json={'query': 'What are the emergency signs of a heart attack?'})
assert res.status_code == 200
chat_res = res.get_json()
assert 'reply' in chat_res and len(chat_res['reply']) > 50
assert 'Offline' in chat_res['engine']
print(f"[PASS] 12. Local Clinical Knowledge Base AI Assistant (Engine: {chat_res['engine']})")

# 13. Academic Metrics & Viva Defense Lab
res = client.get('/api/metrics')
assert res.status_code == 200
metrics_res = res.get_json()
assert len(metrics_res['metrics']) == 6
assert len(metrics_res['viva_guide']) >= 6
print(f"[PASS] 13. Academic Metrics & Viva Voce Guide ({len(metrics_res['viva_guide'])} technical defense Q&A loaded)")

print("=" * 65)
print("ALL 13 FULL-STACK INTEGRATION TESTS PASSED WITH 100% SUCCESS!")
print("=" * 65)
