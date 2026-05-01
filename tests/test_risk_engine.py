"""Tests for risk engine."""
from src.decision.risk_engine import RiskEngine

def test_risk_trajectory_length(): r=RiskEngine(); [r.update_risk("p",0.4) for _ in range(10)]; assert len(r.get_trajectory("p",5))==5
def test_risk_level_mapping(): _,lvl,_=RiskEngine().update_risk("p",1.0); assert lvl in {"LOW","MODERATE","HIGH","CRITICAL"}
def test_alert_triggers_on_large_jump(): r=RiskEngine(alpha=0.1); r.update_risk("p",0.0); _,_,a=r.update_risk("p",1.0); assert a
def test_exponential_smoothing_alpha(): r=RiskEngine(alpha=0.5); r.update_risk("p",0.0); v,_,_=r.update_risk("p",1.0); assert abs(v-0.5)<1e-6
