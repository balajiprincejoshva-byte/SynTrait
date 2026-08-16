/**
 * SynTrait
 * Comparative Genomics Platform for Agronomic Trait Discovery
 *
 * Author: Balaji Muthukumar
 */
import { Dna } from 'lucide-react';

export function EvolutionTree({ candidate }: { candidate: any }) {
  if (!candidate?.evidence_json?.selection_score) {
    return <EmptyState message="Evolutionary constraint data not available." />;
  }

  const score = candidate.evidence_json.selection_score;
  const isConstrained = score > 0.5;

  return (
    <div className="flex flex-col py-8 w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h4 className="text-sm font-bold text-white mb-1">dN/dS Ratio Analysis</h4>
          <p className="text-xs text-slate-400">Evolutionary constraint evidence derived from multi-species alignments.</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-violet-400">{score.toFixed(2)}</div>
          <div className="text-[10px] uppercase font-mono text-slate-500">Constraint Score</div>
        </div>
      </div>

      <div className="relative h-40 w-full flex items-center justify-center bg-navy-800/30 rounded-xl border border-slate-800">
        <Dna className="absolute text-violet-900/20 w-32 h-32" />
        <div className="text-center z-10 p-6">
          {isConstrained ? (
            <>
              <div className="text-violet-400 font-bold mb-2">Strong Purifying Selection</div>
              <p className="text-sm text-slate-400">The coding sequence exhibits a dN/dS ratio indicative of strong functional constraint across the grass lineage, characteristic of essential agronomic traits.</p>
            </>
          ) : (
            <>
              <div className="text-violet-400 font-bold mb-2">Neutral / Positive Selection</div>
              <p className="text-sm text-slate-400">The coding sequence exhibits accelerated evolution, potentially indicating positive selection or relaxed constraint.</p>
            </>
          )}
        </div>
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
