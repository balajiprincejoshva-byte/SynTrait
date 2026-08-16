"""
SynTrait
Comparative Genomics Platform for Agronomic Trait Discovery

Author: Balaji Muthukumar
Project: SynTrait
"""
import os
import subprocess
import json
from Bio import SeqIO

def get_fasta_dict(path):
    print(f"Indexing {path}...", flush=True)
    return SeqIO.index(path, "fasta")

def fasta_to_axt(fasta_file, axt_file, name1, name2):
    records = list(SeqIO.parse(fasta_file, "fasta"))
    if len(records) != 2:
        return False
    with open(axt_file, 'w') as f:
        f.write(f"{name1}-{name2}\n")
        f.write(str(records[0].seq) + "\n")
        f.write(str(records[1].seq) + "\n\n")
    return True

def run_cmd(cmd):
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error running: {cmd}\n{result.stderr}")
    return result.returncode == 0

def run_kaks_for_pair(out_dir, sp1, sp2, gene1, gene2, pep1, pep2, cds1, cds2):
    pair_name = f"{sp1}_{sp2}"
    pair_dir = os.path.join(out_dir, pair_name)
    os.makedirs(pair_dir, exist_ok=True)
    
    # 1. Write unaligned protein FASTA
    prot_fa = os.path.join(pair_dir, "prot.fa")
    with open(prot_fa, "w") as f:
        SeqIO.write([pep1, pep2], f, "fasta")
        
    # 2. Write unaligned CDS FASTA
    cds_fa = os.path.join(pair_dir, "cds.fa")
    with open(cds_fa, "w") as f:
        SeqIO.write([cds1, cds2], f, "fasta")
        
    # 3. Align proteins with MAFFT
    prot_aln = os.path.join(pair_dir, "prot_aln.fa")
    if not run_cmd(f"mafft --auto --quiet \"{prot_fa}\" > \"{prot_aln}\""):
        return None
        
    # 4. Create codon alignment with PAL2NAL
    codon_aln = os.path.join(pair_dir, "codon_aln.fa")
    # -nogap removes columns with gaps or stop codons
    if not run_cmd(f"pal2nal.pl \"{prot_aln}\" \"{cds_fa}\" -output fasta -nogap > \"{codon_aln}\""):
        return None
        
    # Check if pal2nal succeeded and generated a valid FASTA
    if not os.path.exists(codon_aln) or os.path.getsize(codon_aln) == 0:
        return None

    # 5. Convert to AXT
    axt_file = os.path.join(pair_dir, "codon_aln.axt")
    if not fasta_to_axt(codon_aln, axt_file, gene1, gene2):
        return None
        
    # 6. Run KaKs_Calculator (Model YN)
    kaks_out = os.path.join(pair_dir, "kaks.txt")
    if not run_cmd(f"KaKs_Calculator -i \"{axt_file}\" -o \"{kaks_out}\" -m YN"):
        return None
        
    # 7. Parse output
    # Format: Sequence Ka Ks Ka/Ks ...
    if not os.path.exists(kaks_out):
        return None
        
    with open(kaks_out, "r") as f:
        lines = f.readlines()
        if len(lines) < 2:
            return None
        header = lines[0].strip().split("\t")
        vals = lines[1].strip().split("\t")
        res = dict(zip(header, vals))
        
    ka = res.get("Ka", "NA")
    ks = res.get("Ks", "NA")
    ka_ks = res.get("Ka/Ks", "NA")
    
    # Handle NA and invalid
    is_valid = True
    try:
        ka_f = float(ka)
        ks_f = float(ks)
        ka_ks_f = float(ka_ks)
        if ks_f == 0.0 or ks_f > 2.0 or ka_ks_f > 10.0:
            is_valid = False
    except ValueError:
        is_valid = False
        
    return {
        "species1": sp1,
        "species2": sp2,
        "gene1": gene1,
        "gene2": gene2,
        "Ka": ka,
        "Ks": ks,
        "Ka/Ks": ka_ks,
        "is_valid": is_valid
    }

def main():
    base_dir = r"/mnt/c/Users/Balaji/Desktop/Harish dude project/syntrait"
    data_dir = os.path.join(base_dir, "data")
    out_dir = os.path.join(data_dir, "selection_output")
    os.makedirs(out_dir, exist_ok=True)
    
    species = ["Oryza_sativa", "Sorghum_bicolor", "Setaria_italica"]
    pep_dicts = {}
    cds_dicts = {}
    
    print("Loading sequences...", flush=True)
    for sp in species:
        pep_dicts[sp] = get_fasta_dict(os.path.join(data_dir, f"{sp}.pep.fa"))
        cds_dicts[sp] = get_fasta_dict(os.path.join(data_dir, f"{sp}.cds.fa"))
        
    # Load orthogroups subset
    og_file = os.path.join(base_dir, "subset_orthogroups.txt")
    results = []
    
    with open(og_file, "r") as f:
        for line in f:
            line = line.strip()
            if not line: continue
            parts = line.split("\t")
            if len(parts) < 4: continue
            og_id = parts[0]
            print(f"Processing {og_id}...", flush=True)
            # Assumes order: OG, Oryza, Setaria, Sorghum
            oryza_g = parts[1]
            setaria_g = parts[2]
            sorghum_g = parts[3]
            
            genes = {
                "Oryza_sativa": oryza_g,
                "Setaria_italica": setaria_g,
                "Sorghum_bicolor": sorghum_g
            }
            
            # Ensure we have sequences
            have_all = True
            for sp in species:
                if genes[sp] not in pep_dicts[sp] or genes[sp] not in cds_dicts[sp]:
                    print(f"Missing seqs for {sp} {genes[sp]} in {og_id}")
                    have_all = False
            
            if not have_all: continue
            
            og_out = os.path.join(out_dir, og_id)
            os.makedirs(og_out, exist_ok=True)
            
            pairs = [
                ("Oryza_sativa", "Sorghum_bicolor"),
                ("Oryza_sativa", "Setaria_italica"),
                ("Sorghum_bicolor", "Setaria_italica")
            ]
            
            og_results = []
            for sp1, sp2 in pairs:
                g1 = genes[sp1]
                g2 = genes[sp2]
                res = run_kaks_for_pair(
                    og_out, sp1, sp2, g1, g2,
                    pep_dicts[sp1][g1], pep_dicts[sp2][g2],
                    cds_dicts[sp1][g1], cds_dicts[sp2][g2]
                )
                if res:
                    res["orthogroup"] = og_id
                    og_results.append(res)
                    
            results.extend(og_results)
            print(f"Processed {og_id}")
            
    # Save results
    res_file = os.path.join(out_dir, "selection_scores.json")
    with open(res_file, "w") as f:
        json.dump(results, f, indent=2)
    print(f"Saved {len(results)} Ka/Ks comparisons to {res_file}")

if __name__ == "__main__":
    main()
