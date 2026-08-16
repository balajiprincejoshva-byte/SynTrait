"""
SynTrait
Comparative Genomics Platform for Agronomic Trait Discovery

Author: Balaji Muthukumar
Project: SynTrait
"""
import csv
import json
import os
import glob

base_dir = "data"
kb_dir = os.path.join(base_dir, 'knowledge_base')

# 1. Load QTLs
qtls = []
with open(os.path.join(kb_dir, 'qtl_intervals.csv'), 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        row['start_pos'] = int(row['start_pos'])
        row['end_pos'] = int(row['end_pos'])
        qtls.append(row)

# 2. Load Synteny Blocks
with open(os.path.join(base_dir, 'synteny_output', 'synteny_blocks.json'), 'r') as f:
    blocks = json.load(f)

# 3. Load BED files for each species to find candidate genes
def load_bed(species):
    bed_path = os.path.join(base_dir, f"{species}.bed")
    genes = []
    if os.path.exists(bed_path):
        with open(bed_path, 'r') as f:
            for line in f:
                parts = line.strip().split('\t')
                if len(parts) >= 4:
                    genes.append({
                        'chrom': parts[0],
                        'start': int(parts[1]),
                        'end': int(parts[2]),
                        'gene_id': parts[3]
                    })
    return genes

species_map = {
    '1': 'Oryza_sativa',
    '2': 'Sorghum_bicolor',
    '3': 'Zea_mays',
    '4': 'Triticum_aestivum',
    '5': 'Setaria_italica'
}

beds = {
    'Oryza_sativa': load_bed('Oryza_sativa'),
    'Sorghum_bicolor': load_bed('Sorghum_bicolor'),
    'Setaria_italica': load_bed('Setaria_italica')
}

# 4. Project QTLs
projections = []
candidates = []

for qtl in qtls:
    sp_name = species_map.get(qtl['species_id'])
    if not sp_name:
        continue
    
    q_chrom = qtl['chromosome']
    q_start = qtl['start_pos']
    q_end = qtl['end_pos']
    
    for b in blocks:
        # Check if block overlaps with QTL in species A
        if b['speciesA'] == sp_name and b['chromA'] == q_chrom:
            if not (b['endA'] < q_start or b['startA'] > q_end):
                # Overlap! Project to species B
                target_sp = b['speciesB']
                p_chrom = b['chromB']
                p_start = b['startB']
                p_end = b['endB']
                
                projections.append({
                    'qtl_id': qtl['id'],
                    'qtl_name': qtl['qtl_name'],
                    'source_species': sp_name,
                    'target_species': target_sp,
                    'target_chrom': p_chrom,
                    'target_start': p_start,
                    'target_end': p_end,
                    'block_id': b['block_id']
                })
                
                # Find genes in target species
                if target_sp in beds:
                    for g in beds[target_sp]:
                        if g['chrom'] == p_chrom and g['start'] >= p_start and g['end'] <= p_end:
                            candidates.append({
                                'qtl_id': qtl['id'],
                                'qtl_name': qtl['qtl_name'],
                                'target_species': target_sp,
                                'candidate_gene_id': g['gene_id']
                            })

        # Check if block overlaps with QTL in species B
        if b['speciesB'] == sp_name and b['chromB'] == q_chrom:
            if not (b['endB'] < q_start or b['startB'] > q_end):
                # Overlap! Project to species A
                target_sp = b['speciesA']
                p_chrom = b['chromA']
                p_start = b['startA']
                p_end = b['endA']
                
                projections.append({
                    'qtl_id': qtl['id'],
                    'qtl_name': qtl['qtl_name'],
                    'source_species': sp_name,
                    'target_species': target_sp,
                    'target_chrom': p_chrom,
                    'target_start': p_start,
                    'target_end': p_end,
                    'block_id': b['block_id']
                })
                
                # Find genes in target species
                if target_sp in beds:
                    for g in beds[target_sp]:
                        if g['chrom'] == p_chrom and g['start'] >= p_start and g['end'] <= p_end:
                            candidates.append({
                                'qtl_id': qtl['id'],
                                'qtl_name': qtl['qtl_name'],
                                'target_species': target_sp,
                                'candidate_gene_id': g['gene_id']
                            })

# 5. Save Projections
proj_path = os.path.join(kb_dir, 'qtl_projections.csv')
with open(proj_path, 'w', newline='') as f:
    if projections:
        writer = csv.DictWriter(f, fieldnames=projections[0].keys())
        writer.writeheader()
        writer.writerows(projections)

# 6. Save Candidates
cand_path = os.path.join(kb_dir, 'qtl_candidate_genes.csv')
with open(cand_path, 'w', newline='') as f:
    if candidates:
        writer = csv.DictWriter(f, fieldnames=candidates[0].keys())
        writer.writeheader()
        writer.writerows(candidates)

print(f"Generated {len(projections)} QTL projections and {len(candidates)} synteny-based candidate genes.")
