/**
 * SynTrait
 * Comparative Genomics Platform for Agronomic Trait Discovery
 *
 * Author: Balaji Muthukumar
 */
import { Waves } from 'lucide-react';

export function PopulationViewer({ candidate }: { candidate: any }) {
  const pop = candidate.evidence_json?.population;
  
  if (!pop || pop.status === 'unavailable') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8">
        <Waves className="w-16 h-16 mb-6 text-rose-900/50" />
        <h3 className="text-xl font-bold text-slate-300 tracking-wider">POPULATION SIGNAL UNAVAILABLE</h3>
        <p className="text-sm mt-4 text-center max-w-md text-slate-500 leading-relaxed">
          {pop?.message || "Population variant data (VCF) unavailable for this species/region."}
        </p>
        <div className="mt-8 border border-slate-800 bg-slate-900/50 p-4 rounded-lg w-full max-w-md">
          <div className="text-xs text-slate-500 font-mono mb-2 uppercase">Expected Metrics</div>
          <div className="flex justify-between items-center text-sm font-mono text-slate-400">
            <span>Fst (Differentiation)</span>
            <span>—</span>
          </div>
          <div className="flex justify-between items-center text-sm font-mono text-slate-400 mt-2">
            <span>Tajima's D</span>
            <span>—</span>
          </div>
          <div className="flex justify-between items-center text-sm font-mono text-slate-400 mt-2">
            <span>XP-CLR (Sweep)</span>
            <span>—</span>
          </div>
        </div>
      </div>
    );
  }

  // If real data exists, we would render a genome track here.
  return (
    <div className="h-full flex flex-col p-4 relative">
      <div className="flex items-center gap-2 mb-8">
        <Waves className="w-5 h-5 text-rose-500" />
        <h3 className="font-bold text-lg text-rose-500 tracking-wider">POPULATION SELECTION SIGNAL</h3>
      </div>
      
      {/* ... data visualization code ... */}
      <div className="flex-1 flex items-center justify-center">
        <p className="text-rose-400 font-mono">Data visualization pipeline active.</p>
      </div>
    </div>
  );
}
