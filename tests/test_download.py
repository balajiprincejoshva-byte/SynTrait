"""
SynTrait
Comparative Genomics Platform for Agronomic Trait Discovery

Author: Balaji Muthukumar
Project: SynTrait
"""
import os
import sys
import unittest
import hashlib
from unittest.mock import patch, mock_open

# Add pipeline/scripts to path to import the download_genomes module
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'pipeline', 'scripts'))

import download_genomes

class TestDownload(unittest.TestCase):

    def test_compute_sha256(self):
        # Create a small dummy file
        test_file = "dummy_test.txt"
        with open(test_file, "wb") as f:
            f.write(b"hello world")
            
        expected_hash = hashlib.sha256(b"hello world").hexdigest()
        self.assertEqual(download_genomes.compute_sha256(test_file), expected_hash)
        
        # Cleanup
        os.remove(test_file)

    @patch('download_genomes.urllib.request.urlopen')
    def test_download_failure_handling(self, mock_urlopen):
        from urllib.error import URLError
        mock_urlopen.side_effect = URLError("Mocked network error")
        
        with patch('sys.exit') as mock_exit:
            mock_exit.side_effect = SystemExit
            try:
                with patch('builtins.open', mock_open(read_data="species:\n  - name: 'Oryza sativa'\n    tier: 1\n    accession: 'GCF_034140825.1'\n    source: 'NCBI'")):
                    with patch('os.path.exists', return_value=True):
                        download_genomes.main()
            except SystemExit:
                pass
            
            mock_exit.assert_called_with(1)

if __name__ == '__main__':
    unittest.main()
