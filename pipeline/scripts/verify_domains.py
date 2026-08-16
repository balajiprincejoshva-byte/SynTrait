"""
SynTrait
Comparative Genomics Platform for Agronomic Trait Discovery

Author: Balaji Muthukumar
Project: SynTrait
"""
import json
import sys
from collections import defaultdict

def verify_domains(json_file):
    with open(json_file, "r") as f:
        data = json.load(f)
        
    print(f"Total parsed domain hits: {len(data)}")
    
    # SD1 loci in Rice: LOC4325003
    sd1_hits = [hit for hit in data if hit["protein_id"] == "LOC4325003"]
    print(f"\n--- SD1 (LOC4325003) Domains ---")
    for hit in sd1_hits:
        print(f"{hit['pfam_acc']}: {hit['domain_name']} (E-value: {hit['e_value']}) - {hit['description']}")
        
    # Check for NB-ARC domains to find NBS-LRR genes
    nb_arc_hits = [hit for hit in data if "PF00931" in hit["pfam_acc"]]
    print(f"\n--- NBS-LRR (NB-ARC PF00931) Analysis ---")
    print(f"Total NB-ARC domains found: {len(nb_arc_hits)}")
    
    # Show a couple of examples
    if nb_arc_hits:
        print("Example NBS-LRR genes:")
        for hit in nb_arc_hits[:5]:
            print(f"Protein: {hit['protein_id']}, Domain: {hit['domain_name']}, E-value: {hit['e_value']}")
            
    # Stats
    proteins_with_hits = len(set([hit["protein_id"] for hit in data]))
    distinct_families = len(set([hit["pfam_acc"] for hit in data]))
    
    print("\n--- Summary Statistics ---")
    print(f"Proteins with >= 1 Pfam hit: {proteins_with_hits}")
    print(f"Distinct Pfam families identified: {distinct_families}")
    
    # Top families
    family_counts = defaultdict(int)
    for hit in data:
        family_counts[hit["domain_name"]] += 1
        
    sorted_families = sorted(family_counts.items(), key=lambda x: x[1], reverse=True)
    print("\nTop 5 Pfam families by count:")
    for name, count in sorted_families[:5]:
        print(f"{name}: {count} hits")
        
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python verify_domains.py <domain_hits.json>")
        sys.exit(1)
    verify_domains(sys.argv[1])
