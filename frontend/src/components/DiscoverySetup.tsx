/**
 * SynTrait
 * Comparative Genomics Platform for Agronomic Trait Discovery
 *
 * Author: Balaji Muthukumar
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight, Dna, Database, Fingerprint, Info, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8000';

export function DiscoverySetup() {
  const [step, setStep] = useState(1);
  const [traits, setTraits] = useState<any[]>([]);
  const [speciesList, setSpeciesList] = useState<any[]>([]);
  
  const [selectedTrait, setSelectedTrait] = useState<any>(null);
  const [selectedSpecies, setSelectedSpecies] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/traits`)
      .then(r => r.json())
      .then(setTraits)
      .catch(console.error);
      
    fetch(`${API_URL}/species`)
      .then(r => r.json())
      .then(setSpeciesList)
      .catch(console.error);
  }, []);

  const filteredTraits = traits.filter(t => 
    t.trait_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (t.category && t.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSpeciesToggle = (id: number) => {
    if (selectedSpecies.includes(id)) {
      setSelectedSpecies(selectedSpecies.filter(s => s !== id));
    } else {
      setSelectedSpecies([...selectedSpecies, id]);
    }
  };

  const beginDiscovery = () => {
    navigate('/candidates');
  };

  return (
    <div className="max-w-5xl mx-auto p-10 h-full flex flex-col">
      <div className="mb-10">
        <h2 className="text-sm font-mono text-cyan-400 uppercase tracking-widest mb-2">Discovery Setup</h2>
        <h1 className="text-3xl font-extrabold text-white">Configure Investigation</h1>
      </div>

      <div className="flex gap-4 mb-10">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`flex-1 h-1.5 rounded-full ${step >= i ? 'bg-cyan-500 shadow-[0_0_10px_#06b6d4]' : 'bg-slate-800'}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1"
          >
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Fingerprint className="w-6 h-6 text-cyan-400" /> What trait are you investigating?
            </h3>
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search trait knowledge base..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-navy-800 border-2 border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white text-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2">
              {filteredTraits.map(trait => (
                <div 
                  key={trait.id}
                  onClick={() => setSelectedTrait(trait)}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${selectedTrait?.id === trait.id ? 'border-cyan-500 bg-cyan-900/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'border-slate-800 bg-navy-800/50 hover:border-slate-600'}`}
                >
                  <h4 className="text-lg font-bold text-white mb-1">{trait.trait_name}</h4>
                  <div className="flex gap-3 text-xs font-mono">
                    <span className="text-cyan-400 uppercase tracking-wider">{trait.category}</span>
                    <span className="text-slate-500">{trait.to_id || 'No TO ID'}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button 
                onClick={() => setStep(2)}
                disabled={!selectedTrait}
                className="px-8 py-3 bg-cyan-600 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg font-bold flex items-center gap-2 hover:bg-cyan-500 transition-colors"
              >
                Continue <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1"
          >
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Dna className="w-6 h-6 text-cyan-400" /> Choose comparative species
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {speciesList.map(species => {
                const isSelected = selectedSpecies.includes(species.id);
                return (
                  <div 
                    key={species.id}
                    onClick={() => handleSpeciesToggle(species.id)}
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all relative overflow-hidden ${isSelected ? 'border-violet-500 bg-violet-900/20 shadow-[0_0_15px_rgba(139,92,246,0.15)]' : 'border-slate-800 bg-navy-800/50 hover:border-slate-600'}`}
                  >
                    {isSelected && <div className="absolute top-4 right-4 text-violet-400"><CheckCircle2 className="w-5 h-5" /></div>}
                    <div className="text-3xl mb-4">🌾</div>
                    <h4 className="text-lg font-bold text-white italic">{species.scientific_name}</h4>
                    <p className="text-sm text-slate-400 mb-4">{species.common_name}</p>
                    <div className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded inline-block">
                      {species.assembly_accession}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex justify-between">
              <button onClick={() => setStep(1)} className="px-6 py-3 text-slate-400 hover:text-white font-medium">Back</button>
              <button 
                onClick={() => setStep(3)}
                disabled={selectedSpecies.length === 0}
                className="px-8 py-3 bg-cyan-600 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg font-bold flex items-center gap-2 hover:bg-cyan-500 transition-colors"
              >
                Continue <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1"
          >
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Database className="w-6 h-6 text-cyan-400" /> Evidence to consider
            </h3>
            
            <div className="space-y-4 max-w-3xl">
              <EvidenceToggle label="Orthology Inference" desc="Identify orthogroups containing known benchmark genes." active={true} />
              <EvidenceToggle label="Synteny Projection" desc="Utilize collinear genomic blocks to project QTL intervals across species." active={true} />
              <EvidenceToggle label="Evolutionary Constraint" desc="Assess dN/dS ratios to detect signatures of functional conservation." active={true} />
              <EvidenceToggle label="Protein Domain Annotation" desc="Verify presence of functional Pfam domains characteristic of the trait." active={true} />
              <EvidenceToggle label="Trait / QTL Evidence" desc="Incorporate direct overlaps with mapped genetic loci." active={true} />
            </div>

            <div className="mt-12 flex justify-between">
              <button onClick={() => setStep(2)} className="px-6 py-3 text-slate-400 hover:text-white font-medium">Back</button>
              <button 
                onClick={() => setStep(4)}
                className="px-8 py-3 bg-cyan-600 text-white rounded-lg font-bold flex items-center gap-2 hover:bg-cyan-500 transition-colors"
              >
                Review Configuration <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div 
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1"
          >
            <div className="glass-card p-10 rounded-2xl border border-slate-700/50 max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-8 text-center">Analysis Ready</h3>
              
              <div className="space-y-6 mb-10">
                <div className="flex justify-between items-center py-4 border-b border-slate-800">
                  <span className="text-slate-400 font-mono text-sm uppercase tracking-wider">Trait Focus</span>
                  <span className="text-xl font-bold text-cyan-400">{selectedTrait?.trait_name}</span>
                </div>
                
                <div className="flex justify-between items-center py-4 border-b border-slate-800">
                  <span className="text-slate-400 font-mono text-sm uppercase tracking-wider">Comparative Matrix</span>
                  <div className="flex gap-2">
                    {selectedSpecies.map(id => (
                      <span key={id} className="px-3 py-1 bg-violet-900/30 text-violet-300 rounded text-sm italic border border-violet-500/30">
                        {speciesList.find(s => s.id === id)?.scientific_name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center py-4 border-b border-slate-800">
                  <span className="text-slate-400 font-mono text-sm uppercase tracking-wider">Active Evidence Layers</span>
                  <span className="text-emerald-400 font-bold">5 / 5 Supported</span>
                </div>
              </div>

              <button 
                onClick={beginDiscovery}
                className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold text-lg shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-3"
              >
                BEGIN DISCOVERY
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EvidenceToggle({ label, desc, active }: { label: string, desc: string, active: boolean }) {
  return (
    <div className="flex items-start gap-4 p-5 rounded-xl border border-slate-800 bg-navy-800/40">
      <div className={`mt-1 shrink-0 w-6 h-6 rounded border flex items-center justify-center ${active ? 'bg-cyan-500 border-cyan-400 text-navy-900' : 'border-slate-600'}`}>
        {active && <CheckCircle2 className="w-4 h-4" />}
      </div>
      <div>
        <h4 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
          {label}
          <Info className="w-4 h-4 text-slate-500" />
        </h4>
        <p className="text-sm text-slate-400">{desc}</p>
      </div>
    </div>
  );
}
