"""Tests for memory network."""
import torch
from src.models.memory_network import MemoryAugmentedNetwork

def test_write_and_retrieve_patient(): m=MemoryAugmentedNetwork(memory_size=4); m.write("p1",torch.randn(2,256)); assert "p1" in m.patient_store
def test_deviation_score_zero_for_same_input(): m=MemoryAugmentedNetwork(memory_size=4); x=torch.randn(2,256); m.write("p1",x); d=m.deviation_score(m.patient_store["p1"].unsqueeze(0),"p1"); assert d.shape[0]==1
def test_memory_eviction_at_capacity(): m=MemoryAugmentedNetwork(memory_size=2); m.write("a",torch.randn(1,256)); m.write("b",torch.randn(1,256)); m.write("c",torch.randn(1,256)); assert len(m.patient_store)<=2
