import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  getDateForDay,
  formatReadableDate,
  getDayOfWeekKey,
  getDayOfWeekName,
  ORDERED_WEEKDAYS,
  WEEKDAY_LABELS,
} from '../utils/storage';
import { Code, Plus, CheckCircle2, GitCommit, Clock, Terminal, Sparkles } from 'lucide-react';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import { Link } from 'react-router-dom';

const DEFAULT_LANGUAGES = ['Java', 'Python', 'C', 'C++', 'JavaScript', 'TypeScript', 'SQL'];

export default function CodingPage() {
  const {
    data,
    activeDayNumber,
    currentDayData,
    addCoding,
    updateCodingLanguages,
    updateCodingSchedule,
    isFutureDay,
  } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const codingConfig = data.codingConfig || { languages: [], schedule: {} };
  const userLanguages = codingConfig.languages || [];

  const dateStr = getDateForDay(activeDayNumber);
  const weekdayKey = getDayOfWeekKey(dateStr);
  const weekdayName = getDayOfWeekName(dateStr);
  const scheduledLang = codingConfig.schedule?.[weekdayKey] || data.routine?.[weekdayKey]?.codingLang || '';

  const [form, setForm] = useState({
    problem: '',
    language: scheduledLang || userLanguages[0] || 'Java',
    platform: 'LeetCode',
    topic: 'Arrays',
    difficulty: 'Medium',
    durationMinutes: 45,
    problemsSolved: 1,
    commits: 0,
    notes: '',
  });

  const isFuture = isFutureDay(activeDayNumber);
  const codingList = currentDayData?.coding || [];
  const stats = data.stats || {};
  const totalHours = stats.totalCodingHours || 0;
  const totalSolved = stats.totalProblemsSolved || 0;

  const handleToggleLang = (lang) => {
    const list = userLanguages.includes(lang)
      ? userLanguages.filter(l => l !== lang)
      : [...userLanguages, lang];
    updateCodingLanguages(list);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.problem.trim()) return;
    addCoding(activeDayNumber, form);
    setForm({
      problem: '',
      language: scheduledLang || userLanguages[0] || 'Java',
      platform: 'LeetCode',
      topic: 'Arrays',
      difficulty: 'Medium',
      durationMinutes: 45,
      problemsSolved: 1,
      commits: 0,
      notes: '',
    });
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-5xl pb-12">
      {/* Header */}
      <div className="arc-card p-6 sm:p-8 bg-white border border-[#E2E8F0] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] block">
            SOFTWARE ENGINEERING & DSA
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1">
            Coding & Problem Solving
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Log algorithmic problems, language practice, LeetCode milestones, and git commits.
          </p>
        </div>

        {!isFuture && (
          <button
            type="button"
            onClick={() => {
              setForm(prev => ({
                ...prev,
                language: scheduledLang || userLanguages[0] || 'Java',
              }));
              setModalOpen(true);
            }}
            className="arc-btn-primary text-xs"
          >
            <Plus size={16} />
            <span>Log Coding Session</span>
          </button>
        )}
      </div>

      {/* Top 3 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="arc-card p-5 bg-white border border-[#E2E8F0] shadow-sm">
          <span className="text-xs font-semibold text-[#64748B] block">Total Problems Solved</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1">
            {totalSolved} <span className="text-base text-[#64748B] font-medium">problems</span>
          </div>
          <span className="text-[11px] text-[#64748B] block mt-1">
            Verified across 100 days
          </span>
        </div>

        <div className="arc-card p-5 bg-white border border-[#E2E8F0] shadow-sm">
          <span className="text-xs font-semibold text-[#64748B] block">Total Coding Hours</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#2563EB] mt-1">
            {totalHours}h
          </div>
          <span className="text-[11px] text-[#64748B] block mt-1">
            Deep programming time
          </span>
        </div>

        <div className="arc-card p-5 bg-white border border-[#E2E8F0] shadow-sm">
          <span className="text-xs font-semibold text-[#64748B] block">Scheduled Today ({weekdayName})</span>
          <div className="text-xl font-extrabold text-[#0F172A] mt-1">
            {scheduledLang || 'Not assigned'}
          </div>
          <span className="text-[11px] text-[#2563EB] font-medium block mt-1">
            {codingList.length} session(s) logged today
          </span>
        </div>
      </div>

      {/* Programming Languages Setup Bar */}
      <div className="arc-card p-6 bg-white border border-[#E2E8F0] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div>
            <h3 className="text-sm font-bold text-[#0F172A]">My Programming Languages</h3>
            <p className="text-xs text-[#64748B]">Select the languages you are focusing on for this Winter Arc</p>
          </div>
          <Link to="/routine" className="text-xs font-bold text-[#2563EB] hover:underline">
            Manage Weekly Routine →
          </Link>
        </div>

        <div className="flex flex-wrap gap-2">
          {DEFAULT_LANGUAGES.map((lang) => {
            const isSelected = userLanguages.includes(lang);
            return (
              <button
                key={lang}
                type="button"
                onClick={() => handleToggleLang(lang)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-sm'
                    : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:text-[#0F172A]'
                }`}
              >
                {lang} {isSelected && '✓'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Day Sessions List */}
      <div className="arc-card p-6 bg-white border border-[#E2E8F0] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <h3 className="text-sm font-bold text-[#0F172A]">Day {activeDayNumber} Coding Log</h3>
          {!isFuture && (
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="text-xs font-bold text-[#2563EB] hover:underline"
            >
              + Add Session
            </button>
          )}
        </div>

        {codingList.length === 0 ? (
          <EmptyState
            icon={Code}
            title="0 problems logged for this day"
            description={
              scheduledLang
                ? `Today's scheduled language is ${scheduledLang}. Solve your daily problem and log it here.`
                : 'Log your LeetCode problem, project feature, or debugging session.'
            }
            actionLabel="Log Coding Session"
            onAction={() => setModalOpen(true)}
          />
        ) : (
          <div className="space-y-3">
            {codingList.map((c) => (
              <div key={c.id} className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#0F172A]">{c.problem}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-[#2563EB] font-bold">
                      {c.language}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      c.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-800' :
                      c.difficulty === 'Hard' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {c.difficulty}
                    </span>
                    <span className="text-[11px] text-[#64748B]">· {c.platform}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-[#64748B]">
                    <span>Topic: <strong>{c.topic}</strong></span>
                    <span>·</span>
                    <span>{c.durationMinutes} mins</span>
                    {c.problemsSolved > 0 && <span>· <strong>{c.problemsSolved}</strong> solved</span>}
                    {c.commits > 0 && <span>· {c.commits} commits</span>}
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs">
                  Solved ✓
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Log Coding Session */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Log Coding Session" subtitle={`Day ${activeDayNumber}`}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1">Problem / Task Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Two Sum, LRU Cache, Binary Tree Maximum Path Sum..."
              value={form.problem}
              onChange={e => setForm({ ...form, problem: e.target.value })}
              className="w-full arc-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">Language</label>
              <select
                value={form.language}
                onChange={e => setForm({ ...form, language: e.target.value })}
                className="w-full arc-input"
              >
                {userLanguages.length > 0 ? (
                  userLanguages.map(l => <option key={l} value={l}>{l}</option>)
                ) : (
                  DEFAULT_LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)
                )}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">Platform</label>
              <select
                value={form.platform}
                onChange={e => setForm({ ...form, platform: e.target.value })}
                className="w-full arc-input"
              >
                <option value="LeetCode">LeetCode</option>
                <option value="Codeforces">Codeforces</option>
                <option value="HackerRank">HackerRank</option>
                <option value="GitHub Project">GitHub Project</option>
                <option value="Personal Build">Personal Build</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">Difficulty</label>
              <select
                value={form.difficulty}
                onChange={e => setForm({ ...form, difficulty: e.target.value })}
                className="w-full arc-input"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">Duration (mins)</label>
              <input
                type="number"
                min="5"
                value={form.durationMinutes}
                onChange={e => setForm({ ...form, durationMinutes: e.target.value })}
                className="w-full arc-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">Problems Solved</label>
              <input
                type="number"
                min="1"
                value={form.problemsSolved}
                onChange={e => setForm({ ...form, problemsSolved: e.target.value })}
                className="w-full arc-input"
              />
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
            <button type="submit" className="arc-btn-primary text-xs">
              Save Coding Session (+XP)
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
