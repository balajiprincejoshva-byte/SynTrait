"""
SynTrait
Comparative Genomics Platform for Agronomic Trait Discovery

Author: Balaji Muthukumar
Project: SynTrait
"""
import json
import statistics

with open("data/selection_output/selection_scores.json", "r") as f:
    data = json.load(f)

valid = [x for x in data if x.get("is_valid", False)]
invalid = [x for x in data if not x.get("is_valid", False)]

# distributions
dn_vals = [float(x["Ka"]) for x in valid if x["Ka"] != "NA"]
ds_vals = [float(x["Ks"]) for x in valid if x["Ks"] != "NA"]
dnds_vals = [float(x["Ka/Ks"]) for x in valid if x["Ka/Ks"] != "NA"]

print(f"Total processed pairwise comparisons: {len(data)}")
print(f"Valid: {len(valid)}")
print(f"Invalid (saturated or failed): {len(invalid)}")

if dnds_vals:
    purifying = len([x for x in dnds_vals if x < 1])
    print(f"Proportion with dN/dS < 1: {purifying}/{len(dnds_vals)} ({purifying/len(dnds_vals)*100:.1f}%)")
    print(f"dN/dS distribution - Mean: {statistics.mean(dnds_vals):.4f}, Median: {statistics.median(dnds_vals):.4f}, Max: {max(dnds_vals):.4f}")

if dn_vals:
    print(f"dN distribution - Mean: {statistics.mean(dn_vals):.4f}, Median: {statistics.median(dn_vals):.4f}")

if ds_vals:
    print(f"dS distribution - Mean: {statistics.mean(ds_vals):.4f}, Median: {statistics.median(ds_vals):.4f}")
