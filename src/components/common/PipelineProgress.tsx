import React from 'react';
import { useBugContext, PageView } from '@/context';
import { 
  Bug, 
  Cpu, 
  Search, 
  Wrench, 
  FlaskConical, 
  ShieldCheck, 
  Check, 
  ChevronRight 
} from 'lucide-react';

interface PipelineProgressProps {
  currentStage?: 'report' | 'analysis' | 'diagnose' | 'fix' | 'tests' | 'verification';
  className?: string;
}

export const PipelineProgress: React.FC<PipelineProgressProps> = ({ currentStage, className = '' }) => {
  const { activeBug, setActiveView } = useBugContext();

  const stages: {
    key: string;
    label: string;
    sublabel: string;
    icon: React.ComponentType<{ className?: string }>;
    targetView?: PageView;
    isCompleted: boolean;
    isActive: boolean;
    isAvailable: boolean;
  }[] = [
    {
      key: 'report',
      label: 'Bug',
      sublabel: 'Intake & Symptoms',
      icon: Bug,
      targetView: 'report',
      isCompleted: !!activeBug,
      isActive: currentStage === 'report',
      isAvailable: true
    },
    {
      key: 'analysis',
      label: 'Analyze',
      sublabel: 'Pattern Matching',
      icon: Cpu,
      targetView: 'analysis',
      isCompleted: !!activeBug?.analysis,
      isActive: currentStage === 'analysis',
      isAvailable: !!activeBug?.analysis
    },
    {
      key: 'diagnose',
      label: 'Diagnose',
      sublabel: 'Probable Root Cause',
      icon: Search,
      targetView: 'analysis',
      isCompleted: !!activeBug?.analysis?.probableRootCause,
      isActive: currentStage === 'diagnose' || currentStage === 'analysis',
      isAvailable: !!activeBug?.analysis
    },
    {
      key: 'fix',
      label: 'Fix',
      sublabel: 'Before vs After Code',
      icon: Wrench,
      targetView: 'fix',
      isCompleted: !!activeBug?.fix,
      isActive: currentStage === 'fix',
      isAvailable: !!activeBug?.fix || !!activeBug?.analysis
    },
    {
      key: 'tests',
      label: 'Test',
      sublabel: 'Regression Suite',
      icon: FlaskConical,
      targetView: 'tests',
      isCompleted: (activeBug?.testCases?.length || 0) > 0,
      isActive: currentStage === 'tests',
      isAvailable: !!activeBug?.fix
    },
    {
      key: 'verification',
      label: 'Verify',
      sublabel: 'Ready for Review',
      icon: ShieldCheck,
      targetView: 'verification',
      isCompleted: activeBug?.verification?.status === 'PASSED' || activeBug?.verification?.status === 'VERIFIED IN DEMO',
      isActive: currentStage === 'verification',
      isAvailable: (activeBug?.testCases?.length || 0) > 0
    }
  ];

  return (
    <div className={`w-full bg-dark-900/90 border border-dark-750/70 rounded-2xl p-4 shadow-xl backdrop-blur-md ${className}`}>
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-brand-400 animate-ping" />
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-300">
            Pipeline Progression
          </span>
          <span className="text-slate-500 text-xs hidden sm:inline">&bull; 🐞 Bug → 🤖 Analyze → 🔍 Diagnose → 🔧 Fix → 🧪 Test → ✅ Verify</span>
        </div>
        {activeBug && (
          <span className="text-xs font-mono text-slate-400 bg-dark-850 px-2.5 py-1 rounded-lg border border-dark-750">
            Active: <span className="text-brand-300 font-semibold">{activeBug.id}</span>
          </span>
        )}
      </div>

      {/* Horizontal Stage Stepper */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {stages.map((st, idx) => {
          const Icon = st.icon;
          const isCurrent = st.isActive;
          const isDone = st.isCompleted && !isCurrent;

          let cardStyle = 'bg-dark-850/60 border-dark-800 text-slate-400 hover:border-dark-700';
          let iconStyle = 'bg-dark-800 text-slate-400';

          if (isCurrent) {
            cardStyle = 'bg-brand-500/10 border-brand-500/50 text-white shadow-[0_0_15px_rgba(6,182,212,0.18)] ring-1 ring-brand-500/30';
            iconStyle = 'bg-brand-500 text-dark-950 font-bold';
          } else if (isDone) {
            cardStyle = 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200 hover:border-emerald-500/50';
            iconStyle = 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
          }

          return (
            <button
              key={st.key}
              disabled={!st.isAvailable}
              onClick={() => st.targetView && setActiveView(st.targetView)}
              className={`flex flex-col text-left p-3 rounded-xl border transition-all duration-200 relative group ${cardStyle} ${
                !st.isAvailable ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 ${iconStyle}`}>
                  {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : <Icon className="w-3.5 h-3.5" />}
                </div>
                <span className="text-[10px] font-mono text-slate-500 font-medium">0{idx + 1}</span>
              </div>
              <div className="font-bold text-xs tracking-tight truncate w-full flex items-center gap-1">
                <span>{st.label}</span>
              </div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">{st.sublabel}</div>

              {idx < stages.length - 1 && (
                <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                  <ChevronRight className="w-3.5 h-3.5 text-dark-700" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
