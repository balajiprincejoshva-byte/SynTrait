"""
SynTrait
Comparative Genomics Platform for Agronomic Trait Discovery

Author: Balaji Muthukumar
Project: SynTrait
"""
import json
import subprocess
import os

# 1. Load the selection scores and extract all gene IDs
with open('data/selection_output/selection_scores.json', 'r') as f:
    scores = json.load(f)

genes = set()
for s in scores:
    genes.add(s['gene1'])
    genes.add(s['gene2'])

print(f"Extracted {len(genes)} unique candidate genes from Phase 5.")

# 2. Extract sequences from all 3 PEP fasta files
fasta_files = [
    'data/Oryza_sativa.pep.fa',
    'data/Sorghum_bicolor.pep.fa',
    'data/Setaria_italica.pep.fa'
]

subset_fasta = 'data/domains_output/subset.pep.fa'
os.makedirs('data/domains_output', exist_ok=True)

extracted_count = 0
with open(subset_fasta, 'w') as out_f:
    for ff in fasta_files:
        if not os.path.exists(ff):
            continue
        with open(ff, 'r') as in_f:
            write_seq = False
            for line in in_f:
                if line.startswith('>'):
                    # The ID is usually the first word after '>'
                    seq_id = line[1:].strip().split()[0]
                    if seq_id in genes:
                        write_seq = True
                        extracted_count += 1
                        out_f.write(line)
                    else:
                        write_seq = False
                elif write_seq:
                    out_f.write(line)

print(f"Extracted {extracted_count} sequences to {subset_fasta}.")

# 3. Run hmmscan
domtblout = 'data/domains_output/subset.domtblout'
pfam_db = 'data/external_kb/Pfam-A.hmm'
threads = '4'

cmd = [
    'hmmsearch',
    '--cpu', threads,
    '--domtblout', domtblout,
    '-o', '/dev/null',
    pfam_db,
    subset_fasta
]
print(f"Running hmmsearch on subset... ({' '.join(cmd)})")
subprocess.run(cmd, check=True)

# 4. Parse output
print("Parsing domtblout...")
parse_cmd = [
    'python', 'pipeline/scripts/parse_domtblout.py',
    'data/domains_output/domain_hits.json',
    domtblout
]
subprocess.run(parse_cmd, check=True)

print("Subset Phase 6 complete!")
