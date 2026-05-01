"""Patient profile data model and persistence utilities."""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
from datetime import datetime
import json
from pathlib import Path


@dataclass
class PatientProfile:
    """Patient profile DTO for personalization metadata."""

    patient_id: str
    name: str = "Unknown"
    age: int = 0
    baseline_ready: bool = False
    last_analyzed: str = field(default_factory=lambda: datetime.utcnow().isoformat())

    def to_json(self, path: Path) -> None:
        """Save patient profile to disk.

        Args:
            path: Destination JSON file path.
        """
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(asdict(self), indent=2), encoding="utf-8")

    @classmethod
    def from_json(cls, path: Path) -> "PatientProfile":
        """Load patient profile from disk.

        Args:
            path: Source JSON file path.
        """
        data = json.loads(path.read_text(encoding="utf-8"))
        return cls(**data)
