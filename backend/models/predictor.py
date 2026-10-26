"""
Multi-Disease Predictive Analytics Engine
Manages machine learning model artifacts, feature scaling, risk stratifications,
explainable AI (XAI) feature impact calculations, and clinical triage benchmarks.
"""

import os
import json
import joblib
import numpy as np

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ARTIFACTS_DIR = os.path.join(BASE_DIR, 'artifacts')

MODELS = {}
SCALERS = {}

DISEASE_KEYS = ['diabetes', 'heart', 'parkinsons', 'bcancer', 'liver', 'kidney']

def load_artifacts():
    for name in DISEASE_KEYS:
        model_path = os.path.join(ARTIFACTS_DIR, f"{name}_model.pkl")
        scaler_path = os.path.join(ARTIFACTS_DIR, f"{name}_scaler.pkl")
        if os.path.exists(model_path):
            try:
                MODELS[name] = joblib.load(model_path)
            except Exception as e:
                print(f"[WARN] Error loading model {name}: {e}")
        if os.path.exists(scaler_path):
            try:
                SCALERS[name] = joblib.load(scaler_path)
            except Exception as e:
                print(f"[WARN] Error loading scaler {name}: {e}")

load_artifacts()

def get_metrics_data():
    metrics_path = os.path.join(ARTIFACTS_DIR, 'model_metrics.json')
    if os.path.exists(metrics_path):
        with open(metrics_path, 'r') as f:
            return json.load(f)
    return {}

DISEASE_SCHEMA = {
    "diabetes": {
        "name": "Diabetes Mellitus Triage",
        "category": "Metabolic",
        "description": "Predicts onset of Type 2 Diabetes based on clinical diagnostic markers (PIMA Indian cohort).",
        "features": [
            {"key": "pregnancies", "label": "Pregnancies", "unit": "count", "min": 0, "max": 20, "step": 1, "default": 1, "normal": "0 - 4"},
            {"key": "Glucose", "label": "Plasma Glucose (2hr oral test)", "unit": "mg/dL", "min": 50, "max": 300, "step": 1, "default": 110, "normal": "70 - 140 mg/dL"},
            {"key": "BloodPressure", "label": "Diastolic Blood Pressure", "unit": "mmHg", "min": 30, "max": 140, "step": 1, "default": 72, "normal": "60 - 80 mmHg"},
            {"key": "skin_thickness", "label": "Triceps Skinfold Thickness", "unit": "mm", "min": 5, "max": 99, "step": 1, "default": 23, "normal": "10 - 30 mm"},
            {"key": "insulin", "label": "2-Hour Serum Insulin", "unit": "mu U/ml", "min": 10, "max": 800, "step": 1, "default": 79, "normal": "16 - 166 mu U/ml"},
            {"key": "BMI", "label": "Body Mass Index (BMI)", "unit": "kg/m²", "min": 15.0, "max": 65.0, "step": 0.1, "default": 25.5, "normal": "18.5 - 24.9"},
            {"key": "DiabetesPedigreeFunction", "label": "Diabetes Pedigree Score", "unit": "score", "min": 0.05, "max": 2.50, "step": 0.01, "default": 0.35, "normal": "0.1 - 0.5"},
            {"key": "Age", "label": "Patient Age", "unit": "years", "min": 18, "max": 100, "step": 1, "default": 32, "normal": "18 - 85"}
        ],
        "presets": {
            "healthy": {"pregnancies": 1, "Glucose": 95, "BloodPressure": 70, "skin_thickness": 20, "insulin": 75, "BMI": 22.4, "DiabetesPedigreeFunction": 0.25, "Age": 28},
            "borderline": {"pregnancies": 3, "Glucose": 135, "BloodPressure": 82, "skin_thickness": 28, "insulin": 140, "BMI": 28.5, "DiabetesPedigreeFunction": 0.45, "Age": 42},
            "high_risk": {"pregnancies": 6, "Glucose": 178, "BloodPressure": 90, "skin_thickness": 35, "insulin": 220, "BMI": 36.2, "DiabetesPedigreeFunction": 0.85, "Age": 54}
        }
    },
    "heart": {
        "name": "Coronary Artery Disease",
        "category": "Cardiovascular",
        "description": "Assesses presence of significant coronary artery narrowing using Cleveland Clinic diagnostic indicators.",
        "features": [
            {"key": "age", "label": "Age", "unit": "years", "min": 20, "max": 100, "step": 1, "default": 54, "normal": "20 - 85"},
            {"key": "sex", "label": "Sex", "unit": "binary", "options": [{"label": "Female", "value": 0}, {"label": "Male", "value": 1}], "default": 1},
            {"key": "cp", "label": "Chest Pain Type", "unit": "class", "options": [{"label": "Typical Angina (0)", "value": 0}, {"label": "Atypical Angina (1)", "value": 1}, {"label": "Non-anginal Pain (2)", "value": 2}, {"label": "Asymptomatic (3)", "value": 3}], "default": 0},
            {"key": "trestbps", "label": "Resting Blood Pressure", "unit": "mmHg", "min": 80, "max": 200, "step": 1, "default": 130, "normal": "90 - 120 mmHg"},
            {"key": "chol", "label": "Serum Cholesterol", "unit": "mg/dL", "min": 100, "max": 580, "step": 1, "default": 240, "normal": "< 200 mg/dL"},
            {"key": "fbs", "label": "Fasting Blood Sugar > 120 mg/dL", "unit": "binary", "options": [{"label": "No (<= 120)", "value": 0}, {"label": "Yes (> 120)", "value": 1}], "default": 0},
            {"key": "restecg", "label": "Resting ECG Results", "unit": "class", "options": [{"label": "Normal (0)", "value": 0}, {"label": "ST-T Wave Abnormality (1)", "value": 1}, {"label": "Left Ventricular Hypertrophy (2)", "value": 2}], "default": 1},
            {"key": "thalach", "label": "Maximum Heart Rate Achieved", "unit": "bpm", "min": 60, "max": 220, "step": 1, "default": 150, "normal": "120 - 180 bpm"},
            {"key": "exang", "label": "Exercise Induced Angina", "unit": "binary", "options": [{"label": "No", "value": 0}, {"label": "Yes", "value": 1}], "default": 0},
            {"key": "oldpeak", "label": "ST Depression (Exercise vs Rest)", "unit": "score", "min": 0.0, "max": 6.5, "step": 0.1, "default": 1.2, "normal": "0.0 - 1.0"},
            {"key": "slope", "label": "Slope of Peak Exercise ST", "unit": "class", "options": [{"label": "Upsloping (0)", "value": 0}, {"label": "Flat (1)", "value": 1}, {"label": "Downsloping (2)", "value": 2}], "default": 1},
            {"key": "ca", "label": "Major Vessels Colored by Fluoroscopy", "unit": "count", "min": 0, "max": 4, "step": 1, "default": 0, "normal": "0"},
            {"key": "thal", "label": "Thallium Stress Scintigraphy", "unit": "class", "options": [{"label": "Normal (1)", "value": 1}, {"label": "Fixed Defect (2)", "value": 2}, {"label": "Reversible Defect (3)", "value": 3}], "default": 2}
        ],
        "presets": {
            "healthy": {"age": 42, "sex": 0, "cp": 2, "trestbps": 115, "chol": 185, "fbs": 0, "restecg": 0, "thalach": 168, "exang": 0, "oldpeak": 0.0, "slope": 2, "ca": 0, "thal": 2},
            "borderline": {"age": 52, "sex": 1, "cp": 1, "trestbps": 134, "chol": 235, "fbs": 0, "restecg": 1, "thalach": 142, "exang": 0, "oldpeak": 1.4, "slope": 1, "ca": 1, "thal": 2},
            "high_risk": {"age": 63, "sex": 1, "cp": 0, "trestbps": 160, "chol": 290, "fbs": 1, "restecg": 2, "thalach": 118, "exang": 1, "oldpeak": 3.2, "slope": 1, "ca": 2, "thal": 3}
        }
    },
    "parkinsons": {
        "name": "Parkinson's Disease Phonetic Analysis",
        "category": "Neurological",
        "description": "Evaluates sustained acoustic vocal phonation dynamics to detect early neuro-motor laryngeal dysregulation (UCI Biomedical Data).",
        "features": [
            {"key": "MDVPFO", "label": "Fundamental Frequency MDVP:Fo", "unit": "Hz", "min": 80.0, "max": 260.0, "step": 0.1, "default": 154.2, "normal": "120 - 200 Hz"},
            {"key": "MDVPFHI", "label": "Max Vocal Frequency MDVP:Fhi", "unit": "Hz", "min": 100.0, "max": 590.0, "step": 0.1, "default": 197.1, "normal": "140 - 280 Hz"},
            {"key": "MDVPFLO", "label": "Min Vocal Frequency MDVP:Flo", "unit": "Hz", "min": 60.0, "max": 240.0, "step": 0.1, "default": 116.3, "normal": "75 - 150 Hz"},
            {"key": "MDVPJ", "label": "Acoustic Jitter Percentage", "unit": "%", "min": 0.001, "max": 0.04, "step": 0.0001, "default": 0.0062, "normal": "< 0.005%"},
            {"key": "RPDE", "label": "Recurrence Period Density Entropy", "unit": "ratio", "min": 0.20, "max": 0.75, "step": 0.01, "default": 0.49, "normal": "< 0.45"},
            {"key": "DFA", "label": "Detrended Fluctuation Analysis", "unit": "score", "min": 0.50, "max": 0.90, "step": 0.01, "default": 0.71, "normal": "< 0.68"},
            {"key": "spread2", "label": "Nonlinear Spread Dynamic", "unit": "score", "min": 0.01, "max": 0.50, "step": 0.01, "default": 0.22, "normal": "< 0.18"},
            {"key": "D2", "label": "Correlation Dimension D2", "unit": "dimension", "min": 1.4, "max": 3.7, "step": 0.01, "default": 2.38, "normal": "< 2.20"}
        ],
        "presets": {
            "healthy": {"MDVPFO": 197.076, "MDVPFHI": 206.896, "MDVPFLO": 192.055, "MDVPJ": 0.00289, "RPDE": 0.358522, "DFA": 0.627344, "spread2": 0.106886, "D2": 1.774415},
            "high_risk": {"MDVPFO": 119.992, "MDVPFHI": 157.302, "MDVPFLO": 74.997, "MDVPJ": 0.00784, "RPDE": 0.514783, "DFA": 0.815285, "spread2": 0.366482, "D2": 2.501442}
        }
    },
    "bcancer": {
        "name": "Breast Cancer Cytopathology",
        "category": "Oncology",
        "description": "Predicts malignancy versus benign status of breast fine needle aspirates (Wisconsin Diagnostic Dataset).",
        "features": [
            {"key": "mean_radius", "label": "Mean Cell Nucleus Radius", "unit": "μm", "min": 6.0, "max": 30.0, "step": 0.1, "default": 14.1, "normal": "7.0 - 15.0 μm"},
            {"key": "mean_texture", "label": "Mean Texture (Std Dev of Gray Values)", "unit": "score", "min": 9.0, "max": 40.0, "step": 0.1, "default": 19.2, "normal": "10.0 - 20.0"},
            {"key": "mean_perimeter", "label": "Mean Cell Perimeter", "unit": "μm", "min": 40.0, "max": 190.0, "step": 0.1, "default": 91.9, "normal": "50.0 - 95.0 μm"},
            {"key": "mean_area", "label": "Mean Cell Area", "unit": "μm²", "min": 140.0, "max": 2500.0, "step": 1.0, "default": 654.8, "normal": "200 - 700 μm²"},
            {"key": "mean_smoothness", "label": "Mean Smoothness (Local Variation in Radius)", "unit": "score", "min": 0.05, "max": 0.17, "step": 0.001, "default": 0.096, "normal": "0.06 - 0.10"},
            {"key": "mean_compactness", "label": "Mean Compactness (Perimeter² / Area - 1.0)", "unit": "ratio", "min": 0.01, "max": 0.35, "step": 0.001, "default": 0.104, "normal": "0.02 - 0.12"},
            {"key": "mean_concavity", "label": "Mean Concavity (Severity of Inset Contours)", "unit": "ratio", "min": 0.00, "max": 0.43, "step": 0.001, "default": 0.088, "normal": "< 0.08"},
            {"key": "mean_concave_points", "label": "Mean Number of Concave Portions", "unit": "count", "min": 0.00, "max": 0.21, "step": 0.001, "default": 0.048, "normal": "< 0.05"},
            {"key": "mean_symmetry", "label": "Mean Nuclear Symmetry", "unit": "score", "min": 0.10, "max": 0.31, "step": 0.001, "default": 0.181, "normal": "0.12 - 0.20"},
            {"key": "mean_fractal_dimension", "label": "Mean Fractal Dimension ('Coastline' Approx)", "unit": "score", "min": 0.04, "max": 0.10, "step": 0.001, "default": 0.062, "normal": "0.05 - 0.07"}
        ],
        "presets": {
            "benign": {"mean_radius": 12.45, "mean_texture": 15.70, "mean_perimeter": 82.57, "mean_area": 477.1, "mean_smoothness": 0.089, "mean_compactness": 0.065, "mean_concavity": 0.038, "mean_concave_points": 0.025, "mean_symmetry": 0.175, "mean_fractal_dimension": 0.059},
            "malignant": {"mean_radius": 17.99, "mean_texture": 20.38, "mean_perimeter": 122.8, "mean_area": 1001.0, "mean_smoothness": 0.118, "mean_compactness": 0.277, "mean_concavity": 0.300, "mean_concave_points": 0.147, "mean_symmetry": 0.241, "mean_fractal_dimension": 0.078}
        }
    },
    "liver": {
        "name": "Hepatic Disease Profile",
        "category": "Hepatology",
        "description": "Screens for toxic, metabolic, and viral liver inflammation and cellular dysfunction (Indian Liver Patient Dataset).",
        "features": [
            {"key": "age", "label": "Patient Age", "unit": "years", "min": 10, "max": 90, "step": 1, "default": 45, "normal": "18 - 80"},
            {"key": "gender", "label": "Biological Sex", "unit": "binary", "options": [{"label": "Female", "value": 0}, {"label": "Male", "value": 1}], "default": 1},
            {"key": "total_bilirubin", "label": "Total Bilirubin", "unit": "mg/dL", "min": 0.3, "max": 30.0, "step": 0.1, "default": 1.2, "normal": "0.2 - 1.2 mg/dL"},
            {"key": "direct_bilirubin", "label": "Direct (Conjugated) Bilirubin", "unit": "mg/dL", "min": 0.1, "max": 15.0, "step": 0.1, "default": 0.4, "normal": "0.1 - 0.3 mg/dL"},
            {"key": "alkaline_phosphotase", "label": "Alkaline Phosphatase (ALP)", "unit": "U/L", "min": 50, "max": 1800, "step": 1, "default": 210, "normal": "44 - 147 U/L"},
            {"key": "alamine_aminotransferase", "label": "Alanine Aminotransferase (ALT/SGPT)", "unit": "U/L", "min": 10, "max": 1500, "step": 1, "default": 35, "normal": "7 - 56 U/L"},
            {"key": "aspartate_aminotransferase", "label": "Aspartate Aminotransferase (AST/SGOT)", "unit": "U/L", "min": 10, "max": 1500, "step": 1, "default": 42, "normal": "10 - 40 U/L"},
            {"key": "total_proteins", "label": "Total Serum Proteins", "unit": "g/dL", "min": 2.0, "max": 10.0, "step": 0.1, "default": 6.8, "normal": "6.0 - 8.3 g/dL"},
            {"key": "albumin", "label": "Serum Albumin", "unit": "g/dL", "min": 1.0, "max": 6.0, "step": 0.1, "default": 3.4, "normal": "3.5 - 5.0 g/dL"},
            {"key": "albumin_globulin_ratio", "label": "Albumin to Globulin (A/G) Ratio", "unit": "ratio", "min": 0.2, "max": 2.8, "step": 0.05, "default": 1.0, "normal": "1.0 - 2.2"}
        ],
        "presets": {
            "healthy": {"age": 35, "gender": 1, "total_bilirubin": 0.8, "direct_bilirubin": 0.2, "alkaline_phosphotase": 130, "alamine_aminotransferase": 24, "aspartate_aminotransferase": 22, "total_proteins": 7.2, "albumin": 4.1, "albumin_globulin_ratio": 1.3},
            "high_risk": {"age": 58, "gender": 1, "total_bilirubin": 4.5, "direct_bilirubin": 2.1, "alkaline_phosphotase": 380, "alamine_aminotransferase": 115, "aspartate_aminotransferase": 140, "total_proteins": 5.8, "albumin": 2.4, "albumin_globulin_ratio": 0.7}
        }
    },
    "kidney": {
        "name": "Chronic Kidney Disease (CKD)",
        "category": "Nephrology",
        "description": "Calculates chronic renal damage and filtration compromise (UCI CKD Dataset).",
        "features": [
            {"key": "age", "label": "Patient Age", "unit": "years", "min": 10, "max": 95, "step": 1, "default": 50, "normal": "18 - 85"},
            {"key": "bp", "label": "Blood Pressure", "unit": "mmHg", "min": 50, "max": 180, "step": 5, "default": 80, "normal": "70 - 80 mmHg"},
            {"key": "sg", "label": "Urine Specific Gravity", "unit": "density", "options": [{"label": "1.005", "value": 1.005}, {"label": "1.010", "value": 1.010}, {"label": "1.015", "value": 1.015}, {"label": "1.020 (Normal)", "value": 1.020}, {"label": "1.025", "value": 1.025}], "default": 1.020},
            {"key": "al", "label": "Albumin in Urine", "unit": "scale (0-5)", "min": 0, "max": 5, "step": 1, "default": 0, "normal": "0"},
            {"key": "su", "label": "Sugar in Urine", "unit": "scale (0-5)", "min": 0, "max": 5, "step": 1, "default": 0, "normal": "0"},
            {"key": "bgr", "label": "Blood Glucose Random", "unit": "mg/dL", "min": 50, "max": 450, "step": 1, "default": 110, "normal": "70 - 140 mg/dL"},
            {"key": "bu", "label": "Blood Urea", "unit": "mg/dL", "min": 10, "max": 300, "step": 1, "default": 36, "normal": "15 - 40 mg/dL"},
            {"key": "sc", "label": "Serum Creatinine", "unit": "mg/dL", "min": 0.4, "max": 15.0, "step": 0.1, "default": 1.0, "normal": "0.6 - 1.2 mg/dL"},
            {"key": "hemo", "label": "Hemoglobin Concentration", "unit": "g/dL", "min": 4.0, "max": 18.0, "step": 0.1, "default": 14.5, "normal": "13.0 - 17.0 g/dL"},
            {"key": "pcv", "label": "Packed Cell Volume (Hematocrit)", "unit": "%", "min": 15, "max": 55, "step": 1, "default": 44, "normal": "40 - 50%"},
            {"key": "htn", "label": "History of Hypertension", "unit": "binary", "options": [{"label": "No", "value": 0}, {"label": "Yes", "value": 1}], "default": 0},
            {"key": "dm", "label": "Diabetes Mellitus Comorbidity", "unit": "binary", "options": [{"label": "No", "value": 0}, {"label": "Yes", "value": 1}], "default": 0}
        ],
        "presets": {
            "healthy": {"age": 36, "bp": 75, "sg": 1.020, "al": 0, "su": 0, "bgr": 98, "bu": 28, "sc": 0.9, "hemo": 15.2, "pcv": 46, "htn": 0, "dm": 0},
            "high_risk": {"age": 62, "bp": 95, "sg": 1.010, "al": 3, "su": 2, "bgr": 210, "bu": 92, "sc": 3.4, "hemo": 9.4, "pcv": 29, "htn": 1, "dm": 1}
        }
    }
}

def predict_disease(disease_name, feature_vector):
    name = (disease_name or "").lower().strip()
    model = MODELS.get(name)
    scaler = SCALERS.get(name)

    if not model:
        raise ValueError(f"Model artifact for '{name}' is not currently loaded.")

    features_arr = np.array(feature_vector, dtype=np.float64).reshape(1, -1)
    if scaler:
        features_arr = scaler.transform(features_arr)

    raw_pred = int(model.predict(features_arr)[0])
    prob = 50.0

    if hasattr(model, 'predict_proba'):
        probs = model.predict_proba(features_arr)[0]
        # In breast cancer: 0 is malignant (high risk), 1 is benign
        if name == 'bcancer':
            is_risk = (raw_pred == 0)
            prob = round(float(probs[0]) * 100, 1)
        else:
            is_risk = (raw_pred == 1)
            prob = round(float(probs[1]) * 100, 1) if len(probs) > 1 else round(float(probs[raw_pred]) * 100, 1)
    else:
        is_risk = (raw_pred == 1)
        prob = 85.0 if is_risk else 15.0

    # Risk Stratification
    if prob >= 70.0:
        risk_level = "CRITICAL / HIGH RISK"
        risk_badge = "danger"
        clinical_verdict = f"High probability of {DISEASE_SCHEMA.get(name, {}).get('name', name)} markers."
        triage_action = "Immediate physician consultation and secondary diagnostic profiling strongly advised."
    elif prob >= 40.0:
        risk_level = "MODERATE RISK"
        risk_badge = "warning"
        clinical_verdict = "Borderline physiological indicators detected."
        triage_action = "Schedule routine diagnostic re-evaluation and consider proactive lifestyle intervention."
    else:
        risk_level = "LOW RISK"
        risk_badge = "success"
        clinical_verdict = "Biomarkers lie within healthy physiological reference distributions."
        triage_action = "Maintain regular health checkups and balanced lifestyle habits."

    return {
        "disease": name,
        "disease_name": DISEASE_SCHEMA.get(name, {}).get("name", name),
        "prediction": raw_pred,
        "is_risk": is_risk,
        "risk_level": risk_level,
        "risk_badge": risk_badge,
        "probability": prob,
        "confidence": prob if is_risk else round(100.0 - prob, 1),
        "clinical_verdict": clinical_verdict,
        "triage_action": triage_action
    }

