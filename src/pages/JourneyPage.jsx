import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getDateForDay, formatReadableDate } from '../utils/storage';
import { Check, Lock, ChevronRight, AlertTriangle, Calendar } from 'lucide-react';
import Modal from '../components/common/Modal';

export default function JourneyPage() {
  const { data, currentDayNumber, activeDayNumber, setActiveDayNumber, isFutureDay } = useApp();
  const [inspectDayNum, setInspectDayNum] = useState(null);

  const days = data.days || {};
  const currentDay = currentDayNumber;

  const inspectedDay = inspectDayNum ? days[inspectDayNum] : null;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="arc-card p-6 sm:p-8 bg-white border border-[#E2E8F0]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] block">
              100-DAY TRANSFORMATION TIMELINE
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1">
              THE 100-DAY JOURNEY
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
              October 1, 2026 → January 8, 2027 · Day {currentDay} Active
            </p>
          </div>

          {/* Status Legend */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E2E8F0]">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#2563EB]" />
              <span className="font-semibold text-[#0F172A]">Current</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-600" />
              <span className="text-[#64748B]">Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="text-[#64748B]">Missed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#E2E8F0]" />
              <span className="text-[#64748B]">Future</span>
            </div>
          </div>
        </div>
      </div>

      {/* 100 Days Grid */}
      <div className="arc-card p-6 sm:p-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-2.5">
          {Array.from({ length: 100 }, (_, i) => i + 1).map((dayNum) => {
            const dayData = days[dayNum];
            const isCurrent = dayNum === currentDay;
            const isFuture = isFutureDay(dayNum);
            const isCompleted = dayData?.status === 'completed';
            const isMissed = !isFuture && !isCurrent && !isCompleted && dayData?.score < 50;

            const tasks = dayData?.tasks || [];
            const doneTasks = tasks.filter(t => t.completed).length;
            const completionPercent = tasks.length > 0 ? Math.round((doneTasks / tasks.length) * 100) : 0;

            let cardStyle = 'bg-white border-[#E2E8F0] hover:border-blue-400 hover:shadow-sm cursor-pointer';
            if (isCurrent) {
              cardStyle = 'bg-[#EFF6FF] border-[#2563EB] ring-2 ring-[#2563EB]/20 text-[#2563EB] font-bold cursor-pointer';
            } else if (isCompleted) {
              cardStyle = 'bg-emerald-50 border-emerald-300 text-emerald-800 cursor-pointer';
            } else if (isMissed) {
              cardStyle = 'bg-rose-50 border-rose-200 text-rose-800 cursor-pointer';
            } else if (isFuture) {
              cardStyle = 'bg-[#F8FAFC] border-[#E2E8F0] text-[#94A3B8] opacity-60 cursor-not-allowed';
            }

            return (
              <button
                key={dayNum}
                type="button"
                disabled={isFuture}
                onClick={() => setInspectDayNum(dayNum)}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-between text-center min-h-[78px] transition-all ${cardStyle}`}
              >
                <div className="flex items-center justify-between w-full text-[10px] font-mono">
                  <span>D{dayNum}</span>
                  {isCompleted && <Check size={12} className="stroke-[3] text-emerald-600" />}
                  {isFuture && <Lock size={10} className="text-[#94A3B8]" />}
                </div>

                <div className="text-xs font-extrabold my-1">
                  {isFuture ? '—' : `${completionPercent}%`}
                </div>

                <span className="text-[9px] text-[#64748B] truncate w-full">
                  {dayData?.date ? dayData.date.slice(5) : ''}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Day Inspector Modal */}
      {inspectedDay && (
        <Modal
          isOpen={Boolean(inspectedDay)}
          onClose={() => setInspectDayNum(null)}
          title={`DAY ${inspectedDay.dayNumber} DETAILS`}
          subtitle={formatReadableDate(inspectedDay.date)}
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
              <div>
                <span className="text-xs text-[#64748B] block">Daily Score</span>
                <span className="text-2xl font-extrabold text-[#2563EB] mt-0.5 block">
                  {inspectedDay.score} / 100
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#64748B] block">Status</span>
                <span className="text-xs font-bold capitalize px-2 py-0.5 rounded-full bg-white border border-[#E2E8F0] inline-block mt-0.5">
                  {inspectedDay.status}
                </span>
              </div>
            </div>

            {/* Tasks Summary */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#0F172A] block">Protocol Tasks</span>
              {(inspectedDay.tasks || []).map((t) => (
                <div key={t.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-white border border-[#E2E8F0]">
                  <span className={t.completed ? 'line-through text-[#64748B]' : 'text-[#0F172A]'}>
                    {t.title}
                  </span>
                  <span className={t.completed ? 'text-emerald-600 font-bold' : 'text-[#94A3B8]'}>
                    {t.completed ? 'Done' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setInspectDayNum(null)}
                className="arc-btn-secondary text-xs"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveDayNumber(inspectedDay.dayNumber);
                  setInspectDayNum(null);
                }}
                className="arc-btn-primary text-xs"
              >
                Switch to this Day
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
