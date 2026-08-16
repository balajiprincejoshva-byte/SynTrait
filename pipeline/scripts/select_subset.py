"""
SynTrait
Comparative Genomics Platform for Agronomic Trait Discovery

Author: Balaji Muthukumar
Project: SynTrait
"""
import os
import random

def main():
    base_dir = r"c:\Users\Balaji\Desktop\Harish dude project\syntrait"
    og_dir = os.path.join(base_dir, "data", "orthofinder_output", "Orthogroups")
    single_copy_file = os.path.join(og_dir, "Orthogroups_SingleCopyOrthologues.txt")
    og_tsv = os.path.join(og_dir, "Orthogroups.tsv")
    out_file = os.path.join(base_dir, "subset_orthogroups.txt")

    # Get list of single copy OGs
    single_ogs = []
    with open(single_copy_file, "r") as f:
        for line in f:
            line = line.strip()
            if line.startswith("OG"):
                single_ogs.append(line)

    random.seed(42)
    selected_ogs = random.sample(single_ogs, min(20, len(single_ogs)))
    
    # Ensure OG0003934 (sh4/SD1) is in the set
    if "OG0003934" not in selected_ogs:
        selected_ogs.append("OG0003934")

    # Read the TSV to get the genes
    og_data = {}
    with open(og_tsv, "r") as f:
        header = f.readline().strip().split("\t")
        # Find indices:
        oryza_idx = -1
        setaria_idx = -1
        sorghum_idx = -1
        for i, col in enumerate(header):
            if "Oryza" in col: oryza_idx = i
            if "Setaria" in col: setaria_idx = i
            if "Sorghum" in col: sorghum_idx = i
            
        for line in f:
            parts = line.strip().split("\t")
            og_id = parts[0]
            if og_id in selected_ogs:
                o_gene = parts[oryza_idx].split(",")[0].strip() if oryza_idx < len(parts) else ""
                se_gene = parts[setaria_idx].split(",")[0].strip() if setaria_idx < len(parts) else ""
                so_gene = parts[sorghum_idx].split(",")[0].strip() if sorghum_idx < len(parts) else ""
                og_data[og_id] = (o_gene, se_gene, so_gene)

    with open(out_file, "w") as f:
        for og_id in selected_ogs:
            if og_id in og_data:
                o, se, so = og_data[og_id]
                f.write(f"{og_id}\t{o}\t{se}\t{so}\n")
                
    print(f"Selected {len(selected_ogs)} orthogroups and wrote to {out_file}")

if __name__ == "__main__":
    main()
