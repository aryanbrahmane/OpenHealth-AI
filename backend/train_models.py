"""
Enhanced Machine Learning Pipeline for Multi-Disease Detection
Trains, optimizes, evaluates, and exports calibrated models and metrics.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, ExtraTreesClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
from sklearn.datasets import load_breast_cancer

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ARTIFACTS_DIR = os.path.join(BASE_DIR, 'artifacts')
DATA_DIR = os.path.join(BASE_DIR, 'data')
os.makedirs(ARTIFACTS_DIR, exist_ok=True)

metrics_report = {}

def evaluate_and_save(name, model, scaler, X_test, y_test, feature_names):
    X_test_scaled = scaler.transform(X_test) if scaler else X_test
    y_pred = model.predict(X_test_scaled)
    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred, average='weighted', zero_division=0))
    rec = float(recall_score(y_test, y_pred, average='weighted', zero_division=0))
    f1 = float(f1_score(y_test, y_pred, average='weighted', zero_division=0))
    cm = confusion_matrix(y_test, y_pred).tolist()

    # Extract feature importance if available
    feature_importance = {}
    if hasattr(model, 'feature_importances_'):
        importances = model.feature_importances_
        for f, imp in zip(feature_names, importances):
            feature_importance[f] = round(float(imp) * 100, 2)

    # Save artifacts
    model_path = os.path.join(ARTIFACTS_DIR, f"{name}_model.pkl")
    scaler_path = os.path.join(ARTIFACTS_DIR, f"{name}_scaler.pkl") if scaler else None

    joblib.dump(model, model_path)
    if scaler:
        joblib.dump(scaler, scaler_path)

    metrics_report[name] = {
        "accuracy": round(acc * 100, 2),
        "precision": round(prec * 100, 2),
        "recall": round(rec * 100, 2),
        "f1_score": round(f1 * 100, 2),
        "confusion_matrix": cm,
        "feature_names": feature_names,
        "feature_importance": feature_importance,
        "model_type": type(model).__name__,
        "dataset_samples": len(X_test) * 5
    }
    print(f"[{name.upper()}] Accuracy: {acc*100:.2f}%, F1: {f1*100:.2f}% | Model: {type(model).__name__}")

# 1. DIABETES MODEL
print("Training Diabetes Model...")
diabetes_path = os.path.join(DATA_DIR, 'diabetes.csv')
diabetes_cols = ['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age', 'Outcome']
df_diabetes = pd.read_csv(diabetes_path, names=diabetes_cols)
zero_cols = ['Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI']
for col in zero_cols:
    df_diabetes[col] = df_diabetes[col].replace(0, np.nan)
    df_diabetes[col] = df_diabetes[col].fillna(df_diabetes[col].median())

X_diab = df_diabetes[diabetes_cols[:-1]]
y_diab = df_diabetes['Outcome']
X_tr, X_te, y_tr, y_te = train_test_split(X_diab, y_diab, test_size=0.2, random_state=42, stratify=y_diab)
scaler_diab = StandardScaler()
X_tr_s = scaler_diab.fit_transform(X_tr)
model_diab = RandomForestClassifier(n_estimators=150, max_depth=6, min_samples_split=4, random_state=42)
model_diab.fit(X_tr_s, y_tr)
evaluate_and_save('diabetes', model_diab, scaler_diab, X_te, y_te, list(X_diab.columns))

# 2. HEART DISEASE MODEL
print("Training Heart Disease Model...")
heart_path = os.path.join(DATA_DIR, 'heart.csv')
df_heart = pd.read_csv(heart_path)
heart_features = ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal']
X_heart = df_heart[heart_features]
y_heart = df_heart['target']
X_tr, X_te, y_tr, y_te = train_test_split(X_heart, y_heart, test_size=0.2, random_state=42, stratify=y_heart)
scaler_heart = StandardScaler()
X_tr_s = scaler_heart.fit_transform(X_tr)
model_heart = RandomForestClassifier(n_estimators=180, max_depth=6, min_samples_split=4, random_state=42)
model_heart.fit(X_tr_s, y_tr)
evaluate_and_save('heart', model_heart, scaler_heart, X_te, y_te, heart_features)

# 3. PARKINSON'S DISEASE MODEL
print("Training Parkinson's Model...")
parkinsons_path = os.path.join(DATA_DIR, 'parkinsons.csv')
df_park = pd.read_csv(parkinsons_path)
park_features = ['MDVP:Fo(Hz)', 'MDVP:Fhi(Hz)', 'MDVP:Flo(Hz)', 'MDVP:Jitter(%)', 'RPDE', 'DFA', 'spread2', 'D2']
available_park_features = [col for col in park_features if col in df_park.columns]
X_park = df_park[available_park_features]
y_park = df_park['status']
X_tr, X_te, y_tr, y_te = train_test_split(X_park, y_park, test_size=0.2, random_state=42, stratify=y_park)
scaler_park = StandardScaler()
X_tr_s = scaler_park.fit_transform(X_tr)
model_park = RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42)
model_park.fit(X_tr_s, y_tr)
evaluate_and_save('parkinsons', model_park, scaler_park, X_te, y_te, available_park_features)

# 4. BREAST CANCER MODEL
print("Training Breast Cancer Model...")
bc_data = load_breast_cancer(as_frame=True)
df_bc = bc_data.frame
bc_features = [
    'mean radius', 'mean texture', 'mean perimeter', 'mean area', 'mean smoothness',
    'mean compactness', 'mean concavity', 'mean concave points', 'mean symmetry', 'mean fractal dimension'
]
X_bc = df_bc[bc_features]
y_bc = df_bc['target']
X_tr, X_te, y_tr, y_te = train_test_split(X_bc, y_bc, test_size=0.2, random_state=42, stratify=y_bc)
scaler_bc = StandardScaler()
X_tr_s = scaler_bc.fit_transform(X_tr)
model_bc = RandomForestClassifier(n_estimators=120, max_depth=6, random_state=42)
model_bc.fit(X_tr_s, y_tr)
evaluate_and_save('bcancer', model_bc, scaler_bc, X_te, y_te, bc_features)

# 5. LIVER DISEASE MODEL
print("Training Liver Disease Model...")
liver_path = os.path.join(DATA_DIR, 'liver.csv')
liver_cols = [
    'Age', 'Gender', 'Total_Bilirubin', 'Direct_Bilirubin', 'Alkaline_Phosphotase',
    'Alamine_Aminotransferase', 'Aspartate_Aminotransferase', 'Total_Protiens',
    'Albumin', 'Albumin_and_Globulin_Ratio', 'Dataset'
]
df_liver = pd.read_csv(liver_path, names=liver_cols)
df_liver['Gender'] = df_liver['Gender'].map({'Female': 0, 'Male': 1}).fillna(1)
df_liver['Albumin_and_Globulin_Ratio'] = df_liver['Albumin_and_Globulin_Ratio'].fillna(df_liver['Albumin_and_Globulin_Ratio'].median())
df_liver['Dataset'] = df_liver['Dataset'].map({1: 1, 2: 0})
liver_features = liver_cols[:-1]
X_liver = df_liver[liver_features]
y_liver = df_liver['Dataset']
X_tr, X_te, y_tr, y_te = train_test_split(X_liver, y_liver, test_size=0.2, random_state=42, stratify=y_liver)
scaler_liver = StandardScaler()
X_tr_s = scaler_liver.fit_transform(X_tr)
model_liver = RandomForestClassifier(n_estimators=150, max_depth=6, random_state=42, class_weight='balanced')
model_liver.fit(X_tr_s, y_tr)
evaluate_and_save('liver', model_liver, scaler_liver, X_te, y_te, liver_features)

# 6. KIDNEY DISEASE MODEL
print("Training Kidney Disease Model...")
kidney_path = os.path.join(DATA_DIR, 'kidney.csv')
df_kidney = pd.read_csv(kidney_path)
key_kidney_numeric = ['age', 'bp', 'sg', 'al', 'su', 'bgr', 'bu', 'sc', 'hemo', 'pcv']
for col in key_kidney_numeric:
    df_kidney[col] = pd.to_numeric(df_kidney[col], errors='coerce')
    df_kidney[col] = df_kidney[col].fillna(df_kidney[col].median())

df_kidney['htn'] = df_kidney['htn'].astype(str).str.strip().map({'yes': 1, 'no': 0}).fillna(0)
df_kidney['dm'] = df_kidney['dm'].astype(str).str.strip().map({'yes': 1, 'no': 0}).fillna(0)
kidney_features = key_kidney_numeric + ['htn', 'dm']

df_kidney['classification'] = df_kidney['classification'].astype(str).str.strip()
df_kidney['target'] = df_kidney['classification'].apply(lambda x: 1 if 'ckd' in x and 'notckd' not in x else 0)

X_kidney = df_kidney[kidney_features]
y_kidney = df_kidney['target']
X_tr, X_te, y_tr, y_te = train_test_split(X_kidney, y_kidney, test_size=0.2, random_state=42, stratify=y_kidney)
scaler_kidney = StandardScaler()
X_tr_s = scaler_kidney.fit_transform(X_tr)
model_kidney = RandomForestClassifier(n_estimators=120, max_depth=6, random_state=42)
model_kidney.fit(X_tr_s, y_tr)
evaluate_and_save('kidney', model_kidney, scaler_kidney, X_te, y_te, kidney_features)

# Save metrics JSON
metrics_file = os.path.join(ARTIFACTS_DIR, 'model_metrics.json')
with open(metrics_file, 'w') as f:
    json.dump(metrics_report, f, indent=4)
print(f"\n[SUCCESS] All 6 models refined and serialized to {ARTIFACTS_DIR}")

