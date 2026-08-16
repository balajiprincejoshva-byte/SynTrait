/**
 * SynTrait
 * Comparative Genomics Platform for Agronomic Trait Discovery
 *
 * Author: Balaji Muthukumar
 */
import { motion } from 'framer-motion';
import { Target, TrendingUp, TrendingDown, Scale } from 'lucide-react';

export function MetaRankerViewer({ candidate }: { candidate: any }) {
  const meta = candidate.evidence_json?.meta_rank;
  const primaryScore = (candidate.composite_score * 100).toFixed(1);
  
  if (!meta) return null;
  
  const experimentalScore = (meta.meta_score * 100).toFixed(1);
  const diff = meta.meta_score - candidate.composite_score;
  const isUp = diff > 0;
  
  const features = meta.features || {};
  const maxWeight = Math.max(...Object.values(features).map(v => Math.abs(v as number)), 0.1);

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex items-center gap-2 mb-8">
        <Target className="w-5 h-5 text-fuchsia-500" />
        <h3 className="font-bold text-lg text-fuchsia-400 tracking-wider">EXPERIMENTAL META-RANKER</h3>
      </div>
      
      <div className="flex gap-8 mb-10 bg-slate-900/50 p-6 rounded-xl border border-slate-800">
        <div className="flex-1 text-center">
          <div className="text-xs text-slate-400 font-mono mb-2 uppercase">Primary Evidence Score</div>
          <div className="text-4xl font-black text-cyan-400">{primaryScore}</div>
        </div>
        <div className="w-px bg-slate-800"></div>
        <div className="flex-1 text-center relative group">
          <div className="text-xs text-fuchsia-400/80 font-mono mb-2 uppercase flex justify-center items-center gap-1">
            <Scale className="w-3 h-3" />
            Meta-Rank Model
          </div>
          <div className="text-4xl font-black text-fuchsia-400 flex items-center justify-center gap-2">
            {experimentalScore}
            {Math.abs(diff) > 0.01 && (
              isUp ? <TrendingUp className="w-6 h-6 text-emerald-500" /> : <TrendingDown className="w-6 h-6 text-rose-500" />
            )}
          </div>
        </div>
      </div>
      
      <h4 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-widest">Model Feature Importance (L2 Reg)</h4>
      <div className="flex-1 flex flex-col justify-center gap-4">
        {Object.entries(features).map(([feat, weight]: [string, any], idx) => {
          const w = weight as number;
          const width = (Math.abs(w) / maxWeight) * 100;
          const isPos = w >= 0;
          
          return (
            <div key={feat} className="flex items-center gap-4">
              <div className="w-24 text-right text-xs font-mono text-slate-300 uppercase">{feat}</div>
              <div className="flex-1 h-3 bg-slate-900 rounded-full overflow-hidden flex relative">
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-700 z-10"></div>
                {/* Left side (negative) */}
                <div className="flex-1 flex justify-end">
                  {!isPos && (
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${width}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                      className="h-full bg-rose-500 rounded-l-full"
                    />
                  )}
                </div>
                {/* Right side (positive) */}
                <div className="flex-1 flex justify-start">
                  {isPos && (
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${width}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                      className="h-full bg-emerald-500 rounded-r-full"
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 text-xs text-slate-500 font-mono text-center">
        Status: {meta.status}
      </div>
    </div>
  );
}
