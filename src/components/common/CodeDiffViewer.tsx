import React, { useState } from 'react';
import { Copy, Check, FileCode, Split, Columns } from 'lucide-react';

interface CodeDiffViewerProps {
  filename?: string;
  language?: string;
  beforeCode: string;
  afterCode: string;
}

export const CodeDiffViewer: React.FC<CodeDiffViewerProps> = ({
  filename = 'source_code.ts',
  language = 'typescript',
  beforeCode,
  afterCode,
}) => {
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(afterCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const beforeLines = beforeCode.split('\n');
  const afterLines = afterCode.split('\n');

  return (
    <div className="rounded-xl border border-dark-750 bg-dark-900 overflow-hidden shadow-2xl">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-dark-850 border-b border-dark-750">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <FileCode className="w-4 h-4 text-brand-400" />
            <span className="font-semibold">{filename}</span>
            <span className="px-2 py-0.5 rounded bg-dark-800 text-slate-400 text-[11px] border border-dark-700">
              {language}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex bg-dark-900 rounded-lg p-0.5 border border-dark-750 text-xs">
            <button
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                viewMode === 'split' ? 'bg-dark-750 text-brand-300 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              Split Diff
            </button>
            <button
              onClick={() => setViewMode('unified')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                viewMode === 'unified' ? 'bg-dark-750 text-brand-300 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Split className="w-3.5 h-3.5" />
              Unified
            </button>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg bg-dark-800 hover:bg-dark-750 text-slate-300 border border-dark-700 transition-colors"
            title="Copy fix code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Fix</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Content */}
      {viewMode === 'split' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-dark-750 font-mono text-xs overflow-x-auto">
          {/* BEFORE Pane */}
          <div className="bg-dark-950/70 p-4">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-dark-800">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                BEFORE (Problematic Code)
              </span>
              <span className="text-[10px] text-slate-500">Uncaught Vulnerability</span>
            </div>
            <pre className="text-slate-300 leading-relaxed overflow-x-auto py-1">
              {beforeLines.map((line, idx) => (
                <div key={idx} className="flex hover:bg-rose-950/20 px-1 -mx-1 rounded">
                  <span className="w-8 select-none text-slate-600 text-right pr-3">{idx + 1}</span>
                  <span className="text-rose-200/90 whitespace-pre">{line}</span>
                </div>
              ))}
            </pre>
          </div>

          {/* AFTER Pane */}
          <div className="bg-dark-900/90 p-4">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-dark-800">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                AFTER (Suggested Fix)
              </span>
              <span className="text-[10px] text-emerald-400/80 font-mono">Defensive & Type-Safe</span>
            </div>
            <pre className="text-slate-200 leading-relaxed overflow-x-auto py-1">
              {afterLines.map((line, idx) => (
                <div key={idx} className="flex hover:bg-emerald-950/30 px-1 -mx-1 rounded">
                  <span className="w-8 select-none text-emerald-500/50 text-right pr-3">{idx + 1}</span>
                  <span className="text-emerald-100 whitespace-pre">{line}</span>
                </div>
              ))}
            </pre>
          </div>
        </div>
      ) : (
        /* Unified View */
        <div className="p-4 bg-dark-950/80 font-mono text-xs overflow-x-auto">
          <div className="pb-2 mb-2 border-b border-dark-800 text-[11px] text-slate-400">
            Suggested patch for <span className="text-brand-300">{filename}</span>
          </div>
          <pre className="leading-relaxed">
            {afterLines.map((line, idx) => (
              <div key={idx} className="flex hover:bg-dark-800/50 px-1 -mx-1">
                <span className="w-8 select-none text-slate-600 text-right pr-3">{idx + 1}</span>
                <span className="text-emerald-300/95 whitespace-pre">{line}</span>
              </div>
            ))}
          </pre>
        </div>
      )}
    </div>
  );
};
