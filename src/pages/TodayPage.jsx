import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getDateForDay, formatReadableDate, getDayOfWeekKey, getDayOfWeekName } from '../utils/storage';
import {
  Sun,
  Briefcase,
  Heart,
  Moon,
  Plus,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  Lock,
  RotateCcw,
  SkipForward,
  Edit2,
  Trash2,
  AlertCircle,
  Coffee,
  CalendarDays,
} from 'lucide-react';
import Modal from '../components/common/Modal';
import ProgressBar from '../components/common/ProgressBar';
import { Link } from 'react-router-dom';

export default function TodayPage() {
  const {
    currentDayNumber,
    activeDayNumber,
    setActiveDayNumber,
    currentDayData,
    toggleTask,
    skipTask,
    rescheduleTask,
    editTask,
    deleteTask,
    addTask,
    syncAutomatedDayPlan,
    isFutureDay,
    completeDay,
    data,
    showToast,
  } = useApp();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedTaskForEdit, setSelectedTaskForEdit] = useState(null);

  const [taskForm, setTaskForm] = useState({ title: '', category: 'morning', time: '08:00', xp: 15 });
  const [newTimeInput, setNewTimeInput] = useState('18:00');

  const tasks = currentDayData?.tasks || [];
  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isFuture = isFutureDay(activeDayNumber);
  const isDayCompleted = currentDayData?.status === 'completed';

  const dateStr = getDateForDay(activeDayNumber);
  const weekdayKey = getDayOfWeekKey(dateStr);
  const weekdayName = getDayOfWeekName(dateStr);
  const routineForDay = data.routine?.[weekdayKey] || {};
  const isRestDay = routineForDay.isRestDay;

  // Sync automated tasks when day opens if not synced
  useEffect(() => {
    if (!isFuture) {
      syncAutomatedDayPlan(activeDayNumber);
    }
  }, [activeDayNumber, isFuture, syncAutomatedDayPlan]);

  const sections = [
    { key: 'morning', title: 'MORNING', icon: Sun, desc: 'Wake up, hydration, movement & daily setup' },
    { key: 'focus', title: 'FOCUS', icon: Briefcase, desc: 'Course study, next topics, revisions & coding' },
    { key: 'health', title: 'HEALTH', icon: Heart, desc: 'Physical workout, hydration, steps & nutrition' },
    { key: 'evening', title: 'EVENING', icon: Moon, desc: 'Review, daily journal reflection & wind-down' },
  ];

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!taskForm.title.trim()) return;
    addTask(activeDayNumber, taskForm);
    setTaskForm({ title: '', category: 'morning', time: '08:00', xp: 15 });
    setAddModalOpen(false);
  };

  const handleOpenEdit = (task) => {
    setSelectedTaskForEdit(task);
    setTaskForm({
      title: task.title,
      category: task.category || 'focus',
      time: task.time || '12:00',
      xp: task.xp || 15,
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!taskForm.title.trim() || !selectedTaskForEdit) return;
    editTask(selectedTaskForEdit.id, activeDayNumber, {
      title: taskForm.title,
      category: taskForm.category,
      time: taskForm.time,
      xp: Number(taskForm.xp) || 15,
    });
    setEditModalOpen(false);
  };

  const handleOpenReschedule = (task) => {
    setSelectedTaskForEdit(task);
    setNewTimeInput(task.time || '18:00');
    setRescheduleModalOpen(true);
  };

  const handleSaveReschedule = (e) => {
    e.preventDefault();
    if (!selectedTaskForEdit) return;
    rescheduleTask(selectedTaskForEdit.id, activeDayNumber, newTimeInput);
    setRescheduleModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-5xl pb-12">
      {/* Day Selector & Overview Card */}
      <div className="arc-card p-6 sm:p-8 bg-white border border-[#E2E8F0] shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                DAILY EXECUTION PROTOCOL
              </span>
              <span className="text-xs text-[#94A3B8]">·</span>
              <span className="text-xs text-[#64748B] font-medium">
                {weekdayName}, {formatReadableDate(dateStr)}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
              DAY {activeDayNumber} <span className="text-base text-[#64748B] font-medium">/ 100</span>
            </h1>

            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
              {completedCount} of {totalCount} completed ({completionPercentage}%)
            </p>
          </div>

          {/* Day Navigation & Action Buttons */}
          <div className="flex items-center gap-2.5 self-stretch sm:self-auto justify-between sm:justify-end">
            <div className="flex items-center gap-1 bg-[#F8FAFC] border border-[#E2E8F0] p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveDayNumber(prev => Math.max(1, prev - 1))}
                disabled={activeDayNumber <= 1}
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] disabled:opacity-30"
                title="Previous Day"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs font-bold px-2 text-[#0F172A]">
                Day {activeDayNumber}
              </span>
              <button
                type="button"
                onClick={() => setActiveDayNumber(prev => Math.min(100, prev + 1))}
                disabled={activeDayNumber >= 100}
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] disabled:opacity-30"
                title="Next Day"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {!isFuture && (
              <>
                <button
                  type="button"
                  onClick={() => syncAutomatedDayPlan(activeDayNumber)}
                  className="arc-btn-secondary text-xs py-2 px-3 flex items-center gap-1"
                  title="Sync tasks with weekly routine"
                >
                  <RotateCcw size={13} />
                  <span>Sync Routine</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAddModalOpen(true)}
                  className="arc-btn-secondary text-xs py-2 px-3 flex items-center gap-1"
                >
                  <Plus size={14} />
                  <span>Add Task</span>
                </button>

                {!isDayCompleted ? (
                  <button
                    type="button"
                    onClick={() => completeDay(activeDayNumber)}
                    className="arc-btn-primary text-xs py-2 px-3"
                  >
                    <CheckCircle2 size={14} />
                    <span>Complete Day</span>
                  </button>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                    <CheckCircle2 size={14} />
                    <span>Conquered ✓</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5">
          <ProgressBar value={completedCount} max={totalCount} height="h-2.5" />
        </div>
      </div>

      {/* Recovery Day Notice */}
      {isRestDay && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Coffee className="text-emerald-600 shrink-0" size={20} />
            <div>
              <span className="text-xs font-bold text-emerald-900 block">
                Recovery Day · {weekdayName}
              </span>
              <span className="text-xs text-emerald-700">
                No heavy workout scheduled. Missing heavy physical training today will not penalize your streak or daily score.
              </span>
            </div>
          </div>
          <Link
            to="/routine"
            className="text-xs font-bold text-emerald-800 hover:underline shrink-0"
          >
            Edit Routine
          </Link>
        </div>
      )}

      {/* Future Day Lock Notice */}
      {isFuture && (
        <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 flex items-center gap-3 text-slate-600 text-xs">
          <Lock size={16} />
          <span>
            Day {activeDayNumber} is in the future. Tasks and logs are locked until this day arrives to preserve authentic daily execution.
          </span>
        </div>
      )}

      {/* Grouped Task Sections */}
      <div className="space-y-6">
        {sections.map((sec) => {
          const Icon = sec.icon;
          const secTasks = tasks.filter(t => t.category === sec.key);

          return (
            <div key={sec.key} className="arc-card p-6 bg-white border border-[#E2E8F0] shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                    <Icon size={16} />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold tracking-wider uppercase text-[#0F172A]">
                      {sec.title}
                    </h2>
                    <p className="text-[11px] text-[#64748B]">{sec.desc}</p>
                  </div>
                </div>

                <span className="text-xs font-bold text-[#64748B]">
                  {secTasks.filter(t => t.completed).length} / {secTasks.length}
                </span>
              </div>

              {secTasks.length === 0 ? (
                <p className="text-xs text-[#94A3B8] py-2">No tasks in this section yet.</p>
              ) : (
                <div className="space-y-2.5">
                  {secTasks.map((task) => {
                    const isSkipped = task.status === 'skipped';
                    const isCompleted = task.completed;

                    return (
                      <div
                        key={task.id}
                        className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                          isCompleted
                            ? 'bg-[#F8FAFC] border-emerald-200 text-slate-500'
                            : isSkipped
                            ? 'bg-slate-50 border-slate-200 opacity-60'
                            : 'bg-white border-[#E2E8F0] text-[#0F172A] hover:border-blue-200'
                        }`}
                      >
                        <div className="flex items-start sm:items-center gap-3">
                          {/* Checkbox */}
                          <button
                            type="button"
                            disabled={isFuture}
                            onClick={() => toggleTask(task.id, activeDayNumber)}
                            className={`w-5 h-5 rounded-lg border flex items-center justify-center mt-0.5 sm:mt-0 transition-colors ${
                              isCompleted
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'border-[#CBD5E1] hover:border-[#2563EB] bg-white'
                            }`}
                          >
                            {isCompleted && <CheckCircle2 size={14} />}
                          </button>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`text-xs font-bold ${isCompleted ? 'line-through text-slate-400' : ''}`}>
                                {task.title}
                              </span>
                              {isSkipped && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 font-bold">
                                  Skipped
                                </span>
                              )}
                              {task.isRestDay && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-bold">
                                  Recovery
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2.5 text-[11px] text-[#64748B] mt-0.5">
                              {task.time && (
                                <span className="flex items-center gap-1">
                                  <Clock size={12} />
                                  <span>{task.time}</span>
                                </span>
                              )}
                              <span>+{task.xp || 10} XP</span>
                            </div>
                          </div>
                        </div>

                        {/* Task Action Controls (Editable Daily Plan) */}
                        {!isFuture && (
                          <div className="flex items-center gap-1 self-end sm:self-center">
                            {!isCompleted && !isSkipped && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleOpenReschedule(task)}
                                  className="px-2 py-1 rounded text-[11px] text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100"
                                  title="Reschedule task time"
                                >
                                  Reschedule
                                </button>
                                <button
                                  type="button"
                                  onClick={() => skipTask(task.id, activeDayNumber)}
                                  className="px-2 py-1 rounded text-[11px] text-[#64748B] hover:text-amber-700 hover:bg-amber-50"
                                  title="Skip task"
                                >
                                  Skip
                                </button>
                              </>
                            )}

                            <button
                              type="button"
                              onClick={() => handleOpenEdit(task)}
                              className="p-1.5 rounded text-[#64748B] hover:text-[#2563EB] hover:bg-blue-50"
                              title="Edit task"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteTask(task.id, activeDayNumber)}
                              className="p-1.5 rounded text-[#64748B] hover:text-[#DC2626] hover:bg-red-50"
                              title="Delete task"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* MODAL: ADD TASK */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Custom Task"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#0F172A] block mb-1">Task Title</label>
            <input
              type="text"
              value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              placeholder="e.g. Read 20 pages, Complete LeetCode daily..."
              className="arc-input w-full"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#0F172A] block mb-1">Category</label>
              <select
                value={taskForm.category}
                onChange={(e) => setTaskForm({ ...taskForm, category: e.target.value })}
                className="arc-input w-full"
              >
                <option value="morning">Morning</option>
                <option value="focus">Focus (Study/Code)</option>
                <option value="health">Health & Fitness</option>
                <option value="evening">Evening</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#0F172A] block mb-1">Scheduled Time</label>
              <input
                type="time"
                value={taskForm.time}
                onChange={(e) => setTaskForm({ ...taskForm, time: e.target.value })}
                className="arc-input w-full"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="arc-btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="arc-btn-primary">
              Create Task
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: EDIT TASK */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Task"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#0F172A] block mb-1">Task Title</label>
            <input
              type="text"
              value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              className="arc-input w-full"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#0F172A] block mb-1">Category</label>
              <select
                value={taskForm.category}
                onChange={(e) => setTaskForm({ ...taskForm, category: e.target.value })}
                className="arc-input w-full"
              >
                <option value="morning">Morning</option>
                <option value="focus">Focus (Study/Code)</option>
                <option value="health">Health & Fitness</option>
                <option value="evening">Evening</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#0F172A] block mb-1">Time</label>
              <input
                type="time"
                value={taskForm.time}
                onChange={(e) => setTaskForm({ ...taskForm, time: e.target.value })}
                className="arc-input w-full"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="arc-btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="arc-btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: RESCHEDULE TASK */}
      <Modal
        isOpen={rescheduleModalOpen}
        onClose={() => setRescheduleModalOpen(false)}
        title="Reschedule Task"
      >
        <form onSubmit={handleSaveReschedule} className="space-y-4">
          <p className="text-xs text-[#64748B]">
            Change the target execution time for <strong>"{selectedTaskForEdit?.title}"</strong>:
          </p>

          <div>
            <label className="text-xs font-semibold text-[#0F172A] block mb-1">New Time</label>
            <input
              type="time"
              value={newTimeInput}
              onChange={(e) => setNewTimeInput(e.target.value)}
              className="arc-input w-full"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setRescheduleModalOpen(false)}
              className="arc-btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="arc-btn-primary">
              Reschedule
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
