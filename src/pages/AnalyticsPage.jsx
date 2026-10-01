import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { BarChart3, TrendingUp, Flame, Award, Clock, Dumbbell, Code, Scale } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export default function AnalyticsPage() {
  const { data, currentDayNumber, realStreak } = useApp();

  const stats = data.stats || {};
  const days = data.days || {};

  // Compute daily score history for days that actually have recorded data
  const realChartData = useMemo(() => {
    const list = [];
    for (let i = 1; i <= currentDayNumber; i++) {
      const d = days[i];
      if (d && d.score > 0) {
        list.push({
          day: `D${i}`,
          score: d.score,
        });
      }
    }
    return list;
  }, [days, currentDayNumber]);

  const hasData = realChartData.length > 0 || (stats.totalXp > 0) || (stats.totalWorkouts > 0) || (stats.totalStudyHours > 0);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="arc-card p-6 sm:p-8 bg-white border border-[#E2E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] block">
            VERIFIED TELEMETRY
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1">
            ANALYTICS & METRICS
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Zero fabricated curves. All statistics reflect exclusively your recorded actions.
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#EFF6FF] text-[#2563EB]">
          Day {currentDayNumber} of 100
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="arc-card p-5">
          <span className="text-xs font-semibold text-[#64748B] block">Current Streak</span>
          <div className="text-2xl font-extrabold text-[#0F172A] mt-1 flex items-center gap-1.5">
            <Flame size={20} className="fill-amber-500 text-amber-500" />
            <span>{realStreak} days</span>
          </div>
          <span className="text-[11px] text-[#64748B] block mt-1">Verified streak</span>
        </div>

        <div className="arc-card p-5">
          <span className="text-xs font-semibold text-[#64748B] block">Total XP</span>
          <div className="text-2xl font-extrabold text-[#2563EB] mt-1">
            {stats.totalXp || 0} XP
          </div>
          <span className="text-[11px] text-[#64748B] block mt-1">Real action awards</span>
        </div>

        <div className="arc-card p-5">
          <span className="text-xs font-semibold text-[#64748B] block">Total Workouts</span>
          <div className="text-2xl font-extrabold text-[#0F172A] mt-1">
            {stats.totalWorkouts || 0}
          </div>
          <span className="text-[11px] text-[#64748B] block mt-1">Sessions logged</span>
        </div>

        <div className="arc-card p-5">
          <span className="text-xs font-semibold text-[#64748B] block">Total Focus Hours</span>
          <div className="text-2xl font-extrabold text-[#0F172A] mt-1">
            {Math.round(((stats.totalStudyHours || 0) + (stats.totalCodingHours || 0)) * 10) / 10}h
          </div>
          <span className="text-[11px] text-[#64748B] block mt-1">Study + Coding</span>
        </div>
      </div>

      {/* Score Trend Chart or Empty State */}
      <div className="arc-card p-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#0F172A]">Daily Score Trend</h3>
            <p className="text-xs text-[#64748B]">Real daily scores (0-100) based strictly on logged activities</p>
          </div>
        </div>

        {realChartData.length === 0 ? (
          <EmptyState
            icon={BarChart3}
            title="Your analytics will appear here as you complete your first few days."
            description="No fake charts are generated. Complete habits, workouts, or tasks to see your verified curve."
          />
        ) : (
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={realChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="score" stroke="#2563EB" strokeWidth={2.5} dot={{ fill: '#2563EB', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
