"""Hybrid score fusion layer."""
from __future__ import annotations
import torch
from torch import Tensor, nn
class HybridFusionLayer(nn.Module):
    """Learnable weighted fusion of risk sub-scores."""
    def __init__(self) -> None:
        super().__init__(); self.raw_weights=nn.Parameter(torch.tensor([0.2,0.2,0.2,0.2,0.2],dtype=torch.float32))
    def fuse(self, S_ml: Tensor, D: Tensor, U: Tensor, A: Tensor, G: Tensor) -> Tensor:
        """Fuse normalized scalar inputs to one score."""
        w=torch.softmax(self.raw_weights,dim=0); return w[0]*S_ml + w[1]*D + w[2]*(1-U) + w[3]*A + w[4]*G
    def forward(self, S_ml: Tensor, D: Tensor, U: Tensor, A: Tensor, G: Tensor) -> Tensor:
        """Forward wrapper."""
        return self.fuse(S_ml,D,U,A,G)
