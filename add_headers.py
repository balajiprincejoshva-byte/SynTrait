import os

py_header = """\"\"\"
SynTrait
Comparative Genomics Platform for Agronomic Trait Discovery

Author: Balaji Muthukumar
Project: SynTrait
\"\"\"
"""

ts_header = """/**
 * SynTrait
 * Comparative Genomics Platform for Agronomic Trait Discovery
 *
 * Author: Balaji Muthukumar
 */
"""

for root, _, files in os.walk('.'):
    if 'node_modules' in root or '.git' in root or '.gemini' in root or 'miniconda' in root or 'data' in root or 'dist' in root or 'venv' in root:
        continue
    for file in files:
        if file.endswith('.py') and not file == 'add_headers.py':
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            if 'Author: Balaji Muthukumar' not in content:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(py_header + content)
                    
        elif file.endswith('.ts') or file.endswith('.tsx'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            if 'Author: Balaji Muthukumar' not in content:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(ts_header + content)
