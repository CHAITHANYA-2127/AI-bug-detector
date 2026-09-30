import React, { useState } from 'react';
import { useBugContext } from '@/context';
import { X, Key, Shield, Zap, RefreshCw, Check } from 'lucide-react';

export const ApiKeyModal: React.FC = () => {
  const { settingsModalOpen, setSettingsModalOpen, apiKey, setApiKey, isDemoMode, resetToInitialBugs } = useBugContext();
  const [inputKey, setInputKey] = useState(apiKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!settingsModalOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setApiKey(inputKey.trim() || null);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setSettingsModalOpen(false);
    }, 1000);
  };

  const handleClear = () => {
    setInputKey('');
    setApiKey(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-dark-900 border border-dark-750 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-750 bg-dark-850">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-brand-500/10 border border-brand-500/30 text-brand-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">AI Configuration & Settings</h3>
              <p className="text-xs text-slate-400">Configure LLM providers or toggle Demo Mode</p>
            </div>
          </div>
          <button
            onClick={() => setSettingsModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Mode indicator banner */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            isDemoMode
              ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
              : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
          }`}>
            <Zap className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-xs">
              <div className="font-semibold text-sm mb-0.5">
                Current Engine: {isDemoMode ? '⚡ Deterministic Demo Engine (Active)' : '🟢 Live AI Model (Connected)'}
              </div>
              <p className="opacity-90 leading-relaxed">
                {isDemoMode
                  ? 'Demo Mode generates realistic, instantaneous, context-aware bug analysis, code diffs, and test suites with zero external API dependencies. Ideal for hackathon judging.'
                  : 'Live AI Model makes real-time prompt generation requests using your configured API key.'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Gemini or LLM API Key (Optional)
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="AIzaSy... or sk-..."
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  className="w-full bg-dark-950 border border-dark-750 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl px-4 py-2.5 text-sm text-slate-200 font-mono placeholder:text-slate-600 transition-all outline-none"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-brand-400" />
                Never exposed to backend servers. Key is stored strictly in your browser's localStorage.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
              >
                Clear key (Revert to Demo Mode)
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-dark-950 font-semibold text-sm shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    Saved!
                  </>
                ) : (
                  'Save Settings'
                )}
              </button>
            </div>
          </form>

          {/* Reset Demo Data */}
          <div className="pt-4 border-t border-dark-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-300">Reset Hackathon Demo Data</div>
              <div className="text-[11px] text-slate-500">Restore default demo bugs (BUG-1001 to BUG-1006)</div>
            </div>
            <button
              onClick={() => {
                resetToInitialBugs();
                setSettingsModalOpen(false);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-750 text-xs font-medium text-slate-300 border border-dark-700 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
