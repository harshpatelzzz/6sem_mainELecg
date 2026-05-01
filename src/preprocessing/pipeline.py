"""High-level ECG preprocessing pipeline."""
from __future__ import annotations
import numpy as np
from src.preprocessing.filter import ECGFilter
from src.preprocessing.normalization import PatientNormalizer
from src.preprocessing.segmentation import ECGSegmenter
class PreprocessingPipeline:
    """Run filtering, segmentation, and normalization in sequence."""
    def __init__(self) -> None:
        self.filter = ECGFilter()
        self.segmenter = ECGSegmenter()
        self.normalizer = PatientNormalizer()
    def run(self, signal: np.ndarray, fs: int = 360) -> dict:
        """Execute full preprocessing pipeline."""
        cleaned, ops = self.filter.full_filter_pipeline(signal, fs)
        peaks = self.segmenter.detect_r_peaks(cleaned, fs)
        beats = self.segmenter.segment_beats(cleaned, peaks, fs)
        norm_beats = np.array([self.normalizer.zscore(b) for b in beats], dtype=np.float32)
        rri = self.segmenter.compute_rri(peaks, fs)
        return {"cleaned": cleaned, "r_peaks": peaks, "beats": norm_beats, "rri": rri, "ops": ops}
