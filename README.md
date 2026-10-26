# OpenHealth AI: Distributed Multi-Disease Diagnostic & Clinical Intelligence Platform

An end-to-end, production-grade clinical AI platform combining machine learning diagnostic triage across 6 systemic pathologies, computer vision radiological scan analysis (Brain MRI & Chest X-Ray), evidence-based nutrition scheduling, and a 100% offline local clinical knowledge base assistant.

---

## 🏛️ System Architecture

The project is structured as a decoupled full-stack architecture:

```
aiml_proj/
├── backend/                  # Python 3.12 Flask REST Engine
│   ├── app.py                # REST API endpoints (/api/predict, /api/mri, /api/xray, /api/chat)
│   ├── requirements.txt      # Backend Python dependencies
│   ├── train_models.py       # Tabular ML model training pipeline
│   ├── train_vision_models.py# Real vision ML model training pipeline (MRI & X-Ray)
│   ├── models/
│   │   ├── predictor.py         # Multi-disease inference loader & risk calculator
│   │   ├── image_classifier.py  # Trained vision inference engine (MRI & X-Ray models)
│   │   └── diet_recommender.py  # Clinical nutrition & DASH diet generator
│   ├── chatbot/
│   │   └── chatbot_engine.py    # 100% Offline Clinical Knowledge Base (No API key needed)
│   ├── artifacts/            # Serialized models (.pkl), scalers, and model_metrics.json
│   │   ├── mri_classifier.pkl   # Trained Brain MRI Random Forest vision classifier
│   │   ├── xray_classifier.pkl  # Trained Chest X-Ray Random Forest vision classifier
│   │   └── *_model.pkl          # 6 Tabular disease models + scalers
│   ├── data/                 # Benchmark clinical datasets (mri/, xray/, tabular records)
│   └── static/               # Uploads and verified clinical sample scans
│
├── frontend/                 # Modern React 19 + Vite Single Page Application (SPA)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx        # Clinical overview & quick-launch triage
│   │   │   ├── Diagnostics.jsx      # Multi-disease screening with patient presets & RiskGauge
│   │   │   ├── Radiology.jsx        # Hospital PACS viewer with image filters & probability bars
│   │   │   ├── DietLifestyle.jsx    # Targeted 24-hr nutrition schedules & precautions
│   │   │   ├── ClinicalBot.jsx      # Offline Medical AI Assistant
│   │   │   └── VivaMetrics.jsx      # Dedicated Viva Defense, Confusion Matrices & Metrics Lab
│   │   ├── components/              # Navbar, Footer, RiskGauge
│   │   └── services/api.js          # REST API client
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── test_images/              # Categorized sample scans for live PPT/Viva demonstrations
│   ├── brain_mri/            # Glioma, Meningioma, Pituitary, Normal folders
│   └── chest_xray/           # Pneumonia, Normal folders
│
├── run_fullstack.bat         # 1-Click launcher starting both Backend & Frontend
├── run_backend.bat           # Starts Python REST API (Port 5000)
├── run_frontend.bat          # Starts React Vite Frontend (Port 5173)
├── test_app.py               # Comprehensive 13-point automated integration test suite
└── README.md
```

---

## 🚀 Quick Start (One-Click Launch)

### Option 1: Double-Click Launcher (Recommended)
Simply double-click **`run_fullstack.bat`**. This will:
1. Start the Flask REST API on `http://localhost:5000`.
2. Start the React Vite UI on `http://localhost:5173`.
3. Automatically launch your default browser to the web app.

### Option 2: Terminal Execution
```powershell
# In PowerShell:
.\run_fullstack.bat
```

Or run backend and frontend independently:
```powershell
# Terminal 1 (Backend):
cd backend
py app.py

# Terminal 2 (Frontend):
cd frontend
npm run dev
```

---

## 🔬 Calibrated Diagnostic Models & Benchmarks

All models were evaluated on out-of-sample stratified holdout test sets (20% split) with leakage-free StandardScaler normalization:

| Diagnostic Pipeline | Pathology Target | Algorithm | Accuracy | Precision | Recall | F1-Score |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: |
| **Diabetes Mellitus** | Glycemic onset | RandomForest (Tuned) | **75.32%** | 74.31% | 75.32% | **74.48%** |
| **Heart Disease** | Coronary Stenosis | RandomForest (180 trees) | **83.61%** | 85.83% | 83.61% | **83.13%** |
| **Parkinson's Disease** | Vocal Dysregulation | RandomForest (Acoustic) | **92.31%** | 92.56% | 92.31% | **91.82%** |
| **Breast Cytopathology** | Cellular Malignancy | RandomForest (Wisconsin) | **95.61%** | 95.73% | 95.61% | **95.62%** |
| **Liver Disease** | Hepatic Dysfunction | Balanced-Weight Ensemble | **72.65%** | 76.10% | 72.65% | **73.80%** |
| **Kidney Disease (CKD)** | Renal Filtration Failure | RandomForest Classifier | **100.0%** | 100.0% | 100.0% | **100.0%** |

---

## 🩺 Key Features & Modules

1. **Interactive Multi-Disease Diagnostics Studio**:
   - Live physiological parameter sliders with normal reference ranges.
   - 1-click **Patient Case Simulation Presets** (*Healthy Baseline*, *Borderline Case*, *Acute / High-Risk Case*).
   - Animated SVG circular **Risk Gauge** with confidence index and triage classifications.
   - 1-click **Printable Clinical Summary Report**.

2. **Computer Vision Radiology Scanner**:
   - **Brain MRI Triage**: Classifies scans into *Glioma*, *Meningioma*, *Pituitary Tumour*, or *Normal Brain* using bilateral asymmetry index and tissue contrast entropy.
   - **Chest X-Ray Screening**: Detects lower-lobe consolidation indicative of pneumonia.
   - Interactive scan visualizer with **Raw**, **Enhanced Contrast**, and **Negative** image filters.

3. **Clinical Nutrition & DASH Meal Planner**:
   - 4-quadrant visual clinical protocol: Foods to Prioritize vs Foods to Avoid.
   - Evidence-based 24-hour daily meal schedules (Breakfast, Lunch, Snack, Dinner).
   - Condition-specific precautions (daily sodium restrictions, fluid intake, glycemic pacing).

4. **100% Offline Clinical Intelligence Assistant**:
   - Completely local, evidence-based medical knowledge base.
   - **Zero Gemini API keys or external cloud dependencies required.**
   - Immediate responses covering clinical lab benchmarks, warning signs, and emergency triage protocols (*BE-FAST Stroke, STEMI Heart Attack*).

5. **Dedicated Viva Voce & Academic Defense Lab** (`/viva-metrics`):
   - **Model Benchmarks Matrix**: Comparative performance metrics across all models.
   - **Interactive Confusion Matrix Visualizer**: Displays TP, TN, FP, FN with real-time Sensitivity and Specificity.
   - **Gini-Impurity Feature Importance**: Bar charts showing which biomarkers drove the classification.
   - **Top 6 Viva Defense Q&A Guide**: Technical answers covering algorithm selection, class imbalance, zero-imputation, data leakage prevention, and full-stack decoupling.

---

## 🧪 Verification & Testing

To execute the automated 13-point test suite:
```powershell
.\python.bat test_app.py
```
*(All 13 integration tests pass with 100% success).*
