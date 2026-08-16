"""
SynTrait
Comparative Genomics Platform for Agronomic Trait Discovery

Author: Balaji Muthukumar
Project: SynTrait
"""
import pytest
import os
import tempfile
import json
import subprocess

DUMMY_GFF = """##gff-version 3
chr1\tGnomon\tgene\t1000\t2000\t.\t+\t.\tID=gene-LOC1;Name=LOC1
chr1\tGnomon\tmRNA\t1000\t2000\t.\t+\t.\tID=rna-XM_1;Parent=gene-LOC1
chr1\tGnomon\tCDS\t1100\t1200\t.\t+\t0\tID=cds-XP_1;Parent=rna-XM_1;protein_id=XP_1
chr1\tGnomon\tCDS\t1500\t1600\t.\t+\t0\tID=cds-XP_1;Parent=rna-XM_1;protein_id=XP_1
chr1\tGnomon\tmRNA\t1000\t2000\t.\t+\t.\tID=rna-XM_2;Parent=gene-LOC1
chr1\tGnomon\tCDS\t1100\t1900\t.\t+\t0\tID=cds-XP_2;Parent=rna-XM_2;protein_id=XP_2
chr2\tGnomon\tgene\t3000\t4000\t.\t-\t.\tID=gene-LOC2;Name=LOC2
chr2\tGnomon\tmRNA\t3000\t4000\t.\t-\t.\tID=rna-XM_3;Parent=gene-LOC2
chr2\tGnomon\tCDS\t3100\t3200\t.\t-\t0\tID=cds-XP_3;Parent=rna-XM_3;protein_id=XP_3
chr3\tGnomon\tgene\t5000\t6000\t.\t+\t.\tID=gene-LOC3
"""

DUMMY_FASTA = """>XP_1
MKTGLLL
>XP_2
MKTGLLLMKTGLLL
>XP_3
MKT
"""

def test_preprocess_logic():
    with tempfile.TemporaryDirectory() as tmpdir:
        gff_path = os.path.join(tmpdir, "test.gff")
        fasta_path = os.path.join(tmpdir, "test.faa")
        bed_out = os.path.join(tmpdir, "out.bed")
        fasta_out = os.path.join(tmpdir, "out.pep.fa")
        qc_out = os.path.join(tmpdir, "qc.json")

        with open(gff_path, "w") as f:
            f.write(DUMMY_GFF)
        with open(fasta_path, "w") as f:
            f.write(DUMMY_FASTA)

        script_path = os.path.join(os.path.dirname(__file__), "..", "pipeline", "scripts", "preprocess.py")
        cmd = [
            "python", script_path,
            "--gff", gff_path,
            "--fasta", fasta_path,
            "--bed-out", bed_out,
            "--fasta-out", fasta_out,
            "--qc-out", qc_out
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        assert result.returncode == 0, f"Script failed: {result.stderr}"

        # 1. Check QC Stats
        with open(qc_out, "r") as f:
            qc = json.load(f)
        
        # 3 genes total in GFF, but only 2 have CDS/proteins
        assert qc["total_genes_in_gff"] == 3
        assert qc["total_proteins_in_fasta"] == 3
        assert qc["retained_longest_isoforms"] == 2
        assert qc["unique_chromosomes_or_contigs"] == 2

        # 2. Check BED output
        # BED is 0-indexed for start, 1-indexed for end
        with open(bed_out, "r") as f:
            bed_lines = f.read().strip().split("\n")
        
        assert len(bed_lines) == 2
        
        # Gene LOC1 is chr1, 999-2000, strand +
        # Gene LOC2 is chr2, 2999-4000, strand -
        bed_dict = {}
        for line in bed_lines:
            parts = line.split("\t")
            bed_dict[parts[3]] = parts

        assert "LOC1" in bed_dict
        assert bed_dict["LOC1"][0] == "chr1"
        assert bed_dict["LOC1"][1] == "999"
        assert bed_dict["LOC1"][2] == "2000"
        assert bed_dict["LOC1"][5] == "+"

        assert "LOC2" in bed_dict
        assert bed_dict["LOC2"][0] == "chr2"
        assert bed_dict["LOC2"][1] == "2999"
        assert bed_dict["LOC2"][2] == "4000"
        assert bed_dict["LOC2"][5] == "-"

        # 3. Check FASTA output
        with open(fasta_out, "r") as f:
            fasta_lines = f.read().strip().split("\n")
        
        # LOC1 should use XP_2 since it's longer (length 801 vs 202)
        # XP_2 sequence is MKTGLLLMKTGLLL
        # LOC2 should use XP_3
        fasta_dict = {}
        for i in range(0, len(fasta_lines), 2):
            fasta_dict[fasta_lines[i][1:]] = fasta_lines[i+1]
        
        assert len(fasta_dict) == 2
        assert "LOC1" in fasta_dict
        assert fasta_dict["LOC1"] == "MKTGLLLMKTGLLL"
        assert "LOC2" in fasta_dict
        assert fasta_dict["LOC2"] == "MKT"
