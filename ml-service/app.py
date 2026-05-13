from flask import Flask, request, jsonify
import joblib
import pandas as pd

app = Flask(__name__)

# ================= LOAD =================
model = joblib.load("crop_model.pkl")
columns = joblib.load("columns.pkl")

# ================= PREPROCESS =================
def preprocess_input(data):
    df = pd.DataFrame([data])

    # Convert numeric fields
    numeric_fields = [
        "soil_ph", "nitrogen", "phosphorus",
        "potassium", "temperature", "humidity", "rainfall"
    ]

    for field in numeric_fields:
        df[field] = pd.to_numeric(df[field], errors="coerce")

    df = pd.get_dummies(df)

    # Align with training columns
    df = df.reindex(columns=columns, fill_value=0)

    return df

# ================= VALIDATION =================
def validate_input(data):
    required_fields = [
        "district", "taluk", "soil_ph",
        "nitrogen", "phosphorus", "potassium",
        "temperature", "humidity", "rainfall", "season"
    ]

    for field in required_fields:
        if field not in data:
            return f"Missing field: {field}"

    # Range checks
    if not (0 <= float(data["soil_ph"]) <= 14):
        return "Invalid soil_ph range"

    if float(data["rainfall"]) < 0:
        return "Rainfall cannot be negative"

    return None

# ================= ROUTE =================
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        # ✅ Validate
        error = validate_input(data)
        if error:
            return jsonify({"success": False, "error": error}), 400

        # ✅ Preprocess
        input_df = preprocess_input(data)

        # ================= PREDICT =================
        probs = model.predict_proba(input_df)[0]
        classes = model.classes_

        top_indices = probs.argsort()[-3:][::-1]

        results = [
            {
                "crop": classes[i],
                "confidence": round(float(probs[i]), 3)
            }
            for i in top_indices
        ]

        # ================= ADD BASIC ADVISORY =================
        advisory = []

        if float(data["nitrogen"]) < 30:
            advisory.append("Nitrogen is low → consider urea application")

        if float(data["soil_ph"]) < 5.5:
            advisory.append("Soil is acidic → add lime")

        if float(data["rainfall"]) < 50:
            advisory.append("Low rainfall → irrigation needed")

        return jsonify({
            "success": True,
            "predictions": results,
            "advisory": advisory
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# ================= HEALTH =================
@app.route("/", methods=["GET"])
def home():
    return "✅ Crop ML API is running"

# ================= RUN =================
if __name__ == "__main__":
    app.run(port=8000, debug=True)