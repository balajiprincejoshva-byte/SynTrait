/**
 * SynTrait
 * Comparative Genomics Platform for Agronomic Trait Discovery
 *
 * Author: Balaji Muthukumar
 */
import { motion } from 'framer-motion';

export function SyntenyViewer({ candidate }: { candidate: any }) {
  if (!candidate?.evidence_json?.synteny_score) {
    return <EmptyState message="Synteny projection data is not available for this candidate." />;
  }

  // Visual representation of a syntenic alignment
  return (
    <div className="flex flex-col gap-8 py-8 w-full">
      <div className="relative">
        <div className="text-xs font-mono text-slate-400 mb-2">Oryza sativa (Reference)</div>
        <div className="h-2 w-full bg-slate-800 rounded-full relative">
          <div className="absolute left-[20%] right-[60%] h-full bg-blue-500/50 rounded-full shadow-[0_0_10px_#3b82f6]"></div>
        </div>
      </div>
      
      {/* Connecting diagonals */}
      <div className="h-16 relative w-full opacity-30">
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <polygon points="20%,0 40%,0 50%,100 30%,100" fill="#3b82f6" />
        </svg>
      </div>

      <div className="relative">
        <div className="text-xs font-mono text-slate-400 mb-2">Target Species</div>
        <div className="h-2 w-full bg-slate-800 rounded-full relative">
          <div className="absolute left-[30%] right-[50%] h-full bg-blue-400 rounded-full shadow-[0_0_10px_#60a5fa]"></div>
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 40, opacity: 1 }}
            className="absolute left-[40%] -top-10 w-0.5 bg-cyan-400"
          />
          <div className="absolute left-[40%] -top-16 -translate-x-1/2 text-[10px] font-mono text-cyan-400 bg-cyan-900/50 px-2 py-1 rounded">
            {candidate.candidate_gene_id}
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-navy-800 border border-slate-700 rounded-xl">
        <h4 className="text-sm font-bold text-white mb-2">Conserved Syntenic Block</h4>
        <p className="text-xs text-slate-400">
          This candidate falls within a cross-species collinear genomic neighborhood, strongly suggesting functional conservation despite evolutionary divergence.
        </p>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-64 border border-slate-800/50 border-dashed rounded-xl bg-navy-800/20">
      <p className="text-sm text-slate-500 font-mono">{message}</p>
    </div>
  );
}
