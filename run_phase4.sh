#!/bin/bash
source ~/miniconda3/etc/profile.d/conda.sh
conda activate syntrait

mkdir -p ~/syntrait_run/synteny
cd ~/syntrait_run/synteny

# Link BED and PEP files from Windows path where they were generated
ln -sf /mnt/c/Users/Balaji/Desktop/"Harish dude project"/syntrait/data/*.bed .
ln -sf /mnt/c/Users/Balaji/Desktop/"Harish dude project"/syntrait/data/Oryza_sativa.pep.fa Oryza_sativa.pep
ln -sf /mnt/c/Users/Balaji/Desktop/"Harish dude project"/syntrait/data/Sorghum_bicolor.pep.fa Sorghum_bicolor.pep
ln -sf /mnt/c/Users/Balaji/Desktop/"Harish dude project"/syntrait/data/Setaria_italica.pep.fa Setaria_italica.pep

# 1. Oryza_sativa vs Sorghum_bicolor
python -m jcvi.compara.catalog ortholog Oryza_sativa Sorghum_bicolor --dbtype=prot --no_strip_names
python -m jcvi.graphics.dotplot Oryza_sativa.Sorghum_bicolor.anchors --qbed=Oryza_sativa.bed --sbed=Sorghum_bicolor.bed --notex

# 2. Oryza_sativa vs Setaria_italica
python -m jcvi.compara.catalog ortholog Oryza_sativa Setaria_italica --dbtype=prot --no_strip_names
python -m jcvi.graphics.dotplot Oryza_sativa.Setaria_italica.anchors --qbed=Oryza_sativa.bed --sbed=Setaria_italica.bed --notex

# 3. Sorghum_bicolor vs Setaria_italica
python -m jcvi.compara.catalog ortholog Sorghum_bicolor Setaria_italica --dbtype=prot --no_strip_names
python -m jcvi.graphics.dotplot Sorghum_bicolor.Setaria_italica.anchors --qbed=Sorghum_bicolor.bed --sbed=Setaria_italica.bed --notex

# Copy results back
mkdir -p "/mnt/c/Users/Balaji/Desktop/Harish dude project/syntrait/data/synteny_output"
cp *.anchors *.pdf "/mnt/c/Users/Balaji/Desktop/Harish dude project/syntrait/data/synteny_output/" || true
