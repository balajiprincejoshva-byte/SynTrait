#!/bin/bash
set -e

source ~/miniconda3/etc/profile.d/conda.sh
conda activate syntrait

echo "Waiting for hmmpress to finish (checking for Pfam-A.hmm.h3i)..."
while [ ! -s data/external_kb/Pfam-A.hmm.h3i ]; do
    sleep 30
done
echo "hmmpress is complete!"

THREADS=4
PFAM="data/external_kb/Pfam-A.hmm"

mkdir -p data/domains_output

DOMTBLOUT_FILES=""

for species in Oryza_sativa Sorghum_bicolor Setaria_italica; do
    echo "=========================================="
    echo "Starting hmmscan for $species..."
    input_pep="data/${species}.pep.fa"
    output_dom="data/domains_output/${species}.domtblout"
    
    # Run hmmscan
    hmmscan --cpu $THREADS --domtblout "$output_dom" -o /dev/null "$PFAM" "$input_pep"
    echo "Finished hmmscan for $species."
    
    DOMTBLOUT_FILES="$DOMTBLOUT_FILES $output_dom"
done

echo "=========================================="
echo "All hmmscans complete. Parsing results..."

python pipeline/scripts/parse_domtblout.py data/domains_output/domain_hits.json $DOMTBLOUT_FILES

echo "Done running Phase 6 hmmscan and parsing."
