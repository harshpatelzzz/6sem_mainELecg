"""Baseline management for patient personalization."""

from __future__ import annotations

from pathlib import Path

import numpy as np

from src.personalization.memory_store import PatientMemoryStore


class BaselineManager:
    """Build, update, and reset patient baseline embeddings."""

    def __init__(self, root: Path = Path("data/patient_profiles")) -> None:
        """Initialize baseline manager.

        Args:
            root: Directory containing baseline files.
        """
        self.store = PatientMemoryStore(root)

    def build_or_update(self, patient_id: str, embeddings: np.ndarray) -> np.ndarray:
        """Create/update baseline using interpolation.

        Args:
            patient_id: Unique patient identifier.
            embeddings: Current embedding batch for the patient.
        """
        current = self.store.load(patient_id)
        new_embedding = np.mean(embeddings, axis=0)
        baseline = new_embedding if current is None else 0.9 * current + 0.1 * new_embedding
        self.store.save(patient_id, baseline)
        return baseline

    def reset(self, patient_id: str) -> None:
        """Reset a patient's baseline file.

        Args:
            patient_id: Unique patient identifier.
        """
        path = self.store.root / f"{patient_id}.json"
        if path.exists():
            path.unlink()
