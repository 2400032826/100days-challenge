import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getDateForDay, formatReadableDate } from '../utils/storage';
import { PenLine, Sparkles, AlertCircle, Heart, Target, Smile, Zap, Search } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';

export default function JournalPage() {
  const { data, activeDayNumber, currentDayData, saveJournal, isFutureDay } = useApp();

  const journal = currentDayData?.journal || {
    win: '',
    wrong: '',
    mood: 8,
    energy: 8,
    gratitude: '',
    tomorrow: '',
  };

  const isFuture = isFutureDay(activeDayNumber);
  const [form, setForm] = useState({
    win: journal.win || '',
    wrong: journal.wrong || '',
    mood: journal.mood || 8,
    energy: journal.energy || 8,
    gratitude: journal.gratitude || '',
    tomorrow: journal.tomorrow || '',
  });

  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    const cur = currentDayData?.journal || {};
    setForm({
      win: cur.win || '',
      wrong: cur.wrong || '',
      mood: cur.mood || 8,
      energy: cur.energy || 8,
      gratitude: cur.gratitude || '',
      tomorrow: cur.tomorrow || '',
    });
  }, [activeDayNumber, currentDayData]);

  const handleSave = (e) => {
    e.preventDefault();
    saveJournal(activeDayNumber, form);
  };

  // Find all real past journal entries
  const allEntries = React.useMemo(() => {
    const list = [];
    Object.values(data.days || {}).forEach(d => {
      if (d.journal && (d.journal.win || d.journal.wrong || d.journal.gratitude)) {
        list.push({
          dayNumber: d.dayNumber,
          date: d.date,
          journal: d.journal,
        });
      }
    });

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return list.filter(item =>
        (item.journal.win && item.journal.win.toLowerCase().includes(q)) ||
        (item.journal.wrong && item.journal.wrong.toLowerCase().includes(q)) ||
        (item.journal.gratitude && item.journal.gratitude.toLowerCase().includes(q)) ||
        (item.journal.tomorrow && item.journal.tomorrow.toLowerCase().includes(q))
      );
    }

    return list.sort((a, b) => b.dayNumber - a.dayNumber);
  }, [data.days, searchQuery]);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="arc-card p-6 sm:p-8 bg-white border border-[#E2E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] block">
            MENTAL CLARITY & EVENING AUDIT
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1">
            DAILY JOURNAL
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Prompt: “How was today?” Record wins, identify friction, and focus on tomorrow.
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569]">
          Day {activeDayNumber} · {formatReadableDate(getDateForDay(activeDayNumber))}
        </div>
      </div>

      {/* Main Journal Form */}
      <div className="arc-card p-6 sm:p-8">
        <form onSubmit={handleSave} className="space-y-5">
          {/* Today's Win */}
          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1 flex items-center gap-1.5">
              <Sparkles size={14} className="text-[#2563EB]" />
              <span>Today's Win: What did I accomplish today?</span>
            </label>
            <textarea
              rows={2}
              required
              disabled={isFuture}
              placeholder="e.g. Completed all morning protocols, solved Dijkstra algorithm problem, hit gym."
              value={form.win}
              onChange={e => setForm({ ...form, win: e.target.value })}
              className="w-full arc-input"
            />
          </div>

          {/* What Went Wrong? */}
          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1 flex items-center gap-1.5">
              <AlertCircle size={14} className="text-amber-500" />
              <span>What Went Wrong? What could I improve?</span>
            </label>
            <textarea
              rows={2}
              disabled={isFuture}
              placeholder="e.g. Scrolled on phone for 20 mins after lunch. Need to leave phone in another room."
              value={form.wrong}
              onChange={e => setForm({ ...form, wrong: e.target.value })}
              className="w-full arc-input"
            />
          </div>

          {/* Mood & Energy Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div>
              <div className="flex justify-between text-xs font-semibold text-[#334155] mb-1">
                <span className="flex items-center gap-1">
                  <Smile size={14} className="text-[#2563EB]" />
                  <span>Mood Score</span>
                </span>
                <span className="font-bold text-[#0F172A]">{form.mood} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                disabled={isFuture}
                value={form.mood}
                onChange={e => setForm({ ...form, mood: Number(e.target.value) })}
                className="w-full accent-blue-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-[#334155] mb-1">
                <span className="flex items-center gap-1">
                  <Zap size={14} className="text-amber-500" />
                  <span>Energy Level</span>
                </span>
                <span className="font-bold text-[#0F172A]">{form.energy} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                disabled={isFuture}
                value={form.energy}
                onChange={e => setForm({ ...form, energy: Number(e.target.value) })}
                className="w-full accent-amber-500"
              />
            </div>
          </div>

          {/* Gratitude */}
          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1 flex items-center gap-1.5">
              <Heart size={14} className="text-rose-500" />
              <span>Gratitude: What am I grateful for?</span>
            </label>
            <textarea
              rows={2}
              disabled={isFuture}
              placeholder="e.g. Good health, uninterrupted study time, support from family."
              value={form.gratitude}
              onChange={e => setForm({ ...form, gratitude: e.target.value })}
              className="w-full arc-input"
            />
          </div>

          {/* Tomorrow's Priority */}
          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1 flex items-center gap-1.5">
              <Target size={14} className="text-indigo-600" />
              <span>Tomorrow: What is tomorrow's main priority?</span>
            </label>
            <input
              type="text"
              disabled={isFuture}
              placeholder="e.g. Execute pull workout with full focus and solve 2 DP problems."
              value={form.tomorrow}
              onChange={e => setForm({ ...form, tomorrow: e.target.value })}
              className="w-full arc-input"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
            <span className="text-xs text-[#64748B]">Awards +10 XP</span>
            <button
              type="submit"
              disabled={isFuture}
              className="arc-btn-primary"
            >
              Save Journal Entry (+10 XP)
            </button>
          </div>
        </form>
      </div>

      {/* Search Archive */}
      <div className="arc-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E2E8F0] gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#0F172A]">Past Journal Entries</h3>
            <p className="text-xs text-[#64748B]">Real written entries across your Winter Arc</p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#E2E8F0] bg-white text-xs w-full sm:w-64">
            <Search size={14} className="text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search past entries..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-transparent outline-none text-[#0F172A]"
            />
          </div>
        </div>

        {allEntries.length === 0 ? (
          <EmptyState
            icon={PenLine}
            title="No journal entries yet"
            description="Complete your reflection for Day 1 above to save your first entry."
          />
        ) : (
          <div className="space-y-3">
            {allEntries.map((item) => (
              <div key={item.dayNumber} className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#2563EB]">Day {item.dayNumber}</span>
                  <span className="text-[#64748B]">{item.date}</span>
                </div>
                {item.journal.win && (
                  <p className="text-xs text-[#0F172A]">
                    <strong>Win:</strong> {item.journal.win}
                  </p>
                )}
                {item.journal.wrong && (
                  <p className="text-xs text-[#64748B]">
                    <strong>Friction:</strong> {item.journal.wrong}
                  </p>
                )}
                {item.journal.gratitude && (
                  <p className="text-xs text-[#64748B] italic">
                    "{item.journal.gratitude}"
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
