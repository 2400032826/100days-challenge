import React from 'react';
import { useApp } from '../context/AppContext';
import { Trophy, Lock, CheckCircle2, Award } from 'lucide-react';
import ProgressBar from '../components/common/ProgressBar';

export default function AchievementsPage() {
  const { data } = useApp();

  const achievements = data.achievements || [];
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const progressPercent = Math.round((unlockedCount / Math.max(1, achievements.length)) * 100);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="arc-card p-6 sm:p-8 bg-white border border-[#E2E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] block">
            VERIFIED MILESTONES
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1">
            ACHIEVEMENTS
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Unlocked only as you complete real actions in your Winter Arc.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#EFF6FF] border border-blue-200 text-[#2563EB] text-xs font-bold">
          <Trophy size={16} />
          <span>{unlockedCount} / {achievements.length} Unlocked</span>
        </div>
      </div>

      {/* Progress */}
      <div className="arc-card p-6">
        <div className="flex justify-between items-center text-xs mb-2">
          <span className="font-semibold text-[#64748B]">Achievement Mastery</span>
          <span className="font-bold text-[#0F172A]">{progressPercent}%</span>
        </div>
        <ProgressBar value={unlockedCount} max={achievements.length} height="h-2.5" />
      </div>

      {/* Achievements Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className={`p-5 rounded-xl border transition-all ${
              ach.unlocked
                ? 'bg-white border-blue-200 shadow-sm'
                : 'bg-[#F8FAFC] border-[#E2E8F0] opacity-60'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                ach.unlocked ? 'bg-[#EFF6FF] text-[#2563EB]' : 'bg-[#E2E8F0] text-[#94A3B8]'
              }`}>
                {ach.unlocked ? '🏆' : <Lock size={16} />}
              </div>

              {ach.unlocked ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 size={12} />
                  <span>{ach.unlockedAt || 'Earned'}</span>
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-[#94A3B8] bg-[#E2E8F0] px-2 py-0.5 rounded-full">
                  Locked
                </span>
              )}
            </div>

            <h3 className="text-sm font-bold text-[#0F172A]">{ach.title}</h3>
            <p className="text-xs text-[#64748B] mt-1">{ach.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
