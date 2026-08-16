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
import json
import logging
import sys

def parse_args():
    parser = argparse.ArgumentParser(description="Preprocess GFF3 and FASTA to extract longest isoforms and BED.")
    parser.add_argument("--gff", required=True, help="Input GFF3 file (can be .gz)")
    parser.add_argument("--fasta", required=True, help="Input protein FASTA file")
    parser.add_argument("--bed-out", required=True, help="Output BED file")
    parser.add_argument("--fasta-out", required=True, help="Output filtered FASTA file")
    parser.add_argument("--qc-out", required=True, help="Output QC JSON file")
    return parser.parse_args()

def extract_attribute(attr_str, key):
    # Regex to find key=value; or key=value at end of string
    match = re.search(rf"(?:^|;){key}=([^;]+)", attr_str)
    return match.group(1) if match else None

def main():
    args = parse_args()

    logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

    genes = {}
    transcripts = {}
    
    total_genes_parsed = 0
    
    logging.info(f"Parsing GFF3: {args.gff}")
    open_func = gzip.open if args.gff.endswith(".gz") else open
    
    with open_func(args.gff, "rt") as f:
        for line in f:
            if line.startswith("#"):
                continue
            parts = line.strip().split("\t")
            if len(parts) < 9:
                continue
                
            seqid, source, feature_type, start, end, score, strand, phase, attrs = parts
            
            if feature_type in ["gene", "pseudogene", "ncRNA_gene"]:
                total_genes_parsed += 1
                gene_id_raw = extract_attribute(attrs, "ID")
                name_raw = extract_attribute(attrs, "Name")
                if not gene_id_raw:
                    continue
                
                clean_gene_id = re.sub(r"^gene-", "", gene_id_raw)
                genes[gene_id_raw] = {
                    "chr": seqid,
                    "start": int(start) - 1, # BED is 0-indexed
                    "end": int(end),         # BED is 1-indexed, GFF is 1-indexed inclusive, so end is just end
                    "strand": strand,
                    "clean_id": clean_gene_id
                }
            
            elif feature_type in ["mRNA", "transcript"]:
                transcript_id_raw = extract_attribute(attrs, "ID")
                parent_raw = extract_attribute(attrs, "Parent")
                if transcript_id_raw and parent_raw:
                    transcripts[transcript_id_raw] = {
                        "parent": parent_raw,
                        "cds_len": 0,
                        "protein_id": None
                    }
                    
            elif feature_type == "CDS":
                parent_raw = extract_attribute(attrs, "Parent")
                protein_id_raw = extract_attribute(attrs, "protein_id")
                
                if parent_raw and parent_raw in transcripts:
                    transcripts[parent_raw]["cds_len"] += (int(end) - int(start) + 1)
                    if protein_id_raw:
                        transcripts[parent_raw]["protein_id"] = protein_id_raw

    # Find longest isoform
    gene_to_longest_transcript = {}
    for t_id, t_info in transcripts.items():
        gene_id = t_info["parent"]
        if t_info["protein_id"] is None:
            continue # Skip non-coding transcripts that don't have a protein_id
            
        if gene_id not in gene_to_longest_transcript:
            gene_to_longest_transcript[gene_id] = t_id
        else:
            current_longest = transcripts[gene_to_longest_transcript[gene_id]]
            # tie break on transcript ID
            if t_info["cds_len"] > current_longest["cds_len"]:
                gene_to_longest_transcript[gene_id] = t_id
            elif t_info["cds_len"] == current_longest["cds_len"]:
                if t_id < gene_to_longest_transcript[gene_id]:
                    gene_to_longest_transcript[gene_id] = t_id

    # Collect valid protein IDs
    retained_proteins = {}
    for gene_id, t_id in gene_to_longest_transcript.items():
        prot_id = transcripts[t_id]["protein_id"]
        # In case the gene didn't get properly parsed (rare, but happens), skip
        if gene_id in genes:
            clean_gene_id = genes[gene_id]["clean_id"]
            retained_proteins[prot_id] = clean_gene_id

    logging.info(f"Writing FASTA: {args.fasta_out}")
    # Process FASTA
    total_proteins_parsed = 0
    retained_records = []
    
    with open(args.fasta, "rt") as f_in:
        for record in SeqIO.parse(f_in, "fasta"):
            total_proteins_parsed += 1
            # NCBI protein IDs in FASTA might have version or not, match carefully
            prot_id = record.id
            if prot_id in retained_proteins:
                # Rename the record to the clean gene ID
                record.id = retained_proteins[prot_id]
                record.description = ""
                retained_records.append(record)

    # Note: Some FASTA IDs might just be prefix, but Biopython handles the ID up to the first space.
    with open(args.fasta_out, "wt") as f_out:
        SeqIO.write(retained_records, f_out, "fasta")
        
    logging.info(f"Writing BED: {args.bed_out}")
    # Write BED
    written_genes = set()
    with open(args.bed_out, "wt") as f_bed:
        for record in retained_records:
            clean_gene_id = record.id
            # Find the gene info for this clean_gene_id
            # Since retained_proteins maps prot_id -> clean_gene_id,
            # we need to find the gene_id that corresponds to clean_gene_id
            # We can map clean_gene_id back to gene_id
            # (Assuming clean_gene_id is unique, which it usually is)
            
            # A bit inefficient but fine for this scale:
            for g_id, g_info in genes.items():
                if g_info["clean_id"] == clean_gene_id and g_id in gene_to_longest_transcript:
                    if clean_gene_id not in written_genes:
                        f_bed.write(f"{g_info['chr']}\t{g_info['start']}\t{g_info['end']}\t{clean_gene_id}\t.\t{g_info['strand']}\n")
                        written_genes.add(clean_gene_id)
                    break

    logging.info(f"Writing QC stats: {args.qc_out}")
    # Compile QC Stats
    qc_stats = {
        "total_genes_in_gff": total_genes_parsed,
        "total_proteins_in_fasta": total_proteins_parsed,
        "retained_longest_isoforms": len(retained_records),
        "unique_chromosomes_or_contigs": len(set(genes[g_id]["chr"] for g_id in genes if g_id in gene_to_longest_transcript))
    }
    
    with open(args.qc_out, "wt") as f_out:
        json.dump(qc_stats, f_out, indent=4)

if __name__ == "__main__":
    main()
