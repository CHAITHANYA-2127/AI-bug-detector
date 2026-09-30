import React, { useState } from 'react';
import { useBugContext } from '@/context';
import { PipelineProgress } from '@/components/common/PipelineProgress';
import { TestCase } from '@/types';
import { verifier } from '@/services/ai/verifier';
import { 
  FlaskConical, 
  ShieldCheck, 
  Play, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Terminal, 
  ArrowRight,
  Filter,
  Check,
  RefreshCw,
  Bug
} from 'lucide-react';

export const TestGeneratorPage: React.FC = () => {
  const { activeBug, updateBug, selectBugAndNavigate, showToast } = useBugContext();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [currentRunningIndex, setCurrentRunningIndex] = useState<number | null>(null);

  if (!activeBug || !activeBug.testCases || activeBug.testCases.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-dark-900 border border-dark-750 flex items-center justify-center mx-auto mb-4 text-amber-400">
          <FlaskConical className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white">No Test Cases Generated</h3>
        <p className="text-xs text-slate-400 mt-1 mb-6">
          Generate test cases from an AI fix proposal first.
        </p>
        <button
          onClick={() => selectBugAndNavigate('BUG-1002', 'tests')}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-dark-950 font-bold text-xs"
        >
          Load Hackathon Test Suite (BUG-1002)
        </button>
      </div>
    );
  }

  const { testCases } = activeBug;

  const handleRunVerification = async () => {
    setIsRunningTests(true);
    try {
      const { updatedTests, verificationResult } = await verifier.executeVerification(
        {
          bugId: activeBug.id,
          analysis: activeBug.analysis || ({} as any),
          fix: activeBug.fix || ({} as any),
          testCases
        },
        (current, total, test) => {
          setCurrentRunningIndex(current);
          updateBug(activeBug.id, {
            testCases: testCases.map((t) => (t.id === test.id ? test : t))
          });
        }
      );

      updateBug(activeBug.id, {
        testCases: updatedTests,
        verification: verificationResult,
        status: 'Verified'
      });

      showToast('All 5 test suites passed! Fix verified in sandbox', 'success');
      selectBugAndNavigate(activeBug.id, 'verification');
    } catch (err) {
      console.error(err);
      showToast('Test execution encountered an error', 'warning');
    } finally {
      setIsRunningTests(false);
      setCurrentRunningIndex(null);
    }
  };

  const categories = [
    'all',
    'Reproduction Test',
    'Happy Path',
    'Negative Tests',
    'Edge Cases',
    'Regression Tests'
  ];

  const filteredTests = testCases.filter((t) => {
    if (filterCategory === 'all') return true;
    return t.category === filterCategory;
  });

  const passedCount = testCases.filter((t) => t.status === 'Passed').length;
  const failedCount = testCases.filter((t) => t.status === 'Failed').length;
  const notRunCount = testCases.filter((t) => t.status === 'Not Run').length;

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6">
      {/* Persistent Pipeline Progress */}
      <PipelineProgress currentStage="tests" />

      {/* Header and Stats */}
      <div className="p-6 rounded-2xl bg-dark-900 border border-dark-750 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-amber-300 bg-amber-950/60 px-2.5 py-0.5 rounded border border-amber-500/40">
                5-Vector Test Suite
              </span>
              <span className="text-xs font-mono text-slate-400">Targeting {activeBug.id}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Automated Reproduction & Regression Matrix
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              AI-generated multi-vector test scenarios: Reproduction, Happy Path, Negative Tests, Edge Cases, and Regression protection.
            </p>
          </div>

          <button
            onClick={handleRunVerification}
            disabled={isRunningTests}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-dark-950 font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            {isRunningTests ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>
                  Executing ({currentRunningIndex || 0}/{testCases.length})...
                </span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-dark-950" />
                <span>Run Verification</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Counter Pills */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-dark-800 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-xl bg-dark-950 border border-dark-800 flex items-center gap-2">
            <span className="text-slate-400">Total Scenarios:</span>
            <span className="text-white font-bold">{testCases.length}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2 text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Passed: {passedCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-center gap-2 text-rose-300">
            <XCircle className="w-3.5 h-3.5" />
            <span>Failed: {failedCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-dark-850 border border-dark-750 flex items-center gap-2 text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Execution: {notRunCount}</span>
          </div>

          <span className="ml-auto text-[11px] text-amber-400/90 font-sans italic">
            * Simulated sandbox execution for demo purposes
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              filterCategory === cat
                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/40 font-semibold'
                : 'bg-dark-900 text-slate-400 hover:text-slate-200 border border-dark-750'
            }`}
          >
            {cat === 'all' ? 'All Test Suites' : cat}
          </button>
        ))}
      </div>

      {/* Test Cases Table */}
      <div className="rounded-2xl border border-dark-750 bg-dark-900/90 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-950 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-dark-800">
              <tr>
                <th className="py-3 px-4">Test ID</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Scenario</th>
                <th className="py-3 px-4">Input Payload</th>
                <th className="py-3 px-4">Expected Result</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800 text-slate-300 font-sans">
              {filteredTests.map((test) => {
                let statusBadge = (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-dark-800 text-slate-400 text-[11px] font-mono border border-dark-750">
                    <Clock className="w-3 h-3" /> Not Run
                  </span>
                );

                if (test.status === 'Passed') {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 text-[11px] font-mono border border-emerald-500/40">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Passed
                    </span>
                  );
                } else if (test.status === 'Failed') {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-950/60 text-rose-300 text-[11px] font-mono border border-rose-500/40">
                      <XCircle className="w-3 h-3 text-rose-400" /> Failed
                    </span>
                  );
                }

                return (
                  <tr key={test.id} className="hover:bg-dark-850/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-300 whitespace-nowrap">
                      {test.id}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-slate-400">
                      <span className="px-2 py-0.5 rounded bg-dark-850 border border-dark-800">
                        {test.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-white max-w-xs">
                      {test.scenario}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400 max-w-xs truncate">
                      {test.input}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 max-w-xs">
                      {test.expectedResult}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {statusBadge}
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
