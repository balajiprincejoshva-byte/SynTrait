"""
SynTrait
Comparative Genomics Platform for Agronomic Trait Discovery

Author: Balaji Muthukumar
Project: SynTrait
"""
import os
import csv
import json
import argparse

def parse_bed(bed_file):
    gene_dict = {}
    with open(bed_file, 'r') as f:
        for line in f:
            parts = line.strip().split('\t')
            if len(parts) >= 4:
                chrom, start, end, gene_id = parts[0], int(parts[1]), int(parts[2]), parts[3]
                gene_dict[gene_id] = {'chrom': chrom, 'start': start, 'end': end}
    return gene_dict

def parse_anchors(anchor_file, bedA, bedB, speciesA, speciesB):
    blocks = []
    current_block = []
    
    with open(anchor_file, 'r') as f:
        for line in f:
            line = line.strip()
            if line == '###':
                if current_block:
                    blocks.append(current_block)
                    current_block = []
            elif line and not line.startswith('#'):
                parts = line.split('\t')
                if len(parts) >= 2:
                    geneA, geneB = parts[0], parts[1]
                    current_block.append((geneA, geneB))
        if current_block:
            blocks.append(current_block)
            
    synteny_blocks = []
    for i, block in enumerate(blocks):
        anchors = []
        chromA_set = set()
        chromB_set = set()
        startA, endA = float('inf'), 0
        startB, endB = float('inf'), 0
        
        for geneA, geneB in block:
            if geneA in bedA and geneB in bedB:
                locA = bedA[geneA]
                locB = bedB[geneB]
                chromA_set.add(locA['chrom'])
                chromB_set.add(locB['chrom'])
                startA = min(startA, locA['start'])
                endA = max(endA, locA['end'])
                startB = min(startB, locB['start'])
                endB = max(endB, locB['end'])
                anchors.append({'geneA': geneA, 'geneB': geneB})
                
        if anchors:
            chromA = list(chromA_set)[0] if chromA_set else 'unknown'
            chromB = list(chromB_set)[0] if chromB_set else 'unknown'
            
            synteny_blocks.append({
                'block_id': i + 1,
                'speciesA': speciesA,
                'speciesB': speciesB,
                'chromA': chromA,
                'startA': startA,
                'endA': endA,
                'chromB': chromB,
                'startB': startB,
                'endB': endB,
                'num_anchors': len(anchors),
                'anchors': anchors
            })
            
    return synteny_blocks

def main():
    base_dir = r"c:\Users\Balaji\Desktop\Harish dude project\syntrait\data"
    synteny_dir = os.path.join(base_dir, 'synteny_output')
    
    species = ['Oryza_sativa', 'Sorghum_bicolor', 'Setaria_italica']
    
    beds = {}
    for sp in species:
        beds[sp] = parse_bed(os.path.join(base_dir, f"{sp}.bed"))
        
    pairs = [
        ('Oryza_sativa', 'Sorghum_bicolor'),
        ('Oryza_sativa', 'Setaria_italica'),
        ('Sorghum_bicolor', 'Setaria_italica')
    ]
    
    all_blocks = []
    for spA, spB in pairs:
        anchor_file = os.path.join(synteny_dir, f"{spA}.{spB}.lifted.anchors")
        if os.path.exists(anchor_file):
            blocks = parse_anchors(anchor_file, beds[spA], beds[spB], spA, spB)
            all_blocks.extend(blocks)
            print(f"Parsed {len(blocks)} blocks for {spA} vs {spB}")
            
    out_file = os.path.join(synteny_dir, "synteny_blocks.json")
    with open(out_file, 'w') as f:
        json.dump(all_blocks, f, indent=2)
    print(f"Saved {len(all_blocks)} blocks to {out_file}")

if __name__ == '__main__':
    main()
