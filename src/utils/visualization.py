"""Visualization helpers for ECG and risk curves."""
from __future__ import annotations
import matplotlib.pyplot as plt
import numpy as np
from pathlib import Path

def plot_ecg(signal: np.ndarray, out_path: Path) -> None:
    """Plot ECG signal and save figure."""
    plt.figure(figsize=(10,3)); plt.plot(signal); plt.title("ECG Signal"); plt.tight_layout(); out_path.parent.mkdir(parents=True, exist_ok=True); plt.savefig(out_path); plt.close()

def plot_risk(scores: list[float], out_path: Path) -> None:
    """Plot risk trajectory and save figure."""
    plt.figure(figsize=(8,3)); plt.plot(scores); plt.ylim(0,1); plt.title("Risk Trajectory"); plt.tight_layout(); out_path.parent.mkdir(parents=True, exist_ok=True); plt.savefig(out_path); plt.close()
