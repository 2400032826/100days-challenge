import React from 'react';
import { Download, Layers, History, LayoutDashboard, Settings } from 'lucide-react';

export default function MobileBottomNav({ activeTab, setActiveTab, activeDownloadsCount = 0 }) {
  const tabs = [
    { id: 'save', label: 'Save', icon: Download },
    { id: 'queue', label: 'Queue', icon: Layers, badge: activeDownloadsCount },
    { id: 'history', label: 'History', icon: History },
    { id: 'dashboard', label: 'Stats', icon: LayoutDashboard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-3 pb-safe pt-2 bg-[#070913]/85 backdrop-blur-xl border-t border-white/10 shadow-glass">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-col items-center justify-center py-1.5 px-3 min-w-[56px] min-h-[44px] transition-all group"
            >
              {isActive && (
                <span className="absolute -top-2 w-8 h-1 bg-gradient-to-r from-brand-cyan to-brand-purple rounded-full shadow-glow-cyan" />
              )}
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive
                      ? 'text-brand-cyan scale-110'
                      : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                {tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 px-1 min-w-[14px] h-[14px] flex items-center justify-center text-[9px] font-bold rounded-full bg-brand-cyan text-[#070913]">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-1 font-medium tracking-tight transition-colors ${
                  isActive ? 'text-white font-semibold' : 'text-slate-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
