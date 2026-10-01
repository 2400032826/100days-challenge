import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  getDateForDay,
  formatReadableDate,
  getDayOfWeekKey,
  getDayOfWeekName,
  getNextIncompleteTopic,
} from '../utils/storage';
import ProgressBar from '../components/common/ProgressBar';
import ProgressRing from '../components/common/ProgressRing';
import {
  Calendar,
  Flame,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  Dumbbell,
  BookOpen,
  Code,
  Zap,
  Award,
  Sun,
  Coffee,
  Sparkles,
  AlertCircle,
  X,
  RotateCcw,
  CheckSquare,
} from 'lucide-react';
import Modal from '../components/common/Modal';

export default function DashboardPage() {
  const {
    data,
    currentDayNumber,
    currentDayData,
    currentDayScoreObj,
    levelInfo,
    realStreak,
    openQuickAdd,
    toggleTask,
    dismissMorningCheckin,
    saveWeeklyReview,
  } = useApp();

  const navigate = useNavigate();
  const user = data.user || {};
  const dateStr = getDateForDay(currentDayNumber);
  const weekdayKey = getDayOfWeekKey(dateStr);
  const weekdayName = getDayOfWeekName(dateStr);
  const daysLeft = Math.max(0, 100 - currentDayNumber);

  const routineForDay = data.routine?.[weekdayKey] || {};
  const isRestDay = routineForDay.isRestDay;
  const courseForDay = (data.courses || []).find(c => c.id === routineForDay.courseId);
  const nextTopicForDay = courseForDay ? getNextIncompleteTopic(courseForDay) : null;
  const codingLangForDay = routineForDay.codingLang || data.codingConfig?.schedule?.[weekdayKey] || '';

  // Today's task completion
  const tasks = currentDayData?.tasks || [];
  const completedTasksCount = tasks.filter(t => t.completed).length;
  const todayPercentage = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;

  // Habits completed today
  const userHabits = data.habits || [];
  const habitsCompletedToday = currentDayData?.habitsCompleted || [];

  // Revisions due today
  const revisionsDueToday = (data.revisions || []).filter(r => r.dueDate === dateStr && !r.completed);

  // Check if Morning Check-In is visible
  const isMorningCheckinDismissed = data.morningCheckinDismissedDate === dateStr;

  // Weekly review state
  const isSunday = weekdayKey === 'sunday';
  const weekNumber = Math.ceil(currentDayNumber / 7);
  const currentWeekReviewKey = `week-${weekNumber}`;
  const existingReview = data.weeklyReviews?.[currentWeekReviewKey];
  const [weeklyReviewModalOpen, setWeeklyReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    whatWentWell: existingReview?.whatWentWell || '',
    whatShouldImprove: existingReview?.whatShouldImprove || '',
    nextFocus: existingReview?.nextFocus || '',
  });

  const handleSaveWeeklyReview = (e) => {
    e.preventDefault();
    saveWeeklyReview(currentWeekReviewKey, reviewForm);
    setWeeklyReviewModalOpen(false);
  };

  // Generate Smart Suggestions strictly from real data
  const suggestions = [];

  if (!isRestDay && (!currentDayData?.workouts || currentDayData.workouts.length === 0)) {
    suggestions.push({
      id: 'sug-workout',
      title: routineForDay.workoutFocus
        ? `Today's workout: ${routineForDay.workoutFocus}`
        : 'You haven\'t logged your workout session yet.',
      actionLabel: 'Log Workout',
      onClick: () => navigate('/fitness'),
      icon: Dumbbell,
      color: 'text-blue-600',
    });
  }

  if (courseForDay && nextTopicForDay) {
    suggestions.push({
      id: 'sug-study',
      title: `${courseForDay.name}: Ready for topic "${nextTopicForDay.name}"`,
      actionLabel: 'Start Study',
      onClick: () => navigate('/study'),
      icon: BookOpen,
      color: 'text-indigo-600',
    });
  }

  if (revisionsDueToday.length > 0) {
    suggestions.push({
      id: 'sug-rev',
      title: `You have ${revisionsDueToday.length} spaced revision(s) due today: ${revisionsDueToday.map(r => r.topicName).join(', ')}`,
      actionLabel: 'Review Now',
      onClick: () => navigate('/study'),
      icon: RotateCcw,
      color: 'text-amber-600',
    });
  }

  if (userHabits.length > 0 && habitsCompletedToday.length < userHabits.length) {
    const remaining = userHabits.length - habitsCompletedToday.length;
    suggestions.push({
      id: 'sug-habits',
      title: `${remaining} habit${remaining > 1 ? 's' : ''} remaining for today.`,
      actionLabel: 'Check Habits',
      onClick: () => navigate('/habits'),
      icon: CheckSquare,
      color: 'text-emerald-600',
    });
  }

  const currentWater = currentDayData?.nutrition?.water || 0;
  const targetWater = user.dailyTargets?.waterLiters || 3.0;
  if (currentWater < targetWater) {
    suggestions.push({
      id: 'sug-water',
      title: `Water hydration: ${currentWater}L logged of ${targetWater}L target.`,
      actionLabel: 'Log Water',
      onClick: () => navigate('/nutrition'),
      icon: Zap,
      color: 'text-sky-600',
    });
  }

  return (
    <div className="space-y-6 max-w-5xl pb-12">
      {/* 1. MORNING CHECK-IN CARD (Dismissible, shown once per day) */}
      {!isMorningCheckinDismissed && (
        <div className="arc-card p-6 bg-gradient-to-r from-blue-50/80 to-indigo-50/40 border border-blue-200 shadow-sm relative overflow-hidden animate-in fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-blue-200 text-[#2563EB] flex items-center justify-center font-bold shadow-sm shrink-0">
                <Sun size={20} />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB] block">
                  DAILY MORNING CHECK-IN
                </span>
                <h2 className="text-xl font-extrabold text-[#0F172A]">
                  Good morning, {user.name || 'Friend'}
                </h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Today is <strong>{weekdayName}</strong>. Here is your scheduled focus for today:
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#E2E8F0] text-xs font-semibold text-[#0F172A]">
                    <Dumbbell size={13} className="text-[#2563EB]" />
                    <span>
                      {isRestDay ? 'Recovery Day' : routineForDay.workoutFocus || 'Workout: Not configured'}
                    </span>
                  </span>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#E2E8F0] text-xs font-semibold text-[#0F172A]">
                    <BookOpen size={13} className="text-[#2563EB]" />
                    <span>
                      {courseForDay
                        ? `${courseForDay.name}${nextTopicForDay ? ` (${nextTopicForDay.name})` : ''}`
                        : 'Study: Not configured'}
                    </span>
                  </span>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#E2E8F0] text-xs font-semibold text-[#0F172A]">
                    <Code size={13} className="text-[#2563EB]" />
                    <span>{codingLangForDay ? `Coding: ${codingLangForDay}` : 'Coding: Not configured'}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                type="button"
                onClick={() => dismissMorningCheckin(dateStr)}
                className="arc-btn-primary py-2 px-4 text-xs font-bold shadow-sm"
              >
                Start My Day
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] block">
          WINTER ARC · DAY {currentDayNumber} OF 100
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mt-1">
          {weekdayName}, {formatReadableDate(dateStr)}
        </h1>
        <p className="text-base sm:text-lg font-semibold text-[#64748B] mt-0.5">
          Build the version of yourself you want.
        </p>
      </div>

      {/* Top 4 Dynamic Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Day */}
        <div className="arc-card p-5 bg-white border border-[#E2E8F0] shadow-sm">
          <span className="text-xs font-semibold text-[#64748B] block">Day</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1">
            {currentDayNumber} <span className="text-base font-medium text-[#64748B]">/ 100</span>
          </div>
          <span className="text-[11px] text-[#2563EB] font-medium block mt-1">
            Ends Jan 8, 2027
          </span>
        </div>

        {/* Days Left */}
        <div className="arc-card p-5 bg-white border border-[#E2E8F0] shadow-sm">
          <span className="text-xs font-semibold text-[#64748B] block">Days Left</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1">
            {daysLeft}
          </div>
          <span className="text-[11px] text-[#64748B] block mt-1">
            Consecutive focus
          </span>
        </div>

        {/* Today */}
        <div className="arc-card p-5 bg-white border border-[#E2E8F0] shadow-sm">
          <span className="text-xs font-semibold text-[#64748B] block">Today's Tasks</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#2563EB] mt-1">
            {todayPercentage}%
          </div>
          <span className="text-[11px] text-[#64748B] block mt-1">
            {completedTasksCount} of {tasks.length} completed
          </span>
        </div>

        {/* Streak */}
        <div className="arc-card p-5 bg-white border border-[#E2E8F0] shadow-sm">
          <span className="text-xs font-semibold text-[#64748B] block">Current Streak</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1 flex items-center gap-1.5">
            <Flame size={24} className="fill-amber-500 text-amber-500" />
            <span>{realStreak} {realStreak === 1 ? 'day' : 'days'}</span>
          </div>
          <span className="text-[11px] text-[#64748B] block mt-1">
            {realStreak === 0 ? 'Start your streak today' : 'Keep the chain alive'}
          </span>
        </div>
      </div>

      {/* 2. TODAY'S PLAN CARD (The Heart of the Dashboard) */}
      <div className="arc-card p-6 sm:p-8 bg-white border border-[#E2E8F0] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#E2E8F0]">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB] block">
              TODAY'S COMMAND CENTER
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A]">
              Today's Scheduled Plan
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              {weekdayName} · {formatReadableDate(dateStr)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/today" className="arc-btn-primary py-2 px-4 text-xs font-bold flex items-center gap-1.5">
              <span>View Full Checklist</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* 4 Pillars Grid: Workout | Study | Coding | Habits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Workout Pillar */}
          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
                <Dumbbell size={14} className="text-[#2563EB]" />
                <span>Workout</span>
              </span>
              {isRestDay && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">
                  Recovery Day
                </span>
              )}
            </div>

            <div>
              <span className="text-sm font-bold text-[#0F172A] block truncate">
                {isRestDay
                  ? 'Active Recovery / Rest'
                  : routineForDay.workoutFocus || 'Not configured'}
              </span>
              <span className="text-[11px] text-[#64748B] block mt-0.5">
                {isRestDay
                  ? 'Light mobility & walking'
                  : routineForDay.exercises?.length
                  ? `${routineForDay.exercises.length} exercises programmed`
                  : 'Split not set'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => navigate('/fitness')}
              className="w-full arc-btn-secondary text-xs py-1.5 justify-center"
            >
              {currentDayData?.workouts?.length ? 'Workout Logged ✓' : 'Log Workout'}
            </button>
          </div>

          {/* Study Pillar */}
          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
                <BookOpen size={14} className="text-[#2563EB]" />
                <span>Study</span>
              </span>
            </div>

            <div>
              <span className="text-sm font-bold text-[#0F172A] block truncate">
                {courseForDay ? courseForDay.name : 'Not configured'}
              </span>
              <span className="text-[11px] text-[#2563EB] font-medium block mt-0.5 truncate">
                {nextTopicForDay ? `Next: ${nextTopicForDay.name}` : courseForDay ? 'All topics completed' : 'No course set'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => navigate('/study')}
              className="w-full arc-btn-secondary text-xs py-1.5 justify-center"
            >
              Start Study
            </button>
          </div>

          {/* Coding Pillar */}
          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
                <Code size={14} className="text-[#2563EB]" />
                <span>Coding</span>
              </span>
            </div>

            <div>
              <span className="text-sm font-bold text-[#0F172A] block truncate">
                {codingLangForDay || 'Not configured'}
              </span>
              <span className="text-[11px] text-[#64748B] block mt-0.5">
                {currentDayData?.coding?.length ? `${currentDayData.coding.length} sessions logged` : 'Daily practice'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => navigate('/coding')}
              className="w-full arc-btn-secondary text-xs py-1.5 justify-center"
            >
              Start Coding
            </button>
          </div>

          {/* Habits Pillar */}
          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
                <CheckSquare size={14} className="text-[#2563EB]" />
                <span>Habits</span>
              </span>
            </div>

            <div>
              <span className="text-sm font-bold text-[#0F172A] block">
                {habitsCompletedToday.length} / {userHabits.length} completed
              </span>
              <span className="text-[11px] text-[#64748B] block mt-0.5">
                {userHabits.length === 0 ? 'No habits configured' : 'Daily non-negotiables'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => navigate('/habits')}
              className="w-full arc-btn-secondary text-xs py-1.5 justify-center"
            >
              View Habits
            </button>
          </div>
        </div>

        {/* Quick Task Checklist Preview */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
              Today's Key Action Items ({tasks.length})
            </span>
            <Link to="/today" className="text-xs text-[#2563EB] font-bold hover:underline">
              Open Full Day Checklist →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {tasks.slice(0, 6).map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id, currentDayNumber)}
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  task.completed
                    ? 'bg-[#F8FAFC] border-emerald-200 text-slate-400'
                    : 'bg-white border-[#E2E8F0] hover:border-blue-200 text-[#0F172A]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                    task.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-[#CBD5E1]'
                  }`}
                >
                  {task.completed && <CheckCircle2 size={12} />}
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`text-xs font-semibold block truncate ${task.completed ? 'line-through' : ''}`}>
                    {task.title}
                  </span>
                </div>
                <span className="text-[10px] text-[#64748B] shrink-0 font-medium">
                  {task.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. SMART SUGGESTIONS ("Suggested for Today") */}
      {suggestions.length > 0 && (
        <div className="arc-card p-6 bg-white border border-[#E2E8F0] shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-[#2563EB]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
              Suggested for Today (Data-Driven)
            </h3>
          </div>

          <div className="space-y-2.5">
            {suggestions.map((sug) => {
              const Icon = sug.icon;
              return (
                <div
                  key={sug.id}
                  className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center shrink-0">
                      <Icon size={16} className={sug.color} />
                    </div>
                    <span className="text-xs font-medium text-[#0F172A]">{sug.title}</span>
                  </div>

                  <button
                    type="button"
                    onClick={sug.onClick}
                    className="arc-btn-secondary text-xs py-1.5 px-3 self-end sm:self-center shrink-0"
                  >
                    {sug.actionLabel}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. SUNDAY WEEKLY REVIEW (Active on Sunday or accessible) */}
      {(isSunday || existingReview) && (
        <div className="arc-card p-6 sm:p-8 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-blue-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB] block">
                SUNDAY RETROSPECTIVE
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#0F172A]">
                Week {weekNumber} Review & Reflection
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Review your weekly workout consistency, study hours, habits, and set next week's focus.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setWeeklyReviewModalOpen(true)}
              className="arc-btn-primary text-xs py-2 px-4 shrink-0"
            >
              {existingReview ? 'Update Weekly Review' : 'Start Weekly Review (+50 XP)'}
            </button>
          </div>

          {/* Quick Weekly Metrics Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-white border border-[#E2E8F0]">
              <span className="text-[10px] font-bold text-[#64748B] block uppercase">Workouts</span>
              <span className="text-base font-extrabold text-[#0F172A] mt-0.5 block">
                {data.stats?.totalWorkouts || 0} sessions
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-[#E2E8F0]">
              <span className="text-[10px] font-bold text-[#64748B] block uppercase">Study Clocked</span>
              <span className="text-base font-extrabold text-[#0F172A] mt-0.5 block">
                {data.stats?.totalStudyHours || 0} hrs
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-[#E2E8F0]">
              <span className="text-[10px] font-bold text-[#64748B] block uppercase">Coding Clocked</span>
              <span className="text-base font-extrabold text-[#0F172A] mt-0.5 block">
                {data.stats?.totalCodingHours || 0} hrs
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-[#E2E8F0]">
              <span className="text-[10px] font-bold text-[#64748B] block uppercase">Current Streak</span>
              <span className="text-base font-extrabold text-[#2563EB] mt-0.5 block">
                {realStreak} days
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Level & XP Progression Bar */}
      <div className="arc-card p-6 bg-white border border-[#E2E8F0] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-[#2563EB]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
              Level {levelInfo.level} · {levelInfo.title}
            </span>
          </div>
          <span className="text-xs font-bold text-[#2563EB]">
            {data.stats?.totalXp || 0} XP
          </span>
        </div>

        <ProgressBar value={levelInfo.progressPercent} max={100} height="h-2" />

        <div className="flex justify-between text-[11px] text-[#64748B]">
          <span>Current Level: {levelInfo.title}</span>
          <span>{levelInfo.xpToNext} XP to next level tier</span>
        </div>
      </div>

      {/* MODAL: WEEKLY REVIEW */}
      <Modal
        isOpen={weeklyReviewModalOpen}
        onClose={() => setWeeklyReviewModalOpen(false)}
        title={`Week ${weekNumber} Retrospective`}
      >
        <form onSubmit={handleSaveWeeklyReview} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#0F172A] block mb-1">
              What went well this week?
            </label>
            <textarea
              value={reviewForm.whatWentWell}
              onChange={(e) => setReviewForm({ ...reviewForm, whatWentWell: e.target.value })}
              placeholder="Consistent workout timing, completed DSA LinkedLists, logged sleep..."
              className="arc-input w-full h-20 resize-none"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#0F172A] block mb-1">
              What should improve?
            </label>
            <textarea
              value={reviewForm.whatShouldImprove}
              onChange={(e) => setReviewForm({ ...reviewForm, whatShouldImprove: e.target.value })}
              placeholder="Reduce evening phone screen time, improve water hydration..."
              className="arc-input w-full h-20 resize-none"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#0F172A] block mb-1">
              What is next week's core focus?
            </label>
            <textarea
              value={reviewForm.nextFocus}
              onChange={(e) => setReviewForm({ ...reviewForm, nextFocus: e.target.value })}
              placeholder="Finish Binary Search Trees, 4 weight sessions, maintain 8-hr sleep..."
              className="arc-input w-full h-20 resize-none"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setWeeklyReviewModalOpen(false)}
              className="arc-btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="arc-btn-primary">
              Save Review (+50 XP)
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
