import React from 'react';
import { useApp } from '../../context/AppContext';
import { Flame, Shield, TrendingUp } from 'lucide-react';

export default function StreakCard() {
  const { data } = useApp();
  const currentStreak = data.stats?.currentStreak || 14;
  const longestStreak = data.stats?.longestStreak || 17;

  return (
    <div className="arc-card p-5 md:p-6 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#8B929E] block">
            UNBROKEN MOMENTUM
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-3xl font-extrabold text-[#F5F7FA]">
              {currentStreak} DAYS
            </span>
            <span className="text-xl">🔥</span>
          </div>
          <p className="text-xs text-[#8B929E] mt-1">
            “Keep the streak alive.”
          </p>
        </div>

        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
          <Flame size={20} className="fill-amber-400" />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#242932] flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-[#8B929E]">
          <Shield size={14} className="text-sky-400" />
          <span>Longest: <strong className="text-[#F5F7FA]">{longestStreak} Days</strong></span>
        </div>
        <span className="text-[11px] font-semibold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10">
          Unbreakable Tier
        </span>
      </div>
    </div>
  );
}
