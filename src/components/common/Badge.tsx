import React from 'react';
import { Severity, BugStatus } from '@/types';
import { AlertCircle, AlertTriangle, Info, CheckCircle2, Clock, PlayCircle, ShieldCheck } from 'lucide-react';

interface SeverityBadgeProps {
  severity: Severity;
  className?: string;
  size?: 'sm' | 'md';
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, className = '', size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm font-medium';

  switch (severity) {
    case 'Critical':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-rose-950/60 border border-rose-500/40 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.18)] ${sizeClasses} ${className}`}>
          <AlertCircle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          Critical
        </span>
      );
    case 'High':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-amber-950/50 border border-amber-500/40 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.15)] ${sizeClasses} ${className}`}>
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          High
        </span>
      );
    case 'Medium':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-blue-950/40 border border-blue-500/30 text-blue-300 ${sizeClasses} ${className}`}>
          <Info className="w-3.5 h-3.5 text-blue-400" />
          Medium
        </span>
      );
    case 'Low':
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-slate-800/80 border border-slate-700 text-slate-300 ${sizeClasses} ${className}`}>
          <Info className="w-3.5 h-3.5 text-slate-400" />
          Low
        </span>
      );
  }
};

interface StatusBadgeProps {
  status: BugStatus;
  className?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '', size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm font-medium';

  switch (status) {
    case 'Open':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-slate-800 border border-slate-600 text-slate-300 ${sizeClasses} ${className}`}>
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          Open
        </span>
      );
    case 'Analyzing':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 animate-pulse ${sizeClasses} ${className}`}>
          <PlayCircle className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
          Analyzing
        </span>
      );
    case 'Fix Suggested':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-purple-950/50 border border-purple-500/40 text-purple-300 ${sizeClasses} ${className}`}>
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
          Fix Suggested
        </span>
      );
    case 'Testing':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-amber-950/50 border border-amber-500/40 text-amber-300 ${sizeClasses} ${className}`}>
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          Testing
        </span>
      );
    case 'Verified':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)] ${sizeClasses} ${className}`}>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Verified
        </span>
      );
    case 'Closed':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-dark-800 border border-dark-700 text-slate-400 ${sizeClasses} ${className}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
          Closed
        </span>
      );
    default:
      return null;
  }
};
