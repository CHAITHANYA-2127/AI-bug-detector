import React from 'react';
import { useBugContext } from '@/context';
import { 
  GitPullRequestDraft, 
  MessageSquare, 
  BrainCircuit, 
  Search, 
  Wrench, 
  FlaskConical, 
  ShieldCheck, 
  Rocket, 
  ArrowDown, 
  Sparkles, 
  CheckCircle2, 
  Layers
} from 'lucide-react';

export const PromptToProductionPage: React.FC = () => {
  const { setLiveDemoModalOpen, selectBugAndNavigate } = useBugContext();

  const stages = [
    {
      step: '01',
      title: '🐞 Natural Language Bug Report',
      tagline: 'Raw User & Developer Intake',
      desc: 'Users or QA report issues in unstructured natural language (e.g. "When I remove an item from the shopping cart and apply a coupon, checkout crashes"), optionally attaching stack traces or screenshot logs.',
      icon: MessageSquare,
      color: 'text-rose-400',
      border: 'border-rose-500/30',
      bg: 'bg-rose-950/20',
      badge: 'Input Vector'
    },
    {
      step: '02',
      title: '🤖 AI Analysis & Normalization',
      tagline: 'Symptom & Environment Disambiguation',
      desc: 'The reasoning engine extracts reproduction conditions, expected vs. actual invariants, affected platform specifications, and environmental parameters into a normalized bug schema.',
      icon: BrainCircuit,
      color: 'text-blue-400',
      border: 'border-blue-500/30',
      bg: 'bg-blue-950/20',
      badge: 'Semantics'
    },
    {
      step: '03',
      title: '🔍 Probable Root Cause Diagnosis',
      tagline: 'Hypothesis Engine & Duplicate Detection',
      desc: 'Instead of hallucinating certainty, BUG FIX AI formulates defensible root-cause hypotheses (e.g., stale cart array index access during coupon calculation) and checks for possible duplicate reports in the system.',
      icon: Search,
      color: 'text-cyan-400',
      border: 'border-cyan-500/30',
      bg: 'bg-cyan-950/20',
      badge: 'Diagnostics'
    },
    {
      step: '04',
      title: '🔧 AI Fix Generation',
      tagline: 'Defensive Code Diff Synthesis',
      desc: 'Generates structured BEFORE vs AFTER code patches adhering to defensive design patterns, accompanied by explicit architectural rationale, changes made, and potential side-effects.',
      icon: Wrench,
      color: 'text-purple-400',
      border: 'border-purple-500/30',
      bg: 'bg-purple-950/20',
      badge: 'Code Patch'
    },
    {
      step: '05',
      title: '🧪 5-Vector Test Generation',
      tagline: 'Reproduction, Boundary & Regression Matrix',
      desc: 'Automatically crafts targeted Reproduction, Happy Path, Negative error handling, Edge Cases, and Regression test suites to prove the fix and protect adjoining subsystems.',
      icon: FlaskConical,
      color: 'text-amber-400',
      border: 'border-amber-500/30',
      bg: 'bg-amber-950/20',
      badge: 'Quality Assurance'
    },
    {
      step: '06',
      title: '✅ Fix Verification & Governance',
      tagline: 'Sandbox Execution & Developer Sign-Off',
      desc: 'Executes simulated regression tests against the proposed patch, calculates coverage percentage (98%), and enforces explicit human developer review prior to deployment clearance.',
      icon: ShieldCheck,
      color: 'text-emerald-400',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-950/20',
      badge: 'Validation & Gate'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-12 pb-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950 border border-brand-500/40 text-brand-300 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>PROMPT TO PRODUCTION ARCHITECTURE</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          From Natural Language Prompt to Verified Production Readiness
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          BUG FIX AI demonstrates how autonomous AI systems can guide code remediation through software engineering rigor: intake, analysis, diagnosis, synthesis, testing, verification, and human governance.
        </p>

        <div className="pt-2 flex justify-center gap-4">
          <button
            onClick={() => setLiveDemoModalOpen(true)}
            className="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-dark-950 font-bold text-sm shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all hover:scale-105"
          >
            Launch Presentation Mode ⚡
          </button>
          <button
            onClick={() => selectBugAndNavigate('BUG-1002', 'verification')}
            className="px-5 py-3 rounded-xl bg-dark-900 hover:bg-dark-850 text-white font-semibold text-sm border border-dark-750 transition-colors"
          >
            Inspect Verified Case Study
          </button>
        </div>
      </div>

      {/* 6-Step Vertical Pipeline Stack */}
      <div className="space-y-6 relative max-w-4xl mx-auto">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;

          return (
            <div key={stage.step} className="relative">
              <div className={`p-6 rounded-2xl border ${stage.border} ${stage.bg} bg-dark-900/80 backdrop-blur-xl shadow-xl transition-all hover:scale-[1.01]`}>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-dark-950 border border-dark-750 flex items-center justify-center shrink-0 ${stage.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-500">
                          STAGE {stage.step}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-dark-850 text-slate-400 border border-dark-750">
                          {stage.badge}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white tracking-tight">
                        {stage.title}
                      </h3>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-slate-400 self-start sm:self-auto">
                    {stage.tagline}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                  {stage.desc}
                </p>
              </div>

              {idx < stages.length - 1 && (
                <div className="flex justify-center my-2 text-slate-600">
                  <ArrowDown className="w-4 h-4 animate-bounce" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Core Principle Callout */}
      <div className="p-8 rounded-3xl bg-dark-900 border border-dark-750 text-center max-w-3xl mx-auto space-y-3">
        <h3 className="text-base font-bold text-white">Why This Model Matters for Enterprise AI</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Unconstrained code generation tools suffer from hallucination and unpredictable regressions. By enforcing a 6-stage verification boundary with multi-vector test suites and human developer governance, BUG FIX AI delivers production-grade confidence.
        </p>
      </div>
    </div>
  );
};
