/**
 * SynTrait
 * Comparative Genomics Platform for Agronomic Trait Discovery
 *
 * Author: Balaji Muthukumar
 */
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Network, GitMerge, Dna, Cpu, Activity, Fingerprint, Info, Target, Scissors, Waves, MapPin } from 'lucide-react';

import { SyntenyViewer } from './visualizations/SyntenyViewer';
import { OrthologyNetwork } from './visualizations/OrthologyNetwork';
import { DomainArchitecture } from './visualizations/DomainArchitecture';
import { EvolutionTree } from './visualizations/EvolutionTree';
import { ProvenanceDrawer } from './visualizations/ProvenanceDrawer';
import { ExpressionViewer } from './visualizations/ExpressionViewer';
import { MetaRankerViewer } from './visualizations/MetaRankerViewer';
import { CrisprViewer } from './visualizations/CrisprViewer';
import { PopulationViewer } from './visualizations/PopulationViewer';

const API_URL = 'http://localhost:8000';

type EvidenceType = 'summary' | 'orthology' | 'synteny' | 'selection' | 'domains' | 'expression' | 'trait' | 'qtl' | 'metarank' | 'editability' | 'population';

export function CandidateDetail() {
  const { id } = useParams();
  const [candidate, setCandidate] = useState<any>(null);
  const [activeView, setActiveView] = useState<EvidenceType>('summary');
  const [isProvenanceOpen, setIsProvenanceOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/candidates/${id}`)
      .then(r => r.json())
      .then(data => setCandidate(data))
      .catch(e => console.error(e));
  }, [id]);

  if (!candidate) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen">
        <Activity className="w-8 h-8 text-cyan-500 animate-spin" />
      </div>
    );
  }

  const score = (candidate.composite_score * 100).toFixed(1);
  const evidence = candidate.evidence_json || {};

  return (
    <div className="p-10 max-w-[1500px] mx-auto min-h-screen flex flex-col">
      {/* Header */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <Link to="/candidates" className="inline-flex items-center gap-2 text-sm font-mono text-slate-400 hover:text-cyan-400 transition-colors mb-6 group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Discovery
          </Link>
          <h1 className="text-5xl font-mono font-bold text-white mb-2 tracking-tight">{id}</h1>
          <h2 className="text-xl text-slate-400">Putative Functional Candidate</h2>
        </div>
        <button 
          onClick={() => setIsProvenanceOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-navy-800 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors text-sm"
        >
          <Info className="w-4 h-4 text-cyan-500" /> Data Provenance
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        {/* Left Column - Multi-ring Evidence Constellation */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="glass-card rounded-2xl p-6 flex-1 relative flex flex-col border border-slate-800/50 overflow-hidden">
            <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-2 z-30">Evidence Convergence</h3>
            <p className="text-[10px] text-slate-500 mb-8 z-30 relative bg-navy-900/50 inline-block px-2 py-1 rounded">Click nodes to investigate biological, agronomic, and translational evidence.</p>
            
            <div className="flex-1 relative flex items-center justify-center min-h-[500px] scale-[0.85] transform-origin-center -mt-10">
              
              {/* Ring 3: Translational (Radius 240) */}
              <div className="absolute w-[480px] h-[480px] border border-slate-800/60 rounded-full z-0 flex items-start justify-center pt-2 text-[8px] text-slate-600 font-mono tracking-[0.2em]">TRANSLATIONAL</div>
              <OrbitNode icon={Target} label="Meta-Rank" state={evidence.meta_rank ? 'active' : 'inactive'} radius={240} angle={-30} color="fuchsia" isActive={activeView === 'metarank'} onClick={() => setActiveView('metarank')} />
              <OrbitNode icon={Scissors} label="Editability" state={evidence.editability ? 'active' : 'inactive'} radius={240} angle={90} color="lime" isActive={activeView === 'editability'} onClick={() => setActiveView('editability')} />
              <OrbitNode icon={Waves} label="Population" state={evidence.population ? 'active' : 'inactive'} radius={240} angle={210} color="rose" isActive={activeView === 'population'} onClick={() => setActiveView('population')} />

              {/* Ring 2: Agronomic (Radius 170) */}
              <div className="absolute w-[340px] h-[340px] border border-slate-700/60 rounded-full z-0 flex items-start justify-center pt-2 text-[8px] text-slate-500 font-mono tracking-[0.2em]">AGRONOMIC</div>
              <OrbitNode icon={Fingerprint} label="Trait" state="active" radius={170} angle={20} color="amber" isActive={activeView === 'trait'} onClick={() => setActiveView('trait')} />
              <OrbitNode icon={MapPin} label="QTL" state="active" radius={170} angle={160} color="orange" isActive={activeView === 'qtl'} onClick={() => setActiveView('qtl')} />

              {/* Ring 1: Biological (Radius 100) */}
              <div className="absolute w-[200px] h-[200px] border border-slate-600/60 rounded-full z-0 flex items-start justify-center pt-2 text-[8px] text-slate-400 font-mono tracking-[0.2em]">BIOLOGICAL</div>
              <OrbitNode icon={Network} label="Orthology" state={evidence.homology_score > 0 ? 'active' : 'inactive'} radius={100} angle={0} color="emerald" isActive={activeView === 'orthology'} onClick={() => setActiveView('orthology')} />
              <OrbitNode icon={GitMerge} label="Synteny" state={evidence.synteny_score > 0 ? 'active' : 'inactive'} radius={100} angle={72} color="blue" isActive={activeView === 'synteny'} onClick={() => setActiveView('synteny')} />
              <OrbitNode icon={Dna} label="Selection" state={evidence.selection_score > 0 ? 'active' : 'inactive'} radius={100} angle={144} color="violet" isActive={activeView === 'selection'} onClick={() => setActiveView('selection')} />
              <OrbitNode icon={Cpu} label="Domains" state={evidence.domain_score > 0 ? 'active' : 'inactive'} radius={100} angle={216} color="cyan" isActive={activeView === 'domains'} onClick={() => setActiveView('domains')} />
              <OrbitNode icon={Activity} label="Expression" state={evidence.expression ? 'active' : 'inactive'} radius={100} angle={288} color="emerald" isActive={activeView === 'expression'} onClick={() => setActiveView('expression')} />

              {/* Central Node */}
              <motion.div 
                onClick={() => setActiveView('summary')}
                whileHover={{ scale: 1.1 }}
                animate={{ scale: activeView === 'summary' ? 1.05 : 1 }}
                className={`cursor-pointer w-20 h-20 rounded-full flex flex-col items-center justify-center z-10 transition-colors duration-300
                  ${activeView === 'summary' ? 'bg-cyan-900 border-2 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.6)]' : 'bg-slate-900 border-2 border-slate-700 shadow-xl hover:border-cyan-500/50'}`}
              >
                <div className="text-2xl font-black text-white">{score}</div>
                <div className="text-[9px] uppercase font-mono text-cyan-200 mt-1">Score</div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Right Column - Deep Dive Workspace */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="glass-card rounded-2xl p-8 flex-1 border border-slate-800/50 bg-navy-900/40 relative overflow-hidden">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="relative z-10 h-full flex flex-col"
              >
                {activeView === 'summary' && (
                  <div className="flex-1 flex flex-col justify-center items-center text-center max-w-lg mx-auto">
                    <Activity className="w-16 h-16 text-cyan-500/50 mb-6" />
                    <h3 className="text-3xl font-bold text-white mb-4">Candidate Profile</h3>
                    <p className="text-slate-400 text-lg leading-relaxed mb-8">
                      Select an evidence layer on the left to explore the genomic alignments, agronomic trait mappings, and translational priority supporting this candidate.
                    </p>
                    
                    <div className="w-full bg-navy-800 border border-slate-700 p-6 rounded-xl flex items-center justify-between mb-4">
                      <div className="text-left">
                        <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-1">Biological Evidence Score</div>
                        <div className="text-3xl font-bold text-white">{score}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-1">Experimental Rank</div>
                        <div className="text-3xl font-bold text-fuchsia-400">
                          {evidence.meta_rank ? (evidence.meta_rank.meta_score * 100).toFixed(1) : '—'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full flex gap-4">
                      <div className="flex-1 bg-navy-800 border border-slate-700 p-4 rounded-xl text-center">
                        <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-1">Editability</div>
                        <div className="text-lg font-bold text-lime-400">{evidence.editability?.feasibility || '—'}</div>
                      </div>
                      <div className="flex-1 bg-navy-800 border border-slate-700 p-4 rounded-xl text-center">
                        <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-1">Pop Signal</div>
                        <div className="text-lg font-bold text-rose-400">{evidence.population?.status === 'Available' ? 'Detected' : 'Unavailable'}</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeView === 'orthology' && <div className="flex-1 flex flex-col"><OrthologyNetwork candidate={candidate} /></div>}
                {activeView === 'synteny' && <div className="flex-1 flex flex-col"><SyntenyViewer candidate={candidate} /></div>}
                {activeView === 'selection' && <div className="flex-1 flex flex-col"><EvolutionTree candidate={candidate} /></div>}
                {activeView === 'domains' && <div className="flex-1 flex flex-col"><DomainArchitecture candidate={candidate} /></div>}
                {activeView === 'expression' && <div className="flex-1 flex flex-col"><ExpressionViewer candidate={candidate} /></div>}
                
                {activeView === 'trait' && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <Fingerprint className="w-16 h-16 text-amber-500/50 mb-6" />
                    <h3 className="text-2xl font-bold text-amber-400 mb-4">Trait Architecture</h3>
                    <p className="text-slate-400 leading-relaxed max-w-md">Linked to primary agronomic trait through genome-wide association studies.</p>
                  </div>
                )}
                {activeView === 'qtl' && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <MapPin className="w-16 h-16 text-orange-500/50 mb-6" />
                    <h3 className="text-2xl font-bold text-orange-400 mb-4">QTL Projection</h3>
                    <p className="text-slate-400 leading-relaxed max-w-md">Mapped via syntenic blocks from robust quantitative trait loci in related species.</p>
                  </div>
                )}

                {activeView === 'metarank' && <div className="flex-1 flex flex-col"><MetaRankerViewer candidate={candidate} /></div>}
                {activeView === 'editability' && <div className="flex-1 flex flex-col"><CrisprViewer candidate={candidate} /></div>}
                {activeView === 'population' && <div className="flex-1 flex flex-col"><PopulationViewer candidate={candidate} /></div>}
                
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <ProvenanceDrawer isOpen={isProvenanceOpen} onClose={() => setIsProvenanceOpen(false)} candidate={candidate} />
    </div>
  );
}

function OrbitNode({ icon: Icon, label, state, radius, angle, color, isActive, onClick }: any) {
  const rad = angle * (Math.PI / 180);
  const x = Math.cos(rad) * radius;
  const y = Math.sin(rad) * radius;

  const colorMap: any = {
    emerald: 'border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]',
    blue: 'border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]',
    violet: 'border-violet-500/50 text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.2)]',
    cyan: 'border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]',
    amber: 'border-amber-500/50 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]',
    orange: 'border-orange-500/50 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.2)]',
    fuchsia: 'border-fuchsia-500/50 text-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,0.2)]',
    lime: 'border-lime-500/50 text-lime-400 shadow-[0_0_15px_rgba(163,230,53,0.2)]',
    rose: 'border-rose-500/50 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.2)]',
  };

  const activeColorMap: any = {
    emerald: 'bg-emerald-900 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.5)]',
    blue: 'bg-blue-900 border-blue-400 shadow-[0_0_25px_rgba(59,130,246,0.5)]',
    violet: 'bg-violet-900 border-violet-400 shadow-[0_0_25px_rgba(139,92,246,0.5)]',
    cyan: 'bg-cyan-900 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.5)]',
    amber: 'bg-amber-900 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.5)]',
    orange: 'bg-orange-900 border-orange-400 shadow-[0_0_25px_rgba(249,115,22,0.5)]',
    fuchsia: 'bg-fuchsia-900 border-fuchsia-400 shadow-[0_0_25px_rgba(217,70,239,0.5)]',
    lime: 'bg-lime-900 border-lime-400 shadow-[0_0_25px_rgba(163,230,53,0.5)]',
    rose: 'bg-rose-900 border-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.5)]',
  };

  const hasData = state === 'active';

  return (
    <motion.div 
      initial={{ opacity: 0, x: 0, y: 0 }}
      animate={{ opacity: 1, x, y, scale: isActive ? 1.15 : 1 }}
      transition={{ duration: 0.8, delay: 0.1 }}
      onClick={onClick}
      className={`absolute w-12 h-12 rounded-full border cursor-pointer flex flex-col items-center justify-center z-20 transition-colors duration-300
        ${isActive ? activeColorMap[color] : 
          hasData ? `bg-navy-800 hover:bg-slate-800 ${colorMap[color]}` : 
          'bg-navy-900 border-slate-700/50 text-slate-600 hover:border-slate-500'}
      `}
    >
      <Icon className="w-4 h-4" />
      <span className={`absolute -bottom-5 text-[8px] uppercase font-mono tracking-wider whitespace-nowrap
        ${isActive ? 'text-white font-bold' : hasData ? 'text-slate-300' : 'text-slate-600'}
      `}>{label}</span>
    </motion.div>
  );
}
