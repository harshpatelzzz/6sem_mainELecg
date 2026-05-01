"""FastAPI middleware and handlers."""
from __future__ import annotations
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from starlette.middleware.cors import CORSMiddleware

def configure_middleware(app: FastAPI, frontend_url: str) -> None:
    """Configure CORS and global exception handler."""
    app.add_middleware(CORSMiddleware, allow_origins=[frontend_url], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
    @app.exception_handler(Exception)
    async def global_exception_handler(_: Request, exc: Exception):
        return JSONResponse(status_code=500, content={"status":"error","data":{},"message":str(exc)})
