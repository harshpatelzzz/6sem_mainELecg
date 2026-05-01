"""Anomaly detector module."""
from __future__ import annotations
import torch
class AnomalyDetector:
    """Known/OOD anomaly detector using confidence and score thresholds."""
    def detect(self, logits: torch.Tensor, anomaly_score: torch.Tensor, threshold: float = 0.7) -> tuple[torch.Tensor, torch.Tensor]:
        """Return predicted class and OOD flags."""
        probs=torch.softmax(logits,dim=1); conf,pred=torch.max(probs,dim=1); is_ood=(conf<threshold)|(anomaly_score>threshold); return pred,is_ood
