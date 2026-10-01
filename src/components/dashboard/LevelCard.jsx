import React from 'react';
import { useApp } from '../../context/AppContext';
import { Zap, Award, Sparkles } from 'lucide-react';
import ProgressBar from '../common/ProgressBar';

export default function LevelCard() {
  const { levelInfo, data } = useApp();

  return (
    <div className="arc-card p-5 md:p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-500/15 text-sky-400 flex items-center justify-center">
            <Zap size={16} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8B929E]">
              OPERATING LEVEL
            </span>
            <h4 className="text-sm font-bold text-[#F5F7FA]">
              LEVEL {levelInfo.level} — {levelInfo.title.toUpperCase()}
            </h4>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-sky-400">
          {levelInfo.currentXp.toLocaleString()} XP
        </span>
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-center text-[11px] text-[#8B929E] mb-1.5">
          <span>Progress to Level {levelInfo.level + 1}</span>
          <span className="font-mono text-[#F5F7FA]">{levelInfo.progressPercent}% ({levelInfo.xpToNext} XP left)</span>
        </div>
        <ProgressBar
          value={levelInfo.progressPercent}
          max={100}
          height="h-2"
          color="bg-gradient-to-r from-sky-400 to-indigo-500"
        />
      </div>

      <div className="mt-4 pt-3 border-t border-[#242932] flex items-center justify-between text-[11px] text-[#8B929E]">
        <span className="flex items-center gap-1">
          <Sparkles size={12} className="text-amber-400" />
          <span>Complete habit: +10 XP</span>
        </span>
        <span>Workout: +50 XP</span>
        <span>Day Complete: +100 XP</span>
      </div>
    </div>
  );
}
