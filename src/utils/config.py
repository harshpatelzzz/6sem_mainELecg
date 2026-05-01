"""Configuration management for the ECG intelligence system."""

from __future__ import annotations

from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime settings loaded from environment variables."""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    model_path: str = Field(default="./checkpoints/best_model.pt", alias="MODEL_PATH")
    mlflow_tracking_uri: str = Field(default="http://localhost:5000", alias="MLFLOW_TRACKING_URI")
    redis_url: str = Field(default="redis://localhost:6379", alias="REDIS_URL")
    database_url: str = Field(default="sqlite:///./ecg.db", alias="DATABASE_URL")
    api_host: str = Field(default="0.0.0.0", alias="API_HOST")
    api_port: int = Field(default=8000, alias="API_PORT")
    frontend_url: str = Field(default="http://localhost:5173", alias="FRONTEND_URL")
    memory_size: int = Field(default=128, alias="MEMORY_SIZE")
    risk_alpha: float = Field(default=0.3, alias="RISK_ALPHA")
    mc_dropout_samples: int = Field(default=50, alias="MC_DROPOUT_SAMPLES")
    log_level: str = Field(default="INFO", alias="LOG_LEVEL")


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return singleton app settings."""
    return Settings()
