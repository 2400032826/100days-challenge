import React, { useState } from 'react';
import { Download, History, LayoutDashboard, Settings, Layers, Menu, X, Sparkles, Smartphone, Check } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, activeDownloadsCount = 0, pwaPrompt, onInstallPwa }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'save', label: 'Save', icon: Download },
    { id: 'queue', label: 'Downloads Queue', icon: Layers, badge: activeDownloadsCount },
    { id: 'history', label: 'History', icon: History },
    { id: 'dashboard', label: 'Analytics', icon: LayoutDashboard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-8 py-3">
      <nav className="max-w-7xl mx-auto glass-panel rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between border border-white/10 shadow-glass backdrop-blur-2xl">
        {/* Logo */}
        <button
          onClick={() => handleNavClick('save')}
          className="flex items-center gap-3 group text-left transition-transform active:scale-95"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-cyan via-brand-blue to-brand-purple p-[1.5px] shadow-glow-purple">
            <div className="w-full h-full bg-[#070913]/90 rounded-[10px] flex items-center justify-center backdrop-blur-md">
              <Download className="w-5 h-5 text-brand-cyan group-hover:translate-y-0.5 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                GlassySave
              </span>
              <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse"></span>
            </div>
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium hidden sm:block">
              Paste. Choose. Save.
            </p>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  isActive
                    ? 'text-white bg-white/10 border border-white/15 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand-cyan' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-brand-cyan via-brand-purple to-brand-pink rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* PWA Install Button */}
          {pwaPrompt && (
            <button
              onClick={onInstallPwa}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-brand-purple/20 hover:bg-brand-purple/30 text-purple-300 border border-brand-purple/40 shadow-glow-purple transition-all duration-200"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>
          )}



          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 border border-white/10 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 glass-panel rounded-2xl p-3 border border-white/10 shadow-glass animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'text-white bg-white/10 border border-white/10'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-brand-cyan' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge > 0 && (
                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-brand-cyan text-[#070913]">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
            {pwaPrompt && (
              <button
                onClick={() => {
                  onInstallPwa();
                  setMobileMenuOpen(false);
                }}
                className="mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium bg-gradient-to-r from-brand-cyan to-brand-purple text-white shadow-glow-cyan"
              >
                <Smartphone className="w-4 h-4" />
                <span>Install GlassySave PWA</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
