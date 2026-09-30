import React from 'react';
import { useBugContext } from '@/context';
import { 
  Bug, 
  Wrench, 
  Zap, 
  Settings, 
  Sparkles,
  Layers,
  ChevronDown,
  Play
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    setActiveView, 
    setLiveDemoModalOpen, 
    setSettingsModalOpen, 
    isDemoMode,
    bugs,
    activeBugId,
    setActiveBugId
  } = useBugContext();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-dark-800 bg-dark-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Logo: Bug + Wrench */}
        <div 
          onClick={() => setActiveView('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 via-cyan-400 to-indigo-600 p-0.5 shadow-[0_0_20px_rgba(6,182,212,0.35)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all">
            <div className="w-full h-full bg-dark-950 rounded-[10px] flex items-center justify-center relative">
              <Bug className="w-5 h-5 text-brand-400 group-hover:scale-110 transition-transform" />
              <Wrench className="w-3.5 h-3.5 text-emerald-400 absolute -bottom-0.5 -right-0.5" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-tight text-white font-mono">
                AI BUG <span className="text-brand-400">DETECTOR</span>
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-bold tracking-wide uppercase bg-brand-500/10 text-brand-300 border border-brand-500/30 rounded">
                PROMPT TO PROD
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">From Bug Report to Verified Fix</p>
          </div>
        </div>

        {/* Center: Active Bug Selector (Quick Switcher) */}
        <div className="hidden md:flex items-center gap-2">
          <div className="relative">
            <select
              value={activeBugId || ''}
              onChange={(e) => setActiveBugId(e.target.value)}
              className="appearance-none bg-dark-900 border border-dark-750 hover:border-dark-700 text-xs text-slate-300 rounded-xl pl-3 pr-8 py-1.5 focus:outline-none focus:border-brand-500 font-mono transition-colors cursor-pointer"
            >
              {bugs.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.id}: {b.title.slice(0, 32)}...
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Demo Mode / Live API indicator */}
          <button
            onClick={() => setSettingsModalOpen(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border transition-all ${
              isDemoMode
                ? 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:bg-amber-950/60'
                : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/60'
            }`}
            title="Click to view AI configuration"
          >
            <Zap className="w-3 h-3 text-amber-400" />
            <span className="font-bold">{isDemoMode ? 'DEMO MODE' : 'LIVE API'}</span>
          </button>

          {/* Presentation Mode / ⚡ Live AI Demo Button (Hackathon Hero CTA) */}
          <button
            onClick={() => setLiveDemoModalOpen(true)}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-400 hover:to-indigo-500 text-dark-950 font-black text-xs sm:text-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:scale-105 active:scale-95"
            title="Launch 2-Minute Presentation Demo"
          >
            <Sparkles className="w-4 h-4 fill-dark-950" />
            <span>⚡ Presentation Mode</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={() => setSettingsModalOpen(true)}
            className="p-2 rounded-xl bg-dark-900 hover:bg-dark-850 text-slate-400 hover:text-white border border-dark-750 transition-colors"
            title="Settings & API Key"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
