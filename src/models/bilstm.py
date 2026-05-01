"""BiLSTM with attention."""
from __future__ import annotations
import torch
from torch import Tensor, nn
class BiLSTMAttention(nn.Module):
    """BiLSTM + MHA -> 256 context vector."""
    def __init__(self) -> None:
        super().__init__(); self.lstm=nn.LSTM(512,256,2,bidirectional=True,batch_first=True,dropout=0.3); self.attn=nn.MultiheadAttention(512,8,batch_first=True); self.out=nn.Sequential(nn.Linear(512,256), nn.LayerNorm(256))
    def forward(self, x: Tensor) -> Tensor:
        """Encode sequence features."""
        h,_=self.lstm(x); a,_=self.attn(h,h,h); return self.out(a.mean(dim=1))
    def __repr__(self) -> str: return "BiLSTMAttention(output_dim=256)"
if __name__ == "__main__":
    model=BiLSTMAttention(); x=torch.randn(4,3,512); out=model(x); print(f"Output shape: {out.shape}")
