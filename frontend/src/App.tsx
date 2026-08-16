/**
 * SynTrait
 * Comparative Genomics Platform for Agronomic Trait Discovery
 *
 * Author: Balaji Muthukumar
 */
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { CandidateCards } from './components/CandidateCards';
import { CandidateDetail } from './components/CandidateDetail';
import { DiscoverySetup } from './components/DiscoverySetup';
import { Analyses } from './components/Analyses';
import { Provenance } from './components/Provenance';
import { PresentationMode } from './components/PresentationMode';
import { About } from './components/About';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const isPresentation = location.pathname === '/presentation';

  return (
    <div className="flex h-screen bg-navy-900 text-slate-200 overflow-hidden relative font-sans selection:bg-cyan-500/30">
      
      {/* Animated Global Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern opacity-30 mix-blend-screen"></div>
        <motion.div 
          className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-cyan-900/10 rounded-full blur-[120px]"
          animate={{ 
            x: [0, 50, 0], 
            y: [0, 30, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-emerald-900/10 rounded-full blur-[100px]"
          animate={{ 
            x: [0, -40, 0], 
            y: [0, -20, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {!isPresentation && <Sidebar />}
      
      <main className="flex-1 overflow-y-auto relative z-10 custom-scrollbar">
        <AnimatedRoutes />
      </main>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Dashboard /></PageWrapper>} />
        <Route path="/discover" element={<PageWrapper><DiscoverySetup /></PageWrapper>} />
        <Route path="/candidates" element={<PageWrapper><CandidateCards /></PageWrapper>} />
        <Route path="/candidates/:id" element={<PageWrapper><CandidateDetail /></PageWrapper>} />
        <Route path="/analyses" element={<PageWrapper><Analyses /></PageWrapper>} />
        <Route path="/provenance" element={<PageWrapper><Provenance /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
        <Route path="/presentation" element={<PageWrapper><PresentationMode /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      exit={{ opacity: 0, filter: "blur(10px)", y: -10 }}
      transition={{ duration: 0.4 }}
      className="min-h-full"
    >
      {children}
    </motion.div>
  );
}

export default App;
