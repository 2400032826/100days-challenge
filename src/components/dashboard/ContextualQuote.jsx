import React from 'react';
import { useApp } from '../../context/AppContext';
import { Compass, RotateCcw, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ContextualQuote() {
  const { data, activeDayNumber, currentDayData, resetToday } = useApp();
  const navigate = useNavigate();

  const dayNum = activeDayNumber || 37;
  const isMissed = currentDayData?.status === 'missed';
  const isComplete = currentDayData?.status === 'completed';
  const score = currentDayData?.score || 0;

  let message = 'Consistency beats intensity.';
  let submessage = `Day ${dayNum}. Keep showing up.`;

  if (isMissed) {
    message = 'Yesterday didn\'t go as planned. Today is still yours.';
    submessage = 'Reset and attack the day with full presence.';
  } else if (isComplete) {
    message = 'Another day in the books.';
    submessage = `Day ${dayNum} conquered. Protect the sleep window and recharge.`;
  } else if (score >= 70) {
    message = 'You showed up today.';
    submessage = 'Strong execution so far. Close the remaining loops.';
  } else if (dayNum > 30) {
    message = 'Don\'t break the chain.';
    submessage = 'Past Day 30, momentum is your unfair advantage.';
  }

  return (
    <div className={`arc-card p-5 border-l-4 transition-all ${isMissed ? 'border-l-amber-400 bg-amber-500/5' : 'border-l-sky-400 bg-[#12151A]'}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#181D24] border border-[#242932] flex items-center justify-center text-sky-400 shrink-0 mt-0.5">
            <Compass size={16} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#F5F7FA]">
              “{message}”
            </h4>
            <p className="text-xs text-[#8B929E] mt-0.5">
              {submessage}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          {isMissed && (
            <button
              onClick={() => resetToday(dayNum)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold transition-colors"
            >
              <RotateCcw size={13} />
              <span>Reset Today</span>
            </button>
          )}
          <button
            onClick={() => navigate('/today')}
            className="inline-flex items-center gap-1 text-xs font-medium text-sky-400 hover:text-sky-300 transition-colors"
          >
            <span>Today's Protocol</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
