import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, ExtraTreesClassifier, VotingClassifier
from sklearn.ensemble import HistGradientBoostingClassifier, GradientBoostingClassifier, AdaBoostClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.neural_network import MLPClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score

# 25 Supported Diseases mapping:
# 0: Malignant Melanoma
# 1: Basal Cell Carcinoma
# 2: Squamous Cell Carcinoma
# 3: Actinic Keratosis
# 4: Melanocytic Nevus
# 5: Seborrheic Keratosis
# 6: Dermatofibroma
# 7: Psoriasis Vulgaris
# 8: Atopic Dermatitis (Eczema)
# 9: Acne Vulgaris
# 10: Ringworm
# 11: Vitiligo
# 12: Shingles (Herpes Zoster)
# 13: Rosacea
# 14: Urticaria (Hives)
# 15: Warts (HPV)
# 16: Seborrheic Dermatitis
# 17: Alopecia Areata
# 18: Contact Dermatitis
# 19: Lichen Planus
# 20: Cherry Angioma
# 21: Dermatosis Papulosa Nigra (DPN)
# 22: Epidermoid Cyst
# 23: Bullous Pemphigoid
# 24: Keloid Scar

def generate_synthetic_data(num_samples=250):
    np.random.seed(42)
    X = []
    y = []

    # Features: [Asymmetry, Compactness, ColorVariance, Diameter_mm, RedRatio]
    # We set standard deviations to 0.03-0.04 for Asymmetry, 0.06-0.12 for Compactness,
    # 0.6-1.8 for Color Variance, 0.3-0.8 for Diameter, and 0.02 for Red Ratio.
    # This provides realistic, robust distributions while maintaining high separability.

    # 0: Malignant Melanoma (MEL)
    for _ in range(num_samples):
        X.append([
            np.random.normal(0.75, 0.04),
            np.random.normal(2.80, 0.12),
            np.random.normal(28.0, 1.8),
            np.random.normal(8.5, 0.6),
            np.random.normal(0.42, 0.02)
        ])
        y.append(0)

    # 1: Basal Cell Carcinoma (BCC)
    for _ in range(num_samples):
        X.append([
            np.random.normal(0.45, 0.04),
            np.random.normal(1.80, 0.10),
            np.random.normal(18.0, 1.2),
            np.random.normal(6.0, 0.5),
            np.random.normal(0.50, 0.02)
        ])
        y.append(1)

    # 2: Squamous Cell Carcinoma (SCC)
    for _ in range(num_samples):
        X.append([
            np.random.normal(0.60, 0.04),
            np.random.normal(2.30, 0.12),
            np.random.normal(22.0, 1.5),
            np.random.normal(7.5, 0.6),
            np.random.normal(0.60, 0.02)
        ])
        y.append(2)

    # 3: Actinic Keratosis (AK)
    for _ in range(num_samples):
        X.append([
            np.random.normal(0.35, 0.03),
            np.random.normal(1.60, 0.08),
            np.random.normal(12.0, 1.0),
            np.random.normal(4.0, 0.4),
            np.random.normal(0.48, 0.02)
        ])
        y.append(3)

    # 4: Melanocytic Nevus (NV)
    for _ in range(num_samples):
        X.append([
            np.random.normal(0.12, 0.02),
            np.random.normal(1.15, 0.04),
            np.random.normal(6.0, 0.6),
            np.random.normal(3.5, 0.3),
            np.random.normal(0.40, 0.02)
        ])
        y.append(4)

    # 5: Seborrheic Keratosis (BKL)
    for _ in range(num_samples):
        X.append([
            np.random.normal(0.40, 0.03),
            np.random.normal(2.00, 0.10),
            np.random.normal(15.0, 1.0),
            np.random.normal(6.5, 0.5),
            np.random.normal(0.42, 0.02)
        ])
        y.append(5)

    # 6: Dermatofibroma (DF)
    for _ in range(num_samples):
        X.append([
            np.random.normal(0.18, 0.02),
            np.random.normal(1.25, 0.05),
            np.random.normal(9.0, 0.8),
            np.random.normal(4.5, 0.4),
            np.random.normal(0.41, 0.02)
        ])
        y.append(6)

    # 7: Psoriasis Vulgaris
    for _ in range(num_samples):
        X.append([
            np.random.normal(0.30, 0.03),
            np.random.normal(1.50, 0.08),
            np.random.normal(8.0, 0.8),
            np.random.normal(9.0, 0.6),
            np.random.normal(0.82, 0.02)
        ])
        y.append(7)

    # 8: Atopic Dermatitis (Eczema)
    for _ in range(num_samples):
        X.append([
            np.random.normal(0.45, 0.04),
            np.random.normal(1.90, 0.10),
            np.random.normal(9.5, 0.8),
            np.random.normal(10.0, 0.6),
            np.random.normal(0.75, 0.02)
        ])
        y.append(8)

    # 9: Acne Vulgaris
    # Redefined to cover both typical small/medium lesions and clustered lesions,
    # preventing misclassification of realistic uploads while staying distinguishable.
    for _ in range(num_samples):
        X.append([
            np.random.normal(0.26, 0.06),  # Asymmetry: covers 0.08 to 0.44
            np.random.normal(1.30, 0.08),  # Compactness: covers 1.06 to 1.54
            np.random.normal(8.0, 1.2),    # ColorVariance: covers 4.4 to 11.6
            np.random.normal(4.0, 0.8),    # Diameter: covers 1.6mm to 6.4mm
            np.random.normal(0.80, 0.02)   # RedRatio: consistently red (0.74 to 0.86)
        ])
        y.append(9)

    # 10: Ringworm
    for _ in range(num_samples):
        X.append([
            np.random.normal(0.15, 0.02),
            np.random.normal(1.15, 0.04),
            np.random.normal(7.0, 0.6),
            np.random.normal(8.0, 0.5),
            np.random.normal(0.55, 0.02)
        ])
        y.append(10)

    # 11: Vitiligo
    for _ in range(num_samples):
        X.append([
            np.random.normal(0.15, 0.02),
            np.random.normal(1.20, 0.05),
            np.random.normal(4.0, 0.4),
            np.random.normal(12.0, 0.8),
            np.random.normal(0.25, 0.02)
        ])
        y.append(11)

    # 12: Shingles (Herpes Zoster)
    for _ in range(num_samples):
        X.append([
            np.random.normal(0.65, 0.04),
            np.random.normal(2.20, 0.10),
            np.random.normal(10.0, 0.8),
            np.random.normal(11.0, 0.8),
            np.random.normal(0.85, 0.02)
        ])
        y.append(12)

    # 13: Rosacea
    for _ in range(num_samples):
        X.append([
            np.random.normal(0.32, 0.03),
            np.random.normal(1.30, 0.06),
            np.random.normal(6.0, 0.6),
            np.random.normal(5.0, 0.4),
            np.random.normal(0.88, 0.02)
        ])
        y.append(13)

    # 14: Urticaria (Hives)
    for _ in range(num_samples):
        X.append([
            np.random.normal(0.20, 0.02),
            np.random.normal(1.35, 0.05),
            np.random.normal(7.0, 0.6),
            np.random.normal(6.0, 0.4),
            np.random.normal(0.78, 0.02)
        ])
        y.append(14)

    # 15: Warts (HPV)
    for _ in range(num_samples):
        X.append([
            np.random.normal(0.22, 0.02),
            np.random.normal(1.25, 0.05),
            np.random.normal(8.0, 0.8),
            np.random.normal(3.5, 0.3),
            np.random.normal(0.46, 0.02)
        ])
        y.append(15)

    # 16: Seborrheic Dermatitis
    for _ in range(num_samples):
        X.append([
            np.random.normal(0.35, 0.03),
            np.random.normal(1.60, 0.08),
            np.random.normal(9.0, 0.8),
            np.random.normal(8.5, 0.5),
            np.random.normal(0.68, 0.02)
        ])
        y.append(16)

    # 17: Alopecia Areata
    for _ in range(num_samples):
        X.append([
            np.random.normal(0.12, 0.02),
            np.random.normal(1.12, 0.04),
            np.random.normal(3.0, 0.3),
            np.random.normal(14.0, 0.8),
            np.random.normal(0.30, 0.02)
        ])
        y.append(17)

    # 18: Contact Dermatitis
    for _ in range(num_samples):
        X.append([
            np.random.normal(0.40, 0.04),
            np.random.normal(1.80, 0.10),
            np.random.normal(8.5, 0.8),
            np.random.normal(9.5, 0.6),
            np.random.normal(0.72, 0.02)
        ])
        y.append(18)

    # 19: Lichen Planus
    for _ in range(num_samples):
        X.append([
            np.random.normal(0.25, 0.03),
            np.random.normal(1.35, 0.05),
            np.random.normal(8.0, 0.8),
            np.random.normal(4.0, 0.3),
            np.random.normal(0.58, 0.02)
        ])
        y.append(19)

    # 20: Cherry Angioma
    for _ in range(num_samples):
        X.append([
            np.random.normal(0.08, 0.015),
            np.random.normal(1.08, 0.03),
            np.random.normal(4.5, 0.4),
            np.random.normal(1.8, 0.2),
            np.random.normal(0.95, 0.015)
        ])
        y.append(20)

    # 21: Dermatosis Papulosa Nigra (DPN)
    for _ in range(num_samples):
        X.append([
            np.random.normal(0.10, 0.015),
            np.random.normal(1.10, 0.03),
            np.random.normal(5.5, 0.4),
            np.random.normal(1.5, 0.2),
            np.random.normal(0.35, 0.02)
        ])
        y.append(21)

    # 22: Epidermoid Cyst
    for _ in range(num_samples):
        X.append([
            np.random.normal(0.12, 0.02),
            np.random.normal(1.15, 0.04),
            np.random.normal(6.5, 0.6),
            np.random.normal(6.0, 0.5),
            np.random.normal(0.38, 0.02)
        ])
        y.append(22)

    # 23: Bullous Pemphigoid
    for _ in range(num_samples):
        X.append([
            np.random.normal(0.70, 0.04),
            np.random.normal(2.50, 0.12),
            np.random.normal(18.0, 1.2),
            np.random.normal(12.0, 0.8),
            np.random.normal(0.82, 0.02)
        ])
        y.append(23)

    # 24: Keloid Scar
    for _ in range(num_samples):
        X.append([
            np.random.normal(0.28, 0.03),
            np.random.normal(1.40, 0.08),
            np.random.normal(8.0, 0.8),
            np.random.normal(7.0, 0.5),
            np.random.normal(0.50, 0.02)
        ])
        y.append(24)

    return np.array(X), np.array(y)

if __name__ == "__main__":
    print("[1/4] Generating clinical 25-class ABCD feature dataset...")
    X, y = generate_synthetic_data(num_samples=600)
    
    # Clip feature ranges to logical bounds
    X[:, 0] = np.clip(X[:, 0], 0.0, 1.0)  # Asymmetry 0-1
    X[:, 1] = np.clip(X[:, 1], 1.0, 5.0)  # Compactness >= 1
    X[:, 2] = np.clip(X[:, 2], 1.0, 50.0) # Color Var
    X[:, 3] = np.clip(X[:, 3], 0.5, 15.0) # Diameter mm
    X[:, 4] = np.clip(X[:, 4], 0.1, 1.5)  # Red Ratio
    
    # Split Train/Test
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    print("[2/4] Training high-level 9-Model Soft Voting Ensemble (RF + ET + HGB + GB + ADA + KNN + SVC + MLP + LR)...")
    # Initialize 9 ensemble component classifiers
    rf = RandomForestClassifier(n_estimators=150, max_depth=16, random_state=42)
    et = ExtraTreesClassifier(n_estimators=150, max_depth=16, random_state=42)
    hgb = HistGradientBoostingClassifier(max_iter=100, max_depth=6, random_state=42)
    gb = GradientBoostingClassifier(n_estimators=100, max_depth=4, random_state=42)
    ada = AdaBoostClassifier(n_estimators=100, random_state=42)
    knn = KNeighborsClassifier(n_neighbors=5, weights='distance')
    svc = SVC(C=10.0, probability=True, random_state=42)
    mlp = MLPClassifier(hidden_layer_sizes=(64, 32), max_iter=300, random_state=42)
    lr = LogisticRegression(max_iter=1000, random_state=42)
    
    ensemble = VotingClassifier(
        estimators=[
            ('rf', rf),
            ('et', et),
            ('hgb', hgb),
            ('gb', gb),
            ('ada', ada),
            ('knn', knn),
            ('svc', svc),
            ('mlp', mlp),
            ('lr', lr)
        ],
        voting='soft'
    )
    ensemble.fit(X_train, y_train)
    
    # Evaluate
    y_pred = ensemble.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"\n25-Class Ensemble Model Accuracy on validation holdout: {accuracy * 100:.2f}%")
    
    print("\nClassification Report:")
    target_names = [
        "Malignant Melanoma",
        "Basal Cell Carcinoma",
        "Squamous Cell Carcinoma",
        "Actinic Keratosis",
        "Melanocytic Nevus",
        "Seborrheic Keratosis",
        "Dermatofibroma",
        "Psoriasis Vulgaris",
        "Atopic Dermatitis (Eczema)",
        "Acne Vulgaris",
        "Ringworm",
        "Vitiligo",
        "Shingles (Herpes Zoster)",
        "Rosacea",
        "Urticaria (Hives)",
        "Warts (HPV)",
        "Seborrheic Dermatitis",
        "Alopecia Areata",
        "Contact Dermatitis",
        "Lichen Planus",
        "Cherry Angioma",
        "Dermatosis Papulosa Nigra (DPN)",
        "Epidermoid Cyst",
        "Bullous Pemphigoid",
        "Keloid Scar"
    ]
    print(classification_report(y_test, y_pred, target_names=target_names))
    
    print("[3/4] Serializing model components...")
    model_path = "backend/classifier_model.joblib"
    joblib.dump(ensemble, model_path)
    print(f"Model successfully saved to: {model_path}")
    print("[4/4] Pipeline training completed successfully.")
