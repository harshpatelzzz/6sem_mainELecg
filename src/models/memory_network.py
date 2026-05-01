"""Memory-augmented neural network."""
from __future__ import annotations
import math
from collections import OrderedDict
import torch
import torch.nn.functional as F
from torch import Tensor, nn
class MemoryAugmentedNetwork(nn.Module):
    """External memory read/write module with patient baselines."""
    def __init__(self, memory_size: int = 128, key_dim: int = 64) -> None:
        super().__init__(); self.memory_size=memory_size; self.key_dim=key_dim; self.query_proj=nn.Linear(256,key_dim); m=torch.randn(memory_size,key_dim); self.memory=nn.Parameter(F.normalize(m,dim=1)); self.patient_store: OrderedDict[str, Tensor]=OrderedDict()
    def read(self, query: Tensor) -> Tensor:
        """Read memory vector using attention over memory keys."""
        q=self.query_proj(query); attn=torch.softmax((q@self.memory.t())/math.sqrt(self.key_dim), dim=1); return attn@self.memory
    def write(self, patient_id: str, embedding: Tensor) -> None:
        """Write patient embedding with FIFO eviction and interpolation update."""
        key=self.query_proj(embedding.detach().mean(dim=0, keepdim=True)).squeeze(0)
        if patient_id in self.patient_store: self.patient_store.move_to_end(patient_id)
        self.patient_store[patient_id]=embedding.detach().mean(dim=0)
        if len(self.patient_store)>self.memory_size: self.patient_store.popitem(last=False)
        slot=abs(hash(patient_id))%self.memory_size
        with torch.no_grad():
            self.memory[slot]=F.normalize(0.9*self.memory[slot]+0.1*key, dim=0)
    def deviation_score(self, current: Tensor, patient_id: str) -> Tensor:
        """Return cosine distance from stored patient baseline."""
        b=self.patient_store.get(patient_id)
        if b is None: return torch.ones(current.size(0), device=current.device)
        return 1.0 - F.cosine_similarity(current, b.unsqueeze(0).expand_as(current), dim=1)
    def __repr__(self) -> str: return f"MemoryAugmentedNetwork(memory_size={self.memory_size}, key_dim={self.key_dim})"
if __name__ == "__main__":
    model=MemoryAugmentedNetwork(); x=torch.randn(4,256); out=model.read(x); print(f"Output shape: {out.shape}")
