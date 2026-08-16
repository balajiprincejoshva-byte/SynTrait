"""
SynTrait
Comparative Genomics Platform for Agronomic Trait Discovery

Author: Balaji Muthukumar
Project: SynTrait
"""
import os
import csv
import json
import sys

# Add the parent directory to sys.path so we can import from backend
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database import engine, Base, SessionLocal
from backend.models import Species, Trait, BenchmarkGene, QTLInterval, QTLProjection, CandidateScore, Gene

def init_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    print("Database schema initialized.")

def load_species(db):
    species_list = [
        {"id": 1, "scientific_name": "Oryza sativa", "assembly_accession": "GCF_001433935.1"},
        {"id": 2, "scientific_name": "Sorghum bicolor", "assembly_accession": "GCF_000003195.3"},
        {"id": 3, "scientific_name": "Zea mays", "assembly_accession": "GCF_902167145.1"},
        {"id": 4, "scientific_name": "Triticum aestivum", "assembly_accession": "GCF_018691455.1"},
        {"id": 5, "scientific_name": "Setaria italica", "assembly_accession": "GCF_000263155.2"}
    ]
    for s in species_list:
        db.add(Species(**s))
    db.commit()
    print("Species loaded.")

def load_traits(db, kb_dir):
    with open(os.path.join(kb_dir, "trait_ontology.csv"), "r") as f:
        reader = csv.DictReader(f)
        for row in reader:
            t = Trait(id=int(row["id"]), trait_name=row["trait_name"], to_id=row["to_id"], category=row["category"])
            db.add(t)
    db.commit()
    print("Traits loaded.")

def load_benchmarks(db, kb_dir):
    with open(os.path.join(kb_dir, "benchmark_genes.csv"), "r") as f:
        reader = csv.DictReader(f)
        for row in reader:
            b = BenchmarkGene(
                id=int(row["id"]), 
                species_id=int(row["species_id"]), 
                trait_id=int(row["trait_id"]),
                gene_symbol=row["gene_symbol"],
                pmid=row["pmid"],
                evidence_summary=row["evidence_summary"]
            )
            db.add(b)
    db.commit()
    print("Benchmarks loaded.")

def load_qtls(db, kb_dir):
    with open(os.path.join(kb_dir, "qtl_intervals.csv"), "r") as f:
        reader = csv.DictReader(f)
        for row in reader:
            q = QTLInterval(
                id=int(row["id"]),
                species_id=int(row["species_id"]),
                trait_id=int(row["trait_id"]),
                chromosome=row["chromosome"],
                start_pos=int(row["start_pos"]),
                end_pos=int(row["end_pos"]),
                qtl_name=row["qtl_name"],
                pmid=row["pmid"]
            )
            db.add(q)
    db.commit()
    print("QTL Intervals loaded.")

def load_qtl_projections(db, kb_dir):
    path = os.path.join(kb_dir, "qtl_projections.csv")
    if not os.path.exists(path):
        print("No QTL projections found.")
        return
    with open(path, "r") as f:
        reader = csv.DictReader(f)
        for row in reader:
            p = QTLProjection(
                qtl_id=int(row["qtl_id"]),
                qtl_name=row["qtl_name"],
                source_species=row["source_species"],
                target_species=row["target_species"],
                target_chrom=row["target_chrom"],
                target_start=int(row["target_start"]),
                target_end=int(row["target_end"]),
                block_id=int(row["block_id"])
            )
            db.add(p)
    db.commit()
    print("QTL Projections loaded.")

def load_candidate_scores(db, kb_dir):
    path = os.path.join(kb_dir, "candidate_scores.json")
    if not os.path.exists(path):
        print("No candidate scores found.")
        return
    with open(path, "r") as f:
        data = json.load(f)
        for row in data:
            c = CandidateScore(
                candidate_gene_id=row["candidate_gene_id"],
                composite_score=row["composite_score"],
                evidence_json=row["evidence_json"]
            )
            db.add(c)
    db.commit()
    print("Candidate Scores loaded.")

def main():
    init_db()
    db = SessionLocal()
    
    kb_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "knowledge_base")
    
    try:
        load_species(db)
        load_traits(db, kb_dir)
        load_benchmarks(db, kb_dir)
        load_qtls(db, kb_dir)
        load_qtl_projections(db, kb_dir)
        load_candidate_scores(db, kb_dir)
        
        # Print report
        print("\n=== Database Load Report ===")
        print(f"Species: {db.query(Species).count()}")
        print(f"Traits: {db.query(Trait).count()}")
        print(f"Benchmark Genes: {db.query(BenchmarkGene).count()}")
        print(f"QTL Intervals: {db.query(QTLInterval).count()}")
        print(f"QTL Projections: {db.query(QTLProjection).count()}")
        print(f"Candidate Scores: {db.query(CandidateScore).count()}")
        print("ETL Completed Successfully.")
        
    except Exception as e:
        print(f"Error during ETL: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()
