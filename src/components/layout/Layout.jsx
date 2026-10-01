import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MobileNav from './MobileNav';
import OnboardingFlow from '../onboarding/OnboardingFlow';
import QuickAddModal from '../common/QuickAddModal';
import InstallPromptBanner from '../common/InstallPromptBanner';
import { useApp } from '../../context/AppContext';
import { Plus, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function Layout() {
  const { data, toasts, openQuickAdd } = useApp();

  const showOnboarding = data.user?.onboardingComplete === false;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col antialiased">
      {/* Onboarding Dialog if first launch */}
      {showOnboarding && <OnboardingFlow />}

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 pb-20 lg:pb-10">
        <InstallPromptBanner />
        <TopBar />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Floating Quick Add Button */}
      <button
        type="button"
        onClick={() => openQuickAdd('task')}
        className="fixed bottom-20 right-5 lg:bottom-8 lg:right-8 z-30 w-12 h-12 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white flex items-center justify-center shadow-lg shadow-blue-500/30 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        title="Quick Entry"
      >
        <Plus size={22} className="stroke-[2.5]" />
      </button>

      {/* Quick Add Modal */}
      <QuickAddModal />

      {/* Real Toast Notifications */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isDanger = toast.type === 'danger';
          return (
            <div
              key={toast.id}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border shadow-lg text-xs font-semibold pointer-events-auto bg-white ${
                isSuccess
                  ? 'border-emerald-200 text-emerald-800'
                  : isDanger
                  ? 'border-red-200 text-red-800'
                  : 'border-[#E2E8F0] text-[#0F172A]'
              }`}
            >
              {isSuccess && <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />}
              {isDanger && <AlertCircle size={16} className="text-red-600 shrink-0" />}
              {!isSuccess && !isDanger && <Info size={16} className="text-[#2563EB] shrink-0" />}
              <span>{toast.message}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
