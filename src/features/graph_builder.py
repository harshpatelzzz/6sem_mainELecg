"""Heartbeat graph builder for PyG."""
from __future__ import annotations
import numpy as np
import torch
from scipy.stats import kurtosis, skew
from torch_geometric.data import Data
class HeartbeatGraphBuilder:
    """Build beat-level temporal graph with statistical node features."""
    def build_graph(self, beats: np.ndarray, rri: np.ndarray) -> Data:
        """Build graph data object with x, edge_index, edge_attr."""
        n = beats.shape[0]
        if n == 0:
            return Data(x=torch.zeros((0,6),dtype=torch.float32), edge_index=torch.zeros((2,0),dtype=torch.long), edge_attr=torch.zeros((0,1),dtype=torch.float32))
        x = np.stack([np.mean(beats,1), np.std(beats,1), np.max(beats,1), np.min(beats,1), kurtosis(beats,1, fisher=True, bias=False), skew(beats,1,bias=False)], axis=1)
        x = np.nan_to_num(x).astype(np.float32)
        edges, attrs = [], []
        for i in range(n):
            for d in (1,2):
                for j in (i-d, i+d):
                    if 0 <= j < n:
                        edges.append([i,j])
                        ri = rri[min(i, len(rri)-1)] if len(rri) else 0.0
                        rj = rri[min(j, len(rri)-1)] if len(rri) else 0.0
                        attrs.append([float(ri-rj)])
        edge_index = torch.tensor(edges, dtype=torch.long).t().contiguous() if edges else torch.zeros((2,0),dtype=torch.long)
        edge_attr = torch.tensor(attrs, dtype=torch.float32) if attrs else torch.zeros((0,1),dtype=torch.float32)
        return Data(x=torch.tensor(x,dtype=torch.float32), edge_index=edge_index, edge_attr=edge_attr)
