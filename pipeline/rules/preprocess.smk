rule preprocess_species:
    input:
        gff = lambda wildcards: f"data/raw/{wildcards.species}/ncbi_dataset/data/{SPECIES_ACCESSIONS[wildcards.species]}/genomic.gff",
        fasta = lambda wildcards: f"data/raw/{wildcards.species}/ncbi_dataset/data/{SPECIES_ACCESSIONS[wildcards.species]}/protein.faa"
    output:
        bed = "data/{species}.bed",
        fasta_out = "data/{species}.pep.fa",
        qc = "data/{species}_qc.json"
    shell:
        """
        python pipeline/scripts/preprocess.py \
            --gff "{input.gff}" \
            --fasta "{input.fasta}" \
            --bed-out "{output.bed}" \
            --fasta-out "{output.fasta_out}" \
            --qc-out "{output.qc}"
        """
