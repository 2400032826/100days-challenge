import React from 'react';
import Modal from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { Printer, Download, Sparkles, Trophy, Award, CheckCircle2, Flame } from 'lucide-react';

export default function FinalReportModal() {
  const { finalReportOpen, setFinalReportOpen, data, exportData } = useApp();

  const user = data.user || {};
  const stats = data.stats || {};

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={finalReportOpen}
      onClose={() => setFinalReportOpen(false)}
      title="100 DAYS COMPLETE"
      subtitle="Winter Arc Official Transformation Report & Blueprint"
      maxWidth="max-w-4xl"
    >
      <div className="space-y-8 print:space-y-4 print:text-black">
        {/* Actions Bar */}
        <div className="flex items-center justify-between no-print pb-3 border-b border-[#242932]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-xs text-[#8B929E]">Certified Winter Arc Dossier</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181D24] hover:bg-[#1E232B] text-[#F5F7FA] text-xs font-medium border border-[#242932] transition-colors"
            >
              <Printer size={14} />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={exportData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold shadow-md shadow-sky-500/20 transition-all"
            >
              <Download size={14} />
              <span>Export Raw JSON</span>
            </button>
          </div>
        </div>

        {/* Hero Header */}
        <div className="text-center p-8 rounded-2xl bg-gradient-to-b from-[#181D24] to-[#12151A] border border-sky-500/30">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-3">
            <Sparkles size={14} />
            <span>100 DAYS. ONE VERSION BETTER.</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#F5F7FA] tracking-tight">
            TRANSFORMATION DOSSIER
          </h1>
          <p className="text-sm text-[#8B929E] mt-2 max-w-lg mx-auto">
            Subject: <strong className="text-[#F5F7FA]">{user.name || 'Alex'}</strong> · Arc Completed · {user.location || 'UTC'}
          </p>
        </div>

        {/* Core Transformation Metrics Comparison Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="arc-card p-4">
            <span className="text-[11px] text-[#8B929E] uppercase font-semibold block">Body Weight</span>
            <div className="text-lg font-bold text-[#F5F7FA] mt-1">
              {user.startingWeight} kg → <span className="text-emerald-400">{user.targetWeight || 74.0} kg</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-medium">-{(user.startingWeight - (user.targetWeight || 74.0)).toFixed(1)} kg lost</span>
          </div>

          <div className="arc-card p-4">
            <span className="text-[11px] text-[#8B929E] uppercase font-semibold block">Daily Score</span>
            <div className="text-lg font-bold text-[#F5F7FA] mt-1">
              42 / 100 → <span className="text-sky-400">92 / 100</span>
            </div>
            <span className="text-[10px] text-sky-400 font-medium">+119% consistency</span>
          </div>

          <div className="arc-card p-4">
            <span className="text-[11px] text-[#8B929E] uppercase font-semibold block">Total Workouts</span>
            <div className="text-lg font-bold text-[#F5F7FA] mt-1">
              {stats.totalWorkouts || 32} Sessions
            </div>
            <span className="text-[10px] text-[#8B929E]">Strength, HIIT, Cardio</span>
          </div>

          <div className="arc-card p-4">
            <span className="text-[11px] text-[#8B929E] uppercase font-semibold block">Study Hours</span>
            <div className="text-lg font-bold text-[#F5F7FA] mt-1">
              {stats.totalStudyHours || 56.5} Hours
            </div>
            <span className="text-[10px] text-indigo-400">Computer Science / Core</span>
          </div>

          <div className="arc-card p-4">
            <span className="text-[11px] text-[#8B929E] uppercase font-semibold block">Coding Hours</span>
            <div className="text-lg font-bold text-[#F5F7FA] mt-1">
              {stats.totalCodingHours || 52.0} Hours
            </div>
            <span className="text-[10px] text-amber-400">{stats.dsaSolved?.total || 59} Problems Solved</span>
          </div>

          <div className="arc-card p-4">
            <span className="text-[11px] text-[#8B929E] uppercase font-semibold block">Habits Completed</span>
            <div className="text-lg font-bold text-[#F5F7FA] mt-1">
              842 Checks
            </div>
            <span className="text-[10px] text-emerald-400">89.4% completion rate</span>
          </div>

          <div className="arc-card p-4">
            <span className="text-[11px] text-[#8B929E] uppercase font-semibold block">Longest Streak</span>
            <div className="text-lg font-bold text-amber-400 mt-1 flex items-center gap-1">
              <Flame size={18} className="fill-amber-400" />
              <span>{stats.longestStreak || 17} Days</span>
            </div>
            <span className="text-[10px] text-[#8B929E]">Unbroken discipline</span>
          </div>

          <div className="arc-card p-4">
            <span className="text-[11px] text-[#8B929E] uppercase font-semibold block">Total XP & Tier</span>
            <div className="text-lg font-bold text-[#F5F7FA] mt-1">
              {(stats.totalXp || 4820).toLocaleString()} XP
            </div>
            <span className="text-[10px] text-sky-400">Level 12 (Consistency)</span>
          </div>
        </div>

        {/* DAY 1 vs DAY 100 TIMELINE */}
        <div className="arc-card p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#F5F7FA] mb-4">
            DAY 1 vs DAY 100: THE EVOLUTION
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#0F1217] border border-[#242932]">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#8B929E] uppercase">
                <span>❄️ Day 1: Starting State</span>
              </div>
              <ul className="space-y-2 text-xs text-[#8B929E]">
                <li>• Irregular sleep schedule, woke up tired between 8:30 AM – 9:30 AM</li>
                <li>• Distracted focus; averaged less than 35 mins deep work per day</li>
                <li>• Struggled with LeetCode Mediums; lacked structured DSA discipline</li>
                <li>• Skipping gym sessions on days feeling low energy or unmotivated</li>
                <li>• Mindless phone doomscrolling 3+ hours daily</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-sky-500/10 to-[#12151A] border border-sky-500/30">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-sky-400 uppercase">
                <span>⚡ Day 100: Transformed Reality</span>
              </div>
              <ul className="space-y-2 text-xs text-[#F5F7FA]">
                <li>• Waking up naturally at 6:00 AM sharp with clean hydration and energy</li>
                <li>• 4+ hours daily deep work blocks with zero phone notifications</li>
                <li>• Over 59 DSA problems solved including Hard graph & dynamic programming</li>
                <li>• Consistent gym hypertrophy; physical strength up 25% and body recomposition achieved</li>
                <li>• Clear mind, structured finances ($1,420 saved), and unbreakable self-respect</li>
              </ul>
            </div>
          </div>
        </div>

        {/* WHO I BECAME SECTION */}
        <div className="arc-card p-6 border-l-4 border-l-sky-400">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#F5F7FA] mb-2 flex items-center gap-2">
            <Award size={18} className="text-sky-400" />
            <span>WHO I BECAME</span>
          </h3>
          <p className="text-xs md:text-sm text-[#8B929E] leading-relaxed">
            Over these 100 days of the Winter Arc, I did not just complete checkmarks — I rebuilt my baseline. I proved to myself that moods are secondary to commitments. When cold mornings arrived and motivation subsided, discipline carried the standard. I became someone who solves hard problems calmly, respects their sleep and body, protects their attention, and finishes what they start. The Winter Arc is over; the new standard remains.
          </p>
        </div>

        {/* Signoff & Seal */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#242932] text-xs text-[#8B929E]">
          <div className="flex items-center gap-2 font-mono">
            <span>VERIFIED COMPLETION</span>
            <span>·</span>
            <span>DAY 100 OF 100</span>
          </div>
          <div className="font-serif italic text-[#F5F7FA]">
            “100 Days. One Version Better.”
          </div>
        </div>
      </div>
    </Modal>
  );
}
