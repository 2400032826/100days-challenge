import React, { useState } from 'react';
import Modal from './Modal';
import { useApp } from '../../context/AppContext';
import {
  CheckSquare,
  ListPlus,
  Dumbbell,
  BookOpen,
  Code,
  Scale,
  Utensils,
  DollarSign,
  PenLine,
} from 'lucide-react';

export default function QuickAddModal() {
  const {
    quickAddOpen,
    setQuickAddOpen,
    quickAddTab,
    activeDayNumber,
    addTask,
    addHabit,
    addWorkout,
    addStudy,
    addCoding,
    addWeight,
    addMeal,
    addFinance,
    saveJournal,
  } = useApp();

  const [tab, setTab] = useState(quickAddTab || 'task');

  React.useEffect(() => {
    if (quickAddTab) setTab(quickAddTab);
  }, [quickAddTab]);

  // Form states
  const [taskForm, setTaskForm] = useState({ title: '', category: 'focus', time: '10:00', xp: 15 });
  const [habitForm, setHabitForm] = useState({ name: '', category: 'Discipline', frequency: 'Daily', target: '1x daily', xp: 10 });
  const [workoutForm, setWorkoutForm] = useState({ name: 'Strength Training', category: 'Chest', duration: 45, exercise: 'Pushups', sets: 3, reps: '12', weight: '' });
  const [studyForm, setStudyForm] = useState({ subject: 'DSA', topic: '', durationMinutes: 60, questionsSolved: 2 });
  const [codingForm, setCodingForm] = useState({ problem: '', platform: 'LeetCode', topic: '', difficulty: 'Medium', durationMinutes: 45, solved: true });
  const [weightForm, setWeightForm] = useState({ weight: '', note: '' });
  const [mealForm, setMealForm] = useState({ name: '', calories: '', protein: '', time: '13:00' });
  const [financeForm, setFinanceForm] = useState({ type: 'expense', amount: '', category: 'Food', note: '' });
  const [journalForm, setJournalForm] = useState({ win: '', wrong: '', mood: 8, energy: 8, gratitude: '', tomorrow: '' });

  const tabs = [
    { id: 'task', label: 'Add Task', icon: ListPlus },
    { id: 'habit', label: 'Add Habit', icon: CheckSquare },
    { id: 'workout', label: 'Log Workout', icon: Dumbbell },
    { id: 'study', label: 'Log Study', icon: BookOpen },
    { id: 'coding', label: 'Log Coding', icon: Code },
    { id: 'weight', label: 'Add Weight', icon: Scale },
    { id: 'meal', label: 'Add Meal', icon: Utensils },
    { id: 'finance', label: 'Add Expense', icon: DollarSign },
    { id: 'journal', label: 'Journal', icon: PenLine },
  ];

  const handleClose = () => setQuickAddOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tab === 'task') {
      if (!taskForm.title.trim()) return;
      addTask(activeDayNumber, taskForm);
      setTaskForm({ title: '', category: 'focus', time: '10:00', xp: 15 });
    } else if (tab === 'habit') {
      if (!habitForm.name.trim()) return;
      addHabit(habitForm);
      setHabitForm({ name: '', category: 'Discipline', frequency: 'Daily', target: '1x daily', xp: 10 });
    } else if (tab === 'workout') {
      addWorkout(activeDayNumber, {
        name: workoutForm.name,
        category: workoutForm.category,
        duration: workoutForm.duration,
        exercises: [{ name: workoutForm.exercise, sets: workoutForm.sets, reps: workoutForm.reps, weight: workoutForm.weight }],
      });
    } else if (tab === 'study') {
      if (!studyForm.topic.trim()) return;
      addStudy(activeDayNumber, studyForm);
      setStudyForm({ subject: 'DSA', topic: '', durationMinutes: 60, questionsSolved: 2 });
    } else if (tab === 'coding') {
      if (!codingForm.problem.trim()) return;
      addCoding(activeDayNumber, codingForm);
      setCodingForm({ problem: '', platform: 'LeetCode', topic: '', difficulty: 'Medium', durationMinutes: 45, solved: true });
    } else if (tab === 'weight') {
      if (!weightForm.weight) return;
      addWeight(weightForm.weight, null, weightForm.note);
      setWeightForm({ weight: '', note: '' });
    } else if (tab === 'meal') {
      if (!mealForm.name.trim()) return;
      addMeal(activeDayNumber, mealForm);
      setMealForm({ name: '', calories: '', protein: '', time: '13:00' });
    } else if (tab === 'finance') {
      if (!financeForm.amount) return;
      addFinance(activeDayNumber, financeForm);
      setFinanceForm({ type: 'expense', amount: '', category: 'Food', note: '' });
    } else if (tab === 'journal') {
      saveJournal(activeDayNumber, journalForm);
    }
    handleClose();
  };

  return (
    <Modal isOpen={quickAddOpen} onClose={handleClose} title="Quick Entry" subtitle={`Day ${activeDayNumber} Logging`} maxWidth="max-w-xl">
      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 border-b border-[#E2E8F0]">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                active
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]'
              }`}
            >
              <Icon size={14} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Task Form */}
        {tab === 'task' && (
          <>
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">Task Title</label>
              <input
                type="text"
                required
                placeholder="e.g. 45 min HIIT session or finish graph practice"
                value={taskForm.title}
                onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
                className="w-full arc-input"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">Category</label>
                <select
                  value={taskForm.category}
                  onChange={e => setTaskForm({ ...taskForm, category: e.target.value })}
                  className="w-full arc-input"
                >
                  <option value="morning">Morning</option>
                  <option value="focus">Focus</option>
                  <option value="health">Health</option>
                  <option value="evening">Evening</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">Target Time</label>
                <input
                  type="time"
                  value={taskForm.time}
                  onChange={e => setTaskForm({ ...taskForm, time: e.target.value })}
                  className="w-full arc-input"
                />
              </div>
            </div>
          </>
        )}

        {/* Habit Form */}
        {tab === 'habit' && (
          <>
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">Habit Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Wake up at 5 AM"
                value={habitForm.name}
                onChange={e => setHabitForm({ ...habitForm, name: e.target.value })}
                className="w-full arc-input"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">Category</label>
                <select
                  value={habitForm.category}
                  onChange={e => setHabitForm({ ...habitForm, category: e.target.value })}
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
                <label className="block text-xs font-semibold text-[#334155] mb-1">Target</label>
                <input
                  type="text"
                  placeholder="e.g. 1x daily"
                  value={habitForm.target}
                  onChange={e => setHabitForm({ ...habitForm, target: e.target.value })}
                  className="w-full arc-input"
                />
              </div>
            </div>
          </>
        )}

        {/* Workout Form */}
        {tab === 'workout' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">Workout Type</label>
                <input
                  type="text"
                  placeholder="e.g. Chest & Triceps"
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
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Exercise</label>
                <input
                  type="text"
                  placeholder="Bench Press"
                  value={workoutForm.exercise}
                  onChange={e => setWorkoutForm({ ...workoutForm, exercise: e.target.value })}
                  className="w-full arc-input text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Sets x Reps</label>
                <input
                  type="text"
                  placeholder="3x10"
                  value={`${workoutForm.sets}x${workoutForm.reps}`}
                  onChange={e => {
                    const p = e.target.value.split('x');
                    setWorkoutForm({ ...workoutForm, sets: p[0] || '3', reps: p[1] || '10' });
                  }}
                  className="w-full arc-input text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Weight</label>
                <input
                  type="text"
                  placeholder="60kg"
                  value={workoutForm.weight}
                  onChange={e => setWorkoutForm({ ...workoutForm, weight: e.target.value })}
                  className="w-full arc-input text-xs"
                />
              </div>
            </div>
          </>
        )}

        {/* Study Form */}
        {tab === 'study' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DSA, DBMS, OS"
                  value={studyForm.subject}
                  onChange={e => setStudyForm({ ...studyForm, subject: e.target.value })}
                  className="w-full arc-input"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  value={studyForm.durationMinutes}
                  onChange={e => setStudyForm({ ...studyForm, durationMinutes: e.target.value })}
                  className="w-full arc-input"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">Topic Covered</label>
              <input
                type="text"
                required
                placeholder="e.g. Graph Dijkstra or B+ Trees"
                value={studyForm.topic}
                onChange={e => setStudyForm({ ...studyForm, topic: e.target.value })}
                className="w-full arc-input"
              />
            </div>
          </>
        )}

        {/* Coding Form */}
        {tab === 'coding' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">Platform</label>
                <select
                  value={codingForm.platform}
                  onChange={e => setCodingForm({ ...codingForm, platform: e.target.value })}
                  className="w-full arc-input"
                >
                  <option value="LeetCode">LeetCode</option>
                  <option value="Codeforces">Codeforces</option>
                  <option value="GitHub Project">GitHub Project</option>
                  <option value="HackerRank">HackerRank</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">Difficulty</label>
                <select
                  value={codingForm.difficulty}
                  onChange={e => setCodingForm({ ...codingForm, difficulty: e.target.value })}
                  className="w-full arc-input"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">Problem / Feature</label>
              <input
                type="text"
                required
                placeholder="e.g. Trapping Rain Water"
                value={codingForm.problem}
                onChange={e => setCodingForm({ ...codingForm, problem: e.target.value })}
                className="w-full arc-input"
              />
            </div>
          </>
        )}

        {/* Weight Form */}
        {tab === 'weight' && (
          <>
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
                placeholder="e.g. Morning fasted measurement"
                value={weightForm.note}
                onChange={e => setWeightForm({ ...weightForm, note: e.target.value })}
                className="w-full arc-input"
              />
            </div>
          </>
        )}

        {/* Meal Form */}
        {tab === 'meal' && (
          <>
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">Meal Description</label>
              <input
                type="text"
                required
                placeholder="e.g. 4 Boiled Eggs, Oats & Peanut Butter"
                value={mealForm.name}
                onChange={e => setMealForm({ ...mealForm, name: e.target.value })}
                className="w-full arc-input"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">Calories (kcal)</label>
                <input
                  type="number"
                  placeholder="550"
                  value={mealForm.calories}
                  onChange={e => setMealForm({ ...mealForm, calories: e.target.value })}
                  className="w-full arc-input"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">Protein (g)</label>
                <input
                  type="number"
                  placeholder="35"
                  value={mealForm.protein}
                  onChange={e => setMealForm({ ...mealForm, protein: e.target.value })}
                  className="w-full arc-input"
                />
              </div>
            </div>
          </>
        )}

        {/* Finance Form */}
        {tab === 'finance' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">Type</label>
                <select
                  value={financeForm.type}
                  onChange={e => setFinanceForm({ ...financeForm, type: e.target.value })}
                  className="w-full arc-input"
                >
                  <option value="expense">Expense</option>
                  <option value="savings">Savings</option>
                  <option value="investment">Investment</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="500"
                  value={financeForm.amount}
                  onChange={e => setFinanceForm({ ...financeForm, amount: e.target.value })}
                  className="w-full arc-input"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">Category & Note</label>
              <input
                type="text"
                placeholder="e.g. Groceries & healthy food"
                value={financeForm.note}
                onChange={e => setFinanceForm({ ...financeForm, note: e.target.value })}
                className="w-full arc-input"
              />
            </div>
          </>
        )}

        {/* Journal Form */}
        {tab === 'journal' && (
          <>
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">Today's Win</label>
              <textarea
                rows={2}
                placeholder="What did I accomplish today?"
                value={journalForm.win}
                onChange={e => setJournalForm({ ...journalForm, win: e.target.value })}
                className="w-full arc-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">What Went Wrong?</label>
              <textarea
                rows={2}
                placeholder="What could I improve?"
                value={journalForm.wrong}
                onChange={e => setJournalForm({ ...journalForm, wrong: e.target.value })}
                className="w-full arc-input"
              />
            </div>
          </>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
          <button
            type="button"
            onClick={handleClose}
            className="arc-btn-secondary text-xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="arc-btn-primary text-xs"
          >
            Save Entry
          </button>
        </div>
      </form>
    </Modal>
  );
}
