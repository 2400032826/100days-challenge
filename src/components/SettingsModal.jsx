import React, { useState } from 'react';
import { Settings, Save, Shield, FileText, Info, Bell, Moon, Sun, Folder, RefreshCw, Check, Lock } from 'lucide-react';

export default function SettingsModal({
  settings,
  onSaveSettings,
  onOpenLegal,
  privateMode,
  setPrivateMode,
}) {
  const [formData, setFormData] = useState(settings || {
    defaultFormat: 'mp4',
    defaultQuality: '1080p',
    defaultLocation: 'Downloads/GlassySave',
    autoClearHistory: false,
    appearance: 'dark',
    notifications: true,
    language: 'en',
  });
  const [isSaved, setIsSaved] = useState(false);

  const formats = [
    { id: 'mp4', label: 'MP4 Video' },
    { id: 'mp3', label: 'MP3 Audio' },
    { id: 'm4a', label: 'M4A Audio' },
    { id: 'webm', label: 'WebM Video' },
  ];

  const qualities = [
    { id: 'best', label: 'Best Available' },
    { id: '1080p', label: '1080p Full HD' },
    { id: '720p', label: '720p HD' },
    { id: '480p', label: '480p SD' },
    { id: '320kbps', label: 'Audio 320 kbps' },
  ];

  const languages = [
    { id: 'en', label: 'English (US)' },
    { id: 'es', label: 'Español' },
    { id: 'fr', label: 'Français' },
    { id: 'de', label: 'Deutsch' },
    { id: 'ja', label: '日本語' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-brand-purple" />
          <span>Application Settings</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Customize your default formats, notifications, and device download behavior.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Privacy Mode */}
        <div className="glass-panel rounded-3xl p-6 border border-brand-purple/30 bg-brand-purple/[0.04] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-pink/20 border border-brand-pink/40 flex items-center justify-center text-brand-pink">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Private Download Mode</h4>
                <p className="text-xs text-slate-400">
                  Don't save download history, don't store thumbnails, purge temp files instantly
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPrivateMode(!privateMode)}
              className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${
                privateMode ? 'bg-brand-pink' : 'bg-white/10'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white transition-transform duration-300 ${
                  privateMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Section 2: Download Defaults */}
        <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300 pb-2 border-b border-white/10">
            Download Preferences
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Default Format */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Default Format
              </label>
              <select
                value={formData.defaultFormat}
                onChange={(e) => setFormData({ ...formData, defaultFormat: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-sm text-white focus:outline-none focus:border-brand-purple"
              >
                {formats.map((f) => (
                  <option key={f.id} value={f.id} className="bg-[#0b0f19] text-white">
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Default Quality */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Default Resolution / Bitrate
              </label>
              <select
                value={formData.defaultQuality}
                onChange={(e) => setFormData({ ...formData, defaultQuality: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-sm text-white focus:outline-none focus:border-brand-purple"
              >
                {qualities.map((q) => (
                  <option key={q.id} value={q.id} className="bg-[#0b0f19] text-white">
                    {q.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Behavior & Notifications */}
        <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300 pb-2 border-b border-white/10">
            System & Interface
          </h3>

          <div className="space-y-4">
            {/* Auto-clear History toggle */}
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <div>
                <span className="text-sm font-semibold text-white block">Auto-Clear History</span>
                <span className="text-xs text-slate-400">
                  Automatically purge history logs on window exit
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.autoClearHistory}
                onChange={(e) => setFormData({ ...formData, autoClearHistory: e.target.checked })}
                className="w-5 h-5 accent-brand-cyan rounded cursor-pointer"
              />
            </div>

            {/* Notifications toggle */}
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <div>
                <span className="text-sm font-semibold text-white block">Device Notifications</span>
                <span className="text-xs text-slate-400">
                  Show alerts when download completes on device
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.notifications}
                onChange={(e) => setFormData({ ...formData, notifications: e.target.checked })}
                className="w-5 h-5 accent-brand-cyan rounded cursor-pointer"
              />
            </div>

            {/* Language Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2">
              <div>
                <span className="text-sm font-semibold text-white block">Interface Language</span>
                <span className="text-xs text-slate-400">Select your preferred localization</span>
              </div>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/15 text-xs text-white focus:outline-none focus:border-brand-purple"
              >
                {languages.map((l) => (
                  <option key={l.id} value={l.id} className="bg-[#0b0f19] text-white">
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Legal & Information Links */}
        <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300 pb-2 border-b border-white/10">
            About & Compliance
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => onOpenLegal('about')}
              className="p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-left transition-all flex items-center gap-3"
            >
              <Info className="w-5 h-5 text-brand-cyan shrink-0" />
              <div>
                <span className="text-xs font-bold text-white block">About GlassySave</span>
                <span className="text-[10px] text-slate-400">Direct-to-device principles</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onOpenLegal('privacy')}
              className="p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-left transition-all flex items-center gap-3"
            >
              <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-white block">Zero Server Storage</span>
                <span className="text-[10px] text-slate-400">Temporary processing policy</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onOpenLegal('terms')}
              className="p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-left transition-all flex items-center gap-3"
            >
              <FileText className="w-5 h-5 text-purple-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-white block">Terms & DMCA</span>
                <span className="text-[10px] text-slate-400">Permitted usage terms</span>
              </div>
            </button>
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {isSaved && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 animate-in fade-in">
              <Check className="w-4 h-4" />
              <span>Settings Saved Successfully!</span>
            </span>
          )}

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple text-white font-bold text-xs sm:text-sm shadow-glow-cyan hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
}
