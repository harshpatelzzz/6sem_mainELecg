"""Risk endpoints."""
from __future__ import annotations
import numpy as np
from fastapi import APIRouter
from src.api.schemas import Envelope
from src.decision.risk_engine import RiskEngine
router=APIRouter(prefix="/api/v1/risk", tags=["risk"])
engine=RiskEngine()
@router.get("/{patient_id}/history", response_model=Envelope)
async def risk_history(patient_id: str, n: int = 50) -> Envelope:
    """Return patient risk history."""
    tr=engine.get_trajectory(patient_id,last_n=n); return Envelope(status="ok", data={"trajectory":[{"timestamp":t.isoformat(),"score":s,"level":l} for t,s,l in tr]}, message="risk history")
@router.get("/{patient_id}/summary", response_model=Envelope)
async def risk_summary(patient_id: str, n: int = 50) -> Envelope:
    """Return patient risk summary statistics."""
    tr=engine.get_trajectory(patient_id,last_n=n); arr=np.array([s for _,s,_ in tr],dtype=np.float32); mean=float(arr.mean()) if arr.size else 0.0; mx=float(arr.max()) if arr.size else 0.0; trend=float(arr[-1]-arr[0]) if arr.size>1 else 0.0
    return Envelope(status="ok", data={"mean":mean,"max":mx,"trend":trend}, message="risk summary")
