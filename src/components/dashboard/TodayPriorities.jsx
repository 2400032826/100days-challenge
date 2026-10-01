import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Check, Edit3, Save, Target } from 'lucide-react';

export default function TodayPriorities() {
  const { currentDayData, activeDayNumber, toggleFocusPriority, updateFocusPrioritiesList } = useApp();
  const [isEditing, setIsEditing] = useState(false);

  const priorities = currentDayData?.focusPriorities || [
    { id: 'p1', text: 'Complete DSA practice', completed: true },
    { id: 'p2', text: 'Gym session', completed: true },
    { id: 'p3', text: 'Sleep before 11 PM', completed: false },
  ];

  const [editTexts, setEditTexts] = useState(priorities.map(p => p.text));

  const handleSave = () => {
    const updated = priorities.map((p, idx) => ({
      ...p,
      text: editTexts[idx] || p.text,
    }));
    updateFocusPrioritiesList(activeDayNumber, updated);
    setIsEditing(false);
  };

  return (
    <div className="arc-card p-5 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sky-500/15 text-sky-400 flex items-center justify-center">
            <Target size={15} />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F7FA]">
              Today's 3 Non-Negotiables
            </h3>
            <span className="text-[10px] text-[#8B929E]">Focus Priorities for Day {activeDayNumber}</span>
          </div>
        </div>

        <button
          onClick={() => {
            if (isEditing) {
              handleSave();
            } else {
              setEditTexts(priorities.map(p => p.text));
              setIsEditing(true);
            }
          }}
          className="text-xs font-medium text-[#8B929E] hover:text-sky-400 flex items-center gap-1 transition-colors"
        >
          {isEditing ? (
            <>
              <Save size={13} />
              <span>Save</span>
            </>
          ) : (
            <>
              <Edit3 size={13} />
              <span>Edit</span>
            </>
          )}
        </button>
      </div>

      <div className="space-y-2.5">
        {priorities.map((item, index) => {
          return (
            <div
              key={item.id}
              className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                item.completed
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-[#8B929E]'
                  : 'bg-[#181D24] border-[#242932] text-[#F5F7FA] hover:border-[#384252]'
              }`}
            >
              <button
                type="button"
                onClick={() => !isEditing && toggleFocusPriority(item.id, activeDayNumber)}
                className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                  item.completed
                    ? 'bg-emerald-500 border-emerald-400 text-white'
                    : 'border-[#384252] bg-[#0E1116] hover:border-sky-400'
                }`}
              >
                {item.completed && <Check size={14} className="stroke-[3]" />}
              </button>

              <span className="font-mono text-xs text-[#525966] font-bold">
                0{index + 1}
              </span>

              {isEditing ? (
                <input
                  type="text"
                  value={editTexts[index] || ''}
                  onChange={(e) => {
                    const next = [...editTexts];
                    next[index] = e.target.value;
                    setEditTexts(next);
                  }}
                  className="flex-1 arc-input text-xs py-1"
                />
              ) : (
                <span
                  onClick={() => toggleFocusPriority(item.id, activeDayNumber)}
                  className={`flex-1 text-xs font-medium cursor-pointer select-none ${
                    item.completed ? 'line-through text-[#8B929E]' : 'text-[#F5F7FA]'
                  }`}
                >
                  {item.text}
                </span>
              )}

              {item.completed && (
                <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10">
                  Done
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
