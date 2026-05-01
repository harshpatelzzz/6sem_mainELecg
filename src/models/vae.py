"""Patient variational autoencoder."""
from __future__ import annotations
import torch
import torch.nn.functional as F
from torch import Tensor, nn
BETA=0.5
class PatientVAE(nn.Module):
    """VAE for patient context embedding reconstruction."""
    def __init__(self) -> None:
        super().__init__(); self.encoder=nn.Sequential(nn.Linear(256,128),nn.ReLU(),nn.Linear(128,64),nn.ReLU()); self.mu_layer=nn.Linear(64,32); self.logvar_layer=nn.Linear(64,32); self.decoder=nn.Sequential(nn.Linear(32,64),nn.ReLU(),nn.Linear(64,128),nn.ReLU(),nn.Linear(128,256))
    def reparameterize(self, mu: Tensor, logvar: Tensor) -> Tensor:
        """Sample latent vector using reparameterization trick."""
        return mu + torch.randn_like(mu) * torch.exp(0.5*logvar)
    def vae_loss(self, x: Tensor, x_recon: Tensor, mu: Tensor, logvar: Tensor) -> Tensor:
        """Compute beta-VAE loss."""
        recon = F.mse_loss(x_recon, x, reduction="sum"); kl = -0.5*torch.sum(1 + logvar - mu.pow(2) - logvar.exp()); return recon + BETA*kl
    def anomaly_score(self, x: Tensor, x_recon: Tensor) -> Tensor:
        """Compute reconstruction error anomaly score."""
        return torch.sum((x-x_recon)**2, dim=1)
    def forward(self, x: Tensor) -> tuple[Tensor, Tensor, Tensor, Tensor]:
        """Forward pass returning reconstruction and latent stats."""
        h=self.encoder(x); mu=self.mu_layer(h); logvar=self.logvar_layer(h); z=self.reparameterize(mu, logvar); return self.decoder(z), mu, logvar, z
    def __repr__(self) -> str: return "PatientVAE(latent_dim=32)"
if __name__ == "__main__":
    model=PatientVAE(); x=torch.randn(4,256); out=model(x); print(f"Output shape: {out[0].shape}")
