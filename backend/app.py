#!python3.12
"""
OpenHealth AI - Full-Stack REST API Backend
Provides machine learning disease triage, computer vision radiology analysis,
clinical nutrition planning, offline medical Q&A intelligence, and academic metrics.
"""

import os
import sys
import json
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename

# Add current dir to sys.path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from models.predictor import predict_disease, get_metrics_data, DISEASE_SCHEMA, DISEASE_KEYS, MODELS
from models.image_classifier import analyze_brain_mri, analyze_chest_xray
from models.diet_recommender import get_diet_plan, CLINICAL_DIET_PLANS
from chatbot.chatbot_engine import get_chatbot_reply

app = Flask(__name__, static_folder=os.path.join(BASE_DIR, 'static'))
CORS(app, resources={r"/*": {"origins": "*"}})

UPLOAD_FOLDER = os.path.join(BASE_DIR, 'static', 'uploads')
SAMPLES_FOLDER = os.path.join(BASE_DIR, 'static', 'samples')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(SAMPLES_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB

@app.after_request
def after_request(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
    return response

# 1. Health & Status
@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        "status": "online",
        "service": "OpenHealth AI Diagnostic Engine",
        "version": "2.5.0",
        "models_loaded": list(MODELS.keys()),
        "total_models": len(MODELS),
        "offline_chatbot": True
    })

# 2. Disease Schema & Presets
@app.route('/api/schema', methods=['GET'])
def get_schema():
    return jsonify({
        "diseases": DISEASE_SCHEMA,
        "available_conditions": DISEASE_KEYS
    })

# 3. Multi-Disease Prediction
@app.route('/api/predict/<disease>', methods=['POST', 'OPTIONS'])
def predict(disease):
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"})

    disease_key = disease.lower().strip()
    if disease_key not in DISEASE_SCHEMA:
        return jsonify({"error": f"Unknown disease '{disease}'. Available: {DISEASE_KEYS}"}), 400

    data = request.get_json(silent=True) or request.form.to_dict()
    schema = DISEASE_SCHEMA[disease_key]
    feature_specs = schema['features']

    # Extract feature values in exact order
    feature_vector = []
    provided_values = {}
    for spec in feature_specs:
        key = spec['key']
        val = data.get(key)
        if val is None:
            # Fall back to default
            val = spec.get('default', 0)
        try:
            val_float = float(val)
        except (ValueError, TypeError):
            val_float = float(spec.get('default', 0))
        feature_vector.append(val_float)
        provided_values[key] = val_float

    try:
        result = predict_disease(disease_key, feature_vector)
        result["inputs"] = provided_values
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 4. Medical Imaging (Brain MRI)
@app.route('/api/mri/analyze', methods=['POST', 'OPTIONS'])
def mri_analyze():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"})

    file = request.files.get('file')
    sample_name = request.form.get('sample_name') or (request.get_json(silent=True) or {}).get('sample_name')

    target_path = None
    image_rel_url = None

    if file and file.filename != '':
        filename = secure_filename(file.filename)
        target_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(target_path)
        image_rel_url = f"/api/static/uploads/{filename}"
    elif sample_name:
        clean_sample = os.path.basename(sample_name)
        candidate = os.path.join(SAMPLES_FOLDER, clean_sample)
        if os.path.exists(candidate):
            target_path = candidate
            image_rel_url = f"/api/static/samples/{clean_sample}"

    if not target_path or not os.path.exists(target_path):
        return jsonify({
            "error": "No valid MRI scan image was provided. Please upload a file or choose a sample scan."
        }), 400

    result = analyze_brain_mri(target_path)
    result["image_url"] = image_rel_url
    return jsonify(result)

# 5. Medical Imaging (Chest X-Ray)
@app.route('/api/xray/analyze', methods=['POST', 'OPTIONS'])
def xray_analyze():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"})

    file = request.files.get('file')
    sample_name = request.form.get('sample_name') or (request.get_json(silent=True) or {}).get('sample_name')

    target_path = None
    image_rel_url = None

    if file and file.filename != '':
        filename = secure_filename(file.filename)
        target_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(target_path)
        image_rel_url = f"/api/static/uploads/{filename}"
    elif sample_name:
        clean_sample = os.path.basename(sample_name)
        candidate = os.path.join(SAMPLES_FOLDER, clean_sample)
        if os.path.exists(candidate):
            target_path = candidate
            image_rel_url = f"/api/static/samples/{clean_sample}"

    if not target_path or not os.path.exists(target_path):
        return jsonify({"error": "No valid X-Ray scan image provided."}), 400

    result = analyze_chest_xray(target_path)
    result["image_url"] = image_rel_url
    return jsonify(result)

# 6. Sample Images List
@app.route('/api/samples', methods=['GET'])
def list_samples():
    curated = [
        {"filename": "mri_glioma_tumor.jpg", "url": "/api/static/samples/mri_glioma_tumor.jpg", "name": "Glioma Tumour (Scan Y146)", "type": "brain_mri", "finding": "Infiltrative Heterogeneous Mass"},
        {"filename": "mri_meningioma_tumor.jpg", "url": "/api/static/samples/mri_meningioma_tumor.jpg", "name": "Meningioma Tumour (Scan Y109)", "type": "brain_mri", "finding": "Extra-Axial Dense Mass"},
        {"filename": "mri_normal_scan.jpg", "url": "/api/static/samples/mri_normal_scan.jpg", "name": "Normal Brain (Healthy)", "type": "brain_mri", "finding": "Symmetric Ventricular Margins"},
        {"filename": "xray_pneumonia_bacterial.jpeg", "url": "/api/static/samples/xray_pneumonia_bacterial.jpeg", "name": "Bacterial Pneumonia (Lobar)", "type": "chest_xray", "finding": "Right Lower Lobe Consolidation"},
        {"filename": "xray_normal_healthy.jpeg", "url": "/api/static/samples/xray_normal_healthy.jpeg", "name": "Normal Chest X-Ray (Clear)", "type": "chest_xray", "finding": "Sharp Costophrenic Angles"}
    ]
    available = [s for s in curated if os.path.exists(os.path.join(SAMPLES_FOLDER, s["filename"]))]
    # Fallback to any remaining if needed
    if len(available) < 3 and os.path.exists(SAMPLES_FOLDER):
        for f in os.listdir(SAMPLES_FOLDER):
            if f.lower().endswith(('.jpg', '.jpeg', '.png')) and not any(a['filename'] == f for a in available):
                available.append({
                    "filename": f,
                    "url": f"/api/static/samples/{f}",
                    "name": f.replace('_', ' ').replace('.jpg', '').replace('.jpeg', '').title(),
                    "type": "brain_mri"
                })
    return jsonify({"samples": available})

# 7. Static file serving helper
@app.route('/api/static/<path:folder>/<path:filename>')
def serve_static(folder, filename):
    folder_path = os.path.join(BASE_DIR, 'static', folder)
    return send_from_directory(folder_path, filename)

# 8. Clinical Diet & Nutrition Engine
@app.route('/api/diet', methods=['GET', 'POST', 'OPTIONS'])
def diet():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"})

    condition = request.args.get('condition')
    subtype = request.args.get('subtype', 'Standard Clinical')

    if request.method == 'POST':
        data = request.get_json(silent=True) or {}
        condition = data.get('condition', condition)
        subtype = data.get('subtype', subtype)

    plan = get_diet_plan(condition, subtype)
    return jsonify(plan)

@app.route('/api/diet/conditions', methods=['GET'])
def diet_conditions():
    keys = list(CLINICAL_DIET_PLANS.keys())
    return jsonify({
        "conditions": [
            {"key": k, "title": CLINICAL_DIET_PLANS[k]["title"], "subtitle": CLINICAL_DIET_PLANS[k]["condition_name"]}
            for k in keys
        ]
    })

# 9. Local Medical AI Assistant (Pure Offline Engine - No API keys)
@app.route('/api/chat', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"})

    data = request.get_json(silent=True) or {}
    query = data.get('query', '').strip()
    if not query:
        return jsonify({"reply": "Please enter a healthcare, lab test, or symptom query."})

    reply = get_chatbot_reply(query)
    return jsonify({
        "reply": reply,
        "engine": "OpenHealth Local Clinical Intelligence (Offline)",
        "status": "success"
    })

# 10. Academic Metrics & Viva Defense Lab
@app.route('/api/metrics', methods=['GET'])
def metrics():
    raw_metrics = get_metrics_data()
    viva_guide = [
        {
            "category": "Algorithm Selection",
            "question": "Why use Random Forest & Ensemble Classifiers instead of Deep Neural Networks for tabular clinical data?",
            "answer": "Random Forest excels on tabular clinical datasets because it constructs multiple de-correlated decision trees with bootstrap aggregation (bagging) and random feature subspace projection. Unlike deep neural networks that require massive sample sizes (100k+) and are prone to overfitting on small medical cohorts (e.g. PIMA 768 rows), Random Forest provides robust variance reduction, innate resistance to outliers, zero risk of vanishing gradients, and direct calculation of Gini-impurity feature importances."
        },
        {
            "category": "Data Preprocessing",
            "question": "How did you handle biologically impossible zero values and missing data in the diabetes and kidney datasets?",
            "answer": "In datasets like PIMA Diabetes, zero values in physiological features like Plasma Glucose, Blood Pressure, Skinfold Thickness, and Insulin are biologically impossible and represent unrecorded data. Rather than dropping these rows (which discards 40% of the sample size), we imputed them using the feature median computed strictly within training folds to avoid data leakage. For categorical clinical fields, mode imputation and binary dummy mapping were utilized."
        },
        {
            "category": "Class Imbalance",
            "question": "How was severe class imbalance managed in the Liver Disease and Heart cohorts?",
            "answer": "In clinical datasets like the Indian Liver Patient Dataset (71% positive, 29% negative), naive classifiers achieve deceptive accuracy by simply predicting the majority class. We countered this by: (1) implementing stratified k-fold cross-validation splits to maintain identical class ratios across train/test sets, (2) adjusting cost-sensitive loss via 'class_weight=balanced' which penalizes minority class misclassification inversely proportional to class frequencies, and (3) evaluating performance via Weighted F1-Score, Recall, and Confusion Matrices rather than raw accuracy alone."
        },
        {
            "category": "Radiology Computer Vision",
            "question": "How does the Brain MRI analyzer distinguish between Gliomas, Meningiomas, and Normal tissue?",
            "answer": "The medical imaging pipeline leverages dual-hemisphere morphological asymmetry analysis, local tissue contrast entropy, and high-intensity thresholding. Gliomas exhibit marked infiltrative hemispheric asymmetry and intense heterogeneous borders. Meningiomas present as circumscribed extra-axial lesions adjacent to dural membranes with elevated standard deviation. Normal scans exhibit high bilateral symmetry across the sagittal midline with expected ventricular contrast ratios."
        },
        {
            "category": "Data Leakage Prevention",
            "question": "What is data leakage and how did your pipeline guard against it?",
            "answer": "Data leakage occurs when information outside the training dataset is inadvertently used to fit models (e.g., fitting StandardScaler on the entire dataset prior to splitting). In OpenHealth AI, datasets are strictly partitioned into 80/20 train/test splits before fitting scalers. Scalers are fit exclusively on X_train (learning μ and σ) and only transform X_test, ensuring zero out-of-sample data contamination."
        },
        {
            "category": "System Architecture",
            "question": "Explain the architectural advantages of decoupling the Flask REST API from the React frontend.",
            "answer": "Decoupled full-stack architecture separates computational ML inference from presentation logic. The Python backend operates as a stateless RESTful microservice handling intensive linear algebra (NumPy, Scikit-Learn, Joblib), while the React Single Page Application (SPA) delivers instantaneous client-side UI updates, responsive interactive visualizers, and offline caching. This architecture allows horizontal scaling, Docker containerization, and seamless integration with mobile apps or hospital EHR systems."
        }
    ]

    return jsonify({
        "metrics": raw_metrics,
        "viva_guide": viva_guide,
        "project_meta": {
            "title": "OpenHealth AI: Distributed Multi-Disease Diagnostic & Clinical Triage Platform",
            "abstract": "An end-to-end intelligent healthcare platform synthesizing machine learning diagnostic classifiers for 6 major systemic pathologies (Diabetes, Coronary Artery Disease, Parkinson's Vocal Biomarkers, Breast Cancer Cytopathology, Chronic Kidney Disease, Hepatic Cirrhosis) alongside computer-vision radiological triage, personalized clinical nutrition planning, and an offline local clinical intelligence assistant.",
            "stack": {
                "frontend": "React 19, Vite, Tailwind CSS, Lucide Icons, Canvas Visualizers",
                "backend": "Python 3.12, Flask RESTful, Scikit-Learn, NumPy, Pandas, Pillow, Joblib",
                "deployment": "Self-contained full-stack architecture with zero external cloud API dependencies"
            }
        }
    })

# 11. Root status
@app.route('/')
def index():
    return jsonify({
        "message": "OpenHealth AI Full-Stack REST API is active",
        "endpoints": {
            "health": "/api/health",
            "schema": "/api/schema",
            "predict": "/api/predict/<disease>",
            "mri": "/api/mri/analyze",
            "xray": "/api/xray/analyze",
            "diet": "/api/diet?condition=diabetes",
            "chat": "/api/chat",
            "metrics": "/api/metrics",
            "samples": "/api/samples"
        }
    })

if __name__ == '__main__':
    print("=" * 60)
    print("OpenHealth AI - Full-Stack REST API Engine")
    print("Listening on http://localhost:5000")
    print("=" * 60)
    app.run(debug=True, host='0.0.0.0', port=5000)

