#!/bin/bash
set -e

mkdir -p data/external_kb
mkdir -p data/domains_output
mkdir -p data/manifest

PFAM_URL="https://ftp.ebi.ac.uk/pub/databases/Pfam/current_release/Pfam-A.hmm.gz"
PFAM_FILE="data/external_kb/Pfam-A.hmm.gz"
UNZIPPED="data/external_kb/Pfam-A.hmm"

echo "Downloading Pfam-A.hmm.gz from $PFAM_URL..."
wget -q --show-progress -O "$PFAM_FILE" "$PFAM_URL"

echo "Computing SHA256 checksum..."
CHECKSUM=$(sha256sum "$PFAM_FILE" | awk '{print $1}')
DATE=$(date +%Y-%m-%d)

echo "Pfam-A,Pfam-A,${PFAM_URL},current_release,${DATE},${CHECKSUM},Primary HMM domain library" >> data/manifest/provenance_log.csv

echo "Unzipping Pfam-A.hmm.gz..."
gunzip -f "$PFAM_FILE"

echo "Running hmmpress on Pfam-A.hmm..."
source ~/miniconda3/etc/profile.d/conda.sh
conda activate syntrait
hmmpress -f "$UNZIPPED"

echo "Done downloading and indexing Pfam-A."
