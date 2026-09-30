import React from 'react';
import { useBugContext } from '@/context';
import { 
  Bug, 
  Cpu, 
  Wrench, 
  FlaskConical, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Layers
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveView, setLiveDemoModalOpen, selectBugAndNavigate } = useBugContext();

  const features = [
    {
      title: 'AI Bug Analysis',
      description: 'Parses unstructured text, stack traces, and environments to produce structured problem summaries and probable root cause hypotheses.',
      icon: Cpu,
      color: 'text-cyan-400',
      border: 'border-cyan-500/30',
      bg: 'bg-cyan-950/20'
    },
    {
      title: 'AI Fix Generation',
      description: 'Generates clean, defensive BEFORE vs AFTER code diffs with explanations, architectural changes, and developer review flags.',
      icon: Wrench,
      color: 'text-purple-400',
      border: 'border-purple-500/30',
      bg: 'bg-purple-950/20'
    },
    {
      title: 'Automated Test Cases',
      description: 'Creates rigorous multi-category test suites covering Reproduction, Happy Path, Negative scenarios, Edge Cases, and Regression protection.',
      icon: FlaskConical,
      color: 'text-amber-400',
      border: 'border-amber-500/30',
      bg: 'bg-amber-950/20'
    },
    {
      title: 'Fix Verification',
      description: 'Executes simulated regression suites, tracks test pass metrics, and provides an audited Production Readiness checklist.',
      icon: ShieldCheck,
      color: 'text-emerald-400',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-950/20'
    }
  ];

  const pipelineSteps = [
    { name: '🐞 Bug', sub: 'Input report', color: 'text-rose-400' },
    { name: '🤖 Analyze', sub: 'Pattern Match', color: 'text-cyan-400' },
    { name: '🔍 Diagnose', sub: 'Probable Cause', color: 'text-indigo-400' },
    { name: '🔧 Fix', sub: 'Code Diff', color: 'text-purple-400' },
    { name: '🧪 Test', sub: '5 Test Vectors', color: 'text-amber-400' },
    { name: '✅ Verify', sub: 'Ready for Prod', color: 'text-emerald-400' }
  ];

  return (
    <div className="space-y-16 py-6 pb-20">
      {/* Hero Section */}
      <section className="relative text-center max-w-4xl mx-auto px-4 pt-4 sm:pt-10">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-950/80 border border-brand-500/40 text-brand-300 text-xs font-mono mb-6 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>PROMPT TO PRODUCTION &bull; AI HACKATHON EDITION</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Turn Bugs Into <span className="bg-gradient-to-r from-brand-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">Verified Fixes.</span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          <strong className="text-white font-semibold">AI BUG DETECTOR</strong> uses AI to analyze software bugs, identify probable causes, generate fixes, create regression tests, and verify the result.
        </p>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => setActiveView('report')}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-dark-950 font-bold text-sm shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all hover:scale-105 active:scale-95"
          >
            <Bug className="w-4 h-4 text-dark-950" />
            <span>Report a Bug</span>
            <ArrowRight className="w-4 h-4 text-dark-950" />
          </button>

          <button
            onClick={() => setLiveDemoModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-dark-900 hover:bg-dark-850 text-white font-semibold text-sm border border-brand-500/40 shadow-lg transition-all hover:border-brand-400 hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span>⚡ Presentation Mode</span>
          </button>

          <button
            onClick={() => setActiveView('pipeline')}
            className="flex items-center gap-2 px-5 py-3.5 rounded-xl text-slate-400 hover:text-white text-sm font-medium transition-colors"
          >
            <Layers className="w-4 h-4 text-slate-400" />
            <span>See How It Works</span>
          </button>
        </div>

        {/* Visual Pipeline Bar: 🐞 Bug → 🤖 Analyze → 🔍 Diagnose → 🔧 Fix → 🧪 Test → ✅ Verify */}
        <div className="mt-14 p-4 rounded-2xl bg-dark-900/90 border border-dark-750 shadow-2xl backdrop-blur-xl max-w-4xl mx-auto">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase tracking-wider mb-4 px-2">
            <span>Automated Developer Pipeline</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> End-to-End Verified
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 relative items-center">
            {pipelineSteps.map((step, idx) => (
              <div key={step.name} className="flex flex-col items-center text-center p-2.5 rounded-xl bg-dark-850 border border-dark-800 relative group">
                <span className={`text-xs font-bold ${step.color} tracking-tight`}>{step.name}</span>
                <span className="text-[10px] text-slate-400 mt-0.5">{step.sub}</span>

                {idx < pipelineSteps.length - 1 && (
                  <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 text-slate-600 font-bold z-10 text-xs">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Preview / Live Mockup Card */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="rounded-2xl border border-dark-750 bg-dark-900/90 shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Top Window Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-dark-850 border-b border-dark-750 text-xs font-mono">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-slate-400 ml-2 font-medium">AI BUG DETECTOR Developer Studio &bull; BUG-1002</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-medium">98% Regression Coverage</span>
            </div>
          </div>

          {/* Preview Content Grid */}
          <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Analysis Preview */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-4 rounded-xl bg-dark-950 border border-dark-800">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-semibold border border-rose-800/50">
                    CRITICAL BUG
                  </span>
                  <span className="font-mono text-slate-400">Payment / Cart</span>
                </div>
                <h4 className="text-sm font-bold text-white">
                  Checkout crashes after coupon removal
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  TypeError: Cannot read properties of undefined (reading 'price')
                </p>
              </div>

              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs space-y-2">
                <div className="font-semibold text-cyan-300 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  Probable Root Cause Hypothesis
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Direct index property access (<code className="text-brand-300">items[0].price</code>) without boundary checking when items are spliced from cart array.
                </p>
                <div className="text-[11px] text-cyan-400/80 font-mono">
                  AI Confidence: 96%
                </div>
              </div>

              <button
                onClick={() => selectBugAndNavigate('BUG-1002', 'analysis')}
                className="w-full py-2 px-3 rounded-xl bg-dark-800 hover:bg-dark-750 text-xs text-brand-300 font-medium border border-dark-700 flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Inspect Full Analysis Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Right Column: Code Diff Preview */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div className="rounded-xl bg-dark-950 border border-dark-800 p-4 font-mono text-xs overflow-x-auto space-y-2">
                <div className="text-slate-500 text-[10px] pb-1 border-b border-dark-800 flex justify-between">
                  <span>src/features/cart/calculateCartTotal.ts</span>
                  <span className="text-emerald-400">Synthesized Patch</span>
                </div>
                <div className="text-rose-400/80 line-through">
                  - const discountAmount = (cart.items[0].price * coupon.percentage) / 100;
                </div>
                <div className="text-emerald-400">
                  + if (!cart?.items || cart.items.length === 0) return zeroTotal;
                </div>
                <div className="text-emerald-400">
                  + const discountAmount = (subtotal * coupon.percentage) / 100;
                </div>
                <div className="text-emerald-400">
                  + const finalTotal = Math.max(0, subtotal - discountAmount);
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300 font-medium">5 Test Suites Passed in Sandbox</span>
                </div>
                <button
                  onClick={() => selectBugAndNavigate('BUG-1002', 'verification')}
                  className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-dark-950 font-bold text-xs transition-colors"
                >
                  View Verification
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Built for Modern Autonomous Developer Workflows
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Every step is designed with developer review at its core. Transparent hypotheses, verifiable diffs, and zero hallucinated deployments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className={`p-6 rounded-2xl border ${feat.border} ${feat.bg} backdrop-blur-md flex flex-col justify-between hover:scale-[1.02] transition-transform`}
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl bg-dark-900 border border-dark-750 flex items-center justify-center mb-4 ${feat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{feat.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{feat.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-dark-800/80 flex items-center text-xs font-semibold text-slate-300">
                  <span>Audited Architecture</span>
                  <CheckCircle2 className="w-3.5 h-3.5 ml-auto text-emerald-400" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Try Out Banner */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-brand-900/60 via-dark-900 to-indigo-950/60 border border-brand-500/40 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white">Ready for your 2-Minute Demo?</h3>
            <p className="text-xs text-slate-300 mt-1 max-w-md">
              Run the full pipeline with the hackathon judge prompt: cart removal + coupon discount crash.
            </p>
          </div>
          <button
            onClick={() => setLiveDemoModalOpen(true)}
            className="shrink-0 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-dark-950 font-bold text-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:scale-105"
          >
            Launch Presentation Mode ⚡
          </button>
        </div>
      </section>
    </div>
  );
};
