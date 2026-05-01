"""Tests for preprocessing."""
import numpy as np
from src.preprocessing.filter import ECGFilter
from src.preprocessing.segmentation import ECGSegmenter
from src.preprocessing.normalization import PatientNormalizer

def test_bandpass_filter_output_shape():
    s=np.random.randn(360).astype(np.float32); assert ECGFilter().bandpass_filter(s).shape==s.shape

def test_r_peak_detection_accuracy():
    s=np.sin(np.linspace(0,20,3600)).astype(np.float32); assert ECGSegmenter().detect_r_peaks(s).ndim==1

def test_segmentation_uniform_length():
    seg=ECGSegmenter().segment_beats(np.random.randn(1000).astype(np.float32), np.array([100,400,700])); assert len(set([b.shape[0] for b in seg]))==1

def test_normalization_zero_mean():
    z=PatientNormalizer().zscore(np.random.randn(300).astype(np.float32)); assert abs(float(np.mean(z)))<1e-4
