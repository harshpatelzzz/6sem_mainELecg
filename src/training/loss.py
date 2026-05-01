"""Combined ECG objective function."""
from __future__ import annotations
import torch
import torch.nn as nn
from src.models.vae import PatientVAE
class CombinedECGLoss(nn.Module):
    """CE + VAE + deviation regularizer loss."""
    def __init__(self, class_weights: torch.Tensor) -> None:
        super().__init__(); self.ce=nn.CrossEntropyLoss(weight=class_weights); self.vae=PatientVAE()
    def forward(self, logits: torch.Tensor, labels: torch.Tensor, context: torch.Tensor, x_recon: torch.Tensor, mu: torch.Tensor, logvar: torch.Tensor, deviation: torch.Tensor) -> torch.Tensor:
        """Compute final weighted combined loss."""
        ce=self.ce(logits,labels); vae=self.vae.vae_loss(context,x_recon,mu,logvar)/max(context.size(0),1); dev=torch.mean(torch.abs(deviation)); return ce + 0.5*vae + 0.3*dev
