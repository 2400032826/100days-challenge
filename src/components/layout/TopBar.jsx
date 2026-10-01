import React from 'react';
import { useApp } from '../../context/AppContext';
import { getDateForDay, formatReadableDate } from '../../utils/storage';
import { Plus, Flame, CheckCircle2 } from 'lucide-react';

export default function TopBar() {
  const { currentDayNumber, realStreak, openQuickAdd, currentDayData, completeDay, isFutureDay } = useApp();

  const currentDateFormatted = formatReadableDate(getDateForDay(currentDayNumber));
  const daysLeft = Math.max(0, 100 - currentDayNumber);
  const isDone = currentDayData?.status === 'completed';

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-[#E2E8F0] px-4 md:px-8 py-3 flex items-center justify-between gap-4">
      {/* Left: Day & Date Information */}
      <div className="flex items-center gap-3">
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
            WINTER ARC
          </span>
          <span className="text-sm md:text-base font-extrabold text-[#0F172A]">
            DAY {currentDayNumber} <span className="text-[#64748B] text-xs font-semibold">/ 100</span>
          </span>
        </div>

        <span className="hidden sm:inline text-xs text-[#94A3B8]">·</span>
        <span className="hidden sm:inline text-xs text-[#64748B] font-medium">
          {currentDateFormatted}
        </span>

        <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#F1F5F9] text-[11px] font-semibold text-[#475569]">
          {daysLeft} days left
        </span>

        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold">
          <Flame size={12} className="fill-amber-500 text-amber-500" />
          <span>{realStreak} {realStreak === 1 ? 'day' : 'days'}</span>
        </span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 md:gap-3">
        {!isDone ? (
          <button
            type="button"
            onClick={() => completeDay(currentDayNumber)}
            className="arc-btn-secondary text-xs py-1.5 px-3 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
            title="Mark today complete (+100 XP)"
          >
            <CheckCircle2 size={14} className="text-emerald-600" />
            <span className="hidden sm:inline">Complete Day (+100 XP)</span>
          </button>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            <CheckCircle2 size={14} className="text-emerald-600" />
            <span>Day Completed ✓</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => openQuickAdd('task')}
          className="arc-btn-primary text-xs py-1.5 px-3"
        >
          <Plus size={15} />
          <span>Log Entry</span>
        </button>
      </div>
    </header>
  );
}
