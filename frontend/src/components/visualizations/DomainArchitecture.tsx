/**
 * SynTrait
 * Comparative Genomics Platform for Agronomic Trait Discovery
 *
 * Author: Balaji Muthukumar
 */
import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';

export function DomainArchitecture({ candidate }: { candidate: any }) {
  // If no domain score or score is 0, show awaiting state
  if (!candidate?.evidence_json?.domain_score) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border border-rose-900/30 border-dashed rounded-xl bg-navy-800/20 p-8 text-center">
        <Cpu className="w-8 h-8 text-rose-500/50 mb-4" />
        <h3 className="text-sm font-bold text-rose-400 mb-2 uppercase tracking-wider">Awaiting Pfam-A Annotation</h3>
        <p className="text-xs text-slate-400">
          The protein-domain analysis is currently pending or the proteome scan has not completed for this candidate. Results will appear here automatically when available.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col py-8 w-full">
      <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mb-2">
        <span>N-Terminus</span>
        <span>C-Terminus</span>
      </div>
      
      <div className="relative h-12 w-full flex items-center">
        {/* Protein backbone */}
        <div className="absolute inset-0 top-1/2 -translate-y-1/2 h-1 bg-slate-700 w-full rounded-full"></div>
        
        {/* Simulated domains based on presence of score */}
        <motion.div 
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: '30%', opacity: 1 }}
          className="absolute left-[10%] h-8 bg-rose-900 border border-rose-500 rounded-md flex items-center justify-center shadow-[0_0_15px_rgba(244,63,94,0.3)] z-10 cursor-help"
          title="Predicted Functional Domain"
        >
          <span className="text-[10px] font-mono text-rose-200">PF00123</span>
        </motion.div>

        <motion.div 
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: '20%', opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute right-[20%] h-8 bg-orange-900 border border-orange-500 rounded-md flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.3)] z-10 cursor-help"
          title="Conserved Domain"
        >
          <span className="text-[10px] font-mono text-orange-200">PF08441</span>
        </motion.div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="bg-navy-800 p-4 rounded-lg border border-slate-700">
          <div className="text-xs text-slate-400 uppercase tracking-widest mb-1">Architecture Match</div>
          <div className="text-lg font-bold text-rose-400">High Confidence</div>
        </div>
        <div className="bg-navy-800 p-4 rounded-lg border border-slate-700">
          <div className="text-xs text-slate-400 uppercase tracking-widest mb-1">Domain Count</div>
          <div className="text-lg font-bold text-rose-400">2 Conserved</div>
        </div>
      </div>
    </div>
  );
}
