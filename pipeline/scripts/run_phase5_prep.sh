#!/bin/bash
source ~/miniconda3/etc/profile.d/conda.sh
conda activate syntrait

# Base paths
PROJECT_DIR="/mnt/c/Users/Balaji/Desktop/Harish dude project/syntrait"
DATA_DIR="$PROJECT_DIR/data"
RAW_DIR="$DATA_DIR/raw"
SCRIPTS_DIR="$PROJECT_DIR/pipeline/scripts"

mkdir -p "$DATA_DIR/selection_output"

# Species config
SPECIES=("Oryza_sativa" "Sorghum_bicolor" "Setaria_italica")

for sp in "${SPECIES[@]}"; do
    echo "Processing $sp..."
    if [ "$sp" == "Oryza_sativa" ]; then
        GENOME="$RAW_DIR/$sp/ncbi_dataset/data/GCF_034140825.1/GCF_034140825.1_ASM3414082v1_genomic.fna"
        GFF="$RAW_DIR/$sp/ncbi_dataset/data/GCF_034140825.1/genomic.gff"
    elif [ "$sp" == "Sorghum_bicolor" ]; then
        GENOME="$RAW_DIR/$sp/ncbi_dataset/data/GCF_000003195.3/GCF_000003195.3_Sorghum_bicolor_NCBIv3_genomic.fna"
        GFF="$RAW_DIR/$sp/ncbi_dataset/data/GCF_000003195.3/genomic.gff"
    elif [ "$sp" == "Setaria_italica" ]; then
        GENOME="$RAW_DIR/$sp/ncbi_dataset/data/GCF_000263155.2/GCF_000263155.2_Setaria_italica_v2.0_genomic.fna"
        GFF="$RAW_DIR/$sp/ncbi_dataset/data/GCF_000263155.2/genomic.gff"
    fi

    RAW_CDS="$DATA_DIR/${sp}.cds.raw.fa"
    PEP_FA="$DATA_DIR/${sp}.pep.fa"
    OUT_CDS="$DATA_DIR/${sp}.cds.fa"
    CLEAN_GFF="$DATA_DIR/${sp}.clean.gff"

    # 1. Clean GFF (remove lines with '?' strand)
    if [ ! -f "$CLEAN_GFF" ]; then
        echo "Cleaning GFF for $sp..."
        # Copy to WSL native filesystem first for speed
        cp "$GFF" "/tmp/tmp.gff"
        grep -v "[[:space:]]?[[:space:]]" "/tmp/tmp.gff" > "/tmp/clean.gff"
        cp "/tmp/clean.gff" "$CLEAN_GFF"
    fi

    # 2. Extract raw spliced CDS using gffread
    if [ ! -f "$RAW_CDS" ] || [ ! -s "$RAW_CDS" ]; then
        echo "Running gffread for $sp..."
        gffread -x "/tmp/raw.cds" -g "$GENOME" "/tmp/clean.gff"
        cp "/tmp/raw.cds" "$RAW_CDS"
    fi

    # 3. Filter and rename using extract_cds.py
    if [ ! -f "$OUT_CDS" ] || [ ! -s "$OUT_CDS" ]; then
        echo "Filtering CDS for $sp..."
        python "$SCRIPTS_DIR/extract_cds.py" \
            --gff "$CLEAN_GFF" \
            --raw-cds "$RAW_CDS" \
            --pep "$PEP_FA" \
            --cds-out "$OUT_CDS"
    fi
done

echo "CDS extraction complete."
