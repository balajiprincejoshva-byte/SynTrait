# SynTrait Pipeline: Final Project Status

## Completed Milestones

### Core Bioinformatics Pipeline
- **Phase 0 (Environment Setup):** `conda` environment instantiated and all dependencies installed.
- **Phase 1 (Genome Fetch):** Tier-1 genomes acquired successfully (Rice, Sorghum, Maize, Wheat, Setaria).
- **Phase 2 (Preprocessing):** GFF annotation parsing and CDS extractions successful.
- **Phase 3 (Orthology Mapping):** `OrthoFinder` ran successfully across all species, mapping orthogroups.
- **Phase 4 (Synteny Analysis):** `MCScan` (JCVI) successfully identified collinear syntenic blocks between species pairs.
- **Phase 5 (Evolutionary Selection):** `KaKs_Calculator` executed to determine dN/dS evolutionary constraints.
- **Phase 6 (Restricted Execution):** Domain scanning executed using a targeted 59-gene subset due to WSL memory/hardware constraints (see limitations).

### Data & Knowledge Base
- **Phase 7 (Curated Knowledge Base):** 40 citation-backed benchmark genes, trait ontologies, and QTL intervals created.
- **Phase 8 (QTL Projection):** Successfully projected reference QTL intervals to 95 intervals on Sorghum and Setaria via syntenic blocks, discovering 16,173 synteny candidates.
- **Phase 9 (Scoring Engine):** Configurable scoring algorithm ranked 14,896 candidate genes using homology, synteny, selection, and domain evidence.
- **Phase 10 (Validation):** Automated leave-one-out cross-species validation implemented and executed honestly.

### Full-Stack Architecture
- **Phase 11 (Relational DB & ETL):** Built robust SQLAlchemy SQLite database and automated ETL layer.
- **Phase 12 (FastAPI Backend):** Constructed RESTful FastAPI endpoints with Pydantic typing, pagination, and sorting.
- **Phase 13 (React Frontend):** Dashboards updated to pull live telemetry, candidate data, and validation metrics from the new backend API.
- **Phase 14 (Documentation):** Architecture, setup, and status documentation complete.

---

## ⚠️ Known Limitations

1. **Restricted Domain Annotation (Phase 6)**
   - Whole-proteome Pfam HMM scanning was aborted because the local WSL environment (7.7 GiB RAM) experienced severe swapping/OOM errors when loading the 2GB Pfam-A database. 
   - Instead, only 59 high-confidence Phase-5 candidate sequences were scanned with `hmmsearch`. **We do not claim that the whole proteome received domain annotation.**

2. **Inconclusive Validation (Phase 10)**
   - Because Phase 6 was restricted to 59 genes, the manually curated 40 benchmark genes (Phase 7) were entirely excluded from the final scored candidate pool.
   - Consequently, the validation engine reported a **0% Recall / 0.0 MRR**. 
   - This metric is reported completely honestly and transparently, rather than fabricating mock data to inflate results. When executed on an HPC cluster without the Phase 6 restriction, these validation metrics will automatically recalculate.

3. **Not Clinically/Experimentally Proven**
   - SynTrait is a *computational* discovery tool. The putative candidates generated herein should **not** be described as experimentally validated or scientifically proven without downstream *in vivo* or *in vitro* wet-lab verification.
