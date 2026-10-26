"""
Offline Clinical Intelligence Chatbot Engine
Provides structured, instantaneous medical guidance using a comprehensive
evidence-based local knowledge base without external API dependencies.
"""

import re

# Comprehensive Local Clinical Intelligence Database
KNOWLEDGE_BASE = [
    {
        "id": "diabetes",
        "title": "Diabetes Mellitus & Glycemic Health",
        "keywords": ["diabetes", "sugar", "glucose", "insulin", "hba1c", "hyperglycemia", "hypoglycemia", "prediabetes", "glycemic"],
        "summary": "Metabolic disorder involving insufficient insulin secretion or cellular resistance, leading to persistent hyperglycemia.",
        "symptoms": ["Frequent urination (polyuria)", "Excessive thirst (polydipsia)", "Unexplained weight loss", "Fatigue & weakness", "Blurred vision", "Slow-healing wounds"],
        "benchmarks": [
            "Fasting Blood Glucose: Normal < 100 mg/dL | Prediabetes 100-125 mg/dL | Diabetes ≥ 126 mg/dL",
            "HbA1c: Normal < 5.7% | Prediabetes 5.7% - 6.4% | Diabetes ≥ 6.5%",
            "Postprandial (2hr): Normal < 140 mg/dL | Diabetes ≥ 200 mg/dL"
        ],
        "lifestyle": [
            "Adopt low-glycemic, high-soluble-fiber whole foods (steel-cut oats, legumes, cruciferous greens).",
            "Engage in at least 150 minutes of weekly aerobic exercise (brisk walking, swimming).",
            "Monitor pre- and post-meal glucose to track glycemic variability.",
            "Stay hydrated (2.5 - 3L daily) to assist renal filtration of excess solutes."
        ]
    },
    {
        "id": "heart",
        "title": "Cardiovascular Health & Coronary Disease",
        "keywords": ["heart", "cardiac", "chest pain", "angina", "cholesterol", "blood pressure", "hypertension", "bp", "cardiovascular", "arrhythmia", "palpitations"],
        "summary": "Coronary artery disease and vascular conditions resulting from atherosclerotic plaque build-up and elevated arterial pressure.",
        "symptoms": ["Substernal chest pressure / angina", "Radiating pain to left shoulder, arm, or jaw", "Dyspnea (shortness of breath)", "Lightheadedness & diaphoresis", "Irregular heartbeats"],
        "benchmarks": [
            "Blood Pressure: Normal < 120/80 mmHg | Elevated 120-129/<80 | Stage 1 HTN 130-139/80-89",
            "Total Cholesterol: Desirable < 200 mg/dL",
            "LDL ('Bad') Cholesterol: Optimal < 100 mg/dL (or < 70 mg/dL in high risk)",
            "HDL ('Good') Cholesterol: Protective > 50 mg/dL (women), > 40 mg/dL (men)"
        ],
        "lifestyle": [
            "Follow the DASH (Dietary Approaches to Stop Hypertension) diet — restrict daily sodium to < 1,500 mg.",
            "Eliminate all artificial trans-fats and substitute saturated fats with Omega-3 polyunsaturated fatty acids.",
            "Incorporate daily moderate cardiovascular exercise approved by your physician.",
            "Completely avoid tobacco use and manage chronic emotional stress through mindfulness."
        ]
    },
    {
        "id": "parkinsons",
        "title": "Parkinson's Disease & Movement Disorders",
        "keywords": ["parkinson", "tremor", "stiffness", "rigidity", "bradykinesia", "balance", "gait", "dopamine", "neurodegenerative"],
        "summary": "Progressive neurodegenerative condition marked by the depletion of dopamine-producing neurons within the substantia nigra.",
        "symptoms": ["Unilateral resting tremor ('pill-rolling')", "Muscular rigidity & resistance to passive movement", "Bradykinesia (general slowness of physical movement)", "Postural instability & festinating gait", "Micrographia (shrinking handwriting)"],
        "benchmarks": [
            "Clinical evaluation using Unified Parkinson's Disease Rating Scale (UPDRS)",
            "DaTscan (dopamine transporter SPECT imaging) for neurochemical confirmation",
            "Positive motor response to initial trial of Levodopa therapy"
        ],
        "lifestyle": [
            "Maintain consistent timing with prescribed dopaminergic therapies (e.g. Carbidopa/Levodopa).",
            "Participate in targeted neuro-rehabilitation exercises such as LSVT BIG motor training.",
            "Consume adequate dietary fiber and maintain high fluid intake to relieve gastrointestinal motility slowdown.",
            "Create a fall-proof living space (remove throw rugs, install bathroom grab bars)."
        ]
    },
    {
        "id": "cancer",
        "title": "Oncology & Breast Cancer Detection",
        "keywords": ["cancer", "breast", "tumor", "mammogram", "malignant", "benign", "oncology", "biopsy", "lump"],
        "summary": "Abnormal cellular proliferation where cells gain the ability to invade surrounding anatomical tissues and metastasize.",
        "symptoms": ["New firm, painless palpable lump or mass with irregular borders", "Skin dimpling or 'peau d'orange' texture", "Inward nipple retraction or discharge", "Localized axillary lymph node enlargement"],
        "benchmarks": [
            "BI-RADS Breast Imaging Reporting & Data System: Score 1 (Negative) to 6 (Known Biopsy Malignancy)",
            "Diagnostic Digital Mammography & High-Resolution Breast Ultrasound",
            "Core Needle Histopathological Biopsy for definitive receptor typing (ER/PR/HER2/Ki-67)"
        ],
        "lifestyle": [
            "Conduct monthly systematic breast self-examinations and adhere to annual screening mammograms.",
            "Maintain an active lifestyle and healthy BMI (excess adipose tissue converts androgens into estrogen).",
            "Consume an antioxidant-dense Mediterranean diet abundant in cruciferous vegetables and green tea catechins.",
            "Limit alcohol intake, as alcohol consumption is directly correlated with higher hormone receptor-positive risk."
        ]
    },
    {
        "id": "kidney",
        "title": "Nephrology & Chronic Kidney Disease (CKD)",
        "keywords": ["kidney", "renal", "creatinine", "urea", "bun", "gfr", "egfr", "dialysis", "nephron", "proteinuria", "foamy urine"],
        "summary": "Progressive decline in renal filtration efficacy, leading to fluid retention and uremic toxin buildup.",
        "symptoms": ["Peripheral edema in feet, ankles, and periorbital regions", "Persistent foamy or frothy urine (proteinuria)", "Chronic fatigue and cognitive clouding", "Metallic taste in mouth & appetite loss", "Nocturia (frequent night urination)"],
        "benchmarks": [
            "Serum Creatinine: Normal 0.7 - 1.3 mg/dL",
            "eGFR (estimated Glomerular Filtration Rate): Normal ≥ 90 mL/min/1.73m² | Mild 60-89 | Moderate 30-59 | Severe < 30",
            "Blood Urea Nitrogen (BUN): Normal 7 - 20 mg/dL",
            "Urine Albumin-to-Creatinine Ratio (uACR): Normal < 30 mg/g"
        ],
        "lifestyle": [
            "Strict blood pressure management (< 130/80 mmHg) is the single most critical kidney-protective measure.",
            "Avoid habitual use of over-the-counter NSAID analgesics (ibuprofen, naproxen) which induce ischemic renal insult.",
            "Calibrate dietary protein intake with a nephrology dietitian to avoid excessive nitrogenous load.",
            "Stay appropriately hydrated, avoiding both dehydration and fluid overload."
        ]
    },
    {
        "id": "liver",
        "title": "Hepatology & Hepatic Functional Health",
        "keywords": ["liver", "hepatic", "bilirubin", "jaundice", "sgot", "sgpt", "alt", "ast", "fatty liver", "cirrhosis", "hepatitis"],
        "summary": "Hepatic functional compromise stemming from viral infection, metabolic dysfunction (NAFLD/NASH), or toxic exposure.",
        "symptoms": ["Scleral and cutaneous icterus (jaundice)", "Dark tea-colored amber urine", "Right upper quadrant abdominal fullness/pain", "Persistent pruritus (skin itching)", "Pale or clay-colored stools"],
        "benchmarks": [
            "Total Bilirubin: Normal 0.2 - 1.2 mg/dL",
            "ALT (Alanine Aminotransferase / SGPT): Normal 7 - 56 U/L",
            "AST (Aspartate Aminotransferase / SGOT): Normal 10 - 40 U/L",
            "Alkaline Phosphatase (ALP): Normal 44 - 147 U/L",
            "Serum Albumin: Normal 3.5 - 5.0 g/dL"
        ],
        "lifestyle": [
            "Complete abstention from ethanol consumption to allow hepatocyte regeneration.",
            "Eliminate refined high-fructose corn syrups and ultra-processed seed oils to arrest non-alcoholic steatohepatitis.",
            "Engage in structured aerobic training to mobilize intrahepatic lipid stores.",
            "Consult physician before taking concentrated dietary supplements or herbal extracts that stress hepatic cytochrome pathways."
        ]
    },
    {
        "id": "imaging",
        "title": "Radiology, Brain MRI & Chest X-Ray Triage",
        "keywords": ["mri", "x-ray", "xray", "scan", "radiology", "brain tumor", "pneumonia", "glioma", "meningioma", "pituitary", "consolidation"],
        "summary": "Non-invasive diagnostic imaging allowing anatomical cross-sectional visualization of neurocranial structures and thoracic lung fields.",
        "symptoms": ["Persistent atypical headaches waking patient from sleep", "Sudden-onset focal neurological deficits", "Unexplained persistent cough with productive sputum", "Pleuritic chest discomfort upon deep inspiration"],
        "benchmarks": [
            "Brain MRI: Contrast-enhanced T1, T2, and FLAIR sequencing evaluate structural mass effect and midline shift.",
            "Chest Radiography: Evaluates cardiothoracic ratio (< 0.50), costophrenic angle sharpness, and pulmonary parenchymal opacity."
        ],
        "lifestyle": [
            "Diagnostic computer-vision analysis serves strictly as triage assistance for prioritization.",
            "Always corroborate automated scan readings with formal radiologist review.",
            "Prepare for MRI scans by removing all ferromagnetic metallic implants or jewelry."
        ]
    },
    {
        "id": "emergency",
        "title": "Emergency Warning Signs & First-Aid Protocols",
        "keywords": ["emergency", "urgent", "heart attack", "stroke", "fast", "faint", "unconscious", "choking", "severe pain"],
        "summary": "Immediate life-critical recognition criteria for medical emergencies requiring urgent 911 / EMS dispatch.",
        "symptoms": [
            "STROKE (BE-FAST): Balance loss, Eye/vision change, Facial droop, Arm drift/weakness, Slurred Speech, Time to call EMS immediately.",
            "MYOCARDIAL INFARCTION: Crushing chest pain, left arm/jaw radiation, cold sweats, nausea.",
            "ANAPHYLAXIS: Sudden facial swelling, stridor breathing, diffuse urticaria hives.",
            "SEVERE HYPOGLYCEMIA: Profuse sweating, confusion, tremor, loss of consciousness (administer fast glucose or glucagon)."
        ],
        "benchmarks": ["Golden Hour Protocol: Door-to-balloon time < 90 mins for STEMI, thrombolytic window < 4.5 hrs for ischemic stroke."],
        "lifestyle": ["Never drive oneself to the hospital during suspected cardiac or stroke symptoms; always call professional emergency dispatch."]
    }
]

def format_response(item):
    res = f"### {item['title']}\n\n"
    res += f"**Overview:** {item['summary']}\n\n"
    res += "**Key Symptoms & Warning Signs:**\n"
    for s in item['symptoms']:
        res += f"• {s}\n"
    res += "\n**Clinical Diagnostic Benchmarks:**\n"
    for b in item['benchmarks']:
        res += f"• `{b}`\n"
    res += "\n**Evidence-Based Management & Guidance:**\n"
    for l in item['lifestyle']:
        res += f"1. {l}\n"
    res += "\n> *Disclaimer: OpenHealth AI provides educational clinical information and triage assistance. Always seek direct consultation from a licensed medical practitioner for personalized diagnosis and prescriptions.*"
    return res

def get_chatbot_reply(user_query):
    query = (user_query or "").strip().lower()
    if not query:
        return "Please ask a health, diagnostic, lab benchmark, or medical imaging query to receive instant clinical guidance."

    # Priority 1: Check emergency keywords
    for kw in ["emergency", "heart attack", "stroke", "fast", "unconscious", "can't breathe", "choking"]:
        if kw in query:
            for item in KNOWLEDGE_BASE:
                if item["id"] == "emergency":
                    return format_response(item)

    # Priority 2: Keyword match in knowledge base
    scored_matches = []
    for item in KNOWLEDGE_BASE:
        score = 0
        for kw in item["keywords"]:
            if re.search(r'\b' + re.escape(kw) + r'\b', query):
                score += 3
            elif kw in query:
                score += 1
        if score > 0:
            scored_matches.append((score, item))

    if scored_matches:
        scored_matches.sort(key=lambda x: x[0], reverse=True)
        return format_response(scored_matches[0][1])

    # General Wellness Guidance
    return (
        "### OpenHealth Clinical Consultation\n\n"
        "Thank you for reaching out to the OpenHealth Virtual Clinical Assistant. "
        "Here is evidence-based wellness guidance applicable to general preventive health:\n\n"
        "**Core Pillars of Preventive Health:**\n"
        "• **Metabolic Stability:** Prioritize whole, unprocessed foods with balanced macronutrients, dietary fiber, and adequate hydration (2.5L daily).\n"
        "• **Cardiovascular Fitness:** Engage in minimum 150 minutes of moderate-intensity aerobic exercise weekly (e.g. brisk walking, cycling, swimming).\n"
        "• **Annual Clinical Profiling:** Monitor baseline biomarkers: Fasting Glucose, HbA1c, Complete Lipid Panel, Liver Function (ALT/AST), and Kidney Health (eGFR, Creatinine).\n"
        "• **Sleep & Stress:** Target 7-9 hours of restorative sleep to support hormonal regulation and cellular repair.\n\n"
        "**Topics you can ask me about:**\n"
        "• Symptoms & lab benchmarks for *Diabetes, Heart Disease, Parkinson's, Breast Cancer, Liver Health, or Kidney Disease*.\n"
        "• Explanations of *Brain MRI Scans* and *Chest X-Ray* findings.\n"
        "• Emergency recognition protocols (*Stroke FAST*, *Heart Attack Warning Signs*).\n\n"
        "> *Notice: OpenHealth AI runs entirely on a verified local clinical intelligence engine and is designed for academic, triage, and educational purposes.*"
    )

