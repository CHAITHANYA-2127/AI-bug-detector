import React from 'react';
import { useBugContext } from '@/context';
import { SeverityBadge, StatusBadge } from '@/components/common/Badge';
import { 
  Bug, 
  AlertCircle, 
  Wrench, 
  FlaskConical, 
  ShieldCheck, 
  Sparkles, 
  ArrowUpRight, 
  Plus, 
  Cpu, 
  Clock, 
  ExternalLink,
  Zap,
  BarChart3,
  CheckCircle2
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { 
    bugs, 
    stats, 
    insights, 
    selectBugAndNavigate, 
    setActiveView, 
    setLiveDemoModalOpen 
  } = useBugContext();

  const statCards = [
    {
      title: 'Total Bugs',
      value: stats.totalBugs,
      icon: Bug,
      color: 'text-brand-400',
      border: 'border-brand-500/20',
      bg: 'bg-brand-950/10'
    },
    {
      title: 'Critical',
      value: stats.criticalBugs,
      icon: AlertCircle,
      color: 'text-rose-400',
      border: 'border-rose-500/30',
      bg: 'bg-rose-950/15'
    },
    {
      title: 'Open',
      value: stats.openBugs,
      icon: Clock,
      color: 'text-blue-400',
      border: 'border-blue-500/20',
      bg: 'bg-blue-950/10'
    },
    {
      title: 'Fixes Generated',
      value: stats.fixesGenerated,
      icon: Wrench,
      color: 'text-purple-400',
      border: 'border-purple-500/20',
      bg: 'bg-purple-950/10'
    },
    {
      title: 'Tests Generated',
      value: stats.testsGenerated,
      icon: FlaskConical,
      color: 'text-amber-400',
      border: 'border-amber-500/20',
      bg: 'bg-amber-950/10'
    },
    {
      title: 'Verified',
      value: stats.verifiedFixes,
      icon: ShieldCheck,
      color: 'text-emerald-400',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-950/20'
    }
  ];

  return (
    <div className="space-y-8 py-4">
      {/* Header bar with Branding & Supporting line */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-dark-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
              AI BUG <span className="text-brand-400">DETECTOR</span>
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-500/10 text-brand-300 border border-brand-500/30 uppercase">
              Developer Studio
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            AI-powered bug analysis, fix suggestions, test generation, and verification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLiveDemoModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-dark-900 hover:bg-dark-850 text-brand-300 font-semibold text-xs border border-brand-500/40 shadow-sm transition-all hover:scale-105"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>⚡ Presentation Mode</span>
          </button>

          <button
            onClick={() => setActiveView('report')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-dark-950 font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Report Bug</span>
          </button>
        </div>
      </div>

      {/* 6 Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map((sc) => {
          const Icon = sc.icon;
          return (
            <div
              key={sc.title}
              className={`p-4 rounded-2xl border ${sc.border} ${sc.bg} bg-dark-900/60 backdrop-blur-sm flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-slate-400 truncate">{sc.title}</span>
                <div className={`p-1.5 rounded-lg bg-dark-850 ${sc.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-white font-mono tracking-tight">
                {sc.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Engineering Insights Section */}
      <div className="rounded-2xl border border-brand-500/30 bg-gradient-to-br from-brand-950/30 via-dark-900/90 to-dark-950 p-5 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-brand-500/20 text-brand-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                AI Priority Insights
                <span className="px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-300 border border-brand-500/30 text-[10px] font-mono uppercase">
                  Automated Synthesis
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Symptom correlations & risk assessments across active reports</p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-slate-500">Live Heuristics</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {insights.map((ins) => (
            <div
              key={ins.id}
              className="p-3.5 rounded-xl bg-dark-950/70 border border-dark-800 flex flex-col justify-between space-y-2 hover:border-dark-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-200 mb-1">
                  <span className="truncate">{ins.title}</span>
                  {ins.type === 'warning' ? (
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  )}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{ins.message}</p>
              </div>

              {ins.relatedBugIds && ins.relatedBugIds.length > 0 && (
                <div className="pt-2 border-t border-dark-850 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-slate-500 font-mono">Related:</span>
                  {ins.relatedBugIds.map((id) => (
                    <button
                      key={id}
                      onClick={() => selectBugAndNavigate(id, 'analysis')}
                      className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-dark-800 text-brand-300 hover:bg-dark-700 border border-dark-700 transition-colors"
                    >
                      {id}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Severity & Status Distribution Breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Severity Distribution */}
        <div className="p-5 rounded-2xl bg-dark-900 border border-dark-750 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-rose-400" />
              Severity Distribution
            </span>
            <span className="text-slate-500 font-mono text-[10px]">Triage Breakdown</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-rose-300 font-medium">Critical</span>
              <span className="font-mono text-slate-300">{stats.severityCounts.Critical}</span>
            </div>
            <div className="h-1.5 w-full bg-dark-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-500 rounded-full"
                style={{ width: `${(stats.severityCounts.Critical / Math.max(stats.totalBugs, 1)) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-amber-300 font-medium">High</span>
              <span className="font-mono text-slate-300">{stats.severityCounts.High}</span>
            </div>
            <div className="h-1.5 w-full bg-dark-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${(stats.severityCounts.High / Math.max(stats.totalBugs, 1)) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-blue-300 font-medium">Medium</span>
              <span className="font-mono text-slate-300">{stats.severityCounts.Medium}</span>
            </div>
            <div className="h-1.5 w-full bg-dark-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${(stats.severityCounts.Medium / Math.max(stats.totalBugs, 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="p-5 rounded-2xl bg-dark-900 border border-dark-750 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Remediation Pipeline Status
            </span>
            <span className="text-slate-500 font-mono text-[10px]">Lifecycle</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-emerald-300 font-medium">Verified in Sandbox</span>
              <span className="font-mono text-slate-300">{stats.statusCounts.Verified}</span>
            </div>
            <div className="h-1.5 w-full bg-dark-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full"
                style={{ width: `${(stats.statusCounts.Verified / Math.max(stats.totalBugs, 1)) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-purple-300 font-medium">Fix Suggested</span>
              <span className="font-mono text-slate-300">{stats.statusCounts['Fix Suggested']}</span>
            </div>
            <div className="h-1.5 w-full bg-dark-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full"
                style={{ width: `${(stats.statusCounts['Fix Suggested'] / Math.max(stats.totalBugs, 1)) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-blue-300 font-medium">Open / Intake</span>
              <span className="font-mono text-slate-300">{stats.statusCounts.Open}</span>
            </div>
            <div className="h-1.5 w-full bg-dark-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-400 rounded-full"
                style={{ width: `${(stats.statusCounts.Open / Math.max(stats.totalBugs, 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bugs Table */}
      <div className="rounded-2xl border border-dark-750 bg-dark-900/90 overflow-hidden shadow-xl backdrop-blur-md">
        <div className="px-6 py-4 border-b border-dark-750 bg-dark-850/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white">Recent Bugs & Remediation Pipeline</h3>
            <p className="text-xs text-slate-400">Click any bug to view AI root-cause analysis, diffs, or tests</p>
          </div>
          <button
            onClick={() => setActiveView('history')}
            className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            <span>View All ({bugs.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-950/80 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-dark-800">
              <tr>
                <th className="py-3 px-4">Bug ID</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">AI Confidence</th>
                <th className="py-3 px-4 text-right">Updated</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800 text-slate-300 font-sans">
              {bugs.slice(0, 6).map((bug) => {
                const confidence = bug.analysis?.confidenceScore ?? (bug.severity === 'Critical' ? 95 : 88);

                return (
                  <tr
                    key={bug.id}
                    className="hover:bg-dark-850/50 transition-colors cursor-pointer group"
                    onClick={() => selectBugAndNavigate(bug.id, bug.fix ? 'fix' : 'analysis')}
                  >
                    <td className="py-3.5 px-4 font-mono font-semibold text-brand-300 whitespace-nowrap">
                      {bug.id}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs sm:max-w-sm truncate font-medium text-white group-hover:text-brand-300 transition-colors">
                      {bug.title}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <SeverityBadge severity={bug.severity} />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-slate-400">
                      {bug.category}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={bug.status} />
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1 font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
                        <Zap className="w-3 h-3 text-cyan-400" />
                        <span>{confidence}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono text-slate-500">
                      {new Date(bug.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          selectBugAndNavigate(bug.id, 'analysis');
                        }}
                        className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-dark-750 transition-colors"
                        title="View Analysis"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
