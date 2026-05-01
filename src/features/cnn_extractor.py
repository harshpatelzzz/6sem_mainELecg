"""Multi-scale 1D CNN feature extractor."""
from __future__ import annotations
import torch
from torch import Tensor, nn
class MultiScaleCNN(nn.Module):
    """Extract multi-scale representations from ECG segments."""
    def __init__(self) -> None:
        super().__init__()
        self.branch_fine = nn.Sequential(nn.Conv1d(1,64,3,padding=1), nn.BatchNorm1d(64), nn.ReLU(), nn.Conv1d(64,128,3,padding=1), nn.BatchNorm1d(128), nn.ReLU(), nn.AdaptiveAvgPool1d(1))
        self.branch_mid = nn.Sequential(nn.Conv1d(1,64,7,padding=3), nn.BatchNorm1d(64), nn.ReLU(), nn.Conv1d(64,128,7,padding=3), nn.BatchNorm1d(128), nn.ReLU(), nn.AdaptiveAvgPool1d(1))
        self.branch_global = nn.Sequential(nn.Conv1d(1,64,15,dilation=2,padding=14), nn.BatchNorm1d(64), nn.ReLU(), nn.Conv1d(64,128,15,dilation=2,padding=14), nn.BatchNorm1d(128), nn.ReLU(), nn.AdaptiveMaxPool1d(1))
        self.proj = nn.Sequential(nn.Linear(384, 512), nn.LayerNorm(512))
    def forward(self, x: Tensor) -> Tensor:
        """Forward pass with output shape (batch, 512)."""
        a = self.branch_fine(x).squeeze(-1)
        b = self.branch_mid(x).squeeze(-1)
        c = self.branch_global(x).squeeze(-1)
        return self.proj(torch.cat([a, b, c], dim=1))
    def __repr__(self) -> str:
        return "MultiScaleCNN(output_dim=512)"
if __name__ == "__main__":
    model = MultiScaleCNN()
    x = torch.randn(4, 1, 256)
    out = model(x)
    print(f"Output shape: {out.shape}")
