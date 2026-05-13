import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
import joblib

# ================= LOAD =================
df = pd.read_csv("dataset/karnataka_dataset.csv")
df = df.dropna()

# ================= FEATURES =================
X = df.drop("crop", axis=1)
y = df["crop"]

categorical_cols = ["district", "taluk", "season"]

# ================= SPLIT FIRST (IMPORTANT) =================
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# ================= ENCODING =================
X_train_encoded = pd.get_dummies(X_train, columns=categorical_cols)
X_test_encoded = pd.get_dummies(X_test, columns=categorical_cols)

# Align test columns to train columns
X_test_encoded = X_test_encoded.reindex(columns=X_train_encoded.columns, fill_value=0)

# Save columns
joblib.dump(X_train_encoded.columns.tolist(), "columns.pkl")

# ================= MODEL =================
model = RandomForestClassifier(
    n_estimators=200,
    max_depth=15,
    min_samples_split=10,
    random_state=42,
    n_jobs=-1
)

model.fit(X_train_encoded, y_train)

# ================= EVALUATION =================
y_pred = model.predict(X_test_encoded)

print("\n📊 Classification Report:\n")
print(classification_report(y_test, y_pred))

accuracy = model.score(X_test_encoded, y_test)
print("\n✅ Accuracy:", accuracy)

# ================= SAVE =================
joblib.dump(model, "crop_model.pkl")

print("\n✅ Model saved successfully!")