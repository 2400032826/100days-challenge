import React from 'react';
import { LayoutDashboard, Download, Film, Music, HardDrive, TrendingUp, Sparkles, ShieldCheck, Smartphone } from 'lucide-react';

export default function DashboardStats({ stats }) {
  if (!stats) return null;

  const statCards = [
    {
      title: 'Total Device Downloads',
      value: stats.totalDownloads || 0,
      icon: Download,
      gradient: 'from-brand-cyan to-blue-500',
      glow: 'shadow-glow-cyan',
      textColor: 'text-brand-cyan',
      description: 'Saved directly to local device storage'
    },
    {
      title: 'Videos Saved to Device',
      value: stats.videosDownloaded || 0,
      icon: Film,
      gradient: 'from-brand-blue to-brand-purple',
      glow: 'shadow-glow-purple',
      textColor: 'text-brand-blue',
      description: 'MP4 & WebM high definition files'
    },
    {
      title: 'Audio Saved to Device',
      value: stats.audioDownloaded || 0,
      icon: Music,
      gradient: 'from-brand-purple to-brand-pink',
      glow: 'shadow-glow-pink',
      textColor: 'text-brand-purple',
      description: 'MP3 & M4A sound tracks'
    },
    {
      title: 'Device Data Streamed',
      value: stats.storageUsed || '0 MB',
      icon: HardDrive,
      gradient: 'from-brand-pink to-rose-500',
      glow: 'shadow-glow-pink',
      textColor: 'text-brand-pink',
      description: 'Transferred directly to user storage'
    },
    {
      title: 'Downloads This Week',
      value: stats.downloadsThisWeek || 0,
      icon: TrendingUp,
      gradient: 'from-emerald-400 to-teal-500',
      glow: 'shadow-glow-cyan',
      textColor: 'text-emerald-400',
      description: 'Activity in the last 7 days'
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
          <LayoutDashboard className="w-7 h-7 text-brand-cyan" />
          <span>Device Analytics & Statistics</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Real-time summary of media streamed directly to your local device.
        </p>
      </div>

      {/* 5 Glass Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="glass-panel glass-panel-hover rounded-3xl p-5 border border-white/10 relative overflow-hidden flex flex-col justify-between"
            >
              {/* Subtle orb */}
              <div
                className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-br ${card.gradient} rounded-full blur-3xl opacity-20 pointer-events-none`}
              ></div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {card.title}
                </span>
                <div
                  className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${card.gradient} p-[1.5px] ${card.glow}`}
                >
                  <div className="w-full h-full bg-[#070913]/85 rounded-[14px] flex items-center justify-center">
                    <Icon className={`w-5 h-5 ${card.textColor}`} />
                  </div>
                </div>
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight mb-1">
                  {card.value}
                </div>
                <p className="text-[11px] text-slate-400">{card.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Zero Permanent Server Storage Guarantee */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Direct Device Download • Zero Server Retention</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              GlassySave does NOT permanently store media on our servers. Files stream directly to your local phone, tablet, or PC with automatic temporary file cleanup.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-brand-cyan">
            Direct Stream Engine
          </span>
        </div>
      </div>
    </div>
  );
}
