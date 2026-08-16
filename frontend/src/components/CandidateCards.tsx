/**
 * SynTrait
 * Comparative Genomics Platform for Agronomic Trait Discovery
 *
 * Author: Balaji Muthukumar
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Fingerprint, Dna, GitMerge, Cpu, ArrowRight, Network, Activity, List, LayoutGrid, Target, Scissors, Waves } from 'lucide-react';

const API_URL = 'http://localhost:8000';

export function CandidateCards() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'cards' | 'table' | 'network'>('cards');
  const [activeFilter, setActiveFilter] = useState<'all' | 'biological' | 'agronomic' | 'translational'>('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/candidates?limit=50`)
      .then(r => r.json())
      .then(data => setCandidates(data.data || []))
      .catch(e => console.error(e));
  }, []);

  return (
    <div className="p-10 max-w-7xl mx-auto min-h-screen flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h2 className="text-sm font-mono text-cyan-400 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Fingerprint className="w-4 h-4" /> Seed Shattering Focus
          </h2>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Candidate Discovery</h1>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search gene / accession..." 
              className="w-full bg-navy-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-navy-800 border border-slate-700 rounded-lg text-sm text-slate-300 hover:bg-slate-800 transition-colors">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      {/* Filter Drawer / Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 custom-scrollbar">
        <FilterTab label="All Candidates" active={activeFilter === 'all'} onClick={() => setActiveFilter('all')} />
        <FilterTab label="Biological Evidence" active={activeFilter === 'biological'} onClick={() => setActiveFilter('biological')} />
        <FilterTab label="Agronomic Evidence" active={activeFilter === 'agronomic'} onClick={() => setActiveFilter('agronomic')} />
        <FilterTab label="Translational / Experimental" active={activeFilter === 'translational'} onClick={() => setActiveFilter('translational')} />
      </div>

      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-mono text-slate-400">{candidates.length} candidates available</span>
        <div className="flex gap-2">
          <button onClick={() => setViewMode('cards')} className={`p-2 rounded-lg ${viewMode === 'cards' ? 'bg-cyan-900/50 text-cyan-400' : 'bg-slate-800 text-slate-400'}`}><LayoutGrid className="w-4 h-4" /></button>
          <button onClick={() => setViewMode('table')} className={`p-2 rounded-lg ${viewMode === 'table' ? 'bg-cyan-900/50 text-cyan-400' : 'bg-slate-800 text-slate-400'}`}><List className="w-4 h-4" /></button>
          <button onClick={() => setViewMode('network')} className={`p-2 rounded-lg ${viewMode === 'network' ? 'bg-cyan-900/50 text-cyan-400' : 'bg-slate-800 text-slate-400'}`}><Network className="w-4 h-4" /></button>
        </div>
      </div>

      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-12">
          <AnimatePresence>
            {candidates.map((cand, idx) => (
              <CandidateCard key={cand.id} cand={cand} idx={idx} onClick={() => navigate(`/candidates/${cand.candidate_gene_id}`)} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {viewMode === 'table' && (
        <div className="glass-panel rounded-xl overflow-hidden border border-slate-700/50 pb-12">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 font-mono text-xs text-slate-500 uppercase tracking-widest border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Candidate</th>
                <th className="px-6 py-4">Bio Score</th>
                <th className="px-6 py-4">Meta Rank</th>
                <th className="px-6 py-4">Editability</th>
                <th className="px-6 py-4">Coverage</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((cand) => {
                const ev = cand.evidence_json || {};
                const coverage = calculateCoverage(ev);
                
                return (
                  <tr key={cand.id} onClick={() => navigate(`/candidates/${cand.candidate_gene_id}`)} className="border-b border-slate-800/50 hover:bg-slate-800/30 cursor-pointer transition-colors group">
                    <td className="px-6 py-4 font-bold text-white group-hover:text-cyan-400 transition-colors">{cand.candidate_gene_id}</td>
                    <td className="px-6 py-4 font-black text-cyan-400">{(cand.composite_score * 100).toFixed(1)}</td>
                    <td className="px-6 py-4 font-black text-fuchsia-400">{ev.meta_rank ? (ev.meta_rank.meta_score * 100).toFixed(1) : '-'}</td>
                    <td className="px-6 py-4 text-lime-400 font-bold">{ev.editability?.feasibility || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden w-24">
                          <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${(coverage / 8) * 100}%` }}></div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">{coverage}/8</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right"><ArrowRight className="w-4 h-4 text-slate-500 inline group-hover:text-cyan-400 transition-colors" /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {viewMode === 'network' && (
        <div className="glass-panel rounded-xl h-[600px] border border-slate-700/50 flex flex-col items-center justify-center text-center p-10 pb-12">
          <Network className="w-16 h-16 text-cyan-900 mb-6" />
          <h3 className="text-xl font-bold text-white mb-2">Network View Unavailable</h3>
          <p className="text-slate-400 max-w-md">The interactome network view requires downstream experimental interaction data which is not included in the current analysis scope.</p>
        </div>
      )}
    </div>
  );
}

function FilterTab({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-xs font-mono tracking-widest uppercase transition-all whitespace-nowrap
        ${active ? 'bg-cyan-900 text-cyan-400 border border-cyan-500/50' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-600'}`}
    >
      {label}
    </button>
  );
}

function calculateCoverage(evidence: any) {
  let count = 0;
  if (evidence.homology_score > 0) count++;
  if (evidence.synteny_score > 0) count++;
  if (evidence.selection_score > 0) count++;
  if (evidence.domain_score > 0) count++;
  if (evidence.expression && evidence.expression.status !== 'unavailable') count++;
  if (evidence.meta_rank) count++;
  if (evidence.editability && evidence.editability.status !== 'Unavailable') count++;
  if (evidence.population && evidence.population.status !== 'unavailable') count++;
  return count;
}

function CandidateCard({ cand, idx, onClick }: { cand: any, idx: number, onClick: () => void }) {
  const score = (cand.composite_score * 100).toFixed(1);
  const evidence = cand.evidence_json || {};
  const coverage = calculateCoverage(evidence);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={onClick}
      className="glass-card rounded-xl p-6 border border-slate-700/50 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all cursor-pointer group flex flex-col"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">{cand.candidate_gene_id}</h3>
          <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">Rank #{idx + 1}</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            {score}
          </div>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-mono mt-1">Bio Priority</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-end mb-1">
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">Evidence Coverage</span>
          <span className="text-[10px] text-slate-500 font-mono">{coverage} / 8</span>
        </div>
        <div className="h-1 bg-slate-800 rounded-full overflow-hidden flex">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={`flex-1 ${i < coverage ? 'bg-cyan-500 border-r border-slate-900' : 'bg-transparent'}`}></div>
          ))}
        </div>
      </div>

      <div className="flex-1 space-y-4 mb-6 mt-4">
        <div className="grid grid-cols-2 gap-y-4 gap-x-2">
          <EvidenceIndicator label="Orthology" val={evidence.homology_score > 0} icon={Network} color="text-emerald-400" />
          <EvidenceIndicator label="Synteny" val={evidence.synteny_score > 0} icon={GitMerge} color="text-blue-400" />
          <EvidenceIndicator label="Selection" val={evidence.selection_score > 0} icon={Dna} color="text-violet-400" />
          <EvidenceIndicator label="Domains" val={evidence.domain_score > 0} icon={Cpu} color="text-cyan-400" />
          <EvidenceIndicator label="Expression" val={evidence.expression && evidence.expression.status !== 'unavailable'} icon={Activity} color="text-emerald-500" />
          <EvidenceIndicator label="Meta-Rank" val={!!evidence.meta_rank} icon={Target} color="text-fuchsia-400" />
          <EvidenceIndicator label="Editability" val={evidence.editability && evidence.editability.status !== 'Unavailable'} icon={Scissors} color="text-lime-400" />
          <EvidenceIndicator label="Pop Signal" val={evidence.population && evidence.population.status !== 'unavailable'} icon={Waves} color="text-rose-400" />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-800 group-hover:border-slate-700 transition-colors mt-auto">
        <span className="text-xs text-slate-400 font-mono flex items-center gap-2 uppercase tracking-wider">
          Explore Evidence Layers
        </span>
        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transform group-hover:translate-x-1 transition-all" />
      </div>
    </motion.div>
  );
}

function EvidenceIndicator({ label, val, icon: Icon, color }: any) {
  return (
    <div className="flex items-center gap-2">
      {val ? (
        <Icon className={`w-3 h-3 ${color}`} />
      ) : (
        <Icon className="w-3 h-3 text-slate-700" />
      )}
      <span className={`text-[9px] font-mono uppercase tracking-widest ${val ? 'text-slate-300' : 'text-slate-600'}`}>{label}</span>
    </div>
  );
}
