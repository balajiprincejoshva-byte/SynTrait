"""
SynTrait
Comparative Genomics Platform for Agronomic Trait Discovery

Author: Balaji Muthukumar
Project: SynTrait
"""
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional

from backend.database import get_db
from backend.models import Species, Trait, BenchmarkGene, QTLInterval, QTLProjection, CandidateScore
from backend.app.schemas import (
    SpeciesBase, TraitBase, CandidateResponse, PaginatedCandidates, 
    ValidationStats, QTLBase, StatsResponse
)

app = FastAPI(
    title="SynTrait",
    description="Comparative Genomics Platform for Agronomic Trait Discovery",
    version="1.0.0",
    contact={
        "name": "Balaji Muthukumar"
    }
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/stats", response_model=StatsResponse)
def get_stats(db: Session = Depends(get_db)):
    return {
        "species_count": db.query(Species).count(),
        "traits_count": db.query(Trait).count(),
        "benchmark_genes_count": db.query(BenchmarkGene).count(),
        "qtl_count": db.query(QTLInterval).count(),
        "qtl_projections_count": db.query(QTLProjection).count(),
        "candidates_count": db.query(CandidateScore).count()
    }

@app.get("/species", response_model=List[SpeciesBase])
def get_species(db: Session = Depends(get_db)):
    return db.query(Species).all()

@app.get("/traits", response_model=List[TraitBase])
def get_traits(db: Session = Depends(get_db)):
    return db.query(Trait).all()

@app.get("/candidates", response_model=PaginatedCandidates)
def get_candidates(
    skip: int = 0, 
    limit: int = 50, 
    min_score: Optional[float] = None,
    db: Session = Depends(get_db)
):
    query = db.query(CandidateScore)
    if min_score is not None:
        query = query.filter(CandidateScore.composite_score >= min_score)
    
    total = query.count()
    candidates = query.order_by(CandidateScore.composite_score.desc()).offset(skip).limit(limit).all()
    
    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": candidates
    }

@app.get("/candidates/top", response_model=List[CandidateResponse])
def get_top_candidates(limit: int = 10, db: Session = Depends(get_db)):
    return db.query(CandidateScore).order_by(CandidateScore.composite_score.desc()).limit(limit).all()

@app.get("/candidates/{gene_id}", response_model=CandidateResponse)
def get_candidate(gene_id: str, db: Session = Depends(get_db)):
    candidate = db.query(CandidateScore).filter(CandidateScore.candidate_gene_id == gene_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return candidate

@app.get("/qtl", response_model=List[QTLBase])
def get_qtls(db: Session = Depends(get_db)):
    return db.query(QTLInterval).all()

@app.get("/validation", response_model=ValidationStats)
def get_validation():
    # Returning the honest Phase 10 metrics
    return {
        "total_evaluated": 40,
        "total_recovered": 0,
        "top_1_recall": 0.0,
        "top_3_recall": 0.0,
        "top_10_recall": 0.0,
        "mrr": 0.0,
        "limitation_warning": "Phase-10 validation is inconclusive. Benchmark genes were excluded from the restricted Phase 6 candidate pool due to WSL memory limits."
    }

@app.get("/genes/{gene_id}")
def get_gene(gene_id: str):
    raise HTTPException(status_code=501, detail="Not implemented")

@app.get("/search")
def search(q: str, skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    query = db.query(CandidateScore).filter(CandidateScore.candidate_gene_id.contains(q))
    total = query.count()
    results = query.offset(skip).limit(limit).all()
    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": results
    }

@app.get("/about")
def about():
    return {
        "project": "SynTrait",
        "author": "Balaji Muthukumar"
    }
