import React from 'react';
import Modal from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { Award, TrendingUp, Flame, CheckCircle2, Dumbbell, BookOpen, Code } from 'lucide-react';
import ProgressRing from '../common/ProgressRing';

export default function MilestoneModal() {
  const { milestoneModalOpen, setMilestoneModalOpen, activeMilestoneDay, data } = useApp();

  const user = data.user || {};
  const stats = data.stats || {};
  const day = activeMilestoneDay || 30;

  const milestonesData = {
    30: {
      title: 'DAY 30 MILESTONE',
      subtitle: '“Phase 1 Completed. Discipline is becoming second nature.”',
      quote: 'You have endured the initial friction that breaks 90% of people. The foundation is poured.',
      weightLoss: (user.startingWeight - (data.days[30]?.weight || 79)).toFixed(1),
    },
    60: {
      title: 'DAY 60 MILESTONE',
      subtitle: '“60% of Winter Arc Completed. Momentum is irreversible.”',
      quote: 'The transformation is no longer an effort; it is your identity.',
      weightLoss: (user.startingWeight - (data.days[60]?.weight || 76)).toFixed(1),
    },
    90: {
      title: 'DAY 90 MILESTONE',
      subtitle: '“The Final Storm. Unbreakable focus.”',
      quote: '10 days remaining to finish what you started and cement a lifelong standard.',
      weightLoss: (user.startingWeight - (data.days[90]?.weight || 74.5)).toFixed(1),
    },
    100: {
      title: 'DAY 100 SURVIVOR',
      subtitle: '“100 Days Complete. One Version Better.”',
      quote: 'You set out into the cold and emerged a transformed human being.',
      weightLoss: (user.startingWeight - (user.targetWeight || 74)).toFixed(1),
    },
  };

  const currentInfo = milestonesData[day] || milestonesData[30];

  return (
    <Modal
      isOpen={milestoneModalOpen}
      onClose={() => setMilestoneModalOpen(false)}
      title={currentInfo.title}
      subtitle={currentInfo.subtitle}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Banner with ring */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#181D24] to-[#12151A] border border-sky-500/30 flex flex-col sm:flex-row items-center gap-6">
          <ProgressRing radius={52} stroke={7} progress={day} color="#38BDF8">
            <span className="text-xl font-extrabold text-[#F5F7FA]">{day}%</span>
            <span className="text-[9px] uppercase tracking-wider text-[#8B929E]">Day {day}</span>
          </ProgressRing>

          <div className="text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold mb-2">
              <Award size={13} />
              <span>Milestone Achieved</span>
            </div>
            <p className="text-sm font-medium text-[#F5F7FA] italic mb-1">
              "{currentInfo.quote}"
            </p>
            <p className="text-xs text-[#8B929E]">
              Tracked consistently across 100 days of personal transformation.
            </p>
          </div>
        </div>

        {/* Starting vs Current Comparison Table */}
        <div className="arc-card p-5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8B929E] mb-4">
            Transformation Metrics: Day 1 → Day {day}
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-[#181D24] border border-[#242932]">
              <span className="text-[11px] text-[#8B929E] block">Body Weight</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-lg font-bold text-[#F5F7FA]">{user.startingWeight}</span>
                <span className="text-xs text-emerald-400 font-medium">→ {user.currentWeight} kg</span>
              </div>
              <span className="text-[10px] text-emerald-400">-{currentInfo.weightLoss} kg down</span>
            </div>

            <div className="p-3 rounded-xl bg-[#181D24] border border-[#242932]">
              <span className="text-[11px] text-[#8B929E] block">Workouts Logged</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-lg font-bold text-[#F5F7FA]">{stats.totalWorkouts || 32}</span>
                <span className="text-xs text-[#8B929E]">sessions</span>
              </div>
              <span className="text-[10px] text-sky-400 font-medium">High consistency</span>
            </div>

            <div className="p-3 rounded-xl bg-[#181D24] border border-[#242932]">
              <span className="text-[11px] text-[#8B929E] block">Study Hours</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-lg font-bold text-[#F5F7FA]">{stats.totalStudyHours || 56}</span>
                <span className="text-xs text-[#8B929E]">hrs</span>
              </div>
              <span className="text-[10px] text-indigo-400 font-medium">Deep focus</span>
            </div>

            <div className="p-3 rounded-xl bg-[#181D24] border border-[#242932]">
              <span className="text-[11px] text-[#8B929E] block">Coding Practice</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-lg font-bold text-[#F5F7FA]">{stats.totalCodingHours || 52}</span>
                <span className="text-xs text-[#8B929E]">hrs</span>
              </div>
              <span className="text-[10px] text-amber-400 font-medium">{stats.dsaSolved?.total || 59} problems</span>
            </div>
          </div>
        </div>

        {/* Milestone Close Button */}
        <div className="flex justify-end">
          <button
            onClick={() => setMilestoneModalOpen(false)}
            className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold shadow-lg shadow-sky-500/20 transition-all"
          >
            Continue Journey →
          </button>
        </div>
      </div>
    </Modal>
  );
}
