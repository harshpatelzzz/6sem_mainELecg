"""Cross-scale fusion module."""
from __future__ import annotations
import torch
from torch import Tensor, nn
class CrossScaleFusion(nn.Module):
    """Fuse CNN/wavelet/GNN features."""
    def __init__(self, input_dim: int, out_dim: int = 512) -> None:
        super().__init__(); self.net = nn.Sequential(nn.Linear(input_dim, out_dim), nn.ReLU(), nn.LayerNorm(out_dim))
    def forward(self, cnn: Tensor, wav: Tensor, gnn: Tensor) -> Tensor:
        """Concatenate and project fused representation."""
        return self.net(torch.cat([cnn, wav, gnn], dim=1))
