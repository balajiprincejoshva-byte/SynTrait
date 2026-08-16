/**
 * SynTrait
 * Comparative Genomics Platform for Agronomic Trait Discovery
 *
 * Author: Balaji Muthukumar
 */
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Search, Network, GitMerge, Dna, Cpu, Activity, ArrowRight, Target, Scissors, Waves } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:8000';

const PIPELINE_STAGES = [
  { id: 'orthology', icon: Network, label: 'Orthology' },
  { id: 'synteny', icon: GitMerge, label: 'Synteny' },
  { id: 'evolution', icon: Dna, label: 'Evolution' },
  { id: 'protein', icon: Cpu, label: 'Domains' },
  { id: 'expression', icon: Activity, label: 'Expression' },
  { id: 'population', icon: Waves, label: 'Population' },
  { id: 'priority', icon: Search, label: 'Priority' },
  { id: 'metarank', icon: Target, label: 'Meta-Rank' },
  { id: 'editability', icon: Scissors, label: 'Editability' },
];

export function Dashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_URL}/stats`)
      .then(r => r.json())
      .then(data => setStats(data))
      .catch(e => console.error(e));
  }, []);

  return (
    <div className="p-10 max-w-[1500px] mx-auto flex flex-col items-center justify-center min-h-[90vh]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-sm font-mono text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center justify-center gap-3">
          <Database className="w-4 h-4" /> 
          SynTrait Engine
        </h2>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-500 mb-6 drop-shadow-lg tracking-tight">
          Living Evidence Engine for<br/>Agronomic Trait Discovery
        </h1>
        <p className="text-sm font-mono text-cyan-500/80 uppercase tracking-widest mb-10">
          MADE BY BALAJI MUTHUKUMAR
        </p>
        <p className="text-slate-400 max-w-4xl mx-auto text-xl leading-relaxed mb-12">
          Integrating orthology, synteny, evolutionary signals, protein-domain architecture, expression evidence, population genetics, and experimental meta-ranking to prioritize functional targets.
        </p>

        <Link 
          to="/discover"
          className="inline-flex items-center gap-3 px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full font-bold text-lg shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] transition-all transform hover:-translate-y-1"
        >
          START NEW DISCOVERY
          <ArrowRight className="w-5 h-5" />
        </Link>
      </motion.div>

      {/* Animated Scientific Pipeline Visual */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="w-full relative py-12"
      >
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2">
          <motion.div 
            className="h-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent w-1/3"
            animate={{ x: ["-100%", "300%"] }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          />
        </div>
        
        <div className="flex justify-between relative z-10 px-8">
          {PIPELINE_STAGES.map((stage, i) => (
            <motion.div 
              key={stage.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + (i * 0.1) }}
              className="flex flex-col items-center group cursor-default"
            >
              <div className="w-14 h-14 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center mb-4 group-hover:border-cyan-500 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all relative overflow-hidden">
                <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <stage.icon className="w-6 h-6 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </div>
              <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 group-hover:text-cyan-300 transition-colors whitespace-nowrap">
                {stage.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Global Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mt-12 w-full max-w-[1400px]"
      >
        <StatItem label="Species" value={stats?.species_count || '...'} />
        <StatItem label="Traits" value={stats?.traits_count || '...'} />
        <StatItem label="Candidates" value={stats?.candidates_count ? stats.candidates_count.toLocaleString() : '...'} />
        <StatItem label="Expression Models" value="Active" color="text-emerald-400" />
        <StatItem label="ML Meta-Ranker" value="v1.2" color="text-fuchsia-400" />
        <StatItem label="Editability Screen" value="Heuristic" color="text-lime-400" />
      </motion.div>
    </div>
  );
}

function StatItem({ label, value, color = "text-white" }: { label: string, value: string | number, color?: string }) {
  return (
    <div className="text-center p-6 glass-panel rounded-2xl border border-slate-800/50 hover:border-cyan-900/50 transition-colors flex flex-col justify-center min-h-[140px]">
      <div className={`text-3xl font-bold ${color} mb-2 tracking-tight`}>{value}</div>
      <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{label}</div>
    </div>
  );
}
