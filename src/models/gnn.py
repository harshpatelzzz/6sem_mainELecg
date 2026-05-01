"""Graph attention model for heartbeat graphs."""
from __future__ import annotations
import torch
from torch import Tensor, nn
from torch_geometric.nn import GATConv, global_mean_pool
class HeartbeatGNN(nn.Module):
    """Two-layer GAT graph encoder."""
    def __init__(self) -> None:
        super().__init__(); self.g1=GATConv(6,32,heads=4,concat=True); self.g2=GATConv(128,64,heads=1,concat=False); self.out=nn.Linear(64,32)
    def forward(self, batch_data) -> Tensor:
        """Encode batched graph data into graph embeddings."""
        x,edge_index,b=batch_data.x,batch_data.edge_index,batch_data.batch
        x=torch.relu(self.g1(x,edge_index)); x=torch.relu(self.g2(x,edge_index)); return self.out(global_mean_pool(x,b))
    def graph_anomaly_score(self, embedding: Tensor, patient_baseline: Tensor) -> Tensor:
        """Compute L2 graph anomaly distance."""
        return torch.norm(embedding-patient_baseline, dim=1, p=2)
    def __repr__(self) -> str: return "HeartbeatGNN(output_dim=32)"
if __name__ == "__main__":
    print("Use with torch_geometric Batch input.")
