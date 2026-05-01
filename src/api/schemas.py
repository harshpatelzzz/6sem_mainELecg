"""API schemas."""
from __future__ import annotations
from datetime import datetime
from pydantic import BaseModel
class Envelope(BaseModel):
    """Consistent API response envelope."""
    status: str
    data: dict
    message: str=""
class AnalysisResponse(BaseModel):
    """ECG analysis response payload."""
    patient_id: str
    timestamp: datetime
    predicted_class: str
    confidence: float
    is_ood: bool
    anomaly_score: float
    deviation_score: float
    uncertainty: float
    risk_score: float
    risk_level: str
    alert: bool
    risk_trajectory: list[dict]
