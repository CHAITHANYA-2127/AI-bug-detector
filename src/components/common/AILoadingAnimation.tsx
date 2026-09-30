import React, { useEffect, useState } from 'react';
import { 
  FileSearch, 
  Cpu, 
  Search, 
  GitBranch, 
  Wrench, 
  FlaskConical, 
  CheckCircle2,
  Terminal
} from 'lucide-react';

interface Stage {
  title: string;
  detail: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STAGES: Stage[] = [
  {
    title: 'Reading bug report',
    detail: 'Parsing raw bug description, user environment, and attached stack traces...',
    icon: FileSearch
  },
  {
    title: 'Analyzing symptoms',
    detail: 'Correlating runtime error logs with common failure heuristics...',
    icon: Cpu
  },
  {
    title: 'Identifying probable cause',
    detail: 'Isolating root cause hypothesis in application state & edge execution...',
    icon: Search
  },
  {
    title: 'Checking patterns',
    detail: 'Cross-referencing regression databases and architectural invariants...',
    icon: GitBranch
  },
  {
    title: 'Preparing fix',
    detail: 'Synthesizing defensive patch, generating type-safe before/after code diff...',
    icon: Wrench
  },
  {
    title: 'Generating tests',
    detail: 'Constructing Happy Path, Negative, and Edge Regression test suites...',
    icon: FlaskConical
  }
];

interface AILoadingAnimationProps {
  onComplete?: () => void;
  speedMs?: number; // duration per step
}

export const AILoadingAnimation: React.FC<AILoadingAnimationProps> = ({ 
  onComplete, 
  speedMs = 700 
}) => {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStageIdx((prev) => {
        if (prev < STAGES.length - 1) {
          const next = prev + 1;
          setLogs((l) => [
            ...l,
            `[${new Date().toLocaleTimeString()}] ✓ Completed: ${STAGES[prev].title}`,
            `[${new Date().toLocaleTimeString()}] → Initiated: ${STAGES[next].title}...`
          ]);
          return next;
        } else {
          clearInterval(timer);
          setTimeout(() => {
            onComplete?.();
          }, 600);
          return prev;
        }
      });
    }, speedMs);

    setLogs([
      `[${new Date().toLocaleTimeString()}] Pipeline initialized by BUG FIX AI reasoning engine`,
      `[${new Date().toLocaleTimeString()}] → Initiated: ${STAGES[0].title}...`
    ]);

    return () => clearInterval(timer);
  }, [speedMs, onComplete]);

  const activeStage = STAGES[currentStageIdx];
  const progressPercent = Math.round(((currentStageIdx + 1) / STAGES.length) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto my-8 bg-dark-900 border border-brand-500/30 rounded-2xl p-6 shadow-[0_0_50px_rgba(6,182,212,0.12)] backdrop-blur-xl">
      {/* Central Visual Scanner */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="relative mb-5">
          <div className="w-20 h-20 rounded-2xl bg-brand-500/10 border border-brand-500/40 flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
            {React.createElement(activeStage.icon, { className: 'w-10 h-10 text-brand-400 animate-pulse' })}
          </div>
          <div className="absolute inset-0 rounded-2xl bg-brand-400/20 blur-xl animate-ping" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950/60 border border-brand-500/40 text-brand-300 text-xs font-mono mb-2">
          <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping" />
          AI REASONING STAGE {currentStageIdx + 1} OF {STAGES.length}
        </div>

        <h3 className="text-xl font-bold text-white tracking-tight">{activeStage.title}</h3>
        <p className="text-xs text-slate-400 max-w-md mt-1">{activeStage.detail}</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
          <span>PIPELINE DISPATCH</span>
          <span className="text-brand-300 font-bold">{progressPercent}%</span>
        </div>
        <div className="h-2 w-full bg-dark-800 rounded-full overflow-hidden p-0.5 border border-dark-700">
          <div
            className="h-full bg-gradient-to-r from-brand-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Checklist of Stages */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
        {STAGES.map((s, idx) => {
          const isDone = idx < currentStageIdx;
          const isCurrent = idx === currentStageIdx;

          return (
            <div
              key={s.title}
              className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 transition-all ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                  : isCurrent
                  ? 'bg-brand-500/10 border-brand-500/50 text-white font-medium shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                  : 'bg-dark-850 border-dark-800 text-slate-500'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : isCurrent ? (
                <div className="w-3.5 h-3.5 rounded-full border-2 border-brand-400 border-t-transparent animate-spin shrink-0" />
              ) : (
                <div className="w-3.5 h-3.5 rounded-full border border-slate-700 shrink-0" />
              )}
              <span className="truncate">{s.title}</span>
            </div>
          );
        })}
      </div>

      {/* Terminal Trace Stream */}
      <div className="bg-dark-950 rounded-xl p-3 border border-dark-800 font-mono text-[11px] text-slate-400">
        <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-dark-800/80 text-slate-500 text-[10px]">
          <Terminal className="w-3 h-3 text-brand-400" />
          <span>LLM DIAGNOSTIC STREAM</span>
        </div>
        <div className="space-y-1 max-h-24 overflow-y-auto">
          {logs.slice(-4).map((log, idx) => (
            <div key={idx} className="truncate">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
