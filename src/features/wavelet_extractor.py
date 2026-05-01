"""Wavelet + STFT feature extraction."""
from __future__ import annotations
import numpy as np
import pywt
from scipy.signal import stft
EPS = 1e-12
class WaveletExtractor:
    """Feature extraction using DWT and STFT."""
    def dwt_features(self, signal: np.ndarray, wavelet: str = "db4", level: int = 5) -> np.ndarray:
        """Compute energy and entropy per DWT sub-band."""
        coeffs = pywt.wavedec(signal, wavelet=wavelet, level=level)
        feats = []
        for c in coeffs[:level]:
            p = c ** 2
            e = float(np.sum(p))
            pn = p / (e + EPS)
            h = float(-np.sum(pn * np.log(pn + EPS)))
            feats.extend([e, h])
        return np.array(feats, dtype=np.float32)
    def stft_features(self, signal: np.ndarray, fs: int = 360, nperseg: int = 64) -> np.ndarray:
        """Return normalized flattened STFT magnitude."""
        _, _, z = stft(signal, fs=fs, nperseg=nperseg)
        m = np.abs(z).astype(np.float32).flatten()
        if m.size == 0:
            return m
        return (m - float(m.min())) / (float(m.max()) - float(m.min()) + EPS)
    def extract(self, signal: np.ndarray) -> np.ndarray:
        """Combine DWT and STFT features."""
        return np.concatenate([self.dwt_features(signal), self.stft_features(signal)], axis=0)
