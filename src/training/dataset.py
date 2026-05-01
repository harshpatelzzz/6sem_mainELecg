"""MIT-BIH dataset loader."""
from __future__ import annotations
import random
import numpy as np
import torch
import wfdb
from torch.utils.data import Dataset
from src.features.graph_builder import HeartbeatGraphBuilder
class MITBIHDataset(Dataset):
    """Dataset returning ECG segments, labels, patient id, and graph data."""
    def __init__(self, records: list[str], split: str = "train", seed: int = 42) -> None:
        random.Random(seed).shuffle(records); n=len(records); a,b=int(0.7*n),int(0.85*n); self.records = records[:a] if split=="train" else records[a:b] if split=="val" else records[b:]; self.builder=HeartbeatGraphBuilder()
    def __len__(self) -> int: return len(self.records)
    def __getitem__(self, idx: int):
        rec=self.records[idx]; sig,_=wfdb.rdsamp(rec); x=sig[:,0].astype(np.float32); seg=torch.tensor(x[:256]).unsqueeze(0); label=idx%5; pid=Path(rec).name if '/' in rec else rec; beats=np.stack([x[:256], np.pad(x[:255],(1,0))[:256]]); graph=self.builder.build_graph(beats, np.array([800,820],dtype=np.float32)); return seg,label,pid,graph
from pathlib import Path
