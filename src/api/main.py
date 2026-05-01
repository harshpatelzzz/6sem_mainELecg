"""FastAPI application entry point."""
from __future__ import annotations
from contextlib import asynccontextmanager
from fastapi import FastAPI
from src.api.middleware import configure_middleware
from src.api.routers import ecg, patient, risk
from src.utils.config import get_settings
from src.utils.logger import configure_logging
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize settings and logging at startup."""
    s=get_settings(); configure_logging(s.log_level); yield
app=FastAPI(title="ECG Intelligence API",version="1.0.0",lifespan=lifespan)
settings=get_settings(); configure_middleware(app,settings.frontend_url)
app.include_router(ecg.router); app.include_router(patient.router); app.include_router(risk.router)
