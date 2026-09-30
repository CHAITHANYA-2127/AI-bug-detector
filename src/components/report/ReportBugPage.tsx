import React, { useState } from 'react';
import { useBugContext } from '@/context';
import { BugInput, BugRecord } from '@/types';
import { bugAnalyzer } from '@/services/ai/bugAnalyzer';
import { AILoadingAnimation } from '@/components/common/AILoadingAnimation';
import { demoScenarios } from '@/data/demoScenarios';
import { 
  Bug, 
  Sparkles, 
  Code2, 
  Terminal, 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  Check, 
  AlertCircle,
  HelpCircle,
  X
} from 'lucide-react';

export const ReportBugPage: React.FC = () => {
  const { addBug, selectBugAndNavigate, showToast } = useBugContext();

  const [form, setForm] = useState<BugInput>({
    title: '',
    description: '',
    expectedBehavior: '',
    actualBehavior: '',
    environment: 'Staging / Chrome 124 / Windows 11',
    browser: 'Chrome 124',
    os: 'Windows 11',
    programmingLanguage: 'TypeScript / React',
    relevantCode: '',
    errorLogs: '',
    attachments: []
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedBugRecord, setAnalyzedBugRecord] = useState<BugRecord | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleApplyPreset = (scenarioId: string) => {
    const preset = demoScenarios.find((s) => s.id === scenarioId);
    if (preset) {
      setForm({ ...preset.input, attachments: [] });
      setErrorMsg(null);
      showToast(`Loaded "${preset.buttonLabel}" preset`, 'info');
    }
  };

  const handleFileUpload = (type: 'screenshot' | 'log' | 'code') => {
    // Simulated safe upload for developer UX
    const mockFiles: Record<'screenshot' | 'log' | 'code', { name: string; size: string }> = {
      screenshot: { name: 'checkout_crash_screen.png', size: '1.2 MB' },
      log: { name: 'console_error_trace.log', size: '48 KB' },
      code: { name: 'calculateCartTotal.ts', size: '4.8 KB' }
    };

    const file = mockFiles[type];
    setForm((prev) => ({
      ...prev,
      attachments: [...(prev.attachments || []), { ...file, type }]
    }));
    showToast(`Attached ${file.name}`, 'info');
  };

  const handleRemoveAttachment = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      attachments: prev.attachments?.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description.trim()) {
      setErrorMsg('Please describe the bug symptoms or paste an error message.');
      return;
    }

    setErrorMsg(null);
    setIsAnalyzing(true);

    const bugId = `BUG-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const analysis = await bugAnalyzer.analyzeBug({ input: form, bugId });

      const newBug: BugRecord = {
        id: bugId,
        title: form.title?.trim() || analysis.generatedTitle,
        description: form.description,
        input: form,
        severity: analysis.severity,
        category: analysis.category,
        status: 'Fix Suggested',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        analysis
      };

      setAnalyzedBugRecord(newBug);
    } catch (err: any) {
      console.error(err);
      setIsAnalyzing(false);
      setErrorMsg('Failed to analyze bug. Please try again.');
      showToast('Error analyzing bug', 'warning');
    }
  };

  const handleAnimationComplete = () => {
    if (analyzedBugRecord) {
      addBug(analyzedBugRecord);
      selectBugAndNavigate(analyzedBugRecord.id, 'analysis');
    }
  };

  if (isAnalyzing) {
    return (
      <div className="py-12">
        <AILoadingAnimation onComplete={handleAnimationComplete} speedMs={600} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-brand-400 mb-1">
          <Bug className="w-4 h-4" />
          <span>Stage 01: Intake & Symptom Parsing</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Report a Software Bug
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Provide natural language bug reports, logs, code snippets, or error traces. BUG FIX AI synthesizes structured root-cause analyses and verifiable patches.
        </p>
      </div>

      {/* Preset Quick Fill Bar (5 quick presets) */}
      <div className="p-4 rounded-2xl bg-dark-900 border border-brand-500/20 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            Quick Example Presets (Click to Populate):
          </span>
          <span className="text-[11px] text-slate-500 font-mono">1-Click Intake</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {demoScenarios.map((sc) => (
            <button
              key={sc.id}
              type="button"
              onClick={() => handleApplyPreset(sc.id)}
              className="px-3 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 border border-dark-750 hover:border-brand-500/40 text-xs font-medium text-slate-300 transition-colors"
            >
              {sc.buttonLabel}
            </button>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Submission Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bug Title (Optional) */}
        <div className="p-6 rounded-2xl bg-dark-900 border border-dark-750 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Bug Title <span className="text-slate-500 font-normal lowercase">(optional — AI generates if blank)</span>
              </label>
            </div>
            <input
              type="text"
              placeholder="e.g., Checkout crashes after item removal and coupon discount application"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-dark-950 border border-dark-750 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none transition-all"
            />
          </div>

          {/* Bug Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Bug Description <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={4}
              required
              placeholder="Describe what happened, user actions, unexpected behaviors, or error prompts in plain English..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-dark-950 border border-dark-750 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl p-4 text-sm text-white placeholder:text-slate-600 outline-none transition-all resize-y"
            />
          </div>

          {/* Expected vs Actual Behavior */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Expected Behavior
              </label>
              <textarea
                rows={2}
                placeholder="What should have happened?"
                value={form.expectedBehavior}
                onChange={(e) => setForm({ ...form, expectedBehavior: e.target.value })}
                className="w-full bg-dark-950 border border-dark-750 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 outline-none transition-all resize-y"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Actual Behavior
              </label>
              <textarea
                rows={2}
                placeholder="What actually occurred?"
                value={form.actualBehavior}
                onChange={(e) => setForm({ ...form, actualBehavior: e.target.value })}
                className="w-full bg-dark-950 border border-dark-750 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 outline-none transition-all resize-y"
              />
            </div>
          </div>
        </div>

        {/* Environment & Stack */}
        <div className="p-6 rounded-2xl bg-dark-900 border border-dark-750 space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 pb-2 border-b border-dark-800">
            Runtime & Environment Context
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Language / Framework</label>
              <input
                type="text"
                placeholder="TypeScript, Python, Go..."
                value={form.programmingLanguage}
                onChange={(e) => setForm({ ...form, programmingLanguage: e.target.value })}
                className="w-full bg-dark-950 border border-dark-750 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Browser / Client</label>
              <input
                type="text"
                placeholder="Chrome 124, Safari..."
                value={form.browser}
                onChange={(e) => setForm({ ...form, browser: e.target.value })}
                className="w-full bg-dark-950 border border-dark-750 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Operating System / Platform</label>
              <input
                type="text"
                placeholder="Windows 11, Ubuntu 22.04..."
                value={form.os}
                onChange={(e) => setForm({ ...form, os: e.target.value })}
                className="w-full bg-dark-950 border border-dark-750 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Code & Error Logs */}
        <div className="p-6 rounded-2xl bg-dark-900 border border-dark-750 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-brand-400" />
                Relevant Problematic Code (Optional)
              </label>
            </div>
            <textarea
              rows={4}
              placeholder="Paste function, component, or code snippet where failure is suspected..."
              value={form.relevantCode}
              onChange={(e) => setForm({ ...form, relevantCode: e.target.value })}
              className="w-full bg-dark-950 border border-dark-750 font-mono text-xs text-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl p-4 outline-none resize-y"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
                Error Logs / Stack Trace (Optional)
              </label>
            </div>
            <textarea
              rows={3}
              placeholder="Paste console error, TypeError trace, or network failure dump..."
              value={form.errorLogs}
              onChange={(e) => setForm({ ...form, errorLogs: e.target.value })}
              className="w-full bg-dark-950 border border-dark-750 font-mono text-xs text-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl p-4 outline-none resize-y"
            />
          </div>

          {/* File Upload UI */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Attach Artifacts (UI Mockup)
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleFileUpload('screenshot')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 text-xs text-slate-300 border border-dark-750 transition-colors"
              >
                <ImageIcon className="w-3.5 h-3.5 text-brand-400" />
                <span>+ Screenshot</span>
              </button>
              <button
                type="button"
                onClick={() => handleFileUpload('log')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 text-xs text-slate-300 border border-dark-750 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>+ Error Log</span>
              </button>
              <button
                type="button"
                onClick={() => handleFileUpload('code')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 text-xs text-slate-300 border border-dark-750 transition-colors"
              >
                <Code2 className="w-3.5 h-3.5 text-purple-400" />
                <span>+ Code File</span>
              </button>
            </div>

            {/* Attached Badges */}
            {form.attachments && form.attachments.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {form.attachments.map((att, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-950 border border-dark-750 text-xs text-slate-300 font-mono"
                  >
                    <span>{att.name}</span>
                    <span className="text-[10px] text-slate-500">({att.size})</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(idx)}
                      className="text-slate-500 hover:text-rose-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Primary CTA Button */}
        <div className="flex items-center justify-end gap-4 pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-brand-500 hover:bg-brand-400 text-dark-950 font-extrabold text-sm sm:text-base shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-5 h-5 fill-dark-950" />
            <span>Analyze Bug with AI</span>
          </button>
        </div>
      </form>
    </div>
  );
};
