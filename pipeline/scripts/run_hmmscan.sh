#!/bin/bash
set -e

# Run hmmscan sequentially on each proteome to save memory
# Limit CPUs to 4 per run
THREADS=4
PFAM="data/external_kb/Pfam-A.hmm"

source ~/miniconda3/etc/profile.d/conda.sh
conda activate syntrait

for species in Oryza_sativa Sorghum_bicolor Setaria_italica; do
    echo "Running hmmscan for $species..."
    input_pep="data/${species}.pep.fa"
    output_dom="data/domains_output/${species}.domtblout"
    
    # We use hmmscan to scan proteins against Pfam HMM library
    # --domtblout generates parseable domain hits
    hmmscan --cpu $THREADS --domtblout "$output_dom" -o /dev/null "$PFAM" "$input_pep"
    echo "Finished hmmscan for $species."
done

echo "All hmmscans complete."
