"""
SynTrait
Comparative Genomics Platform for Agronomic Trait Discovery

Author: Balaji Muthukumar
Project: SynTrait
"""
import argparse
import gzip
import re
from Bio import SeqIO
import logging

def parse_args():
    parser = argparse.ArgumentParser(description="Extract filtered CDS FASTA matching the longest isoforms.")
    parser.add_argument("--gff", required=True, help="Input GFF3 file (can be .gz)")
    parser.add_argument("--raw-cds", required=True, help="Input raw CDS FASTA (from gffread)")
    parser.add_argument("--pep", required=True, help="Input filtered protein FASTA (to know which genes to keep)")
    parser.add_argument("--cds-out", required=True, help="Output filtered CDS FASTA file")
    return parser.parse_args()

def extract_attribute(attr_str, key):
    match = re.search(rf"(?:^|;){key}=([^;]+)", attr_str)
    return match.group(1) if match else None

def main():
    args = parse_args()
    logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

    # 1. Get the list of clean_gene_ids we want to keep
    keep_genes = set()
    with open(args.pep, "rt") as f:
        for record in SeqIO.parse(f, "fasta"):
            keep_genes.add(record.id)

    # 2. Parse GFF to map transcript_id -> clean_gene_id
    transcripts = {}
    genes = {}
    
    open_func = gzip.open if args.gff.endswith(".gz") else open
    with open_func(args.gff, "rt") as f:
        for line in f:
            if line.startswith("#"):
                continue
            parts = line.strip().split("\t")
            if len(parts) < 9:
                continue
                
            feature_type = parts[2]
            attrs = parts[8]
            
            if feature_type in ["gene", "pseudogene", "ncRNA_gene"]:
                gene_id_raw = extract_attribute(attrs, "ID")
                if gene_id_raw:
                    clean_gene_id = re.sub(r"^gene-", "", gene_id_raw)
                    genes[gene_id_raw] = clean_gene_id
            
            elif feature_type in ["mRNA", "transcript"]:
                transcript_id_raw = extract_attribute(attrs, "ID")
                parent_raw = extract_attribute(attrs, "Parent")
                if transcript_id_raw and parent_raw:
                    transcripts[transcript_id_raw] = parent_raw

    transcript_to_clean_gene = {}
    for t_id, parent_id in transcripts.items():
        if parent_id in genes:
            transcript_to_clean_gene[t_id] = genes[parent_id]

    # 3. Filter the raw CDS FASTA
    retained_records = []
    found_genes = set()
    
    with open(args.raw_cds, "rt") as f_in:
        for record in SeqIO.parse(f_in, "fasta"):
            t_id = record.id
            if t_id in transcript_to_clean_gene:
                clean_gene_id = transcript_to_clean_gene[t_id]
                if clean_gene_id in keep_genes and clean_gene_id not in found_genes:
                    record.id = clean_gene_id
                    record.description = ""
                    retained_records.append(record)
                    found_genes.add(clean_gene_id)

    logging.info(f"Writing {len(retained_records)} CDS sequences out of {len(keep_genes)} requested.")

    with open(args.cds_out, "wt") as f_out:
        SeqIO.write(retained_records, f_out, "fasta")

if __name__ == "__main__":
    main()
