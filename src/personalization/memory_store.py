"""Persistent patient memory store."""

from __future__ import annotations

import json
from pathlib import Path

import numpy as np


class PatientMemoryStore:
    """Store and retrieve patient embeddings on local disk."""

    def __init__(self, root: Path) -> None:
        """Initialize memory store.

        Args:
            root: Root directory for persisted embeddings.
        """
        self.root = root
        self.root.mkdir(parents=True, exist_ok=True)

    def save(self, patient_id: str, embedding: np.ndarray) -> None:
        """Persist patient embedding.

        Args:
            patient_id: Unique patient identifier.
            embedding: Embedding vector.
        """
        (self.root / f"{patient_id}.json").write_text(
            json.dumps(embedding.tolist()),
            encoding="utf-8",
        )

    def load(self, patient_id: str) -> np.ndarray | None:
        """Load patient embedding if present.

        Args:
            patient_id: Unique patient identifier.
        """
        path = self.root / f"{patient_id}.json"
        if not path.exists():
            return None
        return np.array(json.loads(path.read_text(encoding="utf-8")), dtype=np.float32)
