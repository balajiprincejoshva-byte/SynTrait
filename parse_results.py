"""
SynTrait
Comparative Genomics Platform for Agronomic Trait Discovery

Author: Balaji Muthukumar
Project: SynTrait
"""
import json

with open("data/selection_output/selection_scores.json", "r") as f:
    data = json.load(f)

sh4_genes = {"LOC9266435", "LOC101754286", "LOC8070306"}
sd1_genes = {"LOC4325003", "LOC101766258", "LOC8063144"}

print("### sh4 (OG0015352) Results:")
for x in data:
    if x["gene1"] in sh4_genes and x["gene2"] in sh4_genes:
        print(json.dumps(x, indent=2))

print("\n### SD1 (OG0003934) Results:")
for x in data:
    if x["gene1"] in sd1_genes and x["gene2"] in sd1_genes:
        print(json.dumps(x, indent=2))
