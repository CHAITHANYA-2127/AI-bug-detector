import React, { useState } from 'react';
import { useBugContext } from '@/context';
import { SeverityBadge, StatusBadge } from '@/components/common/Badge';
import { BugRecord, Severity, BugStatus, Category } from '@/types';
import { 
  Search, 
  Filter, 
  Clock, 
  ArrowRight, 
  ExternalLink, 
  CheckCircle2, 
  Cpu, 
  Wrench, 
  FlaskConical, 
  ShieldCheck, 
  X,
  History as HistoryIcon
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const { bugs, selectBugAndNavigate } = useBugContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Bug timeline modal inspection
  const [timelineBug, setTimelineBug] = useState<BugRecord | null>(null);

  const severities: Severity[] = ['Critical', 'High', 'Medium', 'Low'];
  const statuses: BugStatus[] = ['Open', 'Analyzing', 'Fix Suggested', 'Testing', 'Verified', 'Closed'];
  const categories: Category[] = [
    'Frontend / UI',
    'Backend / API',
    'Authentication',
    'Payment / Cart',
    'State Management',
    'Database / ORM'
  ];

  const filteredBugs = bugs.filter((b) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        b.id.toLowerCase().includes(q) ||
        b.title.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (selectedSeverity !== 'all' && b.severity !== selectedSeverity) return false;
    if (selectedStatus !== 'all' && b.status !== selectedStatus) return false;
    if (selectedCategory !== 'all' && b.category !== selectedCategory) return false;

    return true;
  });

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-brand-400 mb-1">
          <HistoryIcon className="w-4 h-4" />
          <span>Historical Audit & Telemetry</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Bug Records & Timeline History
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Search, filter, and trace the complete lifecycle progression from initial report to verified deployment clearance.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 rounded-2xl bg-dark-900 border border-dark-750 space-y-3 shadow-md">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by bug ID (BUG-1002), title, symptoms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-dark-950 border border-dark-750 focus:border-brand-500 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-600 outline-none"
            />
          </div>

          {/* Severity Filter */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-dark-950 border border-dark-750 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none focus:border-brand-500"
          >
            <option value="all">All Severities</option>
            {severities.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-dark-950 border border-dark-750 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none focus:border-brand-500"
          >
            <option value="all">All Statuses</option>
            {statuses.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-dark-950 border border-dark-750 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none focus:border-brand-500"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {(searchQuery || selectedSeverity !== 'all' || selectedStatus !== 'all' || selectedCategory !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSeverity('all');
                setSelectedStatus('all');
                setSelectedCategory('all');
              }}
              className="px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-950/30 transition-colors whitespace-nowrap"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Bug Table */}
      <div className="rounded-2xl border border-dark-750 bg-dark-900/90 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-950 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-dark-800">
              <tr>
                <th className="py-3 px-4">Bug ID</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Lifecycle</th>
                <th className="py-3 px-4 text-right">Reported</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800 text-slate-300 font-sans">
              {filteredBugs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No matching bug reports found.
                  </td>
                </tr>
              ) : (
                filteredBugs.map((bug) => {
                  const hasAnalysis = !!bug.analysis;
                  const hasFix = !!bug.fix;
                  const hasTests = (bug.testCases?.length || 0) > 0;
                  const hasVerification = bug.verification?.status === 'PASSED' || bug.verification?.status === 'VERIFIED IN DEMO';

                  return (
                    <tr
                      key={bug.id}
                      onClick={() => setTimelineBug(bug)}
                      className="hover:bg-dark-850/50 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-300 whitespace-nowrap">
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
                        {/* 6-Stage Micro Lifecycle Indicators */}
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-dark-950 border border-dark-800">
                          <span title="Bug Reported" className="w-2 h-2 rounded-full bg-rose-400" />
                          <span title={hasAnalysis ? 'Analyzed' : 'Pending Analysis'} className={`w-2 h-2 rounded-full ${hasAnalysis ? 'bg-cyan-400' : 'bg-slate-700'}`} />
                          <span title={hasFix ? 'Fix Synthesized' : 'Pending Fix'} className={`w-2 h-2 rounded-full ${hasFix ? 'bg-purple-400' : 'bg-slate-700'}`} />
                          <span title={hasTests ? 'Tests Generated' : 'Pending Tests'} className={`w-2 h-2 rounded-full ${hasTests ? 'bg-amber-400' : 'bg-slate-700'}`} />
                          <span title={hasVerification ? 'Verified' : 'Pending Verification'} className={`w-2 h-2 rounded-full ${hasVerification ? 'bg-emerald-400' : 'bg-slate-700'}`} />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono text-slate-500">
                        {new Date(bug.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            selectBugAndNavigate(bug.id, bug.fix ? 'fix' : 'analysis');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-dark-800 hover:bg-dark-750 text-brand-300 font-medium text-xs border border-dark-750 transition-colors"
                        >
                          Open
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Bug Timeline Modal */}
      {timelineBug && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-dark-900 border border-dark-750 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-dark-750 bg-dark-850">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-bold text-brand-300">
                  {timelineBug.id}
                </span>
                <span className="text-sm font-bold text-white truncate max-w-md">
                  {timelineBug.title}
                </span>
              </div>
              <button
                onClick={() => setTimelineBug(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Remediation Progression Timeline
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-dark-750">
                {/* 1. Bug Reported */}
                <div className="relative">
                  <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-rose-500 ring-4 ring-dark-900" />
                  <div className="p-3 rounded-xl bg-dark-950 border border-dark-800 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-white">Bug Reported & Symptoms Logged</span>
                      <span className="font-mono text-slate-500 text-[10px]">
                        {new Date(timelineBug.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-slate-400">{timelineBug.description}</p>
                  </div>
                </div>

                {/* 2. AI Analyzed */}
                <div className="relative">
                  <div className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full ${
                    timelineBug.analysis ? 'bg-cyan-400' : 'bg-slate-700'
                  } ring-4 ring-dark-900`} />
                  <div className="p-3 rounded-xl bg-dark-950 border border-dark-800 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-white">AI Analysis & Probable Cause</span>
                      {timelineBug.analysis && (
                        <span className="font-mono text-cyan-400 text-[10px]">
                          Confidence: {timelineBug.analysis.confidenceScore}%
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400">
                      {timelineBug.analysis?.probableRootCause || 'Pending analysis execution.'}
                    </p>
                  </div>
                </div>

                {/* 3. Fix Suggested */}
                <div className="relative">
                  <div className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full ${
                    timelineBug.fix ? 'bg-purple-400' : 'bg-slate-700'
                  } ring-4 ring-dark-900`} />
                  <div className="p-3 rounded-xl bg-dark-950 border border-dark-800 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-white">Defensive Fix Synthesized</span>
                      {timelineBug.fix && (
                        <span className="font-mono text-purple-400 text-[10px]">
                          {timelineBug.fix.fixId}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400">
                      {timelineBug.fix?.summary || 'Pending code fix generation.'}
                    </p>
                  </div>
                </div>

                {/* 4. Tests Generated */}
                <div className="relative">
                  <div className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full ${
                    (timelineBug.testCases?.length || 0) > 0 ? 'bg-amber-400' : 'bg-slate-700'
                  } ring-4 ring-dark-900`} />
                  <div className="p-3 rounded-xl bg-dark-950 border border-dark-800 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-white">Test Suites Created</span>
                      <span className="font-mono text-amber-400 text-[10px]">
                        {timelineBug.testCases?.length || 0} Test Scenarios
                      </span>
                    </div>
                    <p className="text-slate-400">
                      Reproduction, happy path, negative, edge, and regression testing matrix prepared.
                    </p>
                  </div>
                </div>

                {/* 5. Verification */}
                <div className="relative">
                  <div className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full ${
                    timelineBug.verification?.status === 'PASSED' || timelineBug.verification?.status === 'VERIFIED IN DEMO' ? 'bg-emerald-400' : 'bg-slate-700'
                  } ring-4 ring-dark-900`} />
                  <div className="p-3 rounded-xl bg-dark-950 border border-dark-800 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-white">Fix Verification & Coverage</span>
                      <span className="font-mono text-emerald-400 text-[10px]">
                        {timelineBug.verification?.status || 'NOT RUN'}
                      </span>
                    </div>
                    <p className="text-slate-400">
                      {timelineBug.verification?.verificationNotes || 'Awaiting test execution.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-dark-850 border-t border-dark-750 flex justify-end gap-3">
              <button
                onClick={() => setTimelineBug(null)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const id = timelineBug.id;
                  setTimelineBug(null);
                  selectBugAndNavigate(id, 'analysis');
                }}
                className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-dark-950 font-bold text-xs"
              >
                Open Full Bug Studio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
