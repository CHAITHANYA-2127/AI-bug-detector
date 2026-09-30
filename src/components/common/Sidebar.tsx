import React from 'react';
import { useBugContext, PageView } from '@/context';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Cpu, 
  Wrench, 
  FlaskConical, 
  ShieldCheck, 
  History, 
  Sparkles, 
  Layers,
  Home
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, stats, setLiveDemoModalOpen } = useBugContext();

  const navItems: {
    id: PageView;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number | string;
    badgeColor?: string;
  }[] = [
    {
      id: 'landing',
      label: 'Home / Overview',
      icon: Home
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: stats.totalBugs,
      badgeColor: 'bg-dark-800 text-slate-300'
    },
    {
      id: 'report',
      label: 'Report Bug',
      icon: PlusCircle
    },
    {
      id: 'analysis',
      label: 'AI Analysis',
      icon: Cpu,
      badge: stats.openBugs > 0 ? stats.openBugs : undefined,
      badgeColor: 'bg-cyan-950 text-cyan-300 border border-cyan-800/60'
    },
    {
      id: 'fix',
      label: 'Fixes',
      icon: Wrench,
      badge: stats.fixesGenerated > 0 ? stats.fixesGenerated : undefined,
      badgeColor: 'bg-purple-950 text-purple-300 border border-purple-800/60'
    },
    {
      id: 'tests',
      label: 'Test Cases',
      icon: FlaskConical,
      badge: stats.testsGenerated > 0 ? stats.testsGenerated : undefined,
      badgeColor: 'bg-amber-950 text-amber-300 border border-amber-800/60'
    },
    {
      id: 'verification',
      label: 'Verification',
      icon: ShieldCheck,
      badge: stats.verifiedFixes > 0 ? stats.verifiedFixes : undefined,
      badgeColor: 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
    },
    {
      id: 'history',
      label: 'Bug History',
      icon: History
    },
    {
      id: 'pipeline',
      label: 'Prompt to Production',
      icon: Layers,
      badge: 'Architecture',
      badgeColor: 'bg-indigo-950 text-indigo-300 border border-indigo-800/60'
    }
  ];

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col border-r border-dark-800 bg-dark-950/60 p-4 space-y-6">
      {/* Navigation Links */}
      <div className="space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-brand-500/10 text-brand-300 border border-brand-500/30 font-semibold shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-dark-900 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-brand-400' : 'text-slate-500 group-hover:text-slate-300'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`px-2 py-0.5 text-[11px] font-mono rounded-full font-medium ${
                    item.badgeColor || 'bg-dark-800 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Live AI Demo Hackathon Box */}
      <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-brand-950/80 via-dark-900 to-indigo-950/60 border border-brand-500/30 shadow-xl relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-brand-500/10 rounded-full blur-xl group-hover:bg-brand-500/20 transition-colors pointer-events-none" />
        <div className="flex items-center gap-2 text-brand-300 font-bold text-xs uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          Hackathon Presentation
        </div>
        <p className="text-xs text-slate-300 mb-3 leading-relaxed">
          Walk through the full 6-stage pipeline in 2 minutes with judge presets.
        </p>
        <button
          onClick={() => setLiveDemoModalOpen(true)}
          className="w-full py-2 px-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-dark-950 font-bold text-xs transition-transform active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2"
        >
          <span>Launch Live Demo</span>
          <span className="text-[10px] bg-dark-950/20 px-1.5 py-0.5 rounded">⚡</span>
        </button>
      </div>
    </aside>
  );
};
