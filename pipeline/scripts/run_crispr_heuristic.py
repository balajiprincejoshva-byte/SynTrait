"""
SynTrait
Comparative Genomics Platform for Agronomic Trait Discovery

Author: Balaji Muthukumar
Project: SynTrait
"""
import json
import os
import re

def parse_fasta(filepath):
    """Simple FASTA parser yielding (header, sequence)"""
    with open(filepath, 'r') as f:
        header = ''
        seq = []
        for line in f:
            line = line.strip()
            if not line:
                continue
            if line.startswith('>'):
                if header:
                    yield header, ''.join(seq)
                header = line[1:].split()[0]  # Just take the first token
                seq = []
            else:
                seq.append(line)
        if header:
            yield header, ''.join(seq)

def main():
    base_dir = "data"
    kb_dir = os.path.join(base_dir, 'knowledge_base')
    
    scores_path = os.path.join(kb_dir, 'candidate_scores.json')
    if not os.path.exists(scores_path):
        print("Candidate scores not found.")
        return
        
    with open(scores_path, 'r') as f:
        candidates = json.load(f)
        
    # Build a lookup of candidates to quickly find them
    cand_set = {c['candidate_gene_id'] for c in candidates}
    
    # We will search the rice CDS fasta
    fasta_path = os.path.join(base_dir, 'Oryza_sativa.cds.fa')
    
    seqs = {}
    if os.path.exists(fasta_path):
        print(f"Parsing {fasta_path} for candidate sequences...")
        for header, seq in parse_fasta(fasta_path):
            # Header might be LOC_Os...
            if header in cand_set:
                seqs[header] = seq
    else:
        print(f"FASTA not found at {fasta_path}, editability will be unavailable.")

    crispr_data = {}
    
    # NGG PAM regex (N = A/T/C/G, G = G, G = G). Also check CCN for the other strand if we just look at CDS.
    # Simple heuristic: Just count 'GG' or 'CC' with one base margin.
    # A PAM is NGG. So we just count occurrences of 'GG'.
    
    for cand in candidates:
        gene = cand['candidate_gene_id']
        
        if gene in seqs:
            sequence = seqs[gene].upper()
            length = len(sequence)
            
            # Count NGG on sense strand (look for 'GG')
            pam_count = sequence.count('GG') + sequence.count('CC')
            
            density = pam_count / (length / 1000.0) if length > 0 else 0
            
            if density > 80:
                feasibility = "HIGH"
            elif density > 40:
                feasibility = "MEDIUM"
            else:
                feasibility = "LOW"
                
            crispr_data[gene] = {
                "pam_count": pam_count,
                "exon_length": length,
                "pam_density_per_kb": round(density, 1),
                "uniqueness_estimate": "Heuristic (Coarse K-mer)",
                "feasibility": feasibility,
                "status": "Available"
            }
        else:
            crispr_data[gene] = {
                "status": "Unavailable",
                "message": "Sequence not found in reference CDS."
            }
            
    with open(os.path.join(kb_dir, 'crispr.json'), 'w') as f:
        json.dump(crispr_data, f, indent=2)
        
    print(f"CRISPR heuristic screening completed for {len(candidates)} candidates.")

if __name__ == "__main__":
    main()
