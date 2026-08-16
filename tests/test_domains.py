"""
SynTrait
Comparative Genomics Platform for Agronomic Trait Discovery

Author: Balaji Muthukumar
Project: SynTrait
"""
import sys
import os
import json
import tempfile
import pytest
sys.path.append(os.path.abspath("pipeline/scripts"))
from parse_domtblout import parse_domtblout, resolve_overlaps

@pytest.fixture
def sample_domtblout():
    content = """# hmmscan :: search sequence(s) against a profile database
# HMMER 3.4 (Aug 2023); http://hmmer.org/
# Copyright (C) 2023 Howard Hughes Medical Institute.
# Freely distributed under the BSD open source license.
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
#                                                                            --- full sequence --- -------------- this domain -------------   hmm coord   ali coord   env coord
# target name        accession   tlen query name           accession   qlen   E-value  score  bias   #  of  c-Evalue  i-Evalue  score  bias  from    to  from    to  from    to  acc description of target
#------------------- ---------- ----- -------------------- ---------- ----- --------- ------ ----- --- --- --------- --------- ------ ----- ----- ----- ----- ----- ----- ----- ---- ---------------------
2OG-FeII_Oxy         PF03171.21   104 LOC4325003           -            386     1e-30  100.0   0.1   1   1     1e-31     1e-30  100.0   0.1     1   100    50   150    45   155 0.95 2OG-Fe(II) oxygenase
Fake_Domain          PF99999.1    100 LOC4325003           -            386       1.0    5.0   0.0   1   1       1.0       1.0    5.0   0.0     1    50   100   140    90   150 0.80 Fake overlapping domain
Non_Overlap          PF88888.1    200 LOC4325003           -            386     1e-10   40.0   0.0   1   1     1e-11     1e-10   40.0   0.0     1   100   200   300   190   310 0.90 Non overlapping domain
#
# Program:         hmmscan
# Version:         3.4 (Aug 2023)
"""
    fd, path = tempfile.mkstemp()
    with os.fdopen(fd, 'w') as f:
        f.write(content)
    yield path
    os.remove(path)

def test_parse_domtblout(sample_domtblout):
    hits_by_protein = parse_domtblout(sample_domtblout)
    assert "LOC4325003" in hits_by_protein
    hits = hits_by_protein["LOC4325003"]
    assert len(hits) == 3
    
    # Check extraction
    sd1 = [h for h in hits if h["pfam_acc"] == "PF03171.21"][0]
    assert sd1["domain_name"] == "2OG-FeII_Oxy"
    assert sd1["start"] == 50
    assert sd1["end"] == 150
    assert sd1["e_value"] == 1e-30

def test_resolve_overlaps(sample_domtblout):
    hits_by_protein = parse_domtblout(sample_domtblout)
    hits = hits_by_protein["LOC4325003"]
    
    resolved = resolve_overlaps(hits)
    
    # 2OG-FeII_Oxy (50-150, 1e-30) overlaps Fake_Domain (100-140, 1.0)
    # Non_Overlap is 200-300
    # Expected: 2OG-FeII_Oxy and Non_Overlap should remain. Fake_Domain should be dropped.
    
    assert len(resolved) == 2
    domain_names = [h["domain_name"] for h in resolved]
    assert "2OG-FeII_Oxy" in domain_names
    assert "Non_Overlap" in domain_names
    assert "Fake_Domain" not in domain_names
