"""Patient profile endpoints."""
from __future__ import annotations
from pathlib import Path
from fastapi import APIRouter
from src.api.schemas import Envelope
from src.personalization.baseline_manager import BaselineManager
from src.personalization.patient_profile import PatientProfile
router=APIRouter(prefix="/api/v1/patient", tags=["patient"])
base=Path("data/patient_profiles"); manager=BaselineManager(base)
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
