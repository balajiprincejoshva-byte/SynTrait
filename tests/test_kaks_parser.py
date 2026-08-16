"""
SynTrait
Comparative Genomics Platform for Agronomic Trait Discovery

Author: Balaji Muthukumar
Project: SynTrait
"""
import os
import tempfile
import sys
import pytest

# Adjust path to import run_kaks
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../pipeline/scripts')))
import run_kaks

def test_parse_valid_kaks():
    with tempfile.TemporaryDirectory() as tmpdir:
        kaks_out = os.path.join(tmpdir, "kaks.txt")
        with open(kaks_out, "w") as f:
            f.write("Sequence\tMethod\tKa\tKs\tKa/Ks\tP-Value(Fisher)\tLength\tS-Sites\tN-Sites\tFold-Sites(0:2:4)\tSubstitutions\tS-Substitutions\tN-Substitutions\tFold-S-Substitutions(0:2:4)\tFold-N-Substitutions(0:2:4)\tDivergence-Time\tSubstitution-Rate-Ratio(r)\tGC(1)\tGC(2)\tGC(3)\n")
            f.write("LOC1-LOC2\tYN\t0.0123\t0.456\t0.0269\t1.0\t300\t100\t200\t0:0:0\t10\t5\t5\t0:0:0\t0:0:0\t10.0\t0.5\t0.4\t0.5\t0.6\n")
        
        # Test the parsing logic used in run_kaks
        with open(kaks_out, "r") as f:
            lines = f.readlines()
            header = lines[0].strip().split("\t")
            vals = lines[1].strip().split("\t")
            res = dict(zip(header, vals))
            
        ka = res.get("Ka", "NA")
        ks = res.get("Ks", "NA")
        ka_ks = res.get("Ka/Ks", "NA")
        
        is_valid = True
        try:
            ka_f = float(ka)
            ks_f = float(ks)
            ka_ks_f = float(ka_ks)
            if ks_f == 0.0 or ks_f > 2.0 or ka_ks_f > 10.0:
                is_valid = False
        except ValueError:
            is_valid = False
            
        assert ka == "0.0123"
        assert ks == "0.456"
        assert ka_ks == "0.0269"
        assert is_valid == True

def test_parse_invalid_ks_zero():
    # dS = 0 edge case
    ka, ks, ka_ks = "0.01", "0.0", "NA"
    is_valid = True
    try:
        ks_f = float(ks)
        if ks_f == 0.0 or ks_f > 2.0:
            is_valid = False
    except ValueError:
        is_valid = False
    
    assert is_valid == False

def test_parse_invalid_na():
    # undefined edge case
    ka, ks, ka_ks = "NA", "NA", "NA"
    is_valid = True
    try:
        ka_f = float(ka)
    except ValueError:
        is_valid = False
        
    assert is_valid == False

def test_parse_invalid_ks_saturated():
    # saturated dS
    ka, ks, ka_ks = "0.5", "2.5", "0.2"
    is_valid = True
    try:
        ks_f = float(ks)
        if ks_f == 0.0 or ks_f > 2.0:
            is_valid = False
    except ValueError:
        is_valid = False
        
    assert is_valid == False

def test_fasta_to_axt():
    with tempfile.TemporaryDirectory() as tmpdir:
        fasta_file = os.path.join(tmpdir, "in.fa")
        axt_file = os.path.join(tmpdir, "out.axt")
        
        with open(fasta_file, "w") as f:
            f.write(">gene1\nATGCGT\n>gene2\nATGGGT\n")
            
        success = run_kaks.fasta_to_axt(fasta_file, axt_file, "gene1", "gene2")
        assert success == True
        
        with open(axt_file, "r") as f:
            content = f.read()
            
        assert content == "gene1-gene2\nATGCGT\nATGGGT\n\n"
