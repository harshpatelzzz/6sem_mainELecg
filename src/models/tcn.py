"""Temporal convolutional network model."""
from __future__ import annotations
import torch
from torch import Tensor, nn
class TCN(nn.Module):
    """Simple TCN baseline for ECG sequence modeling."""
    def __init__(self, in_channels: int = 512, out_dim: int = 256) -> None:
        super().__init__(); self.net=nn.Sequential(nn.Conv1d(in_channels,256,3,padding=2,dilation=2), nn.ReLU(), nn.Conv1d(256,256,3,padding=4,dilation=4), nn.ReLU(), nn.AdaptiveAvgPool1d(1)); self.fc=nn.Linear(256,out_dim)
    def forward(self, x: Tensor) -> Tensor:
        """Forward pass with input (B,T,C)."""
        return self.fc(self.net(x.transpose(1,2)).squeeze(-1))
    def __repr__(self) -> str: return "TCN(out_dim=256)"
if __name__ == "__main__":
    model=TCN(); x=torch.randn(4,5,512); out=model(x); print(f"Output shape: {out.shape}")
