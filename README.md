# Adaptive Personalized ECG Intelligence System

Research-grade ECG analysis platform for personalized arrhythmia intelligence and risk modeling.

This repository contains the backend/research stack for a modular ECG system built around:
- Multi-scale feature extraction
- Temporal sequence modeling
- Personalization and memory modules
- Uncertainty-aware decision fusion
- API-first deployment and testing workflow

> Note: This repository currently contains backend/research code and datasets. The `frontend/` app is intentionally excluded from version control in this remote.

## Table of Contents
- [Project Goals](#project-goals)
- [System Architecture](#system-architecture)
- [Repository Structure](#repository-structure)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Run the API](#run-the-api)
- [Run Tests](#run-tests)
- [Model Training and Evaluation](#model-training-and-evaluation)
- [Docker Deployment](#docker-deployment)
- [API Reference](#api-reference)
- [Data](#data)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)

## Project Goals
- Build a personalized ECG intelligence workflow that can adapt to patient baseline patterns.
- Predict rhythm class and risk score from ECG signals.
- Quantify predictive uncertainty for safety-aware interpretation.
- Keep all modules independently testable and replaceable.
- Support reproducible local development and containerized deployment.

## System Architecture
The pipeline is organized as modular stages:

1. **Ingestion**
   - Reads ECG records (MIT-BIH style files under `data/raw/`).
2. **Preprocessing**
   - Filtering, normalization, segmentation, and beat-level preparation.
3. **Feature and Representation Layers**
   - CNN/wavelet feature extraction and graph-ready representations.
4. **Temporal + Structural Modeling**
   - BiLSTM/TCN/auxiliary model components and graph modules.
5. **Personalization Layer**
   - Baseline manager and memory store for patient-aware adaptation.
6. **Decision Layer**
   - Hybrid fusion, anomaly scoring, and Bayesian uncertainty signals.
7. **Serving Layer**
   - FastAPI routes for ECG analysis, patient context, and risk history.

## Repository Structure
```text
.
├── src/
│   ├── api/                # FastAPI app, routers, schemas, middleware
│   ├── preprocessing/      # ECG filter/normalize/segment pipeline
│   ├── features/           # CNN/wavelet/graph feature utilities
│   ├── models/             # Core model blocks (BiLSTM, VAE, GNN, etc.)
│   ├── personalization/    # Baseline manager, memory store, profiles
│   ├── decision/           # Risk engine, uncertainty, fusion, anomaly logic
│   ├── training/           # Dataset, trainer, loss, evaluation
│   └── utils/              # Config, logging, visualization helpers
├── tests/                  # Unit/integration tests
├── data/raw/               # MIT-BIH records (.atr/.dat/.hea)
├── notebooks/              # Exploration, preprocessing, training demos
├── docker/                 # Dockerfiles and nginx config
├── docker-compose.yml
├── requirements.txt
└── pyproject.toml
```

## Tech Stack
- **Language:** Python 3.11+
- **API:** FastAPI, Pydantic, Uvicorn
- **ML/Numerics:** PyTorch, NumPy, SciPy, NeuroKit2, WFDB
- **Testing:** pytest, coverage
- **Quality tools:** black, isort, mypy (configured via `pyproject.toml`)
- **Deployment:** Docker, Docker Compose

## Getting Started

### 1) Clone and enter project
```bash
git clone https://github.com/harshpatelzzz/6sem_mainELecg.git
cd 6sem_mainELecg
```

### 2) Create virtual environment
```bash
python -m venv .venv
```

Windows (PowerShell):
```powershell
.venv\Scripts\Activate.ps1
```

Linux/macOS:
```bash
source .venv/bin/activate
```

### 3) Install dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 4) Configure environment
```bash
cp .env.example .env
```

On Windows PowerShell, if `cp` is unavailable:
```powershell
Copy-Item .env.example .env
```

## Environment Variables
See `.env.example` for defaults. Typical variables include:
- API host/port
- Model/runtime toggles
- Data paths
- Optional tracking/logging configuration

## Run the API
```bash
uvicorn src.api.main:app --reload --host 0.0.0.0 --port 8000
```

Open docs:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Run Tests
```bash
pytest tests/ -q
```

Coverage:
```bash
pytest tests/ --cov=src --cov-report=term-missing --cov-report=html
```

## Model Training and Evaluation
Core training utilities live in `src/training/`.

Typical flow:
1. Prepare/verify data under `data/raw/`
2. Build dataset loaders from `src.training.dataset`
3. Train with `src.training.trainer`
4. Evaluate with `src.training.evaluate`
5. Inspect predictions/risk outputs through API or notebook experiments

Notebook walkthroughs:
- `notebooks/01_data_exploration.ipynb`
- `notebooks/02_preprocessing_demo.ipynb`
- `notebooks/03_model_training.ipynb`
- `notebooks/04_risk_visualization.ipynb`

## Docker Deployment
```bash
docker compose up --build
```

Run in background:
```bash
docker compose up --build -d
```

Stop:
```bash
docker compose down
```

## API Reference
Base route prefix is versioned through API routers.

Representative endpoints:
- `POST /api/v1/analyze`
  - Submit ECG payload/record for inference + risk outputs
- `GET /api/v1/patient/{id}`
  - Retrieve patient profile/baseline context
- `GET /api/v1/risk/{id}/history`
  - Fetch risk trajectory/history

Use Swagger (`/docs`) for request/response schemas and live testing.

## Data
The repository includes MIT-BIH records in `data/raw/` (`.atr`, `.dat`, `.hea`).

If you plan public redistribution, verify dataset licensing and citation requirements for your use case.

## Troubleshooting
- **`python-multipart` error on form endpoints**
  - Install with `pip install python-multipart`.
- **PyTorch Geometric extension build failures on Windows**
  - Install matching wheel versions for your Python/PyTorch environment.
  - Some optional extensions may be skippable depending on active model path.
- **Very short ECG sequence preprocessing errors**
  - The preprocessing pipeline includes short-signal guards; verify sample length before filtering/peak detection.
- **Port already in use**
  - Change port in `uvicorn` command or stop conflicting process.

## Roadmap
- Reconnect and publish the full frontend dashboard in this remote.
- Add model checkpoint/version management.
- Expand CI pipeline (lint + tests + container smoke checks).
- Add benchmark reports for class-wise metrics and calibration.