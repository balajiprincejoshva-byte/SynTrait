/**
 * SynTrait
 * Comparative Genomics Platform for Agronomic Trait Discovery
 *
 * Author: Balaji Muthukumar
 */
import { motion } from 'framer-motion';
import { Network } from 'lucide-react';

export function OrthologyNetwork({ candidate }: { candidate: any }) {
  if (!candidate?.evidence_json?.homology_score) {
    return <EmptyState message="No orthogroup evidence available for this candidate." />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[300px] w-full relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-navy-900/0 to-navy-900/0 pointer-events-none"></div>
      
      <div className="relative w-64 h-64">
        {/* Center Node */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-emerald-900 border-2 border-emerald-500 rounded-full flex flex-col items-center justify-center z-10 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
        >
          <Network className="w-5 h-5 text-emerald-400 mb-1" />
        </motion.div>
        
        {/* Lines */}
        <svg className="absolute inset-0 w-full h-full -z-10 text-emerald-500/30">
          <line x1="50%" y1="50%" x2="20%" y2="20%" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="50%" y1="50%" x2="80%" y2="20%" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="50%" y1="50%" x2="50%" y2="85%" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
        </svg>

        {/* Orbit Nodes */}
        <Node x="20%" y="20%" label="Sorghum" delay={0.2} />
        <Node x="80%" y="20%" label="Maize" delay={0.4} />
        <Node x="50%" y="85%" label="Setaria" delay={0.6} />
      </div>

      <div className="mt-8 text-center max-w-sm z-10">
        <h4 className="text-sm font-bold text-white mb-2">Orthogroup Inference</h4>
        <p className="text-xs text-slate-400">
          Candidate {candidate.candidate_gene_id} shares significant sequence homology with functionally annotated genes across multiple Tier-1 grass species.
        </p>
      </div>
    </div>
  );
}

function Node({ x, y, label, delay }: { x: string, y: string, label: string, delay: number }) {
  return (
    <motion.div 
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay }}
      className="absolute w-10 h-10 bg-slate-800 border border-emerald-500/50 rounded-full flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2"
      style={{ left: x, top: y }}
    >
      <span className="absolute -bottom-6 text-[10px] font-mono text-slate-400 uppercase">{label}</span>
      <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_5px_#34d399]"></div>
    </motion.div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-64 border border-slate-800/50 border-dashed rounded-xl bg-navy-800/20">
      <p className="text-sm text-slate-500 font-mono">{message}</p>
    </div>
  );
}
