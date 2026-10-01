import React from 'react';
import Modal from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { Eye, EyeOff, Layout } from 'lucide-react';

export default function WidgetCustomizerModal({ isOpen, onClose }) {
  const { data, updateUserProfile, showToast } = useApp();

  const visibleWidgets = data.settings?.visibleWidgets || {
    headerStats: true,
    todayPriorities: true,
    todayProgress: true,
    streakCard: true,
    xpCard: true,
    contextQuote: true,
  };

  const widgetDefinitions = [
    { key: 'headerStats', label: 'Header & Progress Rings', desc: 'Day counter, 100-day ring, today completion rate' },
    { key: 'todayPriorities', label: 'Top 3 Priorities', desc: 'Daily non-negotiables checklist' },
    { key: 'todayProgress', label: 'Pillar Progress Grid', desc: 'Mini indicators for habits, workouts, study, coding, sleep, food' },
    { key: 'streakCard', label: 'Streak Counter Card', desc: 'Unbroken day streak and records' },
    { key: 'xpCard', label: 'XP & Level Bar Card', desc: 'Operating level, current XP, and rewards breakdown' },
    { key: 'contextQuote', label: 'Contextual Motivation Banner', desc: 'Dynamic contextual guidance based on current state' },
  ];

  const toggleWidget = (key) => {
    const updated = {
      ...visibleWidgets,
      [key]: !visibleWidgets[key],
    };
    updateUserProfile({
      settings: {
        ...(data.settings || {}),
        visibleWidgets: updated,
      },
    });
    showToast('Dashboard layout updated', 'info');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Customize Dashboard" subtitle="Toggle dashboard widgets to suit your focus workflow" maxWidth="max-w-md">
      <div className="space-y-3">
        {widgetDefinitions.map((w) => {
          const isVisible = visibleWidgets[w.key] !== false;
          return (
            <div
              key={w.key}
              onClick={() => toggleWidget(w.key)}
              className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                isVisible
                  ? 'bg-[#181D24] border-[#242932] hover:border-sky-500/40'
                  : 'bg-[#12151A]/60 border-[#1E232B] opacity-60'
              }`}
            >
              <div>
                <span className="text-xs font-semibold text-[#F5F7FA] block">
                  {w.label}
                </span>
                <span className="text-[10px] text-[#8B929E] block mt-0.5">
                  {w.desc}
                </span>
              </div>

              <div className={`p-1.5 rounded-lg ${isVisible ? 'bg-sky-500/20 text-sky-400' : 'bg-[#1E232B] text-[#525966]'}`}>
                {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end pt-4 mt-4 border-t border-[#242932]">
        <button
          onClick={onClose}
          className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold transition-all"
        >
          Done
        </button>
      </div>
    </Modal>
  );
}
