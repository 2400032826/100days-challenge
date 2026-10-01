import React from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../common/ProgressBar';
import {
  CheckSquare,
  Dumbbell,
  BookOpen,
  Code,
  Moon,
  Utensils,
  PenLine,
  ChevronRight,
} from 'lucide-react';

export default function TodayProgressGrid() {
  const { currentDayData, data, activeDayNumber } = useApp();
  const navigate = useNavigate();

  const totalHabits = data.habits?.length || 10;
  const habitsDone = currentDayData?.habitsCompleted?.length || 0;
  const habitsPercent = Math.round((habitsDone / totalHabits) * 100);

  const workoutsCount = currentDayData?.workouts?.length || 0;
  const studyMinutes = (currentDayData?.study || []).reduce((acc, s) => acc + (Number(s.durationMinutes) || 0), 0);
  const codingMinutes = (currentDayData?.coding || []).reduce((acc, c) => acc + (Number(c.durationMinutes) || 0), 0);
  const sleepHours = Number(currentDayData?.sleep?.durationHours) || 0;
  const proteinCurrent = Number(currentDayData?.nutrition?.protein) || 0;
  const proteinTarget = Number(currentDayData?.nutrition?.proteinTarget) || 130;
  const hasJournal = Boolean(currentDayData?.journal?.win || currentDayData?.journal?.gratitude);

  const modules = [
    {
      title: 'Habits',
      value: `${habitsDone}/${totalHabits}`,
      percent: habitsPercent,
      color: 'bg-emerald-400',
      icon: CheckSquare,
      subtext: `${totalHabits - habitsDone} remaining`,
      to: '/habits',
    },
    {
      title: 'Workout',
      value: workoutsCount > 0 ? `${workoutsCount} Logged` : '0 Done',
      percent: workoutsCount > 0 ? 100 : 0,
      color: 'bg-sky-400',
      icon: Dumbbell,
      subtext: workoutsCount > 0 ? currentDayData?.workouts?.[0]?.name : 'Strength & training',
      to: '/fitness',
    },
    {
      title: 'Study',
      value: `${Math.round(studyMinutes / 60 * 10) / 10}h`,
      percent: Math.min(100, Math.round((studyMinutes / 120) * 100)),
      color: 'bg-indigo-400',
      icon: BookOpen,
      subtext: 'Target: 2.0 hrs',
      to: '/study',
    },
    {
      title: 'Coding',
      value: `${Math.round(codingMinutes / 60 * 10) / 10}h`,
      percent: Math.min(100, Math.round((codingMinutes / 90) * 100)),
      color: 'bg-amber-400',
      icon: Code,
      subtext: 'DSA & Dev practice',
      to: '/coding',
    },
    {
      title: 'Sleep',
      value: `${sleepHours}h`,
      percent: Math.min(100, Math.round((sleepHours / 8) * 100)),
      color: 'bg-purple-400',
      icon: Moon,
      subtext: 'Goal: 8.0 hrs',
      to: '/sleep',
    },
    {
      title: 'Nutrition',
      value: `${proteinCurrent}g`,
      percent: Math.min(100, Math.round((proteinCurrent / proteinTarget) * 100)),
      color: 'bg-teal-400',
      icon: Utensils,
      subtext: `Target: ${proteinTarget}g protein`,
      to: '/nutrition',
    },
    {
      title: 'Journal',
      value: hasJournal ? 'Written' : 'Pending',
      percent: hasJournal ? 100 : 0,
      color: 'bg-rose-400',
      icon: PenLine,
      subtext: hasJournal ? 'Win logged' : 'Evening reflection',
      to: '/journal',
    },
  ];

  return (
    <div className="arc-card p-5 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F7FA]">
            Today's Pillar Progress
          </h3>
          <span className="text-[10px] text-[#8B929E]">Day {activeDayNumber} tracking breakdown</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {modules.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.title}
              onClick={() => navigate(m.to)}
              className="p-3.5 rounded-xl bg-[#181D24] border border-[#242932] hover:border-sky-500/40 cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-[#8B929E] group-hover:text-[#F5F7FA] transition-colors">
                  {m.title}
                </span>
                <Icon size={14} className="text-[#8B929E] group-hover:text-sky-400 transition-colors" />
              </div>

              <div className="mb-2">
                <span className="text-base font-bold text-[#F5F7FA] block">
                  {m.value}
                </span>
                <span className="text-[10px] text-[#8B929E] truncate block mt-0.5">
                  {m.subtext}
                </span>
              </div>

              <ProgressBar value={m.percent} max={100} height="h-1.5" color={m.color} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
