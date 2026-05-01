from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.routers import ecg, patient, risk

app = FastAPI()

# Only one middleware allowed to avoid conflicts and crashes
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://0.0.0.0:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("CORS Middleware initialized on port 8000 for origins: 5173, 5174")

app.include_router(ecg.router)
app.include_router(patient.router)
app.include_router(risk.router)
