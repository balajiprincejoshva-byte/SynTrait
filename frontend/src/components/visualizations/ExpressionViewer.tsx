/**
 * SynTrait
 * Comparative Genomics Platform for Agronomic Trait Discovery
 *
 * Author: Balaji Muthukumar
 */
import { motion } from 'framer-motion';
import { Activity, Database, AlertCircle } from 'lucide-react';

export function ExpressionViewer({ candidate }: { candidate: any }) {
  const expr = candidate.evidence_json?.expression;
  
  if (!expr || expr.status === 'unavailable') {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <AlertCircle className="w-12 h-12 mb-4 text-slate-500 opacity-50" />
        <h3 className="text-lg font-bold text-slate-300">Expression Data Unavailable</h3>
        <p className="text-sm mt-2 text-center max-w-xs">{expr?.message || "Expression evidence is limited for this species/candidate."}</p>
      </div>
    );
  }

  const tissues = ['Root', 'Leaf', 'Panicle', 'Seed', 'Stress'];
  const maxVal = Math.max(...tissues.map(t => expr[t] || 0), 1);

  return (
    <div className="h-full flex flex-col p-4 relative">
      <div className="flex items-center gap-2 mb-8">
        <Activity className="w-5 h-5 text-emerald-400" />
        <h3 className="font-bold text-lg text-emerald-400 tracking-wider">TISSUE EXPRESSION ATLAS</h3>
      </div>
      
      <div className="flex-1 flex items-end justify-around pb-12 px-8">
        {tissues.map((tissue, idx) => {
          const val = expr[tissue] || 0;
          const heightPct = (val / maxVal) * 100;
          const isStress = tissue === 'Stress';
          
          return (
            <div key={tissue} className="flex flex-col items-center gap-4 group">
              <div className="text-xs font-mono text-emerald-400/80 h-6 opacity-0 group-hover:opacity-100 transition-opacity">
                {val.toFixed(1)} TPM
              </div>
              <div className="relative w-12 h-48 bg-slate-900 rounded-t-sm border-b border-emerald-900 overflow-hidden">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPct}%` }}
                  transition={{ duration: 0.8, delay: idx * 0.1, ease: 'easeOut' }}
                  className={`absolute bottom-0 w-full ${isStress ? 'bg-gradient-to-t from-orange-600 to-amber-400' : 'bg-gradient-to-t from-emerald-900 to-emerald-400'} rounded-t-sm opacity-80 group-hover:opacity-100 group-hover:shadow-[0_0_15px_rgba(52,211,153,0.5)] transition-all`}
                />
              </div>
              <div className="text-sm font-bold text-slate-300 uppercase tracking-wider">{tissue}</div>
            </div>
          );
        })}
      </div>
      
      <div className="absolute bottom-4 right-4 flex items-center gap-2 text-xs text-slate-500 font-mono">
        <Database className="w-3 h-3" />
        <span>Provenance: {expr.provenance}</span>
      </div>
    </div>
  );
}
