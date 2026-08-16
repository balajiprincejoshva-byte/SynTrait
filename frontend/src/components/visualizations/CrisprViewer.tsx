/**
 * SynTrait
 * Comparative Genomics Platform for Agronomic Trait Discovery
 *
 * Author: Balaji Muthukumar
 */
import { motion } from 'framer-motion';
import { Scissors, AlertTriangle } from 'lucide-react';

export function CrisprViewer({ candidate }: { candidate: any }) {
  const crispr = candidate.evidence_json?.editability;
  
  if (!crispr || crispr.status === 'Unavailable') {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <AlertTriangle className="w-12 h-12 mb-4 text-slate-500 opacity-50" />
        <h3 className="text-lg font-bold text-slate-300">Editability Screening Unavailable</h3>
        <p className="text-sm mt-2 text-center max-w-xs">{crispr?.message || "Sequence not found in reference CDS."}</p>
      </div>
    );
  }

  const { pam_count, exon_length, pam_density_per_kb, feasibility } = crispr;
  
  const feasibilityColor = 
    feasibility === 'HIGH' ? 'text-lime-400 border-lime-500/50 bg-lime-500/10' : 
    feasibility === 'MEDIUM' ? 'text-amber-400 border-amber-500/50 bg-amber-500/10' : 
    'text-rose-400 border-rose-500/50 bg-rose-500/10';

  return (
    <div className="h-full flex flex-col p-4 relative">
      <div className="flex items-center gap-2 mb-8">
        <Scissors className="w-5 h-5 text-lime-400" />
        <h3 className="font-bold text-lg text-lime-400 tracking-wider">CRISPR EDITABILITY</h3>
      </div>

      <div className="flex items-center gap-6 mb-12">
        <div className={`px-6 py-3 rounded-full border ${feasibilityColor} font-black tracking-widest uppercase`}>
          FEASIBILITY: {feasibility}
        </div>
        
        <div className="flex gap-6 text-sm">
          <div>
            <div className="text-slate-500 font-mono text-xs mb-1">EXON LENGTH</div>
            <div className="text-slate-200 font-mono text-lg">{exon_length} bp</div>
          </div>
          <div>
            <div className="text-slate-500 font-mono text-xs mb-1">PAM (NGG) COUNT</div>
            <div className="text-slate-200 font-mono text-lg">{pam_count}</div>
          </div>
          <div>
            <div className="text-slate-500 font-mono text-xs mb-1">DENSITY</div>
            <div className="text-slate-200 font-mono text-lg">{pam_density_per_kb}/kb</div>
          </div>
        </div>
      </div>

      <div className="flex-1 relative mt-10">
        {/* Synthetic DNA track */}
        <div className="absolute top-1/2 left-0 right-0 h-2 bg-slate-800 rounded-full -translate-y-1/2"></div>
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-lime-900/50 -translate-y-1/2"></div>
        
        {/* Generate synthetic PAM dots based on density */}
        {Array.from({ length: Math.min(pam_count, 50) }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="absolute w-2 h-2 rounded-full bg-lime-400 top-1/2 -translate-y-1/2"
            style={{ 
              left: `${5 + (Math.random() * 90)}%`,
              boxShadow: '0 0 10px rgba(163,230,53,0.8)'
            }}
          />
        ))}
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -mt-10 bg-slate-900 px-4 py-1 text-xs text-lime-500 font-mono border border-lime-900/50 rounded-full">
          Simulated Exonic Target Region
        </div>
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono">
        <div className="text-slate-500">Method: Coarse NGG Density Heuristic</div>
        <div className="text-amber-500/80 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Not a validated guide design
        </div>
      </div>
    </div>
  );
}
