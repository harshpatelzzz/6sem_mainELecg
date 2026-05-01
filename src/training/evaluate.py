"""Evaluation metrics and export."""
from __future__ import annotations
import json
from pathlib import Path
import numpy as np
from sklearn.calibration import calibration_curve
from sklearn.metrics import confusion_matrix, f1_score, roc_auc_score

def evaluate_metrics(y_true: np.ndarray, y_prob: np.ndarray, uncertainty: np.ndarray) -> dict:
    """Compute F1/AUC/confusion matrix/calibration metrics."""
    pred=np.argmax(y_prob,axis=1); pt,pp=calibration_curve((y_true==pred).astype(int), uncertainty, n_bins=10)
    return {"f1_per_class":f1_score(y_true,pred,average=None).tolist(),"f1_macro":float(f1_score(y_true,pred,average="macro")),"auc_ovr":float(roc_auc_score(y_true,y_prob,multi_class="ovr")),"confusion_matrix":confusion_matrix(y_true,pred).tolist(),"calibration_curve":{"prob_true":pt.tolist(),"prob_pred":pp.tolist()}}

def export_results(path: Path, metrics: dict) -> None:
    """Export metrics to JSON file."""
    path.write_text(json.dumps(metrics,indent=2),encoding="utf-8")
