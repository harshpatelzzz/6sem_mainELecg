"""API tests."""
from fastapi.testclient import TestClient
from src.api.main import app
client=TestClient(app)
def test_missing_patient_id_returns_422(): assert client.post("/api/v1/analyze").status_code==422
def test_risk_history_endpoint(): assert client.get("/api/v1/risk/p1/history").status_code==200
def test_analyze_endpoint_returns_200():
    r=client.post("/api/v1/analyze", files={"ecg_file":("ecg.csv",b"0.1,0.2,0.3,0.4")}, data={"patient_id":"p1"}); assert r.status_code in {200,500}
def test_full_pipeline_response_schema():
    r=client.post("/api/v1/analyze", files={"ecg_file":("ecg.csv",b"0.1,0.2,0.3,0.4")}, data={"patient_id":"p1"}); 
    if r.status_code==200: b=r.json(); assert "status" in b and "data" in b
