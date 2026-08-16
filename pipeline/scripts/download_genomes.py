"""
SynTrait
Comparative Genomics Platform for Agronomic Trait Discovery

Author: Balaji Muthukumar
Project: SynTrait
"""
import yaml
import urllib.request
import urllib.error
import ssl
import sys
import os
import hashlib
import zipfile
import shutil
import datetime
import csv

# Bypass SSL Verification due to environment restrictions
ctx = ssl._create_unverified_context()

def compute_sha256(filepath):
    sha256_hash = hashlib.sha256()
    with open(filepath, "rb") as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()

def main():
    config_path = os.path.join("pipeline", "config", "species.yaml")
    log_path = os.path.join("data", "manifest", "provenance_log.csv")
    raw_dir = os.path.join("data", "raw")
    
    if not os.path.exists(config_path):
        print(f"Error: Could not find config at {config_path}")
        sys.exit(1)
        
    os.makedirs(raw_dir, exist_ok=True)
    os.makedirs(os.path.dirname(log_path), exist_ok=True)
    
    with open(config_path, "r") as f:
        config = yaml.safe_load(f)
        
    # Check if log file needs headers
    write_header = not os.path.exists(log_path) or os.path.getsize(log_path) == 0
    with open(log_path, "a", newline="") as log_file:
        writer = csv.writer(log_file)
        if write_header:
            writer.writerow(["dataset", "species", "source_url", "accession_or_version", "retrieval_date", "sha256_checksum", "notes"])

        for species in config.get("species", []):
            if species.get("tier") != 1:
                continue
                
            name = species["name"].replace(" ", "_")
            accession = species["accession"]
            source = species["source"]
            
            if source != "NCBI":
                print(f"Skipping {name} as source {source} is not yet supported in this script.")
                continue
                
            print(f"Processing Tier 1 species: {name} (Accession: {accession})")
            
            url = f"https://api.ncbi.nlm.nih.gov/datasets/v2alpha/genome/accession/{accession}/download?include_annotation_type=GENOME_FASTA,GENOME_GFF,PROT_FASTA"
            zip_path = os.path.join(raw_dir, f"{accession}.zip")
            out_dir = os.path.join(raw_dir, name)
            
            if os.path.exists(zip_path):
                print(f"{name} zip already exists, skipping download.")
            else:
                print(f"Downloading from NCBI Datasets API: {url}")
                max_retries = 3
                for attempt in range(max_retries):
                    try:
                        import http.client
                        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                        response = urllib.request.urlopen(req, context=ctx, timeout=30)
                        with open(zip_path, 'wb') as out_file:
                            shutil.copyfileobj(response, out_file)
                        break # Success
                    except (urllib.error.URLError, http.client.IncompleteRead) as e:
                        print(f"Attempt {attempt + 1} failed for {accession}: {e}")
                        if attempt == max_retries - 1:
                            print(f"CRITICAL ERROR: Failed to download {accession} for {name}.")
                            print("ABORTING PIPELINE.")
                            sys.exit(1)
                        import time
                        time.sleep(5)
                
            checksum = compute_sha256(zip_path)
            print(f"Checksum: {checksum}")
            
            # Extract to a specific directory
            print(f"Extracting to {out_dir}")
            os.makedirs(out_dir, exist_ok=True)
            try:
                with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                    zip_ref.extractall(out_dir)
            except zipfile.BadZipFile:
                print(f"CRITICAL ERROR: Downloaded file for {accession} is not a valid ZIP archive.")
                sys.exit(1)
            
            # Append to provenance log
            retrieval_date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            writer.writerow([
                "genome_annotation", 
                species["name"], 
                url, 
                accession, 
                retrieval_date, 
                checksum, 
                "Downloaded via NCBI Datasets API (Python script fallback)"
            ])
            log_file.flush()
            print(f"Successfully logged {name} to provenance log.\n")

if __name__ == "__main__":
    main()
