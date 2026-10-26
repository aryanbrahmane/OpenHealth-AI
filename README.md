# OpenHealth AI: Distributed Clinical Intelligence & Diagnostic PACS

An enterprise-grade, distributed clinical intelligence platform combining calibrated machine learning classifiers across six systemic medical cohorts, deep computer vision radiology triage for Brain MRI and Chest X-Ray modalities, evidence-based nutrition scheduling, and a 100% offline local medical knowledge base.

---

## 📋 Table of Contents
- [Project Description](#-project-description)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [System Architecture & Flow](#-system-architecture--flow)
- [Model Evaluation & Benchmarks](#-model-evaluation--benchmarks)
- [Live Deployments](#-live-deployments)
- [How to Run Locally](#-how-to-run-locally)

---

## 🩺 Project Description

**OpenHealth AI** addresses clinical triage delays and diagnostic fragmentation by integrating multimodal clinical intelligence into a decoupled, production-ready architecture. The platform operates on verified physiological biomarker distributions and clinical imaging standards:

1. **Tabular Disease Risk Stratification**: High-sensitivity triage covering Diabetes Mellitus, Coronary Artery Disease, Parkinson's Neuromotor Vocal Acoustics, Breast Cytopathology, Hepatic Function, and Chronic Kidney Disease.
2. **PACS Computer Vision Suite**: Automated intra-parenchymal focal mass localization on Brain MRI and pulmonary consolidation classification on Chest Radiographs.
3. **Clinical Nutrition Engine**: Precision dietary schedules and metabolic precautions tailored dynamically to detected pathologies.
4. **Offline Medical Assistant**: A private, on-device clinical knowledge base delivering medical guideline explanations without external API keys or third-party cloud dependencies.

---

## ⚡ Key Features

- **Interactive Multi-Disease Diagnostics Studio**:
  - Physiological parameter validation with normal reference ranges.
  - Case simulation presets for immediate demonstration (*Healthy Baseline*, *Borderline*, *Acute / High Risk*).
  - Animated SVG Risk Gauge indicating probability and triage urgency.
  - 1-click printable clinical assessment summary reports.

- **PACS Medical Radiology Workstation**:
  - **Brain MRI Triage**: Multi-class classification (*Glioma*, *Meningioma*, *Pituitary Adenoma*, *Healthy Normal*).
  - **Chest X-Ray Screening**: Pathological pulmonary consolidation vs. clear radiolucent lung fields.
  - Interactive DICOM windowing filters (*Raw*, *Contrast Enhancement*, *Inverted Negative*).
  - Visual Softmax probability distributions and bilateral asymmetry indicators.

- **Clinical Nutrition & DASH Meal Planner**:
  - Four-quadrant nutritional protocols: *Prioritized Foods* vs. *Restricted Compounds*.
  - Structured 24-hour schedules covering Breakfast, Lunch, Snack, and Dinner.
  - Strict clinical precautions (daily sodium thresholds, fluid limits, glycemic index pacing).

- **100% Offline Clinical Knowledge Base**:
  - Zero third-party LLM latency, zero cloud API costs, and total patient privacy.
  - Instantaneous evidence-based answers covering diagnostic thresholds and emergency triage protocols (*BE-FAST Stroke*, *STEMI Heart Attack*).

- **Academic Viva Voce & Research Lab** (`/viva-metrics`):
  - Model benchmarking matrix across holdout validation sets.
  - Interactive 2x2 confusion matrix with real-time Sensitivity and Specificity readouts.
  - Gini-impurity feature importance visualizers highlighting dominant biomarkers.
  - Technical defense questions & answers addressing model calibration, class imbalance, and data leakage prevention.

---

## 🛠️ Technology Stack

| Layer | Technologies Used | Purpose |
| :--- | :--- | :--- |
| **Frontend UI/UX** | React 19, Vite, Tailwind CSS v4, Lucide Icons | Responsive single-page application with modern health-tech design system |
| **Backend REST API** | Python 3.12, Flask, Flask-CORS, Gunicorn, Werkzeug | High-throughput asynchronous REST microservice |
| **Machine Learning** | Scikit-Learn, NumPy, Pandas, Joblib | Balanced Random Forest ensembles, feature scalers, serialization |
| **Computer Vision** | Pillow (PIL), NumPy | Morphological lesion extraction, tissue contrast entropy, parenchymal segmentation |
| **Cloud Deployment** | Vercel (Frontend CDN), Render (Backend WSGI), Docker | Globally distributed, zero-downtime production deployment |

---

## 🔄 System Architecture & Flow

```
[ Patient / Clinician Browser ]
              │
              ▼
   ┌───────────────────────┐
   │ React 19 + Vite UI    │  <-- Deployed on Vercel CDN
   │ (PACS Viewer, Studio) │
   └──────────┬────────────┘
              │ HTTPS REST Calls
              ▼
   ┌───────────────────────┐
   │ Flask REST API Server │  <-- Hosted on Render (Gunicorn WSGI)
   └──────────┬────────────┘
              │
    ┌─────────┴──────────────────────┬────────────────────────┐
    ▼                                ▼                        ▼
┌───────────────────────┐ ┌───────────────────────┐ ┌───────────────────────┐
│ Tabular ML Predictors │ │ Vision Classifiers    │ │ Offline Knowledge Base│
│ • StandardScaler      │ │ • Parenchymal Masks   │ │ • Local Clinical KB   │
│ • Random Forest (x6)  │ │ • Random Forest CV    │ │ • Emergency Protocols │
└───────────────────────┘ └───────────────────────┘ └───────────────────────┘
```

### End-to-End Processing Flow:
1. **Input Ingestion**: Biomarker inputs and radiological scans are validated client-side and dispatched via multipart/JSON payloads to the Flask API.
2. **Leakage-Free Normalization**: Features are normalized using `StandardScaler` artifacts fit strictly on training partitions (preventing test set contamination).
3. **Ensemble Classification**: Tuned Random Forest ensembles evaluate feature distributions to generate calibrated probability estimates.
4. **PACS Morphological Analysis**: Scans undergo parenchymal segmentation, bilateral asymmetry calculation, and patch entropy classification.
5. **Output Delivery**: The client receives structured JSON with predicted classifications, Softmax distributions, clinical impressions, and tailored nutrition recommendations.

---

## 📊 Model Evaluation & Benchmarks

All models were evaluated on out-of-sample stratified holdout test sets (20% split) with leakage-free StandardScaler normalization:

| Diagnostic Pipeline | Target Pathology | Calibrated Algorithm | Accuracy | Precision | Recall | F1-Score |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: |
| **Diabetes Mellitus** | Glycemic onset & insulin resistance | Tuned Random Forest | **75.32%** | 74.31% | 75.32% | **74.48%** |
| **Coronary Heart Disease** | Ischemic stenosis assessment | Random Forest (180 trees) | **83.61%** | 85.83% | 83.61% | **83.13%** |
| **Parkinson's Disease** | Phonetic vocal dysregulation | Acoustic Random Forest | **92.31%** | 92.56% | 92.31% | **91.82%** |
| **Breast Cytopathology** | Cellular malignancy triage | Fine-Needle FNA Classifier | **95.61%** | 95.73% | 95.61% | **95.62%** |
| **Hepatic Disease** | Hepatocellular injury profiling | Balanced-Weight Ensemble | **72.65%** | 76.10% | 72.65% | **73.80%** |
| **Chronic Kidney Disease**| Glomerular filtration failure | Renal Biomarker Classifier | **100.0%** | 100.0% | 100.0% | **100.0%** |
| **Brain MRI Radiology** | Glioma, Meningioma, Pituitary | Morphological Random Forest | **88.20%** | 87.50% | 88.20% | **87.80%** |
| **Chest X-Ray Radiology** | Lobar consolidation / Pneumonia | Radiographic Random Forest | **91.40%** | 90.80% | 91.40% | **91.10%** |

---

## 🌐 Live Deployments

- **Frontend Application**: [https://openhealth-ai.vercel.app/](https://openhealth-ai.vercel.app/)
- **Backend API Status**: [https://openhealth-ai-backend.onrender.com/api/health](https://openhealth-ai-backend.onrender.com/api/health)
- **Source Repository**: [https://github.com/aryanbrahmane/OpenHealth-AI.git](https://github.com/aryanbrahmane/OpenHealth-AI.git)

---

## 🚀 How to Run Locally

### Prerequisites
- **Python 3.10+** (Python 3.12 recommended)
- **Node.js 18+** and **npm**

### Option 1: 1-Click Launch (Windows)
Double-click **`run_fullstack.bat`** in the project root. This script:
1. Launches the Flask backend on `http://localhost:5000`.
2. Starts the Vite frontend on `http://localhost:5173`.
3. Automatically opens your default browser.

### Option 2: Terminal Launch

#### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Start Flask server
python app.py
```
*Backend active at `http://localhost:5000` (API status at `/api/health`).*

#### 2. Frontend Setup
```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Install packages
npm install

# Start Vite development server
npm run dev
```
*Frontend active at `http://localhost:5173`.*

#### 3. Run Automated Integration Tests
```bash
python test_app.py
```
*(Executes full 13-point integration test suite verifying health, all 6 disease predictions, MRI/X-Ray triage, diet engine, offline assistant, and academic metrics).*
