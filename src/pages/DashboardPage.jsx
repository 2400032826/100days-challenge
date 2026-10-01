import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  getDateForDay,
  formatReadableDate,
  getDayOfWeekKey,
  getDayOfWeekName,
} from '../utils/storage';
import ProgressBar from '../components/common/ProgressBar';
import Modal from '../components/common/Modal';
import {
  CheckCircle2,
  Circle,
  Clock,
  Droplet,
  Flame,
  RotateCcw,
  SlidersHorizontal,
  Plus,
  Utensils,
  ChevronRight,
  Sparkles,
  Calendar,
  AlertCircle,
  X,
  FastForward,
} from 'lucide-react';

export default function DashboardPage() {
  const {
    data,
    currentDayNumber,
    currentDayData,
    realStreak,
    toggleTask,
    skipTask,
    rescheduleTask,
    quickAddWater,
    resetWater,
    updateMeal,
    showToast,
  } = useApp();

  const navigate = useNavigate();
  const dateStr = getDateForDay(currentDayNumber);
  const weekdayName = getDayOfWeekName(dateStr);
  const user = data.user || {};
  const routineConfig = data.routineConfig || {};

  // Tasks timeline
  const tasks = currentDayData?.tasks || [];
  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Hydration state
  const targetWaterLiters = Number(routineConfig.waterGoalLiters || user.dailyTargets?.waterLiters || 3.0);
  const currentWaterLiters = Number(currentDayData?.nutrition?.water || 0);
  const waterPercent = Math.min(100, Math.round((currentWaterLiters / targetWaterLiters) * 100));

  // Meals
  const meals = currentDayData?.meals || {
    breakfast: { time: routineConfig.breakfastTime || '08:00', description: '', completed: false },
    lunch: { time: routineConfig.lunchTime || '13:00', description: '', completed: false },
    dinner: { time: routineConfig.dinnerTime || '20:00', description: '', completed: false },
    snacks: { time: '16:30', description: '', completed: false },
  };

  // Reschedule Modal State
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTime, setNewTime] = useState('12:00');

  // Meal Modal State
  const [mealModalOpen, setMealModalOpen] = useState(false);
  const [activeMealType, setActiveMealType] = useState('breakfast');
  const [mealForm, setMealForm] = useState({ time: '08:00', description: '', completed: false });

  const handleOpenReschedule = (task) => {
    setSelectedTask(task);
    setNewTime(task.time || '12:00');
    setRescheduleModalOpen(true);
  };

  const handleSaveReschedule = (e) => {
    e.preventDefault();
    if (!selectedTask) return;
    rescheduleTask(selectedTask.id, currentDayNumber, newTime);
    setRescheduleModalOpen(false);
    setSelectedTask(null);
  };

  const handleOpenMealModal = (mealType) => {
    setActiveMealType(mealType);
    const existing = meals[mealType] || { time: '12:00', description: '', completed: false };
    setMealForm({
      time: existing.time || '12:00',
      description: existing.description || '',
      completed: !!existing.completed,
    });
    setMealModalOpen(true);
  };

  const handleSaveMeal = (e) => {
    e.preventDefault();
    updateMeal(currentDayNumber, activeMealType, mealForm);
    setMealModalOpen(false);
  };

  return (
    <div className="max-w-3xl pb-20 space-y-6">
      {/* 1. TOP HEADER & TODAY PROGRESS */}
      <div className="arc-card p-5 sm:p-6 bg-white border border-[#E2E8F0] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E2E8F0]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                WINTER ARC · DAY {currentDayNumber} / 100
              </span>
              {realStreak > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold">
                  <Flame size={12} className="fill-amber-500 text-amber-500" />
                  <span>{realStreak}d streak</span>
                </span>
              )}
            </div>
            <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight mt-0.5">
              {weekdayName}, {formatReadableDate(dateStr)}
            </h1>
            <p className="text-xs text-[#64748B] mt-0.5">
              What do I need to do today?
            </p>
          </div>

          <Link
            to="/setup"
            className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold text-[#0F172A] hover:border-blue-300 transition-colors shadow-sm"
          >
            <SlidersHorizontal size={14} className="text-[#2563EB]" />
            <span>Edit Routine</span>
          </Link>
        </div>

        {/* Progress for today */}
        <div className="pt-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-[#64748B]">Today's Completion</span>
            <span className="text-[#0F172A] font-extrabold">
              {completedCount} of {totalCount} completed · <span className="text-[#2563EB]">{progressPercent}%</span>
            </span>
          </div>
          <div className="w-full bg-[#F1F5F9] rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-[#2563EB] h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. QUICK WATER TRACKER */}
      <div className="arc-card p-5 bg-white border border-[#E2E8F0] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-[#2563EB] flex items-center justify-center">
              <Droplet size={18} className="fill-blue-500 text-blue-500" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] block">
                Daily Hydration
              </span>
              <div className="text-lg font-extrabold text-[#0F172A]">
                {currentWaterLiters.toFixed(1)} <span className="text-xs font-medium text-[#64748B]">/ {targetWaterLiters.toFixed(1)} L</span>
                <span className="ml-2 text-xs font-bold text-[#2563EB]">({waterPercent}%)</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => resetWater(currentDayNumber)}
            className="text-[11px] font-bold text-[#64748B] hover:text-rose-600 px-2.5 py-1 rounded-lg border border-[#E2E8F0] hover:border-rose-200 bg-[#F8FAFC] transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Quick action buttons */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            type="button"
            onClick={() => quickAddWater(250, currentDayNumber)}
            className="py-2 px-3 rounded-xl bg-[#EFF6FF] border border-blue-200 text-[#2563EB] hover:bg-blue-600 hover:text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1 active:scale-95"
          >
            <span>+250 ml</span>
          </button>
          <button
            type="button"
            onClick={() => quickAddWater(500, currentDayNumber)}
            className="py-2 px-3 rounded-xl bg-[#EFF6FF] border border-blue-200 text-[#2563EB] hover:bg-blue-600 hover:text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1 active:scale-95"
          >
            <span>+500 ml</span>
          </button>
          <button
            type="button"
            onClick={() => quickAddWater(750, currentDayNumber)}
            className="py-2 px-3 rounded-xl bg-[#EFF6FF] border border-blue-200 text-[#2563EB] hover:bg-blue-600 hover:text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1 active:scale-95"
          >
            <span>+750 ml</span>
          </button>
        </div>
      </div>

      {/* 3. TODAY'S CHRONOLOGICAL TIMELINE */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
            Today's Timeline ({totalCount} items)
          </span>
          <span className="text-xs text-[#64748B]">
            Tap card to complete
          </span>
        </div>

        {tasks.length === 0 ? (
          <div className="arc-card p-8 bg-white border border-[#E2E8F0] text-center space-y-3">
            <Clock size={36} className="mx-auto text-[#64748B] opacity-50" />
            <h3 className="text-base font-bold text-[#0F172A]">No tasks scheduled for today</h3>
            <p className="text-xs text-[#64748B] max-w-sm mx-auto">
              Configure your daily routine to automatically generate today's timeline.
            </p>
            <Link to="/setup" className="arc-btn-primary inline-flex py-2 px-4 text-xs font-bold">
              Configure Routine
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {tasks.map((task) => {
              const isCompleted = !!task.completed;
              const isSkipped = task.status === 'skipped';
              const isMeal = task.type === 'meal';

              return (
                <div
                  key={task.id}
                  className={`arc-card p-4 bg-white border transition-all ${
                    isCompleted
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : isSkipped
                      ? 'border-slate-200 bg-slate-50 opacity-60'
                      : 'border-[#E2E8F0] hover:border-blue-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-start sm:items-center justify-between gap-3">
                    {/* Left: Time & Icon & Title */}
                    <div
                      className="flex items-start sm:items-center gap-3 flex-1 min-w-0 cursor-pointer"
                      onClick={() => {
                        if (isMeal) {
                          handleOpenMealModal(task.mealType || 'breakfast');
                        } else {
                          toggleTask(task.id, currentDayNumber);
                        }
                      }}
                    >
                      {/* Check icon */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTask(task.id, currentDayNumber);
                        }}
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors mt-0.5 sm:mt-0 ${
                          isCompleted
                            ? 'bg-emerald-600 text-white'
                            : 'border-2 border-[#CBD5E1] hover:border-[#2563EB] text-transparent'
                        }`}
                      >
                        <CheckCircle2 size={16} />
                      </button>

                      {/* Icon */}
                      <span className="text-xl shrink-0 select-none">
                        {task.icon || '📌'}
                      </span>

                      {/* Title & Time */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded border border-blue-100 shrink-0">
                            {task.time || 'Anytime'}
                          </span>
                          {isSkipped && (
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded">
                              Skipped
                            </span>
                          )}
                        </div>
                        <h4
                          className={`text-sm font-bold mt-1 truncate ${
                            isCompleted
                              ? 'line-through text-slate-400'
                              : isSkipped
                              ? 'line-through text-slate-400'
                              : 'text-[#0F172A]'
                          }`}
                        >
                          {task.title}
                        </h4>
                      </div>
                    </div>

                    {/* Right: Touch-friendly Action Buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Done button */}
                      <button
                        type="button"
                        onClick={() => toggleTask(task.id, currentDayNumber)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-[#2563EB] text-white hover:bg-blue-700 shadow-sm'
                        }`}
                      >
                        {isCompleted ? 'Done ✓' : 'Done'}
                      </button>

                      {/* Skip button */}
                      {!isCompleted && !isSkipped && (
                        <button
                          type="button"
                          onClick={() => skipTask(task.id, currentDayNumber)}
                          className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
                          title="Skip task"
                        >
                          Skip
                        </button>
                      )}

                      {/* Reschedule button */}
                      <button
                        type="button"
                        onClick={() => handleOpenReschedule(task)}
                        className="p-1.5 rounded-xl text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
                        title="Reschedule task"
                      >
                        <Clock size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. FOOD & MEALS TRACKER */}
      <div className="arc-card p-5 bg-white border border-[#E2E8F0] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
              <Utensils size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">Food & Meals</h2>
              <p className="text-xs text-[#64748B]">Planned time and meals for today</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { key: 'breakfast', label: 'Breakfast', icon: '🍳', defaultTime: routineConfig.breakfastTime || '08:00' },
            { key: 'lunch', label: 'Lunch', icon: '🍛', defaultTime: routineConfig.lunchTime || '13:00' },
            { key: 'dinner', label: 'Dinner', icon: '🍽️', defaultTime: routineConfig.dinnerTime || '20:00' },
            { key: 'snacks', label: 'Snacks / Water', icon: '🍎', defaultTime: '16:30' },
          ].map((mealItem) => {
            const currentMeal = meals[mealItem.key] || { time: mealItem.defaultTime, description: '', completed: false };
            const isLogged = !!currentMeal.description;
            const isMealDone = !!currentMeal.completed;

            return (
              <div
                key={mealItem.key}
                onClick={() => handleOpenMealModal(mealItem.key)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  isMealDone
                    ? 'bg-emerald-50/30 border-emerald-200'
                    : 'bg-[#F8FAFC] border-[#E2E8F0] hover:border-blue-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span className="text-xl shrink-0">{mealItem.icon}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#0F172A]">{mealItem.label}</span>
                        <span className="text-[10px] font-semibold text-[#64748B] bg-white px-1.5 py-0.5 rounded border border-[#E2E8F0]">
                          {currentMeal.time || mealItem.defaultTime}
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B] mt-1 truncate">
                        {isLogged ? currentMeal.description : 'No meal added yet (Tap to add)'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateMeal(currentDayNumber, mealItem.key, { completed: !isMealDone });
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 transition-colors ${
                      isMealDone
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    {isMealDone ? 'Done ✓' : 'Done'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RESCHEDULE MODAL */}
      <Modal
        isOpen={rescheduleModalOpen}
        onClose={() => setRescheduleModalOpen(false)}
        title="Reschedule Task"
        subtitle={selectedTask ? selectedTask.title : 'Select a new scheduled time'}
      >
        <form onSubmit={handleSaveReschedule} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
              Select New Time
            </label>
            <input
              type="time"
              required
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-base font-bold text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {['07:00', '09:00', '12:00', '15:00', '18:00', '20:30'].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setNewTime(preset)}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                  newTime === preset
                    ? 'bg-[#2563EB] text-white border-[#2563EB]'
                    : 'bg-white border-[#E2E8F0] text-[#64748B] hover:border-blue-300'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => setRescheduleModalOpen(false)}
              className="arc-btn-secondary px-4 py-2 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="arc-btn-primary px-4 py-2 text-xs font-bold"
            >
              Save New Time
            </button>
          </div>
        </form>
      </Modal>

      {/* MEAL MODAL */}
      <Modal
        isOpen={mealModalOpen}
        onClose={() => setMealModalOpen(false)}
        title={`Log ${activeMealType.charAt(0).toUpperCase() + activeMealType.slice(1)}`}
        subtitle="Set planned time and meal description"
      >
        <form onSubmit={handleSaveMeal} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
              Meal Time
            </label>
            <input
              type="time"
              value={mealForm.time}
              onChange={(e) => setMealForm({ ...mealForm, time: e.target.value })}
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm font-semibold text-[#0F172A]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
              Description / What did you eat?
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Oatmeal with peanut butter, banana, 3 boiled eggs"
              value={mealForm.description}
              onChange={(e) => setMealForm({ ...mealForm, description: e.target.value })}
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm font-semibold text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="mealCompletedCheck"
              checked={mealForm.completed}
              onChange={(e) => setMealForm({ ...mealForm, completed: e.target.checked })}
              className="w-4 h-4 rounded text-[#2563EB] focus:ring-blue-500 border-gray-300"
            />
            <label htmlFor="mealCompletedCheck" className="text-xs font-semibold text-[#0F172A] cursor-pointer">
              Mark this meal as completed
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => setMealModalOpen(false)}
              className="arc-btn-secondary px-4 py-2 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="arc-btn-primary px-4 py-2 text-xs font-bold"
            >
              Save Meal
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
