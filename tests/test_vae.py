"""Tests for PatientVAE."""
import torch
from src.models.vae import PatientVAE

def test_vae_reconstruction_shape(): x=torch.randn(4,256); xr,_,_,_=PatientVAE()(x); assert xr.shape==x.shape
def test_vae_latent_dim_32(): _,mu,_,z=PatientVAE()(torch.randn(2,256)); assert mu.shape[1]==32 and z.shape[1]==32
def test_vae_loss_positive(): m=PatientVAE(); x=torch.randn(4,256); xr,mu,lv,_=m(x); assert float(m.vae_loss(x,xr,mu,lv).item())>0
def test_anomaly_score_increases_with_noise(): m=PatientVAE(); x=torch.randn(4,256); xr,_,_,_=m(x); assert m.anomaly_score(x+2.0,xr).mean().item()>m.anomaly_score(x,xr).mean().item()
