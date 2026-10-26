"""
Evidence-Based Clinical Diet & Lifestyle Recommendation Engine
Generates tailored dietary guidelines, meal schedules, and medical precautions
based on diagnosed disease conditions and patient subtypes.
"""

CLINICAL_DIET_PLANS = {
    "diabetes": {
        "title": "Diabetes Mellitus Glycemic Management Plan",
        "condition_name": "Type 2 / Impaired Glycemic Tolerance",
        "foods_to_eat": [
            "Non-starchy vegetables (spinach, kale, broccoli, cauliflower, bell peppers)",
            "Whole grains with high soluble fiber (steel-cut oats, quinoa, brown rice, barley)",
            "Lean protein sources (skinless poultry, organic eggs, tofu, lentils, chickpeas)",
            "Monounsaturated & polyunsaturated healthy fats (avocados, extra virgin olive oil, walnuts, chia seeds)",
            "Low-glycemic antioxidant berries in controlled portions (blueberries, raspberries, blackberries)"
        ],
        "foods_to_avoid": [
            "Refined sucrose, high-fructose corn syrup, sweetened sodas, and packaged fruit juices",
            "White refined flour bakery goods (white sandwich bread, pastries, commercial biscuits)",
            "Deep-fried items, trans-fat shortenings, and hydrogenated spreads",
            "High-glycemic dried fruits (dates, raisins in excess) and canned fruits in syrup",
            "Full-fat dairy sweetened desserts and flavored yogurts"
        ],
        "precautions": [
            "Perform scheduled blood glucose checks (both fasting and 2-hour postprandial).",
            "Space macronutrients evenly across 3 balanced meals to mitigate severe insulin spikes.",
            "Maintain moderate cardiovascular exercise (at least 30 mins brisk walking daily).",
            "Maintain baseline hydration with pure water or unsweetened herbal teas."
        ],
        "meal_plan": {
            "breakfast": "Scrambled egg whites or spiced tofu bhurji with sauteed spinach, accompanied by 1 slice 100% whole grain rye bread and matcha green tea.",
            "lunch": "Steamed quinoa or brown basmati bowl with grilled chicken breast / seasoned yellow lentil dal, steamed broccoli florets, and cucumber salad with flaxseed oil.",
            "snack": "A measured handful (25g) of raw roasted almonds with fresh raspberries.",
            "dinner": "Pan-seared wild salmon or herbed cottage cheese with grilled asparagus, zucchini ribbons, and warm clear vegetable broth."
        }
    },
    "heart": {
        "title": "Cardiovascular Health & DASH Diet Plan",
        "condition_name": "Coronary Artery & Hypertensive Care",
        "foods_to_eat": [
            "Cardioprotective Omega-3 rich foods (wild salmon, mackerel, chia seeds, cold-milled flaxseed)",
            "High soluble-fiber items (rolled oats, black beans, lentils, Brussels sprouts, apples)",
            "Potassium & magnesium rich produce (ripe bananas, sweet potatoes, dark leafy greens, avocados)",
            "Anti-inflammatory culinary botanicals (fresh garlic, ginger root, turmeric with black pepper)",
            "Raw unrefined tree nuts (walnuts, almonds) and polyphenol-dense cold-pressed olive oil"
        ],
        "foods_to_avoid": [
            "High-sodium processed deli meats (cured ham, bacon, sausages, salami, canned soups)",
            "Hydrogenated oils, commercial palm shortening, and bakery items rich in trans-fats",
            "Heavy marble-cut red meats, organ meats, and excess dairy butter",
            "High-caffeine energy stimulant drinks and excessive alcohol intake",
            "Salty snack foods, processed potato chips, and instant ramen noodle seasonings"
        ],
        "precautions": [
            "Restrict cumulative daily sodium intake to strictly below 1,500 - 2,000 mg.",
            "Log morning and evening resting blood pressure readings in a clinical diary.",
            "Engage in physician-cleared low-impact aerobic conditioning (brisk walking, lap swimming).",
            "Implement progressive muscle relaxation or meditative breathing to dampen sympathetic stress."
        ],
        "meal_plan": {
            "breakfast": "Warm steel-cut oatmeal cooked in unsweetened almond milk, topped with sliced banana, crushed walnuts, and ground cinnamon.",
            "lunch": "Mediterranean grain salad: cooked farro, cherry tomatoes, cucumbers, kalamata olives, grilled turkey or chickpeas, dressed in lemon-olive oil vinaigrette.",
            "snack": "Sliced crisp green apple with 1 tablespoon of all-natural unsalted peanut butter.",
            "dinner": "Baked lemon-herb cod or grilled firm tofu steak served with steamed sweet potato medallions and garlic-sauteed kale."
        }
    },
    "parkinsons": {
        "title": "Parkinson's Disease Neuro-Nutrition & Motility Plan",
        "condition_name": "Neurodegenerative Motor Health",
        "foods_to_eat": [
            "High-fiber whole grains (steel-cut oats, whole wheat bran, barley) to counter delayed gastrointestinal transit",
            "Polyphenol & flavonoid rich berries (blackberries, blueberries, acai, pomegranate seeds)",
            "Omega-3 fatty acids for neuro-membrane resilience (flaxseeds, walnuts, oily ocean fish)",
            "Dark leafy greens delivering natural folate, magnesium, and vitamin K (spinach, Swiss chard, collards)",
            "Adequate dietary fluid intake (minimum 2.5 liters of filtered water and herbal tisanes daily)"
        ],
        "foods_to_avoid": [
            "Heavy protein loads immediately concurrent with Levodopa dosing (separate dietary protein from medication by 60 mins)",
            "Highly processed snack foods laden with industrial preservatives and artificial additives",
            "Excessive caffeinated beverages that exacerbate resting tremors and dehydrate the body",
            "Hard, dry, difficult-to-chew foods if dysphagia (swallowing difficulty) is emerging",
            "High-sugar confectioneries that promote systemic inflammation and energy crashes"
        ],
        "precautions": [
            "Calibrate dietary protein timing so Levodopa medication achieves optimal amino acid carrier absorption.",
            "Incorporate structured physical and speech therapy sessions (LSVT BIG and LOUD principles).",
            "Maintain upright posture during and for 30 minutes following meals to guard against aspiration.",
            "Keep daily mobility logs tracking 'on' and 'off' medication windows."
        ],
        "meal_plan": {
            "breakfast": "Oat porridge made with chia seeds, topped with fresh blueberries, served alongside pure chamomile tea.",
            "lunch": "Vegetable minestrone soup enriched with cannellini beans, zucchini, and carrots, paired with whole-grain sourdough toast.",
            "snack": "Fresh sliced pear paired with smooth walnut puree or sunflower seed butter.",
            "dinner": "(Protein-focused window): Grilled chicken breast or baked salmon fillet with quinoa pilaf and steamed baby carrots."
        }
    },
    "bcancer": {
        "title": "Oncological Cellular Health & Recovery Plan",
        "condition_name": "Breast & Cellular Longevity Care",
        "foods_to_eat": [
            "Cruciferous vegetables rich in sulforaphane and indole-3-carbinol (broccoli sprouts, Brussels sprouts, cabbage, cauliflower)",
            "Antioxidant-dense berries and citrus fruits providing bioavailable Vitamin C and ellagic acid",
            "Naturally occurring phytoestrogenic whole legumes (edamame, black beans, sprouted lentils)",
            "Green tea (EGCG polyphenols) and herbal infusions (turmeric, rosemary, peppermint)",
            "Healthy fats from cold-pressed flaxseed oil, avocados, and raw pumpkin seeds"
        ],
        "foods_to_avoid": [
            "Charred, flame-broiled, and blackened meats containing heterocyclic amines (HCAs) and polycyclic aromatic hydrocarbons (PAHs)",
            "Processed meats treated with nitrates and nitrites (bacon, cold cuts, hot dogs)",
            "Alcoholic beverages of all varieties (alcohol directly alters systemic circulating estrogen metabolism)",
            "Refined simple carbohydrates and corn syrup that drive hyperinsulinemia",
            "Artificial trans-fat bakery shortening and deep-fried fast food"
        ],
        "precautions": [
            "Maintain an optimal lean body composition, as excess peripheral adipose tissue is a key site of aromatase enzyme activity.",
            "Schedule and adhere to annual mammographic surveillance and clinical oncological exams.",
            "Perform weekly resistance training to preserve bone mineral density and muscular vitality.",
            "Practice stress-reduction modalities to modulate systemic cortisol levels."
        ],
        "meal_plan": {
            "breakfast": "Antioxidant smoothie: unsweetened almond milk, 1 scoop plant pea protein, baby spinach, frozen organic blueberries, and 1 tbsp ground flaxseeds.",
            "lunch": "Superfood salad: baby kale, shaved red cabbage, edamame, grated carrots, walnuts, dressed in tahini-lemon dressing.",
            "snack": "Crisp cucumber rounds and baby bell peppers dipped in traditional garlic hummus.",
            "dinner": "Slow-baked wild salmon or grilled spiced tempeh with roasted cauliflower florets and steamed organic wild rice."
        }
    },
    "liver": {
        "title": "Hepatic Metabolic Support & Detoxification Plan",
        "condition_name": "Hepatocellular & Liver Wellness",
        "foods_to_eat": [
            "Glutathione-supporting sulfur foods (garlic, onions, leeks, shallots, asparagus)",
            "Cruciferous vegetables enhancing phase-II hepatic detoxification pathways (broccoli, arugula, radish)",
            "Antioxidant-rich black coffee (in moderation, clinically documented to reduce fibrosis progression)",
            "Cold-pressed extra virgin olive oil for beneficial hepatic lipid balance",
            "Soluble fiber grains (oats, barley, chia seeds) that bind biliary cholesterol"
        ],
        "foods_to_avoid": [
            "All alcoholic beverages without exception (ethanol poses immediate direct hepatotoxic stress)",
            "Refined high-fructose corn syrup beverages and packaged confections (primary drivers of hepatic de novo lipogenesis)",
            "Deep-fried battered foods and industrial trans-fats",
            "Unchecked high doses of iron supplements or unprescribed herbal concoctions",
            "High-sodium cured goods promoting fluid retention and hepatic vascular strain"
        ],
        "precautions": [
            "Abstain entirely from alcohol to facilitate hepatocellular recovery and reduce transaminase enzymes.",
            "Avoid unverified dietary herbal weight-loss supplements known to cause drug-induced liver injury (DILI).",
            "Monitor liver function panels (ALT, AST, ALP, Total Bilirubin) at 3 to 6-month clinical intervals.",
            "Maintain moderate daily physical exercise to reverse hepatic steatosis."
        ],
        "meal_plan": {
            "breakfast": "Freshly brewed drip black coffee, paired with poached eggs, sauteed spinach, and a slice of sprouted sourdough toast.",
            "lunch": "Grilled Mediterranean chicken or lentil soup with a large bitter greens salad (arugula, radicchio, endive) dressed in olive oil and apple cider vinegar.",
            "snack": "A cup of green tea with a handful of raw walnuts.",
            "dinner": "Pan-seared cod or roasted chickpeas served with roasted asparagus, steamed beetroot, and brown rice."
        }
    },
    "kidney": {
        "title": "Renal Protective & Electrolyte-Balanced Plan",
        "condition_name": "Nephrology & Renal Function Care",
        "foods_to_eat": [
            "Low-potassium, antioxidant-rich fruits (red apples, blueberries, strawberries, cranberries, red grapes)",
            "Renal-friendly vegetables (cauliflower, red bell peppers, cabbage, garlic, onions, raw radishes)",
            "High-biological-value protein in controlled, measured portions (egg whites, skinless chicken breast)",
            "Healthy caloric density from olive oil, avocados (in measured amounts), and white rice / sourdough",
            "Fresh herbs and spices (garlic powder, rosemary, dill, oregano) to season food without sodium"
        ],
        "foods_to_avoid": [
            "High-sodium processed meals, canned soups, cured bacon, and commercial table salt",
            "High-potassium produce when advised by nephrologist (oranges, bananas, tomatoes, potatoes, spinach in excess)",
            "High-phosphorus packaged items, colas with added phosphoric acid, and heavily processed cheese",
            "Excessive, uncontrolled red meat protein loads that elevate serum urea nitrogen and creatinine",
            "Habitual NSAID pain medication use without nephrologist clearance"
        ],
        "precautions": [
            "Strictly follow your nephrologist's daily fluid and electrolyte guidelines.",
            "Keep daily dietary sodium below 1,500 mg to guard against volume overload and arterial hypertension.",
            "Monitor serum creatinine, blood urea nitrogen (BUN), and eGFR every 3 months.",
            "Avoid potassium-based salt substitutes which can induce dangerous hyperkalemia."
        ],
        "meal_plan": {
            "breakfast": "Egg white scramble with diced red bell peppers and scallions, served with toasted sourdough bread and fresh blueberry compote.",
            "lunch": "Cold pasta salad made with chilled rotini, shredded chicken breast, chopped celery, diced cucumber, dressed in light olive oil and lemon juice.",
            "snack": "A crisp red apple paired with 1 tablespoon of unsalted sunflower seed spread.",
            "dinner": "Herb-roasted turkey tenderloin or baked firm tofu with steamed cauliflower mash and seasoned green beans."
        }
    }
}

def get_diet_plan(condition_key, subtype="Standard Clinical"):
    key = (condition_key or "diabetes").lower().strip()
    if key not in CLINICAL_DIET_PLANS:
        key = "diabetes"
    plan = CLINICAL_DIET_PLANS[key].copy()
    plan["selected_condition"] = key
    plan["selected_subtype"] = subtype
    return plan

