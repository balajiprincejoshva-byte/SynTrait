/**
 * SynTrait
 * Comparative Genomics Platform for Agronomic Trait Discovery
 *
 * Author: Balaji Muthukumar
 */
import { Link, useLocation } from 'react-router-dom';
import { Activity, LayoutDashboard, Dna, PlayCircle, Compass, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export function Sidebar() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Overview', icon: LayoutDashboard },
    { path: '/discover', label: 'Discover', icon: Compass },
    { path: '/candidates', label: 'Candidates', icon: Dna },
    { path: '/analyses', label: 'Analyses', icon: Activity },
    { path: '/provenance', label: 'Provenance', icon: Info },
    { path: '/about', label: 'About', icon: Info },
  ];

  return (
    <motion.div 
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="w-64 glass-panel border-r border-cyan-900/30 flex flex-col z-10"
    >
      <div className="flex items-center gap-3 mb-10 p-6">
        <div className="relative">
          <Activity className="text-cyan-400 h-8 w-8 relative z-10" />
          <div className="absolute inset-0 bg-cyan-400 blur-md opacity-40"></div>
        </div>
        <div>
          <h1 className="font-bold text-xl text-white tracking-wider glow-text">SYNTRAIT</h1>
          <p className="text-[10px] text-cyan-400/70 font-mono uppercase tracking-widest">v1.0 Genomics</p>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-4 pl-2">Navigation</div>
        {navItems.map(item => {
          const isActive = location.pathname === item.path || (location.pathname.startsWith('/candidates/') && item.path === '/candidates');
          return (
            <Link 
              key={item.path}
              to={item.path} 
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 font-medium text-sm
                ${isActive 
                  ? 'bg-cyan-900/40 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              {item.label}
              {isActive && (
                <motion.div layoutId="active-indicator" className="absolute left-0 w-1 h-8 bg-cyan-400 rounded-r-full shadow-[0_0_10px_#22d3ee]" />
              )}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 mt-auto">
        <Link 
          to="/presentation"
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 mb-4 border bg-violet-900/40 text-violet-300 border-violet-500/50 shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:bg-violet-900/60"
        >
          <PlayCircle className="w-4 h-4" />
          Presentation Mode
        </Link>

        <div className="p-4 bg-navy-900/60 rounded-xl border border-slate-800 shadow-inner">
          <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">System Core</h3>
          <div className="flex items-center gap-3 text-xs font-medium text-emerald-400">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
            </div>
            Backend Uplink Active
          </div>
        </div>

        <div className="mt-6 text-center text-[10px] text-slate-500 font-mono tracking-widest uppercase pb-2 border-t border-slate-800/50 pt-4">
          Made by Balaji Muthukumar
        </div>
      </div>
    </motion.div>
  );
}
