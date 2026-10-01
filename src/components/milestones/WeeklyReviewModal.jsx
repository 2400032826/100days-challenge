import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { Trophy, CheckCircle, Dumbbell, BookOpen, Code, Moon, TrendingDown, Sparkles } from 'lucide-react';

export default function WeeklyReviewModal() {
  const { weeklyReviewOpen, setWeeklyReviewOpen, activeReviewWeek, showToast } = useApp();
  const week = activeReviewWeek || 5;

  const [reflection, setReflection] = useState({
    well: 'Maintained 100% adherence to 6 AM wake-ups and completed all scheduled LeetCode graph sessions. Upper body strength reached a new peak with 32kg incline dumbbells.',
    wrong: 'Allowed phone distractions around 10:30 PM twice which delayed sleep. Need a physical boundary for the phone.',
    change: 'Keep phone charging strictly outside the bedroom starting at 9:30 PM. Increase water intake before 3 PM.',
  });

  const handleSave = () => {
    showToast(`Week ${week} review saved and archived!`, 'success');
    setWeeklyReviewOpen(false);
  };

  return (
    <Modal
      isOpen={weeklyReviewOpen}
      onClose={() => setWeeklyReviewOpen(false)}
      title={`WEEK ${week} COMPLETE`}
      subtitle="Comprehensive 7-Day Performance & Retrospective"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-transparent border border-sky-500/30 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
            <Trophy size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400">Week 5 Retrospective</h4>
            <p className="text-xs text-[#8B929E]">Days 29–35 analysis. Discipline score: 86.4%.</p>
          </div>
        </div>

        {/* 7-Day Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 rounded-xl bg-[#181D24] border border-[#242932]">
            <span className="text-[11px] text-[#8B929E] block">Avg Daily Score</span>
            <span className="text-lg font-bold text-emerald-400 mt-1 block">84.6 / 100</span>
            <span className="text-[10px] text-[#8B929E]">+4.2% vs Week 4</span>
          </div>

          <div className="p-3 rounded-xl bg-[#181D24] border border-[#242932]">
            <span className="text-[11px] text-[#8B929E] block">Habits Done</span>
            <span className="text-lg font-bold text-[#F5F7FA] mt-1 block">58 / 70</span>
            <span className="text-[10px] text-sky-400">83% adherence</span>
          </div>

          <div className="p-3 rounded-xl bg-[#181D24] border border-[#242932]">
            <span className="text-[11px] text-[#8B929E] block">Study Hours</span>
            <span className="text-lg font-bold text-[#F5F7FA] mt-1 block">14.5 hrs</span>
            <span className="text-[10px] text-indigo-400">DSA & OS focus</span>
          </div>

          <div className="p-3 rounded-xl bg-[#181D24] border border-[#242932]">
            <span className="text-[11px] text-[#8B929E] block">Coding Hours</span>
            <span className="text-lg font-bold text-[#F5F7FA] mt-1 block">12.0 hrs</span>
            <span className="text-[10px] text-amber-400">14 problems solved</span>
          </div>

          <div className="p-3 rounded-xl bg-[#181D24] border border-[#242932]">
            <span className="text-[11px] text-[#8B929E] block">Gym Workouts</span>
            <span className="text-lg font-bold text-[#F5F7FA] mt-1 block">5 Sessions</span>
            <span className="text-[10px] text-emerald-400">Push, Pull, Legs</span>
          </div>

          <div className="p-3 rounded-xl bg-[#181D24] border border-[#242932]">
            <span className="text-[11px] text-[#8B929E] block">Average Sleep</span>
            <span className="text-lg font-bold text-[#F5F7FA] mt-1 block">7.4 hrs</span>
            <span className="text-[10px] text-sky-400">Quality: 8.5/10</span>
          </div>

          <div className="p-3 rounded-xl bg-[#181D24] border border-[#242932]">
            <span className="text-[11px] text-[#8B929E] block">Weight Change</span>
            <span className="text-lg font-bold text-emerald-400 mt-1 block">-0.8 kg</span>
            <span className="text-[10px] text-[#8B929E]">79.0 → 78.2 kg</span>
          </div>

          <div className="p-3 rounded-xl bg-[#181D24] border border-[#242932]">
            <span className="text-[11px] text-[#8B929E] block">Best Day</span>
            <span className="text-lg font-bold text-sky-400 mt-1 block">Day 35</span>
            <span className="text-[10px] text-emerald-400">96 / 100 Score</span>
          </div>
        </div>

        {/* Retrospective Questions */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#F5F7FA] mb-1.5 flex items-center gap-1.5">
              <span className="text-emerald-400">✓</span> What went well?
            </label>
            <textarea
              rows={2}
              value={reflection.well}
              onChange={e => setReflection({ ...reflection, well: e.target.value })}
              className="w-full arc-input"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#F5F7FA] mb-1.5 flex items-center gap-1.5">
              <span className="text-amber-400">!</span> What didn't?
            </label>
            <textarea
              rows={2}
              value={reflection.wrong}
              onChange={e => setReflection({ ...reflection, wrong: e.target.value })}
              className="w-full arc-input"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#F5F7FA] mb-1.5 flex items-center gap-1.5">
              <span className="text-sky-400">→</span> What will you change next week?
            </label>
            <textarea
              rows={2}
              value={reflection.change}
              onChange={e => setReflection({ ...reflection, change: e.target.value })}
              className="w-full arc-input"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-3 border-t border-[#242932]">
          <button
            onClick={() => setWeeklyReviewOpen(false)}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#8B929E] hover:text-[#F5F7FA]"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold shadow-lg shadow-sky-500/20 transition-all"
          >
            Save Weekly Review
          </button>
        </div>
      </div>
    </Modal>
  );
}
