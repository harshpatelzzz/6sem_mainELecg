"""Normalization utilities for ECG signals."""
from __future__ import annotations
import numpy as np
class PatientNormalizer:
    """Per-patient z-score normalization."""
    def zscore(self, signal: np.ndarray, mean: float | None = None, std: float | None = None) -> np.ndarray:
        """Normalize signal with z-score."""
        m = float(np.mean(signal) if mean is None else mean)
        s = float(np.std(signal) if std is None else std)
        s = s if s > 1e-8 else 1.0
        return (signal - m) / s
