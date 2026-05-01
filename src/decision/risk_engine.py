"""Continuous cardiac risk engine."""
from __future__ import annotations
from datetime import datetime
class RiskEngine:
    """Maintain per-patient risk history and smoothed trajectories."""
    def __init__(self, alpha: float = 0.3) -> None:
        self.alpha=alpha; self.risk_history: dict[str, list[tuple[datetime,float]]]={}
    def _level(self, r: float) -> str:
        if r < 0.25: return "LOW"
        if r < 0.50: return "MODERATE"
        if r < 0.75: return "HIGH"
        return "CRITICAL"
    def update_risk(self, patient_id: str, output_score: float) -> tuple[float,str,bool]:
        """Update smoothed risk and return score, level, alert flag."""
        hist=self.risk_history.setdefault(patient_id,[]); prev=hist[-1][1] if hist else 0.0; new=self.alpha*prev + (1-self.alpha)*float(output_score); hist.append((datetime.utcnow(),new)); return new,self._level(new),(new-prev)>0.15
    def get_trajectory(self, patient_id: str, last_n: int = 50) -> list[tuple[datetime,float,str]]:
        """Return timestamped risk trajectory with levels."""
        return [(ts,s,self._level(s)) for ts,s in self.risk_history.get(patient_id,[])[-last_n:]]
