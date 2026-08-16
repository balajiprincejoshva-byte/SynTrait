"""
SynTrait
Comparative Genomics Platform for Agronomic Trait Discovery

Author: Balaji Muthukumar
Project: SynTrait
"""
import json
import csv
import os
import yaml
from collections import defaultdict

base_dir = "data"
kb_dir = os.path.join(base_dir, 'knowledge_base')

# Load weights
with open('traits.yaml', 'r') as f:
    config = yaml.safe_load(f)
weights = config.get('weights', {})

w_homology = weights.get('homology', 0.30)
w_synteny = weights.get('synteny', 0.25)
w_selection = weights.get('selection', 0.20)
w_domain = weights.get('domain', 0.15)
w_expression = weights.get('expression', 0.10)

# Re-normalize if expression is 0 or skipped (Phase 15)
total_w = w_homology + w_synteny + w_selection + w_domain
w_homology /= total_w
w_synteny /= total_w
w_selection /= total_w
w_domain /= total_w

# 1. Load Benchmark Genes
benchmark_genes = {}
trait_by_benchmark = {}
with open(os.path.join(kb_dir, 'benchmark_genes.csv'), 'r') as f:
    for row in csv.DictReader(f):
        symbol = row['gene_symbol']
        trait_id = row['trait_id']
        benchmark_genes[symbol] = row
        trait_by_benchmark[symbol] = trait_id

# 2. Load Orthogroups
gene_to_og = {}
og_to_genes = defaultdict(list)
with open('subset_orthogroups.txt', 'r') as f:
    for line in f:
        parts = line.strip().split('\t')
        if len(parts) >= 2:
            og = parts[0]
            for g in parts[1:]:
                gene_to_og[g] = og
                og_to_genes[og].append(g)

# Map traits to orthogroups (if a benchmark gene is in an OG, that OG is linked to the trait)
trait_to_ogs = defaultdict(set)
# Since we didn't map benchmark gene symbols to their exact LOC IDs in our mock script,
# we'll assume any gene in the subset_orthogroups has a base homology score of 1.0 for now,
# or we'll just score all candidate genes based on orthogroup presence.
# For a real pipeline, we'd lookup LOC_Os01g... for 'SD1' etc.
# Here we just mark all genes in subset_orthogroups as having homology_score = 1.0 for their respective OGs.

# 3. Load Synteny Candidates
synteny_genes = set()
if os.path.exists(os.path.join(kb_dir, 'qtl_candidate_genes.csv')):
    with open(os.path.join(kb_dir, 'qtl_candidate_genes.csv'), 'r') as f:
        for row in csv.DictReader(f):
            synteny_genes.add(row['candidate_gene_id'])

# 4. Load Selection Scores
selection_scores = {}
with open(os.path.join(base_dir, 'selection_output', 'selection_scores.json'), 'r') as f:
    sel_data = json.load(f)
    for item in sel_data:
        dnds = float(item.get('dnds', 999))
        score = 1.0 if dnds < 1.0 else (0.5 if dnds < 2.0 else 0.0) # Simple scoring
        selection_scores[item['gene1']] = max(selection_scores.get(item['gene1'], 0), score)
        selection_scores[item['gene2']] = max(selection_scores.get(item['gene2'], 0), score)

# 5. Load Domain Hits
domain_genes = set()
if os.path.exists(os.path.join(base_dir, 'domains_output', 'domain_hits.json')):
    with open(os.path.join(base_dir, 'domains_output', 'domain_hits.json'), 'r') as f:
        dom_data = json.load(f)
        for hit in dom_data:
            domain_genes.add(hit['protein_id'])

# 6. Load Stretch Features (Expression, Meta-Rank, CRISPR, Population)
expression_data = {}
if os.path.exists(os.path.join(kb_dir, 'expression.json')):
    with open(os.path.join(kb_dir, 'expression.json'), 'r') as f:
        expression_data = json.load(f)

meta_ranks = {}
if os.path.exists(os.path.join(kb_dir, 'meta_ranks.json')):
    with open(os.path.join(kb_dir, 'meta_ranks.json'), 'r') as f:
        meta_ranks = json.load(f)

crispr_data = {}
if os.path.exists(os.path.join(kb_dir, 'crispr.json')):
    with open(os.path.join(kb_dir, 'crispr.json'), 'r') as f:
        crispr_data = json.load(f)

population_data = {}
if os.path.exists(os.path.join(kb_dir, 'population.json')):
    with open(os.path.join(kb_dir, 'population.json'), 'r') as f:
        population_data = json.load(f)


# Calculate Scores for all genes seen in any dataset
all_genes = set(gene_to_og.keys()) | synteny_genes | set(selection_scores.keys()) | domain_genes

results = []
for gene in all_genes:
    h_score = 1.0 if gene in gene_to_og else 0.0
    syn_score = 1.0 if gene in synteny_genes else 0.0
    sel_score = selection_scores.get(gene, 0.0)
    dom_score = 1.0 if gene in domain_genes else 0.0
    
    composite = (h_score * w_homology) + (syn_score * w_synteny) + (sel_score * w_selection) + (dom_score * w_domain)
    
    evidence = {
        "homology_score": h_score,
        "synteny_score": syn_score,
        "selection_score": sel_score,
        "domain_score": dom_score,
        "expression": expression_data.get(gene, None),
        "meta_rank": meta_ranks.get(gene, None),
        "editability": crispr_data.get(gene, None),
        "population": population_data.get(gene, None)
    }
    
    if composite > 0:
        results.append({
            "candidate_gene_id": gene,
            "composite_score": round(composite, 4),
            "evidence_json": evidence
        })

# Sort by score descending
results.sort(key=lambda x: x['composite_score'], reverse=True)

with open(os.path.join(kb_dir, 'candidate_scores.json'), 'w') as f:
    json.dump(results, f, indent=2)

print(f"Scored {len(results)} candidate genes.")
