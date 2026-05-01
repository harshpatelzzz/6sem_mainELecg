"""ECG analysis endpoints."""
from __future__ import annotations
from datetime import datetime
import io
import numpy as np
import torch
from fastapi import APIRouter, File, Form, UploadFile
from torch_geometric.data import Batch
from src.api.schemas import AnalysisResponse, Envelope
from src.decision.bayesian_uncertainty import BayesianEstimator
from src.decision.hybrid_fusion import HybridFusionLayer
from src.decision.risk_engine import RiskEngine
from src.features.graph_builder import HeartbeatGraphBuilder
from src.models.full_model import AdaptiveECGModel
from src.preprocessing.filter import ECGFilter
from src.preprocessing.segmentation import ECGSegmenter
router=APIRouter(prefix="/api/v1", tags=["ecg"])
model=AdaptiveECGModel(); bayes=BayesianEstimator(); fusion=HybridFusionLayer(); risk_engine=RiskEngine(); filt=ECGFilter(); seg=ECGSegmenter(); gb=HeartbeatGraphBuilder()
@router.post("/analyze", response_model=Envelope)
async def analyze_ecg(patient_id: str = Form(...), ecg_file: UploadFile = File(...)) -> Envelope:
    """Analyze uploaded ECG and return risk inference payload."""
    signal=np.loadtxt(io.BytesIO(await ecg_file.read()), delimiter=",", dtype=np.float32)
    cleaned,_=filt.full_filter_pipeline(signal); peaks=seg.detect_r_peaks(cleaned); beats=seg.segment_beats(cleaned, peaks); beats=beats if beats.shape[0] else np.zeros((1,216),dtype=np.float32)
    graph=gb.build_graph(beats, seg.compute_rri(peaks)); out=model(torch.tensor(beats[:1],dtype=torch.float32).unsqueeze(1), Batch.from_data_list([graph]), [patient_id])
    probs=torch.softmax(out["logits"],dim=1); conf,pred=torch.max(probs,dim=1); a=model.vae.anomaly_score(out["context"],out["x_recon"])[0]; d=model.memory.deviation_score(out["context"],patient_id)[0]
    _,epi,ale=bayes.mc_predict(lambda x: model.classifier(model.dropout(x)), out["context"], n_samples=20); u=bayes.uncertainty_score(epi.mean(),ale.mean()).item(); score=fusion.fuse(conf,d,torch.tensor(u),a,torch.tensor(0.5)).item(); rs,rl,alert=risk_engine.update_risk(patient_id,score)
    traj=[{"timestamp":ts.isoformat(),"score":s,"level":lv} for ts,s,lv in risk_engine.get_trajectory(patient_id)]
    payload=AnalysisResponse(patient_id=patient_id,timestamp=datetime.utcnow(),predicted_class=str(int(pred.item())),confidence=float(conf.item()),is_ood=bool(float(conf.item())<0.5),anomaly_score=float(a.item()),deviation_score=float(d.item()),uncertainty=float(u),risk_score=float(rs),risk_level=rl,alert=alert,risk_trajectory=traj)
    return Envelope(status="ok", data=payload.model_dump(), message="analysis complete")
