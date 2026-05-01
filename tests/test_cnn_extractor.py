"""Tests for MultiScaleCNN."""
import torch
from src.features.cnn_extractor import MultiScaleCNN

def test_multiscale_cnn_forward_shape(): assert MultiScaleCNN()(torch.randn(4,1,256)).shape==(4,512)
def test_feature_dim_is_512(): assert MultiScaleCNN()(torch.randn(2,1,128)).shape[1]==512
def test_gradient_flows():
    m=MultiScaleCNN(); x=torch.randn(2,1,256,requires_grad=True); m(x).sum().backward(); assert x.grad is not None
