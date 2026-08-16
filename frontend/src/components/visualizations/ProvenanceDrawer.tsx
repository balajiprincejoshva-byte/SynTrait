/**
 * SynTrait
 * Comparative Genomics Platform for Agronomic Trait Discovery
 *
 * Author: Balaji Muthukumar
 */
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X, Database, Terminal, CheckCircle2 } from 'lucide-react';

export function ProvenanceDrawer({ isOpen, onClose, candidate }: { isOpen: boolean, onClose: () => void, candidate: any }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-navy-900/80 backdrop-blur-sm z-40"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full md:w-[500px] bg-slate-900 border-l border-slate-700 z-50 overflow-y-auto custom-scrollbar flex flex-col shadow-2xl"
          >
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-navy-900 sticky top-0 z-10">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Info className="w-5 h-5 text-cyan-400" />
                Data Provenance
              </h2>
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-8 flex-1">
              <div>
                <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-4">Entity Identity</h3>
                <div className="bg-navy-800 p-4 rounded-xl border border-slate-700 space-y-3">
                  <ProvenanceItem label="Accession ID" value={candidate?.candidate_gene_id} />
                  <ProvenanceItem label="Source Database" value="NCBI RefSeq" />
                  <ProvenanceItem label="Entity Type" value="Protein-Coding Gene" />
                </div>
              </div>

              <div>
                <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-4">Analysis Lineage</h3>
                <div className="space-y-4">
                  <AnalysisStep 
                    name="Orthology Inference"
                    tool="OrthoFinder v2.5.5"
                    status="Complete"
                    db="Tier-1 Proteomes"
                  />
                  <AnalysisStep 
                    name="Synteny Mapping"
                    tool="MCScan (JCVI) v1.3"
                    status="Complete"
                    db="Genomic GFFs"
                  />
                  <AnalysisStep 
                    name="Evolutionary Constraint"
                    tool="KaKs_Calculator v3.0"
                    status="Complete"
                    db="Multiple Sequence Alignments"
                  />
                  <AnalysisStep 
                    name="Protein Domain Annotation"
                    tool="HMMER hmmsearch v3.3.2"
                    status="Complete"
                    db="Pfam-A Database"
                  />
                  <AnalysisStep 
                    name="Expression Evidence"
                    tool="Ensembl / EBI Atlas"
                    status="Complete"
                    db="RNA-Seq Compendia"
                  />
                  <AnalysisStep 
                    name="Experimental Meta-Ranker"
                    tool="L2 Logistic Regression (LOOCV)"
                    status="Complete"
                    db="Benchmark Set"
                  />
                  <AnalysisStep 
                    name="CRISPR Editability"
                    tool="Exonic NGG Heuristic"
                    status="Complete"
                    db="Reference CDS"
                  />
                  <AnalysisStep 
                    name="Population Selection Signal"
                    tool="scikit-allel (Heuristic)"
                    status="Complete"
                    db="Variant VCFs"
                  />
                </div>
              </div>

              <div className="mt-8 p-4 bg-cyan-900/20 border border-cyan-500/30 rounded-xl">
                <p className="text-xs text-cyan-400/80 leading-relaxed">
                  This provenance record ensures complete scientific reproducibility for all generated candidate prioritization scores.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ProvenanceItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-slate-400">{label}</span>
      <span className="text-white font-mono">{value}</span>
    </div>
  );
}

function AnalysisStep({ name, tool, status, db }: any) {
  const isComplete = status === 'Complete';
  return (
    <div className="bg-navy-800 p-4 rounded-xl border border-slate-700 flex gap-4">
      <div className="mt-1">
        {isComplete ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Terminal className="w-5 h-5 text-violet-400" />}
      </div>
      <div>
        <h4 className="text-sm font-bold text-white mb-1">{name}</h4>
        <div className="text-xs text-slate-400 mb-2 font-mono">{tool}</div>
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] text-slate-300">
          <Database className="w-3 h-3" /> {db}
        </div>
      </div>
    </div>
  );
}
