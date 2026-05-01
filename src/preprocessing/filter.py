"""Signal filtering utilities for ECG preprocessing."""
from __future__ import annotations
from dataclasses import dataclass
import numpy as np
from scipy.signal import butter, iirnotch, medfilt, sosfilt, filtfilt
ORDER_BUTTER = 4
@dataclass
class FilterOps:
    """Metadata describing applied filter operations."""
    bandpass: bool
    baseline_removed: bool
    notch: bool
class ECGFilter:
    """Apply filtering operations to ECG signals."""
    def bandpass_filter(self, signal: np.ndarray, fs: int = 360, lowcut: float = 0.5, highcut: float = 40.0) -> np.ndarray:
        """Bandpass filter ECG signal using Butterworth SOS."""
        nyquist = 0.5 * fs
        sos = butter(ORDER_BUTTER, [lowcut / nyquist, highcut / nyquist], btype="band", output="sos")
        return sosfilt(sos, signal)
    def remove_baseline_wander(self, signal: np.ndarray, fs: int = 360) -> np.ndarray:
        """Remove baseline wander with median filtering."""
        kernel = max(3, int(0.2 * fs) // 2 * 2 + 1)
        # Keep median window odd and no larger than input length.
        if kernel > signal.size:
            kernel = signal.size if signal.size % 2 == 1 else max(1, signal.size - 1)
        if kernel < 3:
            return signal
        baseline = medfilt(signal, kernel_size=kernel)
        return signal - baseline
    def notch_filter(self, signal: np.ndarray, fs: int = 360, freq: float = 60.0) -> np.ndarray:
        """Apply notch filter for powerline noise."""
        b, a = iirnotch(w0=freq, Q=30.0, fs=fs)
        # filtfilt requires input length > 3 * max(len(a), len(b)).
        if signal.size <= 3 * max(len(a), len(b)):
            return signal
        return filtfilt(b, a, signal)
    def full_filter_pipeline(self, signal: np.ndarray, fs: int = 360) -> tuple[np.ndarray, dict]:
        """Run full ECG cleaning pipeline."""
        cleaned = self.bandpass_filter(signal, fs=fs)
        cleaned = self.remove_baseline_wander(cleaned, fs=fs)
        cleaned = self.notch_filter(cleaned, fs=fs)
        return cleaned, FilterOps(True, True, True).__dict__
