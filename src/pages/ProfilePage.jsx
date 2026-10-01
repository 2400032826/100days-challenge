import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Edit3, Flame, Award, Zap, Calendar, Scale, Dumbbell, BookOpen, Code, Wallet } from 'lucide-react';
import Modal from '../components/common/Modal';

export default function ProfilePage() {
  const { data, currentDayNumber, levelInfo, realStreak, startWinterArc } = useApp();
  const [editModalOpen, setEditModalOpen] = useState(false);

  const user = data.user || {};
  const stats = data.stats || {};

  const [form, setForm] = useState({
    name: user.name || '',
    avatar: user.avatar || '',
    age: user.age || '',
    height: user.height || '',
    startingWeight: user.startingWeight || '',
    targetWeight: user.targetWeight || '',
    goals: user.goals || [],
  });

  const weightLost = user.startingWeight !== null && user.currentWeight !== null
    ? (user.startingWeight - user.currentWeight).toFixed(1)
    : '0.0';

  const handleSave = (e) => {
    e.preventDefault();
    startWinterArc(form);
    setEditModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Profile Header */}
      <div className="arc-card p-6 sm:p-8 bg-white border border-[#E2E8F0]">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-200"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-[#EFF6FF] text-[#2563EB] font-bold text-2xl flex items-center justify-center border border-blue-200">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}

            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-extrabold text-[#0F172A]">{user.name || 'Arc Warrior'}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-bold">
                  DAY {currentDayNumber} / 100
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-1">
                {user.age ? `${user.age} yrs` : ''} {user.height ? `· ${user.height}` : ''}
              </p>
              <p className="text-xs font-bold text-[#2563EB] mt-1">
                LEVEL {levelInfo.level} — {levelInfo.title.toUpperCase()} · {data.stats?.totalXp || 0} XP
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setForm({
                name: user.name || '',
                avatar: user.avatar || '',
                age: user.age || '',
                height: user.height || '',
                startingWeight: user.startingWeight || '',
                targetWeight: user.targetWeight || '',
                goals: user.goals || [],
              });
              setEditModalOpen(true);
            }}
            className="arc-btn-secondary text-xs"
          >
            <Edit3 size={14} />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* 4 Core Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
          <span className="text-xs font-semibold text-[#64748B] block">Starting Weight</span>
          <div className="text-2xl font-extrabold text-[#0F172A] mt-1">
            {user.startingWeight !== null ? `${user.startingWeight} kg` : 'Not recorded'}
          </div>
          <span className="text-[11px] text-[#64748B] block mt-1">Baseline</span>
        </div>

        <div className="arc-card p-5">
          <span className="text-xs font-semibold text-[#64748B] block">Current Weight</span>
          <div className="text-2xl font-extrabold text-[#0F172A] mt-1">
            {user.currentWeight !== null ? `${user.currentWeight} kg` : 'Not recorded'}
          </div>
          <span className="text-[11px] text-[#64748B] block mt-1">
            {user.targetWeight ? `Target: ${user.targetWeight} kg` : 'Target unassigned'}
          </span>
        </div>
      </div>

      {/* Attributes Table */}
      <div className="arc-card p-6">
        <h3 className="text-sm font-bold text-[#0F172A] pb-3 border-b border-[#E2E8F0] mb-4">
          Challenge Specifications & Baseline
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
          <div>
            <span className="text-[#64748B] block">Start Date:</span>
            <span className="font-bold text-[#0F172A] text-sm block mt-0.5">October 1, 2026</span>
          </div>
          <div>
            <span className="text-[#64748B] block">End Date:</span>
            <span className="font-bold text-[#0F172A] text-sm block mt-0.5">January 8, 2027</span>
          </div>
          <div>
            <span className="text-[#64748B] block">Weight Lost / Gained:</span>
            <span className="font-bold text-[#0F172A] text-sm block mt-0.5">{weightLost} kg</span>
          </div>
          <div>
            <span className="text-[#64748B] block">Total Workouts:</span>
            <span className="font-bold text-[#0F172A] text-sm block mt-0.5">{stats.totalWorkouts || 0} sessions</span>
          </div>
          <div>
            <span className="text-[#64748B] block">Total Study Hours:</span>
            <span className="font-bold text-[#0F172A] text-sm block mt-0.5">{stats.totalStudyHours || 0} hrs</span>
          </div>
          <div>
            <span className="text-[#64748B] block">Total Coding Hours:</span>
            <span className="font-bold text-[#0F172A] text-sm block mt-0.5">{stats.totalCodingHours || 0} hrs</span>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Profile" subtitle="Personal baseline">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1">Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full arc-input"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1">Avatar URL</label>
            <input
              type="text"
              value={form.avatar}
              onChange={e => setForm({ ...form, avatar: e.target.value })}
              className="w-full arc-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">Age</label>
              <input
                type="number"
                value={form.age}
                onChange={e => setForm({ ...form, age: e.target.value })}
                className="w-full arc-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">Height</label>
              <input
                type="text"
                value={form.height}
                onChange={e => setForm({ ...form, height: e.target.value })}
                className="w-full arc-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">Starting Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={form.startingWeight}
                onChange={e => setForm({ ...form, startingWeight: e.target.value })}
                className="w-full arc-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">Target Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={form.targetWeight}
                onChange={e => setForm({ ...form, targetWeight: e.target.value })}
                className="w-full arc-input"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="arc-btn-secondary text-xs"
            >
              Cancel
            </button>
            <button type="submit" className="arc-btn-primary text-xs">
              Save Profile
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
