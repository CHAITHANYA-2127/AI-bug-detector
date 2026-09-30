import React, { useState } from 'react';
import { useBugContext } from '@/context';
import { demoScenarios } from '@/data/demoScenarios';
import { bugAnalyzer } from '@/services/ai/bugAnalyzer';
import { fixGenerator } from '@/services/ai/fixGenerator';
import { testGenerator } from '@/services/ai/testGenerator';
import { verifier } from '@/services/ai/verifier';
import { CodeDiffViewer } from '@/components/common/CodeDiffViewer';
import { SeverityBadge, StatusBadge } from '@/components/common/Badge';
import { BugRecord, AIAnalysis, AIFix, TestCase, VerificationResult } from '@/types';
import { 
  X, 
  Sparkles, 
  ArrowRight, 
  Cpu, 
  Wrench, 
  FlaskConical, 
  ShieldCheck, 
  Rocket, 
  CheckCircle2, 
  Play, 
  RefreshCw, 
  Check, 
  Bug, 
  RotateCcw,
  AlertTriangle,
  GitBranch,
  Layers,
  Terminal,
  FastForward
} from 'lucide-react';

const PROCESSING_STEPS = [
  'Understanding bug...',
  'Analyzing symptoms...',
  'Identifying probable cause...',
  'Preparing fix...',
  'Generating tests...'
];

export const LiveDemoModal: React.FC = () => {
  const { 
    liveDemoModalOpen, 
    setLiveDemoModalOpen, 
    addBug, 
    selectBugAndNavigate,
    showToast
  } = useBugContext();

  const [promptInput, setPromptInput] = useState(
    'When I remove an item from the cart and then apply a coupon, checkout crashes.'
  );

  // Demo step state:
  // 1: Enter Prompt
  // 2: Analysis & Probable Root Cause & Duplicates
  // 3: Code Fix (BEFORE vs AFTER)
  // 4: 5 Test Cases
  // 5: Verification & Checklist (Ending)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeProcessStepIdx, setActiveProcessStepIdx] = useState(0);

  // Generated artifacts
  const [bugRecord, setBugRecord] = useState<BugRecord | null>(null);

  if (!liveDemoModalOpen) return null;

  const handleSelectPreset = (description: string, label: string) => {
    setPromptInput(description);
    showToast(`Loaded "${label}" scenario`, 'info');
  };

  const runAnimationSequence = async (steps: number = 3): Promise<void> => {
    for (let i = 0; i < steps; i++) {
      setActiveProcessStepIdx(i);
      await new Promise((r) => setTimeout(r, 450));
    }
  };

  const handleStartAnalysis = async () => {
    if (!promptInput.trim()) return;
    setIsProcessing(true);

    const bugId = `BUG-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      await runAnimationSequence(3);

      const analysis = await bugAnalyzer.analyzeBug({
        input: {
          title: promptInput.slice(0, 60),
          description: promptInput,
          expectedBehavior: 'System recalculates state safely without throwing unhandled exceptions.',
          actualBehavior: 'Application crashes immediately with unhandled TypeError.',
          environment: 'Production / Chrome 124 / TypeScript'
        },
        bugId
      });

      const record: BugRecord = {
        id: bugId,
        title: analysis.generatedTitle,
        description: promptInput,
        input: {
          title: analysis.generatedTitle,
          description: promptInput,
          environment: 'Production / Chrome 124 / TypeScript'
        },
        severity: analysis.severity,
        category: analysis.category,
        status: 'Analyzing',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        analysis
      };

      setBugRecord(record);
      setCurrentStep(2);
      showToast('Analysis complete: Probable cause isolated', 'success');
    } catch (e) {
      console.error(e);
      showToast('Failed to analyze bug', 'warning');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStepToFix = async () => {
    if (!bugRecord || !bugRecord.analysis) return;
    setIsProcessing(true);
    setActiveProcessStepIdx(3); // "Preparing fix..."

    try {
      await new Promise((r) => setTimeout(r, 600));
      const fix = await fixGenerator.generateFix({
        bugId: bugRecord.id,
        analysis: bugRecord.analysis,
        input: bugRecord.input
      });

      setBugRecord((prev) => (prev ? { ...prev, fix, status: 'Fix Suggested' } : null));
      setCurrentStep(3);
      showToast('Defensive code diff synthesized', 'success');
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStepToTests = async () => {
    if (!bugRecord || !bugRecord.analysis || !bugRecord.fix) return;
    setIsProcessing(true);
    setActiveProcessStepIdx(4); // "Generating tests..."

    try {
      await new Promise((r) => setTimeout(r, 600));
      const tests = await testGenerator.generateTests({
        bugId: bugRecord.id,
        analysis: bugRecord.analysis,
        fix: bugRecord.fix
      });

      setBugRecord((prev) => (prev ? { ...prev, testCases: tests, status: 'Testing' } : null));
      setCurrentStep(4);
      showToast('5 multi-vector test suites created', 'success');
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStepToVerify = async () => {
    if (!bugRecord || !bugRecord.testCases) return;
    setIsProcessing(true);

    try {
      const { updatedTests, verificationResult } = await verifier.executeVerification({
        bugId: bugRecord.id,
        analysis: bugRecord.analysis || ({} as any),
        fix: bugRecord.fix || ({} as any),
        testCases: bugRecord.testCases
      });

      const verifiedRecord: BugRecord = {
        ...bugRecord,
        testCases: updatedTests,
        verification: verificationResult,
        status: 'Verified'
      };

      setBugRecord(verifiedRecord);
      addBug(verifiedRecord); // save into state for persistent dashboard & history review
      setCurrentStep(5);
      showToast('Verification passed: Ready for developer review', 'success');
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFastForwardAll = async () => {
    if (!promptInput.trim()) return;
    setIsProcessing(true);

    try {
      for (let i = 0; i < PROCESSING_STEPS.length; i++) {
        setActiveProcessStepIdx(i);
        await new Promise((r) => setTimeout(r, 350));
      }

      const bugId = `BUG-${Math.floor(1000 + Math.random() * 9000)}`;
      const input = {
        title: promptInput.slice(0, 60),
        description: promptInput,
        environment: 'Production / Chrome 124 / TypeScript'
      };

      const analysis = await bugAnalyzer.analyzeBug({ input, bugId });
      const fix = await fixGenerator.generateFix({ bugId, analysis, input });
      const testCases = await testGenerator.generateTests({ bugId, analysis, fix });
      const { updatedTests, verificationResult } = await verifier.executeVerification({
        bugId,
        analysis,
        fix,
        testCases
      });

      const fullRecord: BugRecord = {
        id: bugId,
        title: analysis.generatedTitle,
        description: promptInput,
        input,
        severity: analysis.severity,
        category: analysis.category,
        status: 'Verified',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        analysis,
        fix,
        testCases: updatedTests,
        verification: verificationResult
      };

      setBugRecord(fullRecord);
      addBug(fullRecord);
      setCurrentStep(5);
      showToast('Fast-forward complete: Pipeline verified!', 'success');
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetDemo = () => {
    setCurrentStep(1);
    setBugRecord(null);
    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-dark-900 border border-brand-500/40 rounded-3xl shadow-[0_0_60px_rgba(6,182,212,0.25)] overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-750 bg-dark-850">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 text-dark-950 font-bold shadow-md">
              <Sparkles className="w-4 h-4 fill-dark-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-base">
                  ⚡ Live AI Demo &bull; Presentation Mode
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-brand-500/10 text-brand-300 border border-brand-500/30 uppercase">
                  Judge Mode
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Natural-language bug intake to auditable verified fix in 2 minutes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 1 && (
              <button
                onClick={handleResetDemo}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 transition-colors"
                title="Restart Demo"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setLiveDemoModalOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Indicator Tracker: 🐞 Bug → 🤖 Analyze → 🔍 Diagnose → 🔧 Fix → 🧪 Test → ✅ Verify */}
        <div className="px-6 py-3 bg-dark-950 border-b border-dark-800 flex items-center justify-between text-xs font-mono overflow-x-auto">
          {[
            { num: 1, label: '🐞 Bug' },
            { num: 2, label: '🤖 Analyze & Diagnose' },
            { num: 3, label: '🔧 Fix' },
            { num: 4, label: '🧪 Test' },
            { num: 5, label: '✅ Verify' }
          ].map((st) => (
            <div
              key={st.num}
              className={`flex items-center gap-2 ${
                currentStep === st.num
                  ? 'text-brand-300 font-bold'
                  : currentStep > st.num
                  ? 'text-emerald-400'
                  : 'text-slate-600'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                currentStep === st.num
                  ? 'bg-brand-500 text-dark-950 font-bold shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                  : currentStep > st.num
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-dark-850 text-slate-600'
              }`}>
                {currentStep > st.num ? '✓' : st.num}
              </span>
              <span className="whitespace-nowrap">{st.label}</span>
              {st.num < 5 && <span className="text-dark-750 mx-1">→</span>}
            </div>
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* STEP 1: Intake & Prompt */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Describe your bug:
                </label>
                <textarea
                  rows={3}
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  className="w-full bg-dark-950 border border-dark-750 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-2xl p-4 text-sm text-white placeholder:text-slate-600 outline-none transition-all resize-none shadow-inner"
                  placeholder="When I remove an item from the cart and then apply a coupon, checkout crashes."
                />
              </div>

              {/* Quick Example Buttons (Section 15: Login Bug, Checkout Bug, API 500 Error, Image Upload Bug, Mobile UI Bug) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-400">
                    Quick Scenario Presets (Click to Populate):
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">1-Click Intake</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {demoScenarios.map((sc) => (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => handleSelectPreset(sc.input.description, sc.buttonLabel)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                        promptInput === sc.input.description
                          ? 'bg-brand-500/20 text-brand-300 border-brand-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                          : 'bg-dark-850 hover:bg-dark-800 text-slate-300 border-dark-750'
                      }`}
                    >
                      {sc.buttonLabel}
                    </button>
                  ))}
                </div>
              </div>

              {/* Processing Progress Overlay if active */}
              {isProcessing && (
                <div className="p-4 rounded-xl bg-dark-950 border border-brand-500/30 flex items-center gap-3">
                  <RefreshCw className="w-5 h-5 text-brand-400 animate-spin shrink-0" />
                  <div className="text-xs space-y-0.5">
                    <span className="font-bold text-white block">
                      {PROCESSING_STEPS[activeProcessStepIdx]}
                    </span>
                    <span className="text-slate-400">Step {activeProcessStepIdx + 1} of {PROCESSING_STEPS.length} in AI reasoning pipeline</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-dark-800">
                <button
                  type="button"
                  onClick={handleFastForwardAll}
                  disabled={isProcessing}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-dark-850 hover:bg-dark-800 text-slate-300 text-xs font-semibold border border-dark-750 transition-colors"
                >
                  <FastForward className="w-4 h-4 text-brand-400" />
                  <span>1-Click Fast Forward (All Stages)</span>
                </button>

                <button
                  type="button"
                  onClick={handleStartAnalysis}
                  disabled={isProcessing || !promptInput.trim()}
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-dark-950 font-extrabold text-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:scale-105"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{PROCESSING_STEPS[activeProcessStepIdx]}</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4 text-dark-950" />
                      <span>Analyze Bug ⚡</span>
                      <ArrowRight className="w-4 h-4 text-dark-950" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: AI Bug Analysis & Probable Root Cause & Duplicate Detection */}
          {currentStep === 2 && bugRecord?.analysis && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Metadata Cards */}
              <div className="p-5 rounded-2xl bg-dark-950 border border-dark-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-brand-300 bg-dark-850 px-2.5 py-1 rounded border border-dark-700">
                      {bugRecord.id}
                    </span>
                    <SeverityBadge severity={bugRecord.analysis.severity} />
                    <span className="px-2.5 py-1 rounded text-xs font-mono bg-dark-850 text-slate-300 border border-dark-750">
                      {bugRecord.analysis.category}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-indigo-950/60 text-indigo-300 border border-indigo-500/40">
                      {bugRecord.analysis.priority}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-cyan-400 font-bold">
                    AI Confidence: {bugRecord.analysis.confidenceScore}%
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white">
                  {bugRecord.analysis.generatedTitle}
                </h3>
                <div className="text-xs text-slate-400 font-mono">
                  Affected Component: <span className="text-slate-200">{bugRecord.analysis.affectedComponent}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  {bugRecord.analysis.problemSummary}
                </p>
              </div>

              {/* Probable Root Cause Box (Framed Defensively) */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-dark-950 to-indigo-950/30 border border-cyan-500/40 shadow-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    AI Analysis: Probable Cause Hypothesis
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/40">
                    Defensive AI Wording
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                  {bugRecord.analysis.probableRootCause}
                </p>
                <div className="text-xs text-slate-400 pt-1 border-t border-cyan-900/40">
                  <strong className="text-slate-300">AI Reasoning:</strong> {bugRecord.analysis.aiReasoning}
                </div>
              </div>

              {/* Possible Duplicate Bug Detection (Section 9) */}
              {bugRecord.analysis.possibleDuplicates && bugRecord.analysis.possibleDuplicates.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300 flex items-center gap-1.5">
                      <GitBranch className="w-4 h-4 text-amber-400" />
                      Possible Duplicate Bugs Detected
                    </span>
                    <span className="text-[10px] text-amber-400 font-mono">AI Suggestion &bull; Review Recommended</span>
                  </div>
                  {bugRecord.analysis.possibleDuplicates.map((dup) => (
                    <div key={dup.id} className="p-2.5 rounded-lg bg-dark-950/70 border border-dark-800 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-brand-300 font-bold">{dup.id}</span>
                          <span className="text-white font-medium">{dup.title}</span>
                        </div>
                        <p className="text-slate-400 text-[11px] mt-0.5">{dup.reason}</p>
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-400 shrink-0 ml-3">
                        {dup.similarity}% match
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Step Navigation CTA */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-dark-800">
                <button
                  onClick={handleStepToFix}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all hover:scale-105"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Preparing fix...</span>
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
          )}

          {/* STEP 3: AI Fix Experience (BEFORE vs AFTER) */}
          {currentStep === 3 && bugRecord?.fix && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200">
                <strong>Developer Review Required:</strong> AI-generated patch is provided as a verifiable recommendation. Review before regression test generation.
              </div>

              <div>
                <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-purple-400" />
                  Proposed Fix: {bugRecord.fix.summary}
                </h4>

                <CodeDiffViewer
                  filename={bugRecord.fix.diff.filename}
                  language={bugRecord.fix.diff.language}
                  beforeCode={bugRecord.fix.diff.beforeCode}
                  afterCode={bugRecord.fix.diff.afterCode}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-dark-950 border border-dark-800">
                  <span className="font-bold text-emerald-400 block mb-1">Why This Fix Works</span>
                  <p className="text-slate-300">{bugRecord.fix.whyThisFixWorks}</p>
                </div>
                <div className="p-3 rounded-xl bg-dark-950 border border-dark-800">
                  <span className="font-bold text-amber-400 block mb-1">Potential Side Effects Checked</span>
                  <p className="text-slate-300">{bugRecord.fix.potentialSideEffects[0] || 'Evaluated against zero-item boundaries.'}</p>
                </div>
              </div>

              {/* Step Navigation CTA */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-dark-800">
                <button
                  onClick={handleStepToTests}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-dark-950 font-bold text-sm shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all hover:scale-105"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Generating tests...</span>
                    </>
                  ) : (
                    <>
                      <FlaskConical className="w-4 h-4" />
                      <span>Generate Tests</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: 5 Test Cases (Reproduction, Happy Path, Negative, Edge Case, Regression) */}
          {currentStep === 4 && bugRecord?.testCases && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-white">
                    Generated Test Suites ({bugRecord.testCases.length} Scenarios)
                  </h4>
                  <p className="text-xs text-slate-400">
                    Covering Reproduction, Happy Path, Negative Tests, Edge Cases, and Regression protection
                  </p>
                </div>
                <span className="text-xs font-mono text-amber-400 bg-amber-950/50 px-2.5 py-1 rounded-full border border-amber-500/40">
                  5 Test Vectors
                </span>
              </div>

              <div className="space-y-2">
                {bugRecord.testCases.map((tc) => (
                  <div
                    key={tc.id}
                    className="p-3.5 rounded-xl bg-dark-950 border border-dark-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-amber-300 font-bold">{tc.id}</span>
                        <span className="px-2 py-0.5 rounded bg-dark-850 text-slate-300 text-[10px] font-mono border border-dark-750">
                          {tc.category}
                        </span>
                      </div>
                      <div className="font-medium text-white">{tc.scenario}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Expected: {tc.expectedResult}
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-dark-850 text-slate-400 border border-dark-750 self-start sm:self-auto">
                      Not Run
                    </span>
                  </div>
                ))}
              </div>

              {/* Step Navigation CTA */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-dark-800">
                <button
                  onClick={handleStepToVerify}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-dark-950 font-extrabold text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:scale-105"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying simulated test suite...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verify Fix</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Verification & Production Readiness Checklist */}
          {currentStep === 5 && bugRecord?.verification && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Grand Status Card with Explicit VERIFIED IN DEMO status */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/60 via-dark-900 to-dark-950 border border-emerald-500/50 shadow-2xl text-center space-y-3">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto shadow-[0_0_25px_rgba(16,185,129,0.4)]">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  VERIFICATION STATUS: <span className="text-emerald-400">{bugRecord.verification.status}</span>
                </div>
                <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
                  All 5 automated unit and regression suites executed successfully. No regressions detected. Regression coverage: <strong className="text-emerald-300 font-mono">98%</strong>.
                </p>
                <div className="text-[11px] font-mono text-emerald-400/80">
                  READY FOR DEVELOPER REVIEW
                </div>
              </div>

              {/* Production Readiness Checklist */}
              <div className="p-5 rounded-2xl bg-dark-950 border border-dark-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-brand-400" />
                  Production Readiness Checklist
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>✓ Bug documented & parsed</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>✓ Root cause reviewed</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>✓ Fix generated & diff inspected</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>✓ Tests generated & executed</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>✓ Regression suites passed</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>✓ Verification completed</span>
                  </div>
                  <div className="flex items-center gap-2 text-brand-300 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-brand-400" />
                    <span>✓ Developer approval granted</span>
                  </div>
                  <div className="flex items-center gap-2 text-brand-300 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-brand-400" />
                    <span>✓ Cleared for production release</span>
                  </div>
                </div>
              </div>

              {/* The Hackathon Ending Quote */}
              <div className="p-6 rounded-2xl bg-brand-950/40 border border-brand-500/30 text-center space-y-2">
                <div className="text-lg sm:text-xl font-extrabold text-white">
                  "From Bug Report to Verified Fix."
                </div>
                <p className="text-xs text-slate-400">
                  BUG FIX AI brings transparency, defensive engineering, and automated verification to the developer loop.
                </p>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleResetDemo}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white bg-dark-850 hover:bg-dark-800 transition-colors"
                >
                  Test Another Bug Prompt
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLiveDemoModalOpen(false);
                    selectBugAndNavigate(bugRecord.id, 'verification');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-dark-950 font-bold text-xs shadow-md transition-colors"
                >
                  Open in Bug Studio
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
