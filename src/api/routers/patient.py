from pathlib import Path
from datetime import datetime
from fastapi import APIRouter
from src.api.schemas import Envelope
from src.personalization.baseline_manager import BaselineManager
from src.personalization.patient_profile import PatientProfile
from src.api.state import PATIENT_DB

router=APIRouter(prefix="/api/v1/patient", tags=["patient"])
base=Path("data/patient_profiles"); manager=BaselineManager(base)

@router.get("/", response_model=Envelope)
async def list_patients() -> Envelope:
    """Return list of patients with summary info."""
    data = []
    for pid, entry in PATIENT_DB.items():
        last_rec = entry["history"][-1] if entry["history"] else None
        data.append({
            "patient_id": pid,
            "name": entry["info"]["name"],
            "last_risk": last_rec["risk_score"] if last_rec else 0,
            "last_updated": last_rec["timestamp"] if last_rec else datetime.utcnow().isoformat()
        })
    return Envelope(status="ok", data=data, message="patients listed")

@router.get("/{patient_id}/history", response_model=Envelope)
async def get_history(patient_id: str) -> Envelope:
    """Return full history for a patient."""
    history = PATIENT_DB.get(patient_id, {}).get("history", [])
    return Envelope(status="ok", data=history, message="history fetched")

@router.get("/reports/{patient_id}", response_model=Envelope)
async def get_report(patient_id: str) -> Envelope:
    """Return analytical report metrics for a patient."""
    history = PATIENT_DB.get(patient_id, {}).get("history", [])
    if not history:
        return Envelope(status="error", data={}, message="no history for report")
    
    avg_risk = sum(h["risk_score"] for h in history) / len(history)
    max_anomaly = max(h["anomaly_score"] for h in history)
    
    classes = [h["predicted_class"] for h in history]
    most_common = max(set(classes), key=classes.count)
    
    trend = [{"score": h["risk_score"], "timestamp": h["timestamp"]} for h in history]
    
    return Envelope(status="ok", data={
        "avg_risk": avg_risk,
        "max_anomaly": max_anomaly,
        "most_common_class": most_common,
        "risk_trend": trend
    }, message="report generated")

@router.get("/{patient_id}", response_model=Envelope)
async def get_patient(patient_id: str) -> Envelope:
    """Return existing or default patient profile."""
    p=base/f"{patient_id}_profile.json"; profile=PatientProfile.from_json(p) if p.exists() else PatientProfile(patient_id=patient_id)
    return Envelope(status="ok", data=profile.__dict__, message="patient fetched")

@router.post("/register", response_model=Envelope)
async def register_patient(patient_id: str, name: str = "Unknown", age: int = 0) -> Envelope:
    """Register a patient profile."""
    p=PatientProfile(patient_id=patient_id,name=name,age=age); p.to_json(base/f"{patient_id}_profile.json"); return Envelope(status="ok", data=p.__dict__, message="patient registered")

@router.put("/{patient_id}/reset", response_model=Envelope)
async def reset_patient(patient_id: str) -> Envelope:
    """Reset patient baseline state."""
    manager.reset(patient_id); return Envelope(status="ok", data={"patient_id":patient_id}, message="baseline reset")
