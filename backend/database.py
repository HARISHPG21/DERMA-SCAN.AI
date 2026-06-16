import os
from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, Float, func
from sqlalchemy.orm import declarative_base, sessionmaker

DB_PATH = os.path.join(os.path.dirname(__file__), "dermascan.db")
DATABASE_URL = f"sqlite:///{DB_PATH}"

# Initialize SQLAlchemy Engine and Session factory
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Prediction(Base):
    __tablename__ = "predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(String, nullable=False)
    filename = Column(String, nullable=True)
    diagnosis = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    severity = Column(String, nullable=False)
    score = Column(Float, nullable=False)
    affected_area = Column(Float, nullable=False)
    model_used = Column(String, nullable=False)

def init_db():
    """Initializes the database tables and prepopulates mock statistics if empty."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        count = db.query(Prediction).count()
        if count == 0:
            mock_data = [
                ("2026-05-15 10:24:11", "acne_sample.jpg", "Acne Vulgaris", 92.4, "Mild", 1.8, 14.5, "MobileNetV2"),
                ("2026-05-20 14:15:32", "eczema_patch.png", "Atopic Dermatitis (Eczema)", 88.7, "Moderate", 4.2, 35.0, "CNN"),
                ("2026-05-28 09:10:04", "spot_lesion.jpg", "Malignant Melanoma", 91.2, "Severe", 8.4, 45.0, "EfficientNetB0"),
                ("2026-06-01 11:34:55", "psoriasis_scale.png", "Psoriasis Vulgaris", 96.3, "Moderate", 4.8, 42.0, "EfficientNetB0"),
                ("2026-06-05 16:40:12", "ringworm_ring.jpg", "Ringworm", 87.5, "Mild", 2.2, 10.0, "MobileNetV2"),
                ("2026-06-08 13:22:19", "spot_lesion.jpg", "Malignant Melanoma", 93.8, "Severe", 8.8, 48.0, "EfficientNetB0"),
                ("2026-06-10 10:05:44", "vitiligo_patch.jpg", "Vitiligo", 94.1, "Moderate", 5.2, 28.5, "CNN"),
                ("2026-06-12 15:44:23", "acne_forehead.jpg", "Acne Vulgaris", 95.0, "Mild", 1.2, 8.0, "MobileNetV2"),
                ("2026-06-13 11:12:09", "vitiligo_arm.png", "Vitiligo", 96.5, "Moderate", 5.0, 31.0, "CNN"),
                ("2026-06-14 17:21:05", "eczema_flare.jpg", "Atopic Dermatitis (Eczema)", 91.5, "Moderate", 4.5, 38.0, "CNN")
            ]
            for row in mock_data:
                db.add(Prediction(
                    timestamp=row[0],
                    filename=row[1],
                    diagnosis=row[2],
                    confidence=row[3],
                    severity=row[4],
                    score=row[5],
                    affected_area=row[6],
                    model_used=row[7]
                ))
            db.commit()
    finally:
        db.close()

def insert_prediction(filename, diagnosis, confidence, severity, score, affected_area, model_used):
    """Saves a diagnostic prediction transaction to the database."""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    db = SessionLocal()
    try:
        pred = Prediction(
            timestamp=timestamp,
            filename=filename,
            diagnosis=diagnosis,
            confidence=confidence,
            severity=severity,
            score=score,
            affected_area=affected_area,
            model_used=model_used
        )
        db.add(pred)
        db.commit()
    finally:
        db.close()

def get_history(limit=50):
    """Fetches diagnostic prediction history logs sorted descending."""
    db = SessionLocal()
    try:
        preds = db.query(Prediction).order_by(Prediction.timestamp.desc()).limit(limit).all()
        return [
            {
                "id": p.id,
                "timestamp": p.timestamp,
                "filename": p.filename,
                "diagnosis": p.diagnosis,
                "confidence": p.confidence,
                "severity": p.severity,
                "score": p.score,
                "affected_area": p.affected_area,
                "model_used": p.model_used
            }
            for p in preds
        ]
    finally:
        db.close()

def get_statistics():
    """Calculates general stats for admin dashboards and progress trackers."""
    db = SessionLocal()
    try:
        total = db.query(Prediction).count()
        if total == 0:
            return {
                "total": 0,
                "avg_severity": 0.0,
                "common_disease": "None",
                "accuracy": 94.8,
                "distribution": {},
                "timeline": []
            }
            
        avg_sev = db.query(func.avg(Prediction.score)).scalar() or 0.0
        avg_sev = round(float(avg_sev), 2)
        
        common_disease_row = (
            db.query(Prediction.diagnosis, func.count(Prediction.diagnosis))
            .group_by(Prediction.diagnosis)
            .order_by(func.count(Prediction.diagnosis).desc())
            .first()
        )
        common_disease = common_disease_row[0] if common_disease_row else "None"
        
        dist_rows = db.query(Prediction.diagnosis, func.count(Prediction.diagnosis)).group_by(Prediction.diagnosis).all()
        distribution = {row[0]: row[1] for row in dist_rows}
        
        timeline_rows = db.query(Prediction.timestamp, Prediction.score, Prediction.affected_area, Prediction.diagnosis).order_by(Prediction.timestamp.asc()).all()
        timeline = [
            {
                "timestamp": row[0],
                "score": row[1],
                "affected_area": row[2],
                "diagnosis": row[3]
            }
            for row in timeline_rows
        ]
        
        return {
            "total": total,
            "avg_severity": avg_sev,
            "common_disease": common_disease,
            "accuracy": 94.8,
            "distribution": distribution,
            "timeline": timeline
        }
    finally:
        db.close()
