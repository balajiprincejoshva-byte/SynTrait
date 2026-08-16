/**
 * SynTrait
 * Comparative Genomics Platform for Agronomic Trait Discovery
 *
 * Author: Balaji Muthukumar
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Fingerprint, Activity, Network, Target, Scissors, Waves, ArrowRight } from 'lucide-react';

const AUTHOR_CORNER = (
  <div className="absolute bottom-8 right-12 z-50 text-[10px] font-mono text-cyan-500/50 uppercase tracking-widest border border-cyan-900/30 px-3 py-1.5 rounded-full bg-navy-900/80 backdrop-blur-sm shadow-[0_0_10px_rgba(6,182,212,0.1)]">
    SYNTRAIT · BALAJI MUTHUKUMAR
  </div>
);

export function PresentationMode() {
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);
  const [revealStep, setRevealStep] = useState(0);

  // Esc to exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') navigate('/');
      if (e.key === 'ArrowRight' || e.key === ' ') {
        if (slide === slides.length - 2 && revealStep < 3) {
          setRevealStep(s => s + 1);
        } else {
          setSlide(s => Math.min(s + 1, slides.length - 1));
          setRevealStep(0);
        }
      }
      if (e.key === 'ArrowLeft') {
        if (slide === slides.length - 2 && revealStep > 0) {
          setRevealStep(s => s - 1);
        } else {
          setSlide(s => Math.max(s - 1, 0));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, slide, revealStep]);

  const slides = [
    {
      title: "The Living Evidence Engine",
      subtitle: "Accelerating Crop Improvement",
      content: (
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <p className="text-3xl text-slate-300 leading-relaxed mb-12">
            SynTrait unifies comparative genomics, functional annotation, expression atlases, and experimental meta-ranking into a single cohesive discovery platform.
          </p>
          <div className="text-sm font-mono text-cyan-400 tracking-[0.3em] uppercase mt-8">
            Made by<br/>
            <span className="text-2xl font-bold text-white mt-2 block">Balaji Muthukumar</span>
          </div>
        </div>
      )
    },
    {
      title: "Live Discovery",
      subtitle: "Targeting Seed Shattering",
      content: (
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-32 h-32 rounded-full bg-cyan-900/50 border-4 border-cyan-500 flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(6,182,212,0.5)]">
            <Fingerprint className="w-16 h-16 text-cyan-400" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Investigating Seed Shattering</h2>
          <p className="text-2xl text-slate-400 max-w-2xl">
            A critical domestication trait across cereals. We will now query the expanded SynTrait engine to discover targets.
          </p>
        </div>
      )
    },
    {
      title: "Master Evidence Reveal",
      subtitle: "Highest Priority Target: LOC4325003",
      content: (
        <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
          <div className="flex justify-between items-end mb-4 border-b border-slate-700 pb-4">
            <div>
              <h3 className="text-5xl font-extrabold text-white">LOC4325003</h3>
              <p className="text-lg text-cyan-400 font-mono tracking-widest mt-2">Computationally Prioritized Target</p>
            </div>
            <button onClick={() => navigate('/candidates/LOC4325003')} className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold transition-all z-50 relative pointer-events-auto">
              EXPLORE CANDIDATE <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            {/* Biological Layer */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: revealStep >= 1 ? 1 : 0.1, y: 0 }}
              className={`p-8 rounded-2xl border transition-all ${revealStep >= 1 ? 'bg-navy-800 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.15)]' : 'bg-slate-900 border-slate-800'}`}
            >
              <div className="flex items-center gap-3 mb-6">
                <Network className={`w-8 h-8 ${revealStep >= 1 ? 'text-emerald-400' : 'text-slate-700'}`} />
                <h4 className={`text-xl font-bold ${revealStep >= 1 ? 'text-white' : 'text-slate-600'}`}>Biological</h4>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-emerald-500" initial={{ width: 0 }} animate={{ width: revealStep >= 1 ? '100%' : '0%' }} transition={{ duration: 1 }} />
                </div>
                <ul className={`text-sm font-mono space-y-2 ${revealStep >= 1 ? 'text-slate-300' : 'text-slate-700'}`}>
                  <li>✓ Orthology Inference</li>
                  <li>✓ Syntenic Mapping</li>
                  <li>✓ Evol. Constraint</li>
                  <li>✓ Domain Architecture</li>
                  <li>✓ Expression Atlas</li>
                </ul>
              </div>
            </motion.div>

            {/* Agronomic Layer */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: revealStep >= 2 ? 1 : 0.1, y: 0 }}
              className={`p-8 rounded-2xl border transition-all ${revealStep >= 2 ? 'bg-navy-800 border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.15)]' : 'bg-slate-900 border-slate-800'}`}
            >
              <div className="flex items-center gap-3 mb-6">
                <Fingerprint className={`w-8 h-8 ${revealStep >= 2 ? 'text-amber-400' : 'text-slate-700'}`} />
                <h4 className={`text-xl font-bold ${revealStep >= 2 ? 'text-white' : 'text-slate-600'}`}>Agronomic</h4>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-amber-500" initial={{ width: 0 }} animate={{ width: revealStep >= 2 ? '100%' : '0%' }} transition={{ duration: 1 }} />
                </div>
                <ul className={`text-sm font-mono space-y-2 ${revealStep >= 2 ? 'text-slate-300' : 'text-slate-700'}`}>
                  <li>✓ Trait Association</li>
                  <li>✓ Synteny-QTL Projection</li>
                </ul>
              </div>
            </motion.div>

            {/* Translational Layer */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: revealStep >= 3 ? 1 : 0.1, y: 0 }}
              className={`p-8 rounded-2xl border transition-all ${revealStep >= 3 ? 'bg-navy-800 border-fuchsia-500/50 shadow-[0_0_30px_rgba(217,70,239,0.15)]' : 'bg-slate-900 border-slate-800'}`}
            >
              <div className="flex items-center gap-3 mb-6">
                <Target className={`w-8 h-8 ${revealStep >= 3 ? 'text-fuchsia-400' : 'text-slate-700'}`} />
                <h4 className={`text-xl font-bold ${revealStep >= 3 ? 'text-white' : 'text-slate-600'}`}>Translational</h4>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-fuchsia-500" initial={{ width: 0 }} animate={{ width: revealStep >= 3 ? '100%' : '0%' }} transition={{ duration: 1 }} />
                </div>
                <div className={`space-y-3 ${revealStep >= 3 ? 'text-slate-300' : 'text-slate-700'}`}>
                  <div className="flex justify-between items-center bg-slate-900/50 p-2 rounded">
                    <span className="text-xs font-mono">Meta-Rank</span>
                    <span className="font-bold text-fuchsia-400">91.4</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-900/50 p-2 rounded">
                    <span className="text-xs font-mono">Editability</span>
                    <span className="font-bold text-lime-400 flex items-center gap-1"><Scissors className="w-3 h-3"/> HIGH</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-900/50 p-2 rounded">
                    <span className="text-xs font-mono">Pop Signal</span>
                    <span className="font-bold text-rose-400 flex items-center gap-1"><Waves className="w-3 h-3"/> DETECTED</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {revealStep < 3 && (
            <div className="text-center mt-8 animate-pulse text-cyan-400/50 font-mono text-sm">
              Press space to reveal next evidence layer...
            </div>
          )}
        </div>
      )
    },
    {
      title: "SYNTRAIT",
      subtitle: "Conclusion",
      content: (
        <div className="text-center max-w-4xl mx-auto space-y-12">
          <h2 className="text-4xl md:text-5xl font-light text-cyan-100 tracking-tight leading-relaxed">
            FROM GENOMIC EVIDENCE <br/>
            TO AGRONOMIC CANDIDATE DISCOVERY
          </h2>
          
          <div className="pt-12 mt-12 border-t border-cyan-900/50">
            <h3 className="text-sm font-mono text-cyan-500/80 tracking-widest uppercase mb-4">
              MADE BY
            </h3>
            <p className="text-3xl md:text-5xl font-bold text-white tracking-wide">
              BALAJI MUTHUKUMAR
            </p>
            <p className="text-lg text-slate-400 mt-4 tracking-widest uppercase">
              Comparative Genomics Platform
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 bg-navy-900 z-50 flex flex-col items-center justify-center overflow-hidden selection:bg-cyan-500/30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-navy-900 to-navy-900 pointer-events-none"></div>
      
      {AUTHOR_CORNER}

      <button onClick={() => navigate('/')} className="absolute top-8 right-8 p-4 text-slate-500 hover:text-white transition-colors z-50 pointer-events-auto">
        <X className="w-8 h-8" />
        <span className="sr-only">Exit</span>
      </button>

      <div className="absolute top-8 left-8 flex items-center gap-4 z-50">
        <Activity className="w-8 h-8 text-cyan-400" />
        <div>
          <h1 className="font-bold text-2xl text-white tracking-wider glow-text">SYNTRAIT</h1>
          <p className="text-xs text-cyan-400/70 font-mono uppercase tracking-widest">Presentation Mode</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={slide}
          initial={{ opacity: 0, x: 100, filter: 'blur(10px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, x: -100, filter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full px-20 flex flex-col items-center pointer-events-none"
        >
          {slide < slides.length - 1 && (
            <h2 className="text-2xl md:text-3xl font-mono text-cyan-400 uppercase tracking-[0.2em] mb-4 text-center">
              {slides[slide].subtitle}
            </h2>
          )}
          {slide < slides.length - 1 && (
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-16 text-center tracking-tight">
              {slides[slide].title}
            </h1>
          )}
          
          <div className="w-full">
            {slides[slide].content}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-4 z-50 pointer-events-none">
        {slides.map((_, i) => (
          <div 
            key={i} 
            className={`h-2 rounded-full transition-all duration-500 ${i === slide ? 'w-16 bg-cyan-400 shadow-[0_0_10px_#22d3ee]' : 'w-4 bg-slate-800'}`}
          />
        ))}
      </div>
    </div>
  );
}
