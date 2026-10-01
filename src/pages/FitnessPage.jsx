import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  getDateForDay,
  formatReadableDate,
  getDayOfWeekKey,
  getDayOfWeekName,
  getLastPerformanceForExercise,
} from '../utils/storage';
import {
  Dumbbell,
  Plus,
  Scale,
  Clock,
  Award,
  Trash2,
  TrendingDown,
  Activity,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Link } from 'react-router-dom';

export default function FitnessPage() {
  const { data, activeDayNumber, currentDayData, addWorkout, addWeight, isFutureDay, showToast } = useApp();

  const [workoutModalOpen, setWorkoutModalOpen] = useState(false);
  const [weightModalOpen, setWeightModalOpen] = useState(false);

  const dateStr = getDateForDay(activeDayNumber);
  const weekdayKey = getDayOfWeekKey(dateStr);
  const weekdayName = getDayOfWeekName(dateStr);
  const routineForDay = data.routine?.[weekdayKey] || {};
  const isRestDay = routineForDay.isRestDay;
  const workoutHistory = data.workoutHistory || [];

  // Forms
  const [weightForm, setWeightForm] = useState({ weight: '', note: '' });
  const [workoutForm, setWorkoutForm] = useState({
    name: routineForDay.workoutFocus || 'Strength Training',
    category: routineForDay.workoutFocus || 'Split',
    duration: 45,
    notes: '',
    exercises: [],
  });

  const [newEx, setNewEx] = useState({ name: '', sets: 3, reps: 10, weight: 0 });

  const user = data.user || {};
  const weightLog = data.weightLog || [];
  const workouts = currentDayData?.workouts || [];
  const isFuture = isFutureDay(activeDayNumber);

  const handleOpenWorkoutModal = () => {
    // Pre-populate with routine exercises if available
    const routineExercises = (routineForDay.exercises || []).map(ex => ({
      name: ex.name,
      sets: ex.sets,
      reps: ex.reps,
      weight: ex.weight || 0,
    }));

    setWorkoutForm({
      name: routineForDay.workoutFocus || 'Strength Training',
      category: routineForDay.workoutFocus || 'Split',
      duration: 45,
      notes: '',
      exercises: routineExercises,
    });
    setWorkoutModalOpen(true);
  };

  const handleAddExerciseToForm = (e) => {
    e.preventDefault();
    if (!newEx.name.trim()) return;
    setWorkoutForm(prev => ({
      ...prev,
      exercises: [...prev.exercises, { ...newEx }],
    }));
    setNewEx({ name: '', sets: 3, reps: 10, weight: 0 });
  };

  const handleRemoveExerciseFromForm = (idx) => {
    setWorkoutForm(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== idx),
    }));
  };

  const handleExerciseChange = (idx, field, val) => {
    setWorkoutForm(prev => ({
      ...prev,
      exercises: prev.exercises.map((item, i) => i === idx ? { ...item, [field]: val } : item),
    }));
  };

  const handleSaveWeight = (e) => {
    e.preventDefault();
    if (!weightForm.weight) return;
    addWeight(weightForm.weight, getDateForDay(activeDayNumber), weightForm.note);
    setWeightForm({ weight: '', note: '' });
    setWeightModalOpen(false);
  };

  const handleSaveWorkout = (e) => {
    e.preventDefault();
    addWorkout(activeDayNumber, {
      name: workoutForm.name,
      category: workoutForm.category,
      duration: workoutForm.duration,
      exercises: workoutForm.exercises,
      notes: workoutForm.notes,
    });
    setWorkoutModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-5xl pb-12">
      {/* Header */}
      <div className="arc-card p-6 sm:p-8 bg-white border border-[#E2E8F0] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] block">
            PHYSICAL DISCIPLINE
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1">
            Fitness & Body Composition
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Track workouts, sets, repetitions, progression weights, and weight trajectory.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setWeightModalOpen(true)}
            className="arc-btn-secondary text-xs"
          >
            <Scale size={14} />
            <span>+ Add Weight</span>
          </button>

          <button
            type="button"
            onClick={handleOpenWorkoutModal}
            className="arc-btn-primary text-xs"
          >
            <Plus size={14} />
            <span>Log Workout</span>
          </button>
        </div>
      </div>

      {/* Recovery Day Notice */}
      {isRestDay && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-emerald-600 shrink-0" size={20} />
            <div>
              <span className="text-xs font-bold text-emerald-900 block">
                {weekdayName} is your Scheduled Recovery Day
              </span>
              <span className="text-xs text-emerald-700">
                Active recovery day programmed in your routine. No heavy lifting required today.
              </span>
            </div>
          </div>
          <Link to="/routine" className="text-xs font-bold text-emerald-800 hover:underline shrink-0">
            Edit Routine
          </Link>
        </div>
      )}

      {/* Top 4 Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="arc-card p-5 bg-white border border-[#E2E8F0] shadow-sm">
          <span className="text-xs font-semibold text-[#64748B] block">Starting Weight</span>
          <div className="text-2xl font-extrabold text-[#0F172A] mt-1">
            {user.startingWeight !== null ? `${user.startingWeight} kg` : 'Not recorded'}
          </div>
          <span className="text-[11px] text-[#64748B] block mt-1">Baseline measurement</span>
        </div>

        <div className="arc-card p-5 bg-white border border-[#E2E8F0] shadow-sm">
          <span className="text-xs font-semibold text-[#64748B] block">Current Weight</span>
          <div className="text-2xl font-extrabold text-[#2563EB] mt-1">
            {user.currentWeight !== null ? `${user.currentWeight} kg` : 'Not recorded'}
          </div>
          <span className="text-[11px] text-[#64748B] block mt-1">
            {user.targetWeight ? `Target: ${user.targetWeight} kg` : 'Target unassigned'}
          </span>
        </div>

        <div className="arc-card p-5 bg-white border border-[#E2E8F0] shadow-sm">
          <span className="text-xs font-semibold text-[#64748B] block">Total Workouts</span>
          <div className="text-2xl font-extrabold text-[#0F172A] mt-1">
            {data.stats?.totalWorkouts || 0}
          </div>
          <span className="text-[11px] text-[#64748B] block mt-1">Logged sessions</span>
        </div>

        <div className="arc-card p-5 bg-white border border-[#E2E8F0] shadow-sm">
          <span className="text-xs font-semibold text-[#64748B] block">Today's Focus</span>
          <div className="text-base font-extrabold text-[#0F172A] mt-1 truncate">
            {isRestDay ? 'Recovery Day' : routineForDay.workoutFocus || 'Not configured'}
          </div>
          <span className="text-[11px] text-[#2563EB] font-medium block mt-1">
            {weekdayName} routine
          </span>
        </div>
      </div>

      {/* Weight Chart (Strict Real Data Only) */}
      <div className="arc-card p-6 bg-white border border-[#E2E8F0] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div>
            <h3 className="text-sm font-bold text-[#0F172A]">Body Weight Trajectory</h3>
            <p className="text-xs text-[#64748B]">Real measurements recorded over the 100 days</p>
          </div>
          <button
            type="button"
            onClick={() => setWeightModalOpen(true)}
            className="text-xs font-semibold text-[#2563EB] hover:underline"
          >
            + Log Weight
          </button>
        </div>

        {weightLog.length === 0 ? (
          <EmptyState
            icon={Scale}
            title="No weight data yet"
            description="Log your fasted morning weight to track your physical transformation."
            actionLabel="Add Starting Weight"
            onAction={() => setWeightModalOpen(true)}
          />
        ) : (
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[...weightLog].reverse()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '12px' }}
                  formatter={(val) => [`${val} kg`, 'Weight']}
                />
                <Line type="monotone" dataKey="weight" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 4, fill: '#2563EB' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Today's Workout Sessions */}
      <div className="arc-card p-6 bg-white border border-[#E2E8F0] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div>
            <h3 className="text-sm font-bold text-[#0F172A]">Day {activeDayNumber} Workouts</h3>
            <p className="text-xs text-[#64748B]">Logged exercises, sets, reps, and weights lifted</p>
          </div>
          {!isFuture && (
            <button
              type="button"
              onClick={handleOpenWorkoutModal}
              className="text-xs font-semibold text-[#2563EB] hover:underline"
            >
              + Log Workout
            </button>
          )}
        </div>

        {workouts.length === 0 ? (
          <EmptyState
            icon={Dumbbell}
            title="No workouts logged yet for this day"
            description={
              isRestDay
                ? 'Today is marked as a Recovery Day in your weekly routine.'
                : routineForDay.workoutFocus
                ? `Scheduled split: ${routineForDay.workoutFocus}. Train hard and log your numbers.`
                : 'Configure your weekly routine or log a custom session.'
            }
            actionLabel="Log Workout"
            onAction={handleOpenWorkoutModal}
          />
        ) : (
          <div className="space-y-3">
            {workouts.map((w) => (
              <div key={w.id} className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#0F172A]">{w.name}</span>
                    <span className="text-[11px] text-[#64748B]">({w.category})</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#2563EB]">{w.duration} mins</span>
                </div>

                {(w.exercises || []).length > 0 && (
                  <div className="text-xs text-[#475569] space-y-2 pt-2 border-t border-[#E2E8F0]">
                    {w.exercises.map((ex, idx) => {
                      const prev = getLastPerformanceForExercise(workoutHistory, ex.name);
                      return (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2 rounded-lg bg-white border border-[#E2E8F0]">
                          <span className="font-bold text-[#0F172A]">{ex.name}</span>
                          <div className="flex items-center gap-3 text-[11px] text-[#64748B]">
                            {prev && (
                              <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                                Prev: {prev.weight}kg × {prev.reps}
                              </span>
                            )}
                            <span className="font-semibold text-[#0F172A]">
                              Today: {ex.weight ? `${ex.weight}kg × ` : ''}{ex.reps} reps ({ex.sets} sets)
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Weight Modal */}
      <Modal isOpen={weightModalOpen} onClose={() => setWeightModalOpen(false)} title="Record Weight" subtitle="Fasted morning measurement">
        <form onSubmit={handleSaveWeight} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1">Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              required
              placeholder="e.g. 78.5"
              value={weightForm.weight}
              onChange={e => setWeightForm({ ...weightForm, weight: e.target.value })}
              className="w-full arc-input"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1">Optional Note</label>
            <input
              type="text"
              placeholder="e.g. Fasted check after waking up"
              value={weightForm.note}
              onChange={e => setWeightForm({ ...weightForm, note: e.target.value })}
              className="w-full arc-input"
            />
          </div>
          <div className="flex justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => setWeightModalOpen(false)}
              className="arc-btn-secondary text-xs"
            >
              Cancel
            </button>
            <button type="submit" className="arc-btn-primary text-xs">
              Save Weight (+10 XP)
            </button>
          </div>
        </form>
      </Modal>

      {/* Workout Modal with Workout Progression Comparison */}
      <Modal isOpen={workoutModalOpen} onClose={() => setWorkoutModalOpen(false)} title="Log Workout Session" subtitle={`Day ${activeDayNumber} · ${weekdayName}`}>
        <form onSubmit={handleSaveWorkout} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">Workout Focus</label>
              <input
                type="text"
                required
                value={workoutForm.name}
                onChange={e => setWorkoutForm({ ...workoutForm, name: e.target.value })}
                className="w-full arc-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">Duration (minutes)</label>
              <input
                type="number"
                value={workoutForm.duration}
                onChange={e => setWorkoutForm({ ...workoutForm, duration: e.target.value })}
                className="w-full arc-input"
              />
            </div>
          </div>

          {/* Exercise Progression Table */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A] block">
              Exercises & Progression
            </span>

            {workoutForm.exercises.length === 0 ? (
              <p className="text-xs text-[#94A3B8] p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                No exercises added yet. Add exercises below or load from routine.
              </p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {workoutForm.exercises.map((ex, idx) => {
                  const prev = getLastPerformanceForExercise(workoutHistory, ex.name);
                  return (
                    <div key={idx} className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#0F172A]">{ex.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveExerciseFromForm(idx)}
                          className="text-[#DC2626] hover:underline text-[11px]"
                        >
                          Remove
                        </button>
                      </div>

                      {/* Previous Performance Badge */}
                      {prev ? (
                        <div className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold inline-block">
                          Previous: {prev.weight}kg × {prev.reps} reps ({prev.sets} sets) on {prev.date}
                        </div>
                      ) : (
                        <div className="text-[10px] text-[#94A3B8]">
                          Previous: No prior record
                        </div>
                      )}

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[10px] text-[#64748B] block">Sets</label>
                          <input
                            type="number"
                            value={ex.sets}
                            onChange={e => handleExerciseChange(idx, 'sets', Number(e.target.value))}
                            className="arc-input text-xs w-full py-1"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-[#64748B] block">Reps</label>
                          <input
                            type="number"
                            value={ex.reps}
                            onChange={e => handleExerciseChange(idx, 'reps', Number(e.target.value))}
                            className="arc-input text-xs w-full py-1"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-[#64748B] block">Today's Weight (kg)</label>
                          <input
                            type="number"
                            step="0.5"
                            value={ex.weight}
                            onChange={e => handleExerciseChange(idx, 'weight', Number(e.target.value))}
                            className="arc-input text-xs w-full py-1"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quick Add Exercise to Log */}
            <div className="pt-2 border-t border-[#E2E8F0] grid grid-cols-1 sm:grid-cols-4 gap-2">
              <input
                type="text"
                placeholder="Exercise name"
                value={newEx.name}
                onChange={e => setNewEx({ ...newEx, name: e.target.value })}
                className="arc-input text-xs sm:col-span-2"
              />
              <input
                type="number"
                step="0.5"
                placeholder="Weight kg"
                value={newEx.weight || ''}
                onChange={e => setNewEx({ ...newEx, weight: Number(e.target.value) })}
                className="arc-input text-xs"
              />
              <button
                type="button"
                onClick={handleAddExerciseToForm}
                className="arc-btn-secondary text-xs py-1"
              >
                + Add
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => setWorkoutModalOpen(false)}
              className="arc-btn-secondary text-xs"
            >
              Cancel
            </button>
            <button type="submit" className="arc-btn-primary text-xs">
              Save Workout (+50 XP)
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
