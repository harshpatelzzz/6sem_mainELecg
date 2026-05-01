"""Integrated adaptive ECG model."""
from __future__ import annotations
import numpy as np
import torch
from torch import Tensor, nn
from src.features.cnn_extractor import MultiScaleCNN
from src.features.wavelet_extractor import WaveletExtractor
from src.features.fusion import CrossScaleFusion
from src.models.gnn import HeartbeatGNN
from src.models.bilstm import BiLSTMAttention
from src.models.vae import PatientVAE
from src.models.memory_network import MemoryAugmentedNetwork
class AdaptiveECGModel(nn.Module):
    """Master model integrating all core modules."""
    def __init__(self, wav_dim: int = 370, num_classes: int = 6) -> None:
        super().__init__(); self.cnn=MultiScaleCNN(); self.wavelet=WaveletExtractor(); self.graph_net=HeartbeatGNN(); self.fusion=CrossScaleFusion(512+wav_dim+32,512); self.bilstm=BiLSTMAttention(); self.vae=PatientVAE(); self.memory=MemoryAugmentedNetwork(); self.classifier=nn.Linear(256,num_classes); self.dropout=nn.Dropout(0.3); self.wav_dim=wav_dim
    def wavelet_tensor(self, ecg_batch: Tensor) -> Tensor:
        """Convert wavelet extraction to batched tensor."""
        feats=[]
        for i in range(ecg_batch.size(0)):
            sig=ecg_batch[i,0].detach().cpu().numpy().astype(np.float32); f=self.wavelet.extract(sig)
            if f.size<self.wav_dim: f=np.pad(f,(0,self.wav_dim-f.size))
            feats.append(f[:self.wav_dim])
        return torch.tensor(np.stack(feats), dtype=ecg_batch.dtype, device=ecg_batch.device)
    def forward(self, ecg_batch: Tensor, graph_batch, patient_ids: list[str] | None = None) -> dict:
        """Forward pass through all integrated modules."""
        cnn_feat=self.cnn(ecg_batch); wav_feat=self.wavelet_tensor(ecg_batch); gnn_feat=self.graph_net(graph_batch); fused=self.fusion(cnn_feat,wav_feat,gnn_feat); context=self.bilstm(fused.unsqueeze(1)); x_recon,mu,logvar,z=self.vae(context); mem_read=self.memory.read(context); logits=self.classifier(self.dropout(context)); return {"logits":logits,"z":z,"mu":mu,"logvar":logvar,"x_recon":x_recon,"context":context,"mem_read":mem_read}
if __name__ == "__main__":
    print("Use with ECG tensor + PyG graph batch.")
