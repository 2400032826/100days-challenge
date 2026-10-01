import React from 'react';
import { useApp } from '../../context/AppContext';
import ProgressRing from '../common/ProgressRing';
import { Flame, Zap, CheckCircle2, RotateCcw, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HeaderStats() {
  const { data, activeDayNumber, currentDayData, completeEntireDay, resetToday, levelInfo } = useApp();
  const navigate = useNavigate();

  const user = data.user || {};
  const currentDayNum = data.currentDayNumber || 37;
  const daysRemaining = Math.max(0, 100 - currentDayNum);
  const todayScore = currentDayData?.score || 72;
  const isComplete = currentDayData?.status === 'completed';

  // Contextual Greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="arc-card p-6 md:p-8 bg-gradient-to-b from-[#141820] to-[#12151A] relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        {/* Left: Salutation & Day Headline */}
        <div>
          <span className="text-xs uppercase tracking-widest text-sky-400 font-bold block mb-1">
            {greeting}, {user.name || 'Alex'}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#F5F7FA]">
            DAY {currentDayNum} <span className="text-[#8B929E] font-medium text-2xl md:text-3xl">OF 100</span>
          </h1>
          <p className="text-xs md:text-sm text-[#8B929E] mt-2 flex items-center gap-2">
            <span>“100 Days. One Version Better.”</span>
            <span>·</span>
            <span className="text-sky-300 font-medium">{daysRemaining} days remaining</span>
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 mt-5">
            {!isComplete ? (
              <button
                onClick={() => completeEntireDay(activeDayNumber)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold shadow-sm transition-all cursor-pointer"
              >
                <CheckCircle2 size={15} />
                <span>Complete Today (+100 XP)</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 size={15} />
                <span>Day Completed ✓</span>
              </div>
            )}

            <button
              onClick={() => resetToday(activeDayNumber)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#181D24] hover:bg-[#1E232B] text-[#8B929E] hover:text-[#F5F7FA] border border-[#242932] text-xs font-medium transition-colors"
              title="Reset today's checks"
            >
              <RotateCcw size={13} />
              <span>Reset Today</span>
            </button>

            <button
              onClick={() => navigate('/today')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-medium transition-colors"
            >
              <span>View Checklist →</span>
            </button>
          </div>
        </div>

        {/* Center / Right: Circular Arc Indicator & Daily Score */}
        <div className="flex items-center gap-6 sm:gap-8 self-center lg:self-auto">
          {/* 100-Day Challenge Progress Ring */}
          <div className="flex flex-col items-center">
            <ProgressRing radius={58} stroke={8} progress={currentDayNum} color="#38BDF8">
              <span className="text-2xl font-black text-[#F5F7FA]">{currentDayNum}%</span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-[#8B929E]">Progress</span>
            </ProgressRing>
            <span className="text-[11px] font-semibold text-[#8B929E] mt-2">100-Day Arc</span>
          </div>

          {/* Today's Score Ring */}
          <div className="flex flex-col items-center">
            <ProgressRing
              radius={58}
              stroke={8}
              progress={todayScore}
              color={todayScore >= 80 ? '#34D399' : todayScore >= 50 ? '#38BDF8' : '#FBBF24'}
            >
              <span className="text-2xl font-black text-[#F5F7FA]">{todayScore}%</span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-[#8B929E]">Score</span>
            </ProgressRing>
            <span className="text-[11px] font-semibold text-emerald-400 mt-2">Today Complete</span>
          </div>
        </div>
      </div>
    </div>
  );
}
