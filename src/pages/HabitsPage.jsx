import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckSquare, Plus, Flame, Check, Trash2, Calendar } from 'lucide-react';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';

export default function HabitsPage() {
  const { data, activeDayNumber, currentDayData, toggleHabit, addHabit, deleteHabit, isFutureDay } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    category: 'Discipline',
    frequency: 'Daily',
    target: '1x daily',
    xp: 10,
  });

  const habits = data.habits || [];
  const completedList = currentDayData?.habitsCompleted || [];
  const isFuture = isFutureDay(activeDayNumber);

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    addHabit(form);
    setForm({ name: '', category: 'Discipline', frequency: 'Daily', target: '1x daily', xp: 10 });
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="arc-card p-6 sm:p-8 bg-white border border-[#E2E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] block">
            HABIT ARCHITECTURE
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1">
            HABIT TRACKER
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Build unshakeable daily habits. No fake completions. Every check is verified.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="arc-btn-primary"
        >
          <Plus size={16} />
          <span>+ Add Habit</span>
        </button>
      </div>

      {/* Habits List */}
      <div className="arc-card p-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-4">
          <h3 className="text-sm font-bold text-[#0F172A]">Day {activeDayNumber} Habits</h3>
          <span className="text-xs text-[#64748B]">
            {completedList.length} of {habits.length} Completed
          </span>
        </div>

        {habits.length === 0 ? (
          <EmptyState
            icon={CheckSquare}
            title="No habits created yet"
            description="Create your first habit standard to start building consistency."
            actionLabel="+ Add Habit"
            onAction={() => setModalOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {habits.map((habit) => {
              const isDone = completedList.includes(habit.id);
              return (
                <div
                  key={habit.id}
                  className={`p-4 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                    isDone
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-white border-[#E2E8F0] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={isFuture}
                      onClick={() => toggleHabit(habit.id, activeDayNumber)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-colors ${
                        isDone
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-[#CBD5E1] bg-white hover:border-[#2563EB]'
                      }`}
                    >
                      {isDone && <Check size={14} className="stroke-[3]" />}
                    </button>

                    <div>
                      <span className={`text-xs font-bold block ${isDone ? 'line-through text-[#64748B]' : 'text-[#0F172A]'}`}>
                        {habit.name}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#64748B]">
                        <span>{habit.category}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1 font-mono font-bold text-amber-600">
                          <Flame size={12} className="fill-amber-500 text-amber-500" />
                          {habit.streak || 0}d
                        </span>
                        <span>·</span>
                        <span className="font-semibold text-[#2563EB]">+{habit.xp} XP</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteHabit(habit.id)}
                    className="p-1 rounded text-[#94A3B8] hover:text-red-600"
                    title="Delete Habit"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 100-Day Habit Calendar */}
      <div className="arc-card p-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#0F172A]">100-Day Habit Calendar</h3>
            <p className="text-xs text-[#64748B]">Subtle blue intensity represents actual habit completion</p>
          </div>
        </div>

        <div className="grid grid-cols-10 sm:grid-cols-20 gap-1.5">
          {Array.from({ length: 100 }, (_, i) => i + 1).map((dayNum) => {
            const dayData = data.days?.[dayNum];
            const completedCount = dayData?.habitsCompleted?.length || 0;
            const ratio = habits.length > 0 ? completedCount / habits.length : 0;

            let bgClass = 'bg-[#F1F5F9] text-[#94A3B8]'; // Empty
            if (ratio >= 0.8) bgClass = 'bg-[#1D4ED8] text-white font-bold';
            else if (ratio >= 0.5) bgClass = 'bg-[#2563EB] text-white font-medium';
            else if (ratio > 0) bgClass = 'bg-[#93C5FD] text-[#0F172A] font-medium';

            const isCurrent = dayNum === activeDayNumber;

            return (
              <div
                key={dayNum}
                className={`aspect-square rounded-md flex items-center justify-center text-[10px] font-mono select-none ${bgClass} ${
                  isCurrent ? 'ring-2 ring-[#0F172A]' : ''
                }`}
                title={`Day ${dayNum}: ${completedCount} / ${habits.length} Habits completed`}
              >
                {dayNum}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Habit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Habit" subtitle="Personal Winter Arc Habit">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1">Habit Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Wake up at 5 AM or Gym workout"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full arc-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">Category</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full arc-input"
              >
                <option value="Discipline">Discipline</option>
                <option value="Fitness">Fitness</option>
                <option value="Study">Study</option>
                <option value="Coding">Coding</option>
                <option value="Health">Health</option>
                <option value="Sleep">Sleep</option>
                <option value="Mindset">Mindset</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">Frequency</label>
              <select
                value={form.frequency}
                onChange={e => setForm({ ...form, frequency: e.target.value })}
                className="w-full arc-input"
              >
                <option value="Daily">Daily</option>
                <option value="Weekdays">Weekdays</option>
                <option value="3x a week">3x a week</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="arc-btn-secondary text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="arc-btn-primary text-xs"
            >
              Add Habit
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
