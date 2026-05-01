"""ECG beat segmentation and RR interval utilities."""
from __future__ import annotations
import neurokit2 as nk
import numpy as np
class ECGSegmenter:
    """Detect R-peaks and extract beat windows."""
    def detect_r_peaks(self, signal: np.ndarray, fs: int = 360) -> np.ndarray:
        """Detect R-peaks using NeuroKit2."""
        if signal.size < fs // 2:
            return np.array([], dtype=np.int64)
        try:
            _, info = nk.ecg_peaks(signal, sampling_rate=fs)
            return np.array(info.get("ECG_R_Peaks", []), dtype=np.int64)
        except (TypeError, ValueError):
            return np.array([], dtype=np.int64)
    def segment_beats(self, signal: np.ndarray, r_peaks: np.ndarray, fs: int = 360, window_ms: int = 600) -> np.ndarray:
        """Segment ECG beats into fixed-length windows."""
        window = int(window_ms * fs / 1000)
        half = window // 2
        beats = []
        for peak in r_peaks:
            start = int(peak) - half
            end = int(peak) + half
            segment = signal[max(0, start): min(len(signal), end)]
            if len(segment) < window:
                segment = np.pad(segment, (0, window - len(segment)))
            else:
                segment = segment[:window]
            beats.append(segment)
        return np.stack(beats) if beats else np.zeros((0, window), dtype=np.float32)
    def compute_rri(self, r_peaks: np.ndarray, fs: int = 360) -> np.ndarray:
        """Compute RR intervals in milliseconds."""
        if len(r_peaks) < 2:
            return np.array([], dtype=np.float32)
        return np.diff(r_peaks).astype(np.float32) * (1000.0 / fs)
