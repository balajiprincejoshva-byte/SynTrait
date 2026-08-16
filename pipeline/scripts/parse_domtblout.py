"""
SynTrait
Comparative Genomics Platform for Agronomic Trait Discovery

Author: Balaji Muthukumar
Project: SynTrait
"""
import sys
import json
from collections import defaultdict

def parse_domtblout(file_path):
    hits_by_protein = defaultdict(list)
    
    with open(file_path, "r") as f:
        for line in f:
            if line.startswith("#"):
                continue
            
            parts = line.split(maxsplit=22)
            if len(parts) < 23:
                continue
            
            domain_name = parts[0]
            pfam_acc = parts[1]
            protein_id = parts[3]
            e_value = float(parts[6])  # full sequence e-value
            i_evalue = float(parts[12]) # independent domain e-value
            score = float(parts[13])
            start = int(parts[17])
            end = int(parts[18])
            description = parts[22].strip()
            
            hits_by_protein[protein_id].append({
                "protein_id": protein_id,
                "pfam_acc": pfam_acc,
                "domain_name": domain_name,
                "start": start,
                "end": end,
                "e_value": i_evalue, # using i-Evalue for domain level significance
                "score": score,
                "description": description
            })
            
    return hits_by_protein

def resolve_overlaps(hits):
    # Sort hits by E-value (ascending), so best hits are processed first
    hits.sort(key=lambda x: x["e_value"])
    
    resolved = []
    for hit in hits:
        overlap = False
        for r_hit in resolved:
            # Check for coordinate overlap
            # overlap condition: max(start1, start2) <= min(end1, end2)
            if max(hit["start"], r_hit["start"]) <= min(hit["end"], r_hit["end"]):
                overlap = True
                break
        
        if not overlap:
            resolved.append(hit)
            
    return resolved

def main():
    if len(sys.argv) < 3:
        print("Usage: python parse_domtblout.py <output_json> <input_domtblout_files...>")
        sys.exit(1)
        
    out_json = sys.argv[1]
    in_files = sys.argv[2:]
    
    all_resolved = []
    
    for fpath in in_files:
        hits_by_protein = parse_domtblout(fpath)
        for prot_id, hits in hits_by_protein.items():
            resolved = resolve_overlaps(hits)
            all_resolved.extend(resolved)
            
    with open(out_json, "w") as f:
        json.dump(all_resolved, f, indent=2)
        
    print(f"Parsed {len(all_resolved)} non-overlapping domain hits into {out_json}")

if __name__ == "__main__":
    main()
