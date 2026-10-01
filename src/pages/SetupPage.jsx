import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_ROUTINE_CONFIG, ORDERED_WEEKDAYS, WEEKDAY_LABELS } from '../utils/storage';
import {
  Clock,
  Droplet,
  Dumbbell,
  BookOpen,
  Code,
  PenLine,
  Sparkles,
  Footprints,
  Save,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';

const POPULAR_LANGUAGES = ['Java', 'Python', 'C++', 'JavaScript', 'TypeScript', 'Go', 'Rust', 'SQL'];

export default function SetupPage() {
  const { data, updateRoutineConfig, showToast } = useApp();
  const navigate = useNavigate();

  const initialConfig = {
    ...DEFAULT_ROUTINE_CONFIG,
    ...(data.routineConfig || {}),
  };

  const [form, setForm] = useState(initialConfig);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const toggleDay = (arrayKey, day) => {
    const list = form[arrayKey] || [];
    const next = list.includes(day)
      ? list.filter(d => d !== day)
      : [...list, day];
    setForm(prev => ({ ...prev, [arrayKey]: next }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateRoutineConfig(form);
    setSavedSuccess(true);
    showToast("Routine configuration saved! Today's schedule updated.", 'success');
    setTimeout(() => {
      navigate('/');
    }, 800);
  };

  return (
    <div className="max-w-3xl pb-16 space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] block">
          SMART ROUTINE CONFIGURATION
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mt-1">
          Simple Setup
        </h1>
        <p className="text-sm font-medium text-[#64748B] mt-1">
          Configure your daily targets and times once. The app will automatically generate your structured daily timeline.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. DAILY ROUTINE TIMES */}
        <div className="arc-card p-6 bg-white border border-[#E2E8F0] shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#E2E8F0]">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-[#2563EB] flex items-center justify-center">
              <Clock size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">Daily Routine Times</h2>
              <p className="text-xs text-[#64748B]">Set your wake, meal, and sleep milestones</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
            {/* Wake up */}
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1.5 flex items-center gap-1.5">
                <span>🌅 Wake-up Time</span>
              </label>
              <input
                type="time"
                value={form.wakeUpTime || '06:30'}
                onChange={(e) => handleChange('wakeUpTime', e.target.value)}
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm font-semibold text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            {/* Breakfast */}
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1.5 flex items-center gap-1.5">
                <span>🍳 Breakfast Time</span>
              </label>
              <input
                type="time"
                value={form.breakfastTime || '08:00'}
                onChange={(e) => handleChange('breakfastTime', e.target.value)}
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm font-semibold text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            {/* Lunch */}
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1.5 flex items-center gap-1.5">
                <span>🍛 Lunch Time</span>
              </label>
              <input
                type="time"
                value={form.lunchTime || '13:00'}
                onChange={(e) => handleChange('lunchTime', e.target.value)}
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm font-semibold text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            {/* Dinner */}
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1.5 flex items-center gap-1.5">
                <span>🍽️ Dinner Time</span>
              </label>
              <input
                type="time"
                value={form.dinnerTime || '20:00'}
                onChange={(e) => handleChange('dinnerTime', e.target.value)}
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm font-semibold text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            {/* Sleep */}
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1.5 flex items-center gap-1.5">
                <span>😴 Sleep Time</span>
              </label>
              <input
                type="time"
                value={form.sleepTime || '22:30'}
                onChange={(e) => handleChange('sleepTime', e.target.value)}
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm font-semibold text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>
        </div>

        {/* 2. HEALTH & FITNESS */}
        <div className="arc-card p-6 bg-white border border-[#E2E8F0] shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#E2E8F0]">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
              <Dumbbell size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">Health & Hydration</h2>
              <p className="text-xs text-[#64748B]">Water, workouts, and daily activity movement</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Water Goal */}
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                💧 Daily Water Goal (Liters)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.25"
                  min="1"
                  max="8"
                  value={form.waterGoalLiters ?? 3.0}
                  onChange={(e) => handleChange('waterGoalLiters', parseFloat(e.target.value) || 3.0)}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm font-semibold text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
                />
                <span className="text-xs font-bold text-[#64748B] shrink-0">L / day</span>
              </div>
            </div>

            {/* Water Reminder Interval */}
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                🔔 Water Reminder Interval
              </label>
              <select
                value={form.waterReminderIntervalHours ?? 2}
                onChange={(e) => handleChange('waterReminderIntervalHours', parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm font-semibold text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
              >
                <option value={1}>Every 1 hour</option>
                <option value={2}>Every 2 hours (Recommended)</option>
                <option value={3}>Every 3 hours</option>
                <option value={4}>Every 4 hours</option>
              </select>
            </div>
          </div>

          {/* Workout Toggle & Schedule */}
          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-[#0F172A] block">🏋️ Workout Schedule</span>
                <span className="text-xs text-[#64748B]">Include strength training in your daily plan</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.workoutEnabled !== false}
                  onChange={(e) => handleChange('workoutEnabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB]"></div>
              </label>
            </div>

            {form.workoutEnabled !== false && (
              <div className="space-y-3 pt-2 border-t border-[#E2E8F0]">
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Scheduled Workout Time
                  </label>
                  <input
                    type="time"
                    value={form.workoutTime || '17:30'}
                    onChange={(e) => handleChange('workoutTime', e.target.value)}
                    className="w-full sm:w-48 px-3 py-2 bg-white border border-[#E2E8F0] rounded-xl text-sm font-semibold text-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                    Workout Days
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {ORDERED_WEEKDAYS.map(day => {
                      const selected = (form.workoutDays || []).includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay('workoutDays', day)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            selected
                              ? 'bg-[#2563EB] text-white shadow-sm'
                              : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:border-blue-300'
                          }`}
                        >
                          {WEEKDAY_LABELS[day]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Activity / Steps */}
          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-[#0F172A] block">🚶 Daily Activity & Steps</span>
                <span className="text-xs text-[#64748B]">Non-exercise physical activity</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.activityEnabled !== false}
                  onChange={(e) => handleChange('activityEnabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB]"></div>
              </label>
            </div>

            {form.activityEnabled !== false && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#E2E8F0]">
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Daily Steps Target
                  </label>
                  <input
                    type="number"
                    step="500"
                    min="1000"
                    max="50000"
                    value={form.stepsGoal || 10000}
                    onChange={(e) => handleChange('stepsGoal', parseInt(e.target.value, 10) || 10000)}
                    className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-xl text-sm font-semibold text-[#0F172A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Activity Reminder Time
                  </label>
                  <input
                    type="time"
                    value={form.activityTime || '19:00'}
                    onChange={(e) => handleChange('activityTime', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-xl text-sm font-semibold text-[#0F172A]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. STUDY SCHEDULE */}
        <div className="arc-card p-6 bg-white border border-[#E2E8F0] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center">
                <BookOpen size={18} />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#0F172A]">Study Plan</h2>
                <p className="text-xs text-[#64748B]">Course work and academic study sessions</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.studyEnabled !== false}
                onChange={(e) => handleChange('studyEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB]"></div>
            </label>
          </div>

          {form.studyEnabled !== false && (
            <div className="space-y-4 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Study Time
                  </label>
                  <input
                    type="time"
                    value={form.studyTime || '09:00'}
                    onChange={(e) => handleChange('studyTime', e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm font-semibold text-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Course Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Data Structures & Algorithms"
                    value={form.courseName || ''}
                    onChange={(e) => handleChange('courseName', e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm font-semibold text-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Course Code (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CS201"
                    value={form.courseCode || ''}
                    onChange={(e) => handleChange('courseCode', e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm font-semibold text-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Current Focus Topic
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Binary Search Trees & AVL"
                    value={form.currentTopic || ''}
                    onChange={(e) => handleChange('currentTopic', e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm font-semibold text-[#0F172A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                  Study Days
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {ORDERED_WEEKDAYS.map(day => {
                    const selected = (form.studyDays || []).includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay('studyDays', day)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          selected
                            ? 'bg-[#2563EB] text-white shadow-sm'
                            : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:border-blue-300'
                        }`}
                      >
                        {WEEKDAY_LABELS[day]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. CODING SCHEDULE */}
        <div className="arc-card p-6 bg-white border border-[#E2E8F0] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-[#2563EB] flex items-center justify-center">
                <Code size={18} />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#0F172A]">Coding Practice</h2>
                <p className="text-xs text-[#64748B]">Hands-on problem solving and project build</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.codingEnabled !== false}
                onChange={(e) => handleChange('codingEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB]"></div>
            </label>
          </div>

          {form.codingEnabled !== false && (
            <div className="space-y-4 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Coding Time
                  </label>
                  <input
                    type="time"
                    value={form.codingTime || '14:30'}
                    onChange={(e) => handleChange('codingTime', e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm font-semibold text-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Language / Tech
                  </label>
                  <select
                    value={form.codingLanguage || 'Java'}
                    onChange={(e) => handleChange('codingLanguage', e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm font-semibold text-[#0F172A]"
                  >
                    {POPULAR_LANGUAGES.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Daily Duration (Mins)
                  </label>
                  <input
                    type="number"
                    step="15"
                    min="15"
                    max="300"
                    value={form.codingDurationMins || 60}
                    onChange={(e) => handleChange('codingDurationMins', parseInt(e.target.value, 10) || 60)}
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm font-semibold text-[#0F172A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                  Coding Days
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {ORDERED_WEEKDAYS.map(day => {
                    const selected = (form.codingDays || []).includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay('codingDays', day)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          selected
                            ? 'bg-[#2563EB] text-white shadow-sm'
                            : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:border-blue-300'
                        }`}
                      >
                        {WEEKDAY_LABELS[day]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 5. OTHER (JOURNAL & MEDITATION) */}
        <div className="arc-card p-6 bg-white border border-[#E2E8F0] shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#E2E8F0]">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
              <PenLine size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">Mindset & Reflection</h2>
              <p className="text-xs text-[#64748B]">Nightly reflection and mindfulness</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Journal */}
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-[#0F172A] block">📝 Journal Reflection</span>
                  <span className="text-xs text-[#64748B]">Log daily wins & learnings</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.journalEnabled !== false}
                    onChange={(e) => handleChange('journalEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB]"></div>
                </label>
              </div>

              {form.journalEnabled !== false && (
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Journal Time
                  </label>
                  <input
                    type="time"
                    value={form.journalTime || '21:30'}
                    onChange={(e) => handleChange('journalTime', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-xl text-sm font-semibold text-[#0F172A]"
                  />
                </div>
              )}
            </div>

            {/* Meditation */}
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-[#0F172A] block">🧘 Meditation (Optional)</span>
                  <span className="text-xs text-[#64748B]">Morning or evening breathwork</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.meditationEnabled === true}
                    onChange={(e) => handleChange('meditationEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB]"></div>
                </label>
              </div>

              {form.meditationEnabled && (
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Meditation Time
                  </label>
                  <input
                    type="time"
                    value={form.meditationTime || '07:00'}
                    onChange={(e) => handleChange('meditationTime', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-xl text-sm font-semibold text-[#0F172A]"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="sticky bottom-16 lg:bottom-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#E2E8F0] shadow-lg flex items-center justify-between gap-4">
          <div className="text-xs text-[#64748B]">
            Saving automatically generates today's chronological schedule.
          </div>
          <button
            type="submit"
            className="arc-btn-primary px-6 py-2.5 text-sm font-bold flex items-center gap-2 shadow-sm shrink-0"
          >
            <Save size={16} />
            <span>Save & Generate Routine</span>
          </button>
        </div>
      </form>
    </div>
  );
}
