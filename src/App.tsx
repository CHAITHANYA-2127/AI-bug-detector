import React, { useState } from 'react';
import { useBugContext, PageView } from '@/context';
import { Navbar } from '@/components/common/Navbar';
import { Sidebar } from '@/components/common/Sidebar';
import { ApiKeyModal } from '@/components/common/ApiKeyModal';
import { LiveDemoModal } from '@/components/demo/LiveDemoModal';
import { LandingPage } from '@/components/landing/LandingPage';
import { DashboardPage } from '@/components/dashboard/DashboardPage';
import { ReportBugPage } from '@/components/report/ReportBugPage';
import { AnalysisPage } from '@/components/analysis/AnalysisPage';
import { FixPage } from '@/components/fix/FixPage';
import { TestGeneratorPage } from '@/components/tests/TestGeneratorPage';
import { VerificationPage } from '@/components/verification/VerificationPage';
import { HistoryPage } from '@/components/history/HistoryPage';
import { PromptToProductionPage } from '@/components/pipeline/PromptToProductionPage';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Cpu, 
  Wrench, 
  FlaskConical, 
  ShieldCheck, 
  History, 
  Home,
  Menu,
  X
} from 'lucide-react';

export const AppContent: React.FC = () => {
  const { activeView, setActiveView } = useBugContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeView) {
      case 'landing':
        return <LandingPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'report':
        return <ReportBugPage />;
      case 'analysis':
        return <AnalysisPage />;
      case 'fix':
        return <FixPage />;
      case 'tests':
        return <TestGeneratorPage />;
      case 'verification':
        return <VerificationPage />;
      case 'history':
        return <HistoryPage />;
      case 'pipeline':
        return <PromptToProductionPage />;
      default:
        return <LandingPage />;
    }
  };

  const mobileNavItems: { id: PageView; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'landing', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'report', label: 'Report', icon: PlusCircle },
    { id: 'analysis', label: 'Analysis', icon: Cpu },
    { id: 'fix', label: 'Fixes', icon: Wrench },
    { id: 'tests', label: 'Tests', icon: FlaskConical },
    { id: 'verification', label: 'Verify', icon: ShieldCheck },
    { id: 'history', label: 'History', icon: History }
  ];

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col selection:bg-brand-500/30 selection:text-brand-200">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pb-20 md:pb-10">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-dark-900/95 border-t border-dark-800 backdrop-blur-xl px-2 py-1.5 flex items-center justify-around">
        {mobileNavItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-medium transition-colors ${
                isActive ? 'text-brand-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-medium text-slate-400 hover:text-slate-200"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          <span>More</span>
        </button>
      </div>

      {/* Mobile Drawer for More Items */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 bottom-16 z-50 bg-dark-900 border-t border-dark-750 p-4 shadow-2xl space-y-2">
          {mobileNavItems.slice(5).map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-semibold ${
                  isActive ? 'bg-brand-500/10 text-brand-300' : 'text-slate-300 hover:bg-dark-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Global Modals */}
      <ApiKeyModal />
      <LiveDemoModal />
    </div>
  );
};

export const App: React.FC = () => {
  return <AppContent />;
};
export default App;
