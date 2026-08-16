"""
SynTrait
Comparative Genomics Platform for Agronomic Trait Discovery

Author: Balaji Muthukumar
Project: SynTrait
"""
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class SpeciesBase(BaseModel):
    id: int
    scientific_name: str
    common_name: Optional[str]
    assembly_accession: str

    class Config:
        orm_mode = True

class TraitBase(BaseModel):
    id: int
    trait_name: str
    to_id: Optional[str]
    category: Optional[str]

    class Config:
        orm_mode = True

class CandidateEvidence(BaseModel):
    homology_score: float
    synteny_score: float
    selection_score: float
    domain_score: float

class CandidateResponse(BaseModel):
    id: int
    candidate_gene_id: str
    composite_score: float
    evidence_json: CandidateEvidence

    class Config:
        orm_mode = True

class PaginatedCandidates(BaseModel):
    total: int
    skip: int
    limit: int
    data: List[CandidateResponse]

class ValidationStats(BaseModel):
    total_evaluated: int
    total_recovered: int
    top_1_recall: float
    top_3_recall: float
    top_10_recall: float
    mrr: float
    limitation_warning: str

class QTLBase(BaseModel):
    id: int
    species_id: int
    trait_id: int
    chromosome: str
    start_pos: int
    end_pos: int
    qtl_name: Optional[str]
    pmid: Optional[str]

    class Config:
        orm_mode = True

class StatsResponse(BaseModel):
    species_count: int
    traits_count: int
    benchmark_genes_count: int
    qtl_count: int
    qtl_projections_count: int
    candidates_count: int
