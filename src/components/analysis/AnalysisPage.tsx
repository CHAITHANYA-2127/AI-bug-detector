import React, { useState } from 'react';
import { useBugContext } from '@/context';
import { PipelineProgress } from '@/components/common/PipelineProgress';
import { SeverityBadge, StatusBadge } from '@/components/common/Badge';
import { fixGenerator } from '@/services/ai/fixGenerator';
import { 
  Cpu, 
  Search, 
  Wrench, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink,
  Zap,
  Info,
  GitBranch,
  RefreshCw,
  BrainCircuit
} from 'lucide-react';

export const AnalysisPage: React.FC = () => {
  const { activeBug, updateBug, selectBugAndNavigate, showToast } = useBugContext();
  const [isGeneratingFix, setIsGeneratingFix] = useState(false);

  if (!activeBug || !activeBug.analysis) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-dark-900 border border-dark-750 flex items-center justify-center mx-auto mb-4 text-slate-500">
          <Cpu className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white">No Bug Selected for Analysis</h3>
        <p className="text-xs text-slate-400 mt-1 mb-6">
          Please select an existing bug or submit a new bug report.
        </p>
        <button
          onClick={() => selectBugAndNavigate('BUG-1002', 'analysis')}
          className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-dark-950 font-bold text-xs"
        >
          Load Hackathon Demo (BUG-1002)
        </button>
      </div>
    );
  }

  const { analysis } = activeBug;

  const handleGenerateFix = async () => {
    setIsGeneratingFix(true);
    try {
      const fix = await fixGenerator.generateFix({
        bugId: activeBug.id,
        analysis,
        input: activeBug.input
      });

      updateBug(activeBug.id, {
        fix,
        status: 'Fix Suggested'
      });

      showToast('Defensive code diff synthesized successfully', 'success');
      selectBugAndNavigate(activeBug.id, 'fix');
    } catch (err) {
      console.error(err);
      showToast('Failed to generate fix', 'warning');
    } finally {
      setIsGeneratingFix(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6">
      {/* 6-Step Persistent Pipeline Tracker: 🐞 Bug → 🤖 Analyze → 🔍 Diagnose → 🔧 Fix → 🧪 Test → ✅ Verify */}
      <PipelineProgress currentStage="analysis" />

      {/* Analysis Header Card */}
      <div className="p-6 rounded-2xl bg-dark-900 border border-dark-750 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-5 border-b border-dark-800">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-bold text-brand-300 bg-brand-950/60 px-2.5 py-1 rounded-lg border border-brand-500/40">
                {analysis.bugId}
              </span>
              <SeverityBadge severity={analysis.severity} size="md" />
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-indigo-950/50 border border-indigo-500/40 text-indigo-300">
                {analysis.priority}
              </span>
              <StatusBadge status={activeBug.status} size="md" />
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
              {analysis.generatedTitle}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
              <div>
                <span className="text-slate-500">Category:</span>{' '}
                <span className="text-slate-200">{analysis.category}</span>
              </div>
              <div>
                <span className="text-slate-500">Affected Component:</span>{' '}
                <span className="text-slate-200">{analysis.affectedComponent}</span>
              </div>
              <div>
                <span className="text-slate-500">Environment:</span>{' '}
                <span className="text-slate-200">{analysis.environment}</span>
              </div>
            </div>
          </div>

          {/* AI Confidence Meter */}
          <div className="shrink-0 p-4 rounded-xl bg-dark-950 border border-dark-750 text-center min-w-[150px]">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">
              AI Confidence Score
            </span>
            <div className="text-2xl font-extrabold font-mono text-cyan-400 flex items-center justify-center gap-1">
              <Zap className="w-5 h-5 text-cyan-400" />
              <span>{analysis.confidenceScore}%</span>
            </div>
            <div className="w-full bg-dark-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-cyan-400 rounded-full"
                style={{ width: `${analysis.confidenceScore}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Symptom Correlation</span>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Info className="w-4 h-4 text-brand-400 shrink-0" />
            <span>AI hypothesis generated. Proceed to view or synthesize automated code patch.</span>
          </div>

          <button
            onClick={handleGenerateFix}
            disabled={isGeneratingFix}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all hover:scale-[1.02]"
          >
            {isGeneratingFix ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Synthesizing Fix...</span>
              </>
            ) : (
              <>
                <Wrench className="w-4 h-4" />
                <span>Generate Fix</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Duplicate Bug Detection Alert (Section 9) */}
      {analysis.possibleDuplicates && analysis.possibleDuplicates.length > 0 && (
        <div className="p-5 rounded-2xl bg-amber-950/25 border border-amber-500/40 text-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <GitBranch className="w-4 h-4 text-amber-400" />
              <span>Possible Duplicate Bug Reports Detected</span>
            </div>
            <span className="text-[11px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
              Review Recommended
            </span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            AI symptom correlation identified existing reports that match this failure profile. Consider reviewing prior root causes to avoid redundant triage:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {analysis.possibleDuplicates.map((dup) => (
              <div
                key={dup.id}
                onClick={() => selectBugAndNavigate(dup.id, 'analysis')}
                className="p-3 rounded-xl bg-dark-950/80 border border-dark-800 hover:border-amber-500/40 cursor-pointer flex items-center justify-between group transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-brand-300 font-bold">{dup.id}</span>
                    <span className="text-white font-medium group-hover:text-amber-300 transition-colors">
                      {dup.title}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{dup.reason}</div>
                </div>
                <span className="font-mono text-amber-400 font-bold text-xs shrink-0 ml-2">
                  {dup.similarity}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analysis Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Problem Breakdown (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Problem Summary */}
          <div className="p-5 rounded-2xl bg-dark-900 border border-dark-750 space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-400" />
              1. Problem Summary
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {analysis.problemSummary}
            </p>
          </div>

          {/* Section 2 & 3: Expected vs Actual Behavior */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-dark-900 border border-dark-750 space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                2. Expected Behavior
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {analysis.expectedBehavior}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-dark-900 border border-dark-750 space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                3. Actual Behavior
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {analysis.actualBehavior}
              </p>
            </div>
          </div>

          {/* Section 4: Steps to Reproduce */}
          <div className="p-5 rounded-2xl bg-dark-900 border border-dark-750 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              4. Reproduction Steps
            </h3>
            <ol className="space-y-2 text-xs text-slate-300 font-sans">
              {analysis.stepsToReproduce.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-dark-850 text-brand-300 font-mono text-[11px] flex items-center justify-center shrink-0 border border-dark-750">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed mt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Right Column: Probable Root Cause & Technical Deep Dive (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Section 6: Probable Root Cause (Highlighted Card) */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-dark-900 to-indigo-950/30 border border-cyan-500/40 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                <Search className="w-4 h-4 text-cyan-400" />
                Probable Root Cause Hypothesis
              </span>
              <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/40">
                AI Analysis
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed bg-dark-950/60 p-3.5 rounded-xl border border-cyan-500/20">
              {analysis.probableRootCause}
            </p>
            <div className="text-[11px] text-slate-400 flex items-start gap-1.5 leading-normal">
              <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                Note: Wording reflects probable causation rather than an unverified assertion. Developer verification follows in next pipeline stages.
              </span>
            </div>
          </div>

          {/* Section: AI Reasoning */}
          <div className="p-5 rounded-2xl bg-dark-900 border border-dark-750 space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
              AI Reasoning & Deductive Invariants
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans bg-dark-950 p-3.5 rounded-xl border border-dark-800">
              {analysis.aiReasoning || 'Symptom analysis matches state-invalidation edge cases where collections are modified concurrently with calculation evaluation.'}
            </p>
          </div>

          {/* Section 5: Technical Analysis */}
          <div className="p-5 rounded-2xl bg-dark-900 border border-dark-750 space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-brand-400" />
              Technical Stack Analysis
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-mono bg-dark-950 p-3 rounded-xl border border-dark-800">
              {analysis.technicalAnalysis}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
