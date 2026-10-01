import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Search, X, CheckSquare, Dumbbell, BookOpen, Code, FileText, DollarSign, Calendar } from 'lucide-react';

export default function GlobalSearch() {
  const { globalSearchOpen, setGlobalSearchOpen, data, setActiveDayNumber } = useApp();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const results = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];
    const q = query.toLowerCase();
    const items = [];

    // Search Habits
    (data.habits || []).forEach(h => {
      if (h.title.toLowerCase().includes(q) || h.category.toLowerCase().includes(q)) {
        items.push({
          type: 'habit',
          title: h.title,
          subtitle: `Habit · ${h.category} · Streak ${h.streak}d`,
          icon: CheckSquare,
          action: () => navigate('/habits'),
        });
      }
    });

    // Search Tasks in days
    Object.values(data.days || {}).forEach(d => {
      (d.tasks || []).forEach(t => {
        if (t.title.toLowerCase().includes(q) || (t.note && t.note.toLowerCase().includes(q))) {
          items.push({
            type: 'task',
            title: t.title,
            subtitle: `Day ${d.dayNumber} Task · ${t.category} · ${t.completed ? 'Completed' : 'Pending'}`,
            icon: CheckSquare,
            action: () => {
              setActiveDayNumber(d.dayNumber);
              navigate('/today');
            },
          });
        }
      });

      // Search Workouts
      (d.workouts || []).forEach(w => {
        if (w.name.toLowerCase().includes(q) || w.category.toLowerCase().includes(q)) {
          items.push({
            type: 'workout',
            title: w.name,
            subtitle: `Day ${d.dayNumber} Workout · ${w.category} · ${w.duration} min`,
            icon: Dumbbell,
            action: () => {
              setActiveDayNumber(d.dayNumber);
              navigate('/fitness');
            },
          });
        }
      });

      // Search Study
      (d.study || []).forEach(s => {
        if (s.subject.toLowerCase().includes(q) || s.topic.toLowerCase().includes(q)) {
          items.push({
            type: 'study',
            title: `${s.subject}: ${s.topic}`,
            subtitle: `Day ${d.dayNumber} Study · ${s.durationMinutes} min`,
            icon: BookOpen,
            action: () => {
              setActiveDayNumber(d.dayNumber);
              navigate('/study');
            },
          });
        }
      });

      // Search Coding
      (d.coding || []).forEach(c => {
        if (c.problemName.toLowerCase().includes(q) || c.topic.toLowerCase().includes(q) || c.platform.toLowerCase().includes(q)) {
          items.push({
            type: 'coding',
            title: `${c.problemName} (${c.platform})`,
            subtitle: `Day ${d.dayNumber} Coding · ${c.difficulty} · ${c.durationMinutes} min`,
            icon: Code,
            action: () => {
              setActiveDayNumber(d.dayNumber);
              navigate('/coding');
            },
          });
        }
      });

      // Search Journal
      if (d.journal) {
        if ((d.journal.win && d.journal.win.toLowerCase().includes(q)) || (d.journal.gratitude && d.journal.gratitude.toLowerCase().includes(q))) {
          items.push({
            type: 'journal',
            title: `Journal Day ${d.dayNumber}: "${d.journal.win || d.journal.gratitude}"`,
            subtitle: `Mood: ${d.journal.mood}/10 · Energy: ${d.journal.energy}/10`,
            icon: FileText,
            action: () => {
              setActiveDayNumber(d.dayNumber);
              navigate('/journal');
            },
          });
        }
      }

      // Search Finance
      (d.finance || []).forEach(f => {
        if ((f.note && f.note.toLowerCase().includes(q)) || f.category.toLowerCase().includes(q)) {
          items.push({
            type: 'finance',
            title: `${f.category}: $${f.amount} (${f.note || f.type})`,
            subtitle: `Day ${d.dayNumber} Transaction · ${f.type}`,
            icon: DollarSign,
            action: () => {
              setActiveDayNumber(d.dayNumber);
              navigate('/finance');
            },
          });
        }
      });
    });

    return items.slice(0, 15);
  }, [data, query, navigate, setActiveDayNumber]);

  if (!globalSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={() => setGlobalSearchOpen(false)} />
      <div className="relative w-full max-w-2xl bg-[#12151A] border border-[#242932] rounded-2xl shadow-2xl overflow-hidden z-10">
        {/* Search bar */}
        <div className="flex items-center px-4 py-3 border-b border-[#242932] gap-3">
          <Search size={18} className="text-[#8B929E]" />
          <input
            type="text"
            autoFocus
            placeholder="Search habits, tasks, workouts, study, coding, journal, finance... (ESC to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-[#F5F7FA] placeholder-[#8B929E] focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-[#8B929E] hover:text-[#F5F7FA]">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {query.trim().length < 2 ? (
            <div className="p-8 text-center text-xs text-[#8B929E]">
              Type at least 2 characters to search across your 100-day Winter Arc journey.
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#8B929E]">
              No matches found for <span className="text-[#F5F7FA]">"{query}"</span>.
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((res, idx) => {
                const Icon = res.icon;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      res.action();
                      setGlobalSearchOpen(false);
                      setQuery('');
                    }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#181D24] cursor-pointer transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#1E232B] group-hover:bg-sky-500/10 group-hover:text-sky-400 text-[#8B929E] flex items-center justify-center shrink-0 transition-colors">
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-[#F5F7FA] truncate group-hover:text-sky-300">
                        {res.title}
                      </div>
                      <div className="text-[11px] text-[#8B929E] truncate">
                        {res.subtitle}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-[#0F1217] border-t border-[#242932] flex items-center justify-between text-[11px] text-[#8B929E]">
          <span>Press ESC to exit</span>
          <span className="font-mono">Winter Arc Search</span>
        </div>
      </div>
    </div>
  );
}
