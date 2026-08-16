"""
SynTrait
Comparative Genomics Platform for Agronomic Trait Discovery

Author: Balaji Muthukumar
Project: SynTrait
"""
from sqlalchemy import Column, Integer, String, Float, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.database import Base

class Species(Base):
    __tablename__ = "species"
    id = Column(Integer, primary_key=True, index=True)
    scientific_name = Column(String, nullable=False)
    common_name = Column(String)
    assembly_accession = Column(String, nullable=False)

class Gene(Base):
    __tablename__ = "genes"
    id = Column(Integer, primary_key=True, index=True)
    species_id = Column(Integer, ForeignKey("species.id"))
    external_gene_id = Column(String, index=True, nullable=False)
    chromosome = Column(String)
    start_pos = Column(Integer)
    end_pos = Column(Integer)

class Trait(Base):
    __tablename__ = "traits"
    id = Column(Integer, primary_key=True, index=True)
    trait_name = Column(String, nullable=False)
    to_id = Column(String)
    category = Column(String)

class BenchmarkGene(Base):
    __tablename__ = "benchmark_genes"
    id = Column(Integer, primary_key=True, index=True)
    species_id = Column(Integer, ForeignKey("species.id"))
    trait_id = Column(Integer, ForeignKey("traits.id"))
    gene_symbol = Column(String, nullable=False)
    pmid = Column(String, nullable=False)
    evidence_summary = Column(String)

class QTLInterval(Base):
    __tablename__ = "qtl_intervals"
    id = Column(Integer, primary_key=True, index=True)
    species_id = Column(Integer, ForeignKey("species.id"))
    trait_id = Column(Integer, ForeignKey("traits.id"))
    chromosome = Column(String)
    start_pos = Column(Integer)
    end_pos = Column(Integer)
    qtl_name = Column(String)
    pmid = Column(String)

class QTLProjection(Base):
    __tablename__ = "qtl_projections"
    id = Column(Integer, primary_key=True, index=True)
    qtl_id = Column(Integer, ForeignKey("qtl_intervals.id"))
    qtl_name = Column(String)
    source_species = Column(String)
    target_species = Column(String)
    target_chrom = Column(String)
    target_start = Column(Integer)
    target_end = Column(Integer)
    block_id = Column(Integer)

class CandidateScore(Base):
    __tablename__ = "candidate_scores"
    id = Column(Integer, primary_key=True, index=True)
    candidate_gene_id = Column(String, index=True, nullable=False)
    composite_score = Column(Float)
    evidence_json = Column(JSON)
