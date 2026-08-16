/**
 * SynTrait
 * Comparative Genomics Platform for Agronomic Trait Discovery
 *
 * Author: Balaji Muthukumar
 */
import { Activity, Clock, CheckCircle2, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

export function Analyses() {
  const runs = [
    { name: 'Orthology Inference', species: 'Rice, Sorghum, Maize, Wheat, Setaria', status: 'Completed', time: '2h 15m' },
    { name: 'Synteny Mapping', species: 'Rice ↔ Sorghum, Rice ↔ Setaria', status: 'Completed', time: '45m' },
    { name: 'Evolutionary Constraint', species: 'Conserved orthogroups', status: 'Completed', time: '1h 30m' },
    { name: 'Protein Domain Annotation', species: 'Tier-1 Proteomes', status: 'Running', time: '01:42:18' },
    { name: 'Candidate Prioritization', species: 'Seed Shattering', status: 'Completed', time: '5m' }
  ];

  return (
    <div className="p-10 max-w-5xl mx-auto h-full flex flex-col">
      <div className="mb-10">
        <h2 className="text-sm font-mono text-cyan-400 uppercase tracking-widest mb-2 flex items-center gap-2">
          <Activity className="w-4 h-4" /> System Telemetry
        </h2>
        <h1 className="text-3xl font-extrabold text-white">Analysis History</h1>
      </div>

      <div className="glass-panel border border-slate-700/50 rounded-xl overflow-hidden flex-1">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-navy-900 border-b border-slate-700 font-mono text-xs uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Analysis</th>
              <th className="px-6 py-4">Scope</th>
              <th className="px-6 py-4">Runtime</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((r, i) => (
              <motion.tr 
                key={i} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer"
              >
                <td className="px-6 py-4 font-bold text-white">{r.name}</td>
                <td className="px-6 py-4 text-slate-400">{r.species}</td>
                <td className="px-6 py-4 font-mono flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-500" /> {r.time}
                </td>
                <td className="px-6 py-4">
                  {r.status === 'Completed' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4" /> Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-900/30 text-violet-400 border border-violet-500/30 text-xs font-bold uppercase tracking-wider animate-pulse">
                      <Terminal className="w-4 h-4" /> Running
                    </span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
