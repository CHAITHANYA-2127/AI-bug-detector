import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { BugRecord, BugStatus, Severity, Category, TestCase } from '@/types';
import { initialBugs } from '@/data/initialBugs';
import { bugAnalyzer } from '@/services/ai/bugAnalyzer';
import { fixGenerator } from '@/services/ai/fixGenerator';
import { ToastContainer, ToastItem } from '@/components/common/Toast';

export type PageView = 
  | 'landing' 
  | 'dashboard' 
  | 'report' 
  | 'analysis' 
  | 'fix' 
  | 'tests' 
  | 'verification' 
  | 'history' 
  | 'pipeline';

export interface AIInsight {
  id: string;
  type: 'warning' | 'info' | 'success';
  title: string;
  message: string;
  relatedBugIds?: string[];
}

interface BugContextType {
  bugs: BugRecord[];
  activeBugId: string | null;
  activeBug: BugRecord | null;
  activeView: PageView;
  setActiveView: (view: PageView) => void;
  setActiveBugId: (id: string | null) => void;
  selectBugAndNavigate: (bugId: string, view: PageView) => void;
  addBug: (bug: BugRecord) => void;
  updateBug: (id: string, updates: Partial<BugRecord>) => void;
  deleteBug: (id: string) => void;
  resetToInitialBugs: () => void;
  
  // API & Demo state
  apiKey: string | null;
  setApiKey: (key: string | null) => void;
  isDemoMode: boolean;
  liveDemoModalOpen: boolean;
  setLiveDemoModalOpen: (open: boolean) => void;
  settingsModalOpen: boolean;
  setSettingsModalOpen: (open: boolean) => void;

  // Stats & Visual breakdowns
  stats: {
    totalBugs: number;
    openBugs: number;
    criticalBugs: number;
    fixesGenerated: number;
    testsGenerated: number;
    verifiedFixes: number;
    severityCounts: Record<Severity, number>;
    statusCounts: Record<BugStatus, number>;
  };
  insights: AIInsight[];

  // Toast notifications
  showToast: (message: string, type?: 'success' | 'warning' | 'info') => void;
}

const BugContext = createContext<BugContextType | undefined>(undefined);

const STORAGE_KEY = 'bug_fix_ai_records_v2';
const API_KEY_STORAGE = 'bug_fix_ai_api_key';

export const BugProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bugs, setBugs] = useState<BugRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load saved bugs from localStorage:', e);
    }
    return initialBugs;
  });

  const [activeBugId, setActiveBugId] = useState<string | null>(() => {
    return initialBugs[1]?.id || initialBugs[0]?.id || null;
  });

  const [activeView, setActiveView] = useState<PageView>('landing');
  const [liveDemoModalOpen, setLiveDemoModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const [apiKey, setApiKeyState] = useState<string | null>(() => {
    return localStorage.getItem(API_KEY_STORAGE) || import.meta.env.VITE_AI_API_KEY || null;
  });

  const showToast = (message: string, type: 'success' | 'warning' | 'info' = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setApiKey = (key: string | null) => {
    setApiKeyState(key);
    if (key) {
      localStorage.setItem(API_KEY_STORAGE, key);
      bugAnalyzer.setApiKey(key);
      fixGenerator.setApiKey(key);
      showToast('Live AI API key configured successfully', 'success');
    } else {
      localStorage.removeItem(API_KEY_STORAGE);
      bugAnalyzer.setApiKey(null);
      fixGenerator.setApiKey(null);
      showToast('Reverted to Deterministic Demo Mode', 'info');
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bugs));
    } catch (e) {
      console.error('Failed to sync bugs to localStorage:', e);
    }
  }, [bugs]);

  const activeBug = useMemo(() => {
    return bugs.find((b) => b.id === activeBugId) || bugs[0] || null;
  }, [bugs, activeBugId]);

  const selectBugAndNavigate = (bugId: string, view: PageView) => {
    setActiveBugId(bugId);
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addBug = (newBug: BugRecord) => {
    setBugs((prev) => [newBug, ...prev]);
    setActiveBugId(newBug.id);
    showToast(`Bug ${newBug.id} logged and analyzed`, 'success');
  };

  const updateBug = (id: string, updates: Partial<BugRecord>) => {
    setBugs((prev) =>
      prev.map((bug) => {
        if (bug.id === id) {
          return {
            ...bug,
            ...updates,
            updatedAt: new Date().toISOString()
          };
        }
        return bug;
      })
    );
  };

  const deleteBug = (id: string) => {
    setBugs((prev) => prev.filter((b) => b.id !== id));
    if (activeBugId === id) {
      const remaining = bugs.filter((b) => b.id !== id);
      setActiveBugId(remaining[0]?.id || null);
    }
    showToast(`Bug ${id} deleted`, 'info');
  };

  const resetToInitialBugs = () => {
    setBugs(initialBugs);
    setActiveBugId(initialBugs[1]?.id || initialBugs[0]?.id || null);
    localStorage.removeItem(STORAGE_KEY);
    showToast('Reset to original hackathon demo data', 'info');
  };

  const stats = useMemo(() => {
    const totalBugs = bugs.length;
    const openBugs = bugs.filter((b) => b.status === 'Open' || b.status === 'Analyzing').length;
    const criticalBugs = bugs.filter((b) => b.severity === 'Critical').length;
    const fixesGenerated = bugs.filter((b) => !!b.fix).length;
    const testsGenerated = bugs.reduce((acc, b) => acc + (b.testCases?.length || 0), 0);
    const verifiedFixes = bugs.filter((b) => b.verification?.status === 'PASSED' || b.verification?.status === 'VERIFIED IN DEMO').length;

    const severityCounts: Record<Severity, number> = {
      Critical: bugs.filter((b) => b.severity === 'Critical').length,
      High: bugs.filter((b) => b.severity === 'High').length,
      Medium: bugs.filter((b) => b.severity === 'Medium').length,
      Low: bugs.filter((b) => b.severity === 'Low').length
    };

    const statusCounts: Record<BugStatus, number> = {
      Open: bugs.filter((b) => b.status === 'Open').length,
      Analyzing: bugs.filter((b) => b.status === 'Analyzing').length,
      'Fix Suggested': bugs.filter((b) => b.status === 'Fix Suggested').length,
      Testing: bugs.filter((b) => b.status === 'Testing').length,
      Verified: bugs.filter((b) => b.status === 'Verified').length,
      Closed: bugs.filter((b) => b.status === 'Closed').length
    };

    return {
      totalBugs,
      openBugs,
      criticalBugs,
      fixesGenerated,
      testsGenerated,
      verifiedFixes,
      severityCounts,
      statusCounts
    };
  }, [bugs]);

  const insights = useMemo((): AIInsight[] => {
    const list: AIInsight[] = [];

    // 1. Attention required
    const unaddressed = bugs.filter((b) => b.status === 'Open' || b.status === 'Analyzing');
    if (unaddressed.length > 0) {
      list.push({
        id: 'ins-att',
        type: 'warning',
        title: 'Pending Developer Attention',
        message: `${unaddressed.length} bug${unaddressed.length > 1 ? 's' : ''} require attention and have not yet completed the automated remediation pipeline.`,
        relatedBugIds: unaddressed.map((b) => b.id)
      });
    }

    // 2. Correlated authentication patterns
    const authBugs = bugs.filter((b) => b.category === 'Authentication');
    if (authBugs.length >= 2) {
      list.push({
        id: 'ins-auth',
        type: 'info',
        title: 'Related Pattern Correlation',
        message: `${authBugs.length} reports may describe related authentication problems (token refresh race conditions and timeout handling).`,
        relatedBugIds: authBugs.map((b) => b.id)
      });
    }

    // 3. Critical verification awaiting
    const critAwaiting = bugs.filter((b) => b.severity === 'Critical' && (!b.verification || b.verification.status !== 'PASSED'));
    if (critAwaiting.length > 0) {
      list.push({
        id: 'ins-crit',
        type: 'warning',
        title: 'Critical Issues Awaiting Verification',
        message: `${critAwaiting.length} critical issue${critAwaiting.length > 1 ? 's are' : ' is'} awaiting automated regression verification prior to merge review.`,
        relatedBugIds: critAwaiting.map((b) => b.id)
      });
    }

    return list;
  }, [bugs]);

  return (
    <BugContext.Provider
      value={{
        bugs,
        activeBugId,
        activeBug,
        activeView,
        setActiveView,
        setActiveBugId,
        selectBugAndNavigate,
        addBug,
        updateBug,
        deleteBug,
        resetToInitialBugs,
        apiKey,
        setApiKey,
        isDemoMode: !apiKey,
        liveDemoModalOpen,
        setLiveDemoModalOpen,
        settingsModalOpen,
        setSettingsModalOpen,
        stats,
        insights,
        showToast
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </BugContext.Provider>
  );
};

export const useBugContext = () => {
  const ctx = useContext(BugContext);
  if (!ctx) throw new Error('useBugContext must be used within a BugProvider');
  return ctx;
};
