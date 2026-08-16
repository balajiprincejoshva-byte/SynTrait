rule download_genomes:
    output:
        log_file = "data/manifest/provenance_log.csv"
    params:
        config = "pipeline/config/species.yaml"
    shell:
        """
        python pipeline/scripts/download_genomes.py
        """
