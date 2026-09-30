import React, { useState } from 'react';
import { useBugContext } from '@/context';
import { PipelineProgress } from '@/components/common/PipelineProgress';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Rocket, 
  UserCheck, 
  Layers, 
  FileCheck, 
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Lock,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

export const VerificationPage: React.FC = () => {
  const { activeBug, updateBug, selectBugAndNavigate, showToast } = useBugContext();

  const [developerApproved, setDeveloperApproved] = useState(
    activeBug?.verification?.checklist?.developerApproval ?? false
  );
  const [deploymentReady, setDeploymentReady] = useState(
    activeBug?.verification?.checklist?.readyForDeployment ?? false
  );
  const [showDeploymentSuccess, setShowDeploymentSuccess] = useState(false);

  if (!activeBug || !activeBug.verification) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-dark-900 border border-dark-750 flex items-center justify-center mx-auto mb-4 text-emerald-400">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white">No Verification Data Available</h3>
        <p className="text-xs text-slate-400 mt-1 mb-6">
          Execute test cases on an accepted fix to view verification telemetry.
        </p>
        <button
          onClick={() => selectBugAndNavigate('BUG-1002', 'verification')}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-dark-950 font-bold text-xs"
        >
          Load Hackathon Verification Demo (BUG-1002)
        </button>
      </div>
    );
  }

  const { verification, fix, testCases = [] } = activeBug;

  const handleToggleApproval = () => {
    const nextApproved = !developerApproved;
    setDeveloperApproved(nextApproved);
    if (!nextApproved) {
      setDeploymentReady(false);
    }
    updateBug(activeBug.id, {
      verification: {
        ...verification,
        checklist: {
          ...verification.checklist,
          developerApproval: nextApproved,
          readyForDeployment: nextApproved ? deploymentReady : false
        }
      }
    });

    if (nextApproved) {
      showToast('Developer review sign-off recorded', 'success');
    } else {
      showToast('Developer sign-off revoked', 'info');
    }
  };

  const handleTriggerDeployment = () => {
    if (!developerApproved) return;
    setDeploymentReady(true);
    setShowDeploymentSuccess(true);
    updateBug(activeBug.id, {
      status: 'Verified',
      verification: {
        ...verification,
        checklist: {
          ...verification.checklist,
          readyForDeployment: true
        }
      }
    });
    showToast('Deployment clearance issued for staging cut', 'success');
    setTimeout(() => setShowDeploymentSuccess(false), 5000);
  };

  const isVerified = verification.status === 'PASSED' || verification.status === 'VERIFIED IN DEMO';

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6">
      {/* Persistent Pipeline Progress */}
      <PipelineProgress currentStage="verification" />

      {/* Main Verification Status Card */}
      <div className={`p-8 rounded-3xl border shadow-2xl backdrop-blur-xl relative overflow-hidden ${
        isVerified
          ? 'bg-gradient-to-br from-emerald-950/40 via-dark-900 to-dark-950 border-emerald-500/40 shadow-[0_0_50px_rgba(16,185,129,0.14)]'
          : 'bg-gradient-to-br from-amber-950/40 via-dark-900 to-dark-950 border-amber-500/40 shadow-[0_0_50px_rgba(245,158,11,0.12)]'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-800/40">
                AUDITED TEST VERIFICATION
              </span>
              <span className="text-xs font-mono text-slate-400">{activeBug.id}</span>
            </div>

            <div className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
              {isVerified ? (
                <>
                  <ShieldCheck className="w-10 h-10 text-emerald-400 shrink-0" />
                  <span>VERIFICATION: <span className="text-emerald-400">{verification.status}</span></span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-10 h-10 text-amber-400 shrink-0" />
                  <span>STATUS: <span className="text-amber-400">READY FOR REVIEW</span></span>
                </>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
              {verification.verificationNotes}
            </p>
          </div>

          {/* Quick Metrics Tile */}
          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="p-4 rounded-2xl bg-dark-950/80 border border-dark-800 text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                Regression Coverage
              </span>
              <span className="text-2xl font-black font-mono text-emerald-400">
                {verification.regressionCoveragePercent}%
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-dark-950/80 border border-dark-800 text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                Tests Passing
              </span>
              <span className="text-2xl font-black font-mono text-white">
                {verification.testsPassed} / {verification.totalTests}
              </span>
            </div>
          </div>
        </div>

        {/* Demo Label Notice */}
        <div className="mt-6 pt-4 border-t border-dark-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Simulated Sandbox Environment (Demonstration Mode)
          </span>
          <span className="italic text-slate-500">
            Automated reproduction and regression suites confirmed zero side-effects
          </span>
        </div>
      </div>

      {/* Verification Visual Flow */}
      <div className="p-6 rounded-2xl bg-dark-900 border border-dark-750 space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          End-to-End Verification Pipeline
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          <div className="p-3.5 rounded-xl bg-dark-950 border border-dark-800">
            <span className="text-[10px] font-mono text-slate-500 block mb-1">STAGE 1</span>
            <div className="font-semibold text-white text-xs">Original Bug</div>
            <div className="text-[11px] text-slate-400 truncate mt-1">{activeBug.title}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-dark-950 border border-dark-800">
            <span className="text-[10px] font-mono text-slate-500 block mb-1">STAGE 2</span>
            <div className="font-semibold text-white text-xs">Suggested Fix</div>
            <div className="text-[11px] text-purple-300 truncate mt-1">{fix?.fixId || 'Synthesized'}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-dark-950 border border-dark-800">
            <span className="text-[10px] font-mono text-slate-500 block mb-1">STAGE 3</span>
            <div className="font-semibold text-white text-xs">Generated Tests</div>
            <div className="text-[11px] text-amber-300 truncate mt-1">{testCases.length} Scenarios</div>
          </div>

          <div className="p-3.5 rounded-xl bg-dark-950 border border-dark-800">
            <span className="text-[10px] font-mono text-slate-500 block mb-1">STAGE 4</span>
            <div className="font-semibold text-white text-xs">Test Results</div>
            <div className="text-[11px] text-emerald-400 truncate mt-1">{verification.testsPassed} Passed (100%)</div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40">
            <span className="text-[10px] font-mono text-emerald-400 block mb-1">STAGE 5</span>
            <div className="font-semibold text-emerald-300 text-xs">Verification Status</div>
            <div className="text-[11px] text-emerald-400 font-bold truncate mt-1">{verification.status}</div>
          </div>
        </div>
      </div>

      {/* Production Readiness Checklist */}
      <div className="p-6 rounded-2xl bg-dark-900 border border-dark-750 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-dark-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Rocket className="w-4 h-4 text-brand-400" />
              Production Readiness Checklist
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Auditable gating checklist ensuring AI assists developers and never autonomously deploys unreviewed code.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-dark-850 text-slate-300 border border-dark-700">
            Human Governance Gate
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Automated System Checkpoints */}
          <div className="space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 block">
              Automated Checkpoints
            </span>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-950 border border-dark-800 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-200">Bug documented and symptom vector parsed</span>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-950 border border-dark-800 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-200">Root cause reviewed & hypothesis isolated</span>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-950 border border-dark-800 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-200">Fix generated with Before vs After code diff</span>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-950 border border-dark-800 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-200">5-vector test suites generated (Reproduction, Happy, Negative, Edge, Regression)</span>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-950 border border-dark-800 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-200">Regression tests considered and validated</span>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-950 border border-dark-800 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-200">Verification completed with 0 simulated failures</span>
            </div>
          </div>

          {/* Human Governance Checkpoints */}
          <div className="space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-brand-400 block">
              Human Developer Sign-Off
            </span>

            {/* Checkpoint: Developer Approval */}
            <div
              onClick={handleToggleApproval}
              className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                developerApproved
                  ? 'bg-emerald-950/30 border-emerald-500/50 text-white'
                  : 'bg-dark-950 border-dark-750 text-slate-300 hover:border-brand-500/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                  developerApproved ? 'bg-emerald-500 border-emerald-400 text-dark-950' : 'border-slate-600 bg-dark-850'
                }`}>
                  {developerApproved && <CheckCircle2 className="w-4 h-4" />}
                </div>
                <div>
                  <div className="font-bold text-xs">Developer Approval & Code Review</div>
                  <div className="text-[11px] text-slate-400">
                    Lead engineer reviews diff and signs off on fix
                  </div>
                </div>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                {developerApproved ? 'APPROVED ✓' : 'CLICK TO APPROVE'}
              </span>
            </div>

            {/* Checkpoint: Deployment Ready */}
            <div
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                deploymentReady
                  ? 'bg-brand-500/10 border-brand-500/50 text-white'
                  : developerApproved
                  ? 'bg-dark-950 border-brand-500/30 text-slate-300'
                  : 'bg-dark-950/40 border-dark-800 text-slate-600 cursor-not-allowed opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                  deploymentReady ? 'bg-brand-500 border-brand-400 text-dark-950' : 'border-slate-700 bg-dark-850'
                }`}>
                  {deploymentReady ? <Rocket className="w-3.5 h-3.5" /> : <Lock className="w-3 h-3 text-slate-600" />}
                </div>
                <div>
                  <div className="font-bold text-xs">Release & Deployment Clearance</div>
                  <div className="text-[11px] text-slate-400">
                    Gated strictly behind developer approval
                  </div>
                </div>
              </div>

              {developerApproved && !deploymentReady && (
                <button
                  onClick={handleTriggerDeployment}
                  className="px-3.5 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-400 text-dark-950 font-bold text-xs shadow-md transition-colors"
                >
                  Clear for Release
                </button>
              )}

              {deploymentReady && (
                <span className="text-xs font-mono text-brand-300 font-bold">
                  CLEARED 🚀
                </span>
              )}
            </div>

            {showDeploymentSuccess && (
              <div className="p-3 rounded-xl bg-brand-950/80 border border-brand-500/50 text-brand-200 text-xs flex items-center gap-2 animate-in fade-in duration-300">
                <Sparkles className="w-4 h-4 text-brand-400 shrink-0" />
                <span>
                  <strong>Success:</strong> Fix verified, reviewed by developer, and cleared for release cut!
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tagline Footer Callout */}
      <div className="text-center py-6 border-t border-dark-800 space-y-2">
        <div className="text-lg font-extrabold text-white tracking-tight">
          "From Bug Report to Verified Fix."
        </div>
        <p className="text-xs text-slate-400">
          AI BUG DETECTOR &bull; Prompt to Production Hackathon Finalist
        </p>
      </div>
    </div>
  );
};
