/**
 * SynTrait
 * Comparative Genomics Platform for Agronomic Trait Discovery
 *
 * Author: Balaji Muthukumar
 */
import { Info, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export function Provenance() {
  return (
    <div className="p-10 max-w-5xl mx-auto h-full flex flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-12 rounded-2xl border border-slate-700/50 max-w-3xl"
      >
        <ShieldCheck className="w-16 h-16 text-cyan-500 mx-auto mb-6" />
        <h1 className="text-3xl font-extrabold text-white mb-4">Scientific Provenance</h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-8">
          SynTrait enforces strict data lineage and provenance tracking for all candidate prioritization events. Provenance records are directly accessible within the <strong className="text-white">Candidate Detail Workspace</strong> to contextualize specific lines of evidence.
        </p>

        <div className="bg-navy-900 p-6 rounded-xl border border-slate-700 text-left">
          <h3 className="text-sm font-mono text-cyan-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Info className="w-4 h-4" /> How to access provenance
          </h3>
          <p className="text-sm text-slate-300 mb-4">
            1. Navigate to <strong>Candidate Discovery</strong>.<br/>
            2. Select a specific Candidate to enter the immersive workspace.<br/>
            3. Click the <strong>Data Provenance</strong> button in the upper right header to expand the lineage drawer.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
