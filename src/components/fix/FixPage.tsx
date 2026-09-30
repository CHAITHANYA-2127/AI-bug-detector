import React, { useState } from 'react';
import { useBugContext } from '@/context';
import { PipelineProgress } from '@/components/common/PipelineProgress';
import { CodeDiffViewer } from '@/components/common/CodeDiffViewer';
import { fixGenerator } from '@/services/ai/fixGenerator';
import { testGenerator } from '@/services/ai/testGenerator';
import { 
  Wrench, 
  FlaskConical, 
  Check, 
  RefreshCw, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  FileCode2,
  Bug
} from 'lucide-react';

export const FixPage: React.FC = () => {
  const { activeBug, updateBug, selectBugAndNavigate, showToast } = useBugContext();
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isGeneratingTests, setIsGeneratingTests] = useState(false);
  const [accepted, setAccepted] = useState(activeBug?.fix?.status === 'Accepted');

  if (!activeBug || !activeBug.fix) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-dark-900 border border-dark-750 flex items-center justify-center mx-auto mb-4 text-purple-400">
          <Wrench className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white">No Fix Generated Yet</h3>
        <p className="text-xs text-slate-400 mt-1 mb-6">
          Please run AI Analysis first to identify the probable cause before generating a fix.
        </p>
        <button
          onClick={() => selectBugAndNavigate('BUG-1002', 'fix')}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
        >
          Load Hackathon Fix Demo (BUG-1002)
        </button>
      </div>
    );
  }

  const { fix, analysis } = activeBug;

  const handleRegenerateFix = async () => {
    setIsRegenerating(true);
    try {
      const newFix = await fixGenerator.generateFix({
        bugId: activeBug.id,
        analysis: activeBug.analysis || ({} as any),
        input: activeBug.input
      });
      updateBug(activeBug.id, { fix: newFix });
      showToast('Fix regenerated with alternative defensive pattern', 'info');
    } catch (err) {
      console.error(err);
      showToast('Failed to regenerate fix', 'warning');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleAcceptFix = () => {
    setAccepted(true);
    updateBug(activeBug.id, {
      fix: {
        ...fix,
        status: 'Accepted'
      }
    });
    showToast('Fix accepted by developer for test validation', 'success');
  };

  const handleGenerateTests = async () => {
    setIsGeneratingTests(true);
    try {
      const tests = await testGenerator.generateTests({
        bugId: activeBug.id,
        analysis: activeBug.analysis || ({} as any),
        fix
      });

      updateBug(activeBug.id, {
        testCases: tests,
        status: 'Testing'
      });

      showToast('5 multi-vector test suites generated', 'success');
      selectBugAndNavigate(activeBug.id, 'tests');
    } catch (err) {
      console.error(err);
      showToast('Failed to generate tests', 'warning');
    } finally {
      setIsGeneratingTests(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6">
      {/* Persistent Pipeline Progress */}
      <PipelineProgress currentStage="fix" />

      {/* Developer Review Required Warning Banner */}
      <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 shadow-lg flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-0.5">
          <div className="font-bold text-amber-300 uppercase tracking-wide">
            Developer Review Required &bull; Proposed AI Remediation
          </div>
          <p className="text-slate-300 leading-relaxed">
            This patch is an AI-generated suggestion based on identified symptoms. It has <strong>not</strong> been applied to a production system. Always audit changes, execute regression test suites, and obtain developer sign-off prior to merge.
          </p>
        </div>
      </div>

      {/* Header Summary */}
      <div className="p-6 rounded-2xl bg-dark-900 border border-dark-750 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-bold text-purple-300 bg-purple-950/60 px-2.5 py-0.5 rounded border border-purple-500/40">
                {fix.fixId}
              </span>
              <span className="text-xs font-mono text-slate-400">Targeting {fix.bugId}</span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium border ${
                accepted
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                  : 'bg-dark-850 border-dark-700 text-slate-400'
              }`}>
                {accepted ? 'Accepted by Developer' : 'Pending Review'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {fix.summary}
            </h1>
          </div>

          {/* Action CTAs: Accept Fix, Regenerate Fix, Generate Tests */}
          <div className="flex items-center gap-2 self-start shrink-0 flex-wrap">
            <button
              onClick={handleRegenerateFix}
              disabled={isRegenerating}
              className="px-3.5 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 text-slate-300 font-medium text-xs border border-dark-750 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
              <span>{isRegenerating ? 'Regenerating...' : 'Regenerate Fix'}</span>
            </button>

            <button
              onClick={handleAcceptFix}
              className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                accepted
                  ? 'bg-emerald-600 text-white'
                  : 'bg-dark-800 hover:bg-dark-750 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{accepted ? 'Fix Accepted' : 'Accept Fix'}</span>
            </button>

            <button
              onClick={handleGenerateTests}
              disabled={isGeneratingTests}
              className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-dark-950 font-extrabold text-xs shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center gap-1.5 transition-all hover:scale-105"
            >
              {isGeneratingTests ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Building Tests...</span>
                </>
              ) : (
                <>
                  <FlaskConical className="w-3.5 h-3.5" />
                  <span>Generate Tests</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Original Bug & Probable Root Cause Recap */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-dark-950 border border-dark-800 text-xs">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-500 block mb-1">
              Original Bug Symptoms
            </span>
            <p className="text-slate-300">{activeBug.description}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-dark-950 border border-dark-800 text-xs">
            <span className="text-[10px] uppercase font-mono font-bold text-cyan-400 block mb-1">
              Probable Cause Hypothesis
            </span>
            <p className="text-slate-300">{analysis?.probableRootCause || 'Unchecked state update exception'}</p>
          </div>
        </div>
      </div>

      {/* Code Diff BEFORE vs AFTER (LEFT: Problematic Code, RIGHT: Suggested Fixed Code) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <FileCode2 className="w-4 h-4 text-purple-400" />
            Synthesized Code Patch (LEFT: 🐞 Problematic Code &bull; RIGHT: 🔧 Suggested Fixed Code)
          </span>
          <span className="text-[11px] font-mono text-slate-500">Defensive Patch Synthesizer</span>
        </div>

        <CodeDiffViewer
          filename={fix.diff.filename}
          language={fix.diff.language}
          beforeCode={fix.diff.beforeCode}
          afterCode={fix.diff.afterCode}
        />
      </div>

      {/* Fix Explanations & Side-Effects */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Why This Fix Works */}
        <div className="p-5 rounded-2xl bg-dark-900 border border-dark-750 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            Why This Fix Works
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {fix.whyThisFixWorks}
          </p>
        </div>

        {/* Changes Made */}
        <div className="p-5 rounded-2xl bg-dark-900 border border-dark-750 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-400 flex items-center gap-1.5">
            <Wrench className="w-4 h-4" />
            Specific Changes Made
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {fix.changesMade.map((ch, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-brand-400 font-bold">•</span>
                <span className="leading-relaxed">{ch}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Potential Side Effects */}
        <div className="p-5 rounded-2xl bg-dark-900 border border-dark-750 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            Potential Side Effects
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {fix.potentialSideEffects.map((se, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">⚠</span>
                <span className="leading-relaxed">{se}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
