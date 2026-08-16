# SynTrait

Comparative Genomics Platform for Agronomic Trait-Target Discovery

### Created by

**Balaji Muthukumar**

> SynTrait is an independent computational biology platform integrating comparative genomics, orthology, synteny, evolutionary evidence, protein-domain analysis, and trait evidence for candidate-gene prioritization.

SynTrait is a fully-automated, computationally intensive pipeline and platform designed to identify functional candidate genes across multiple Tier-1 grass species.

## Architecture Overview

SynTrait operates as a modular three-tier architecture:
1. **Bioinformatics Pipeline (Python/Bash):** Fetches genomes, extracts CDS, runs OrthoFinder (homology), JCVI MCScan (synteny), KaKs_Calculator (evolutionary selection), and HMMER (domain signatures). 
2. **Backend API (FastAPI + SQLite):** A robust ETL ingestion layer structures the pipeline outputs into an indexed relational schema served over RESTful endpoints.
3. **Frontend Dashboard (React/Vite):** A high-performance, dark-mode visualization layer for interrogating the candidate discovery space.

## Environment Setup

### Prerequisites
- WSL2 (Windows Subsystem for Linux) or Native Linux
- Miniconda3 or Anaconda3
- Node.js (v18+)

### 1. Conda Environment
```bash
conda env create -f environment.yml
conda activate syntrait
```

## Running the Platform

### 1. Database Initialization & ETL
The ETL script drops and rebuilds the SQLite database from the local `data/` and `data/knowledge_base/` flat files. It is strictly idempotent.
```bash
conda activate syntrait
python backend/etl.py
```

### 2. Launch FastAPI Backend
The API serves candidate data on port 8000.
```bash
conda activate syntrait
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000
```
API Documentation (Swagger UI) is available at: [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Launch React Frontend
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
Navigate to [http://localhost:5173](http://localhost:5173).

## Methodology & Scoring Engine
The system assigns every gene a multi-dimensional composite score based on the formula defined in `traits.yaml`:
```
composite_score =
    0.30 * homology_score
  + 0.25 * synteny_score
  + 0.20 * selection_score
  + 0.15 * domain_score
```

## Project Status & Limitations
Please thoroughly read `FINAL_STATUS.md` before proceeding. The validation module accurately reports 0% recall because the current build execution was strictly limited to a 59-gene subset due to severe local memory hardware constraints, subsequently excluding the baseline benchmark genes.

## Attribution
- **NCBI Datasets:** Genomes and RefSeq annotations.
- **OrthoFinder:** Emms & Kelly.
- **MCscan (JCVI):** Tang et al. 2008.
- **HMMER / Pfam:** Domain architecture mapping.
- **KaKs_Calculator:** Evolutionary constraint calculations.
