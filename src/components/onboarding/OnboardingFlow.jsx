import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Target, Clock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function OnboardingFlow() {
  const { startWinterArc } = useApp();
  const [screen, setScreen] = useState('welcome'); // 'welcome' | 'profile' | 'goals' | 'targets' | 'confirm'

  const [form, setForm] = useState({
    name: '',
    avatar: '',
    age: '',
    height: '',
    startingWeight: '',
    targetWeight: '',
    goals: [],
    dailyTargets: {
      workout: '45 mins',
      study: '2 hours',
      coding: '1.5 hours',
      sleep: '8 hours',
      water: '3 Liters',
      steps: '10,000 steps',
      reading: '20 pages',
    },
  });

  const availableGoals = [
    'Fitness',
    'Study',
    'Coding',
    'Career',
    'Discipline',
    'Sleep',
    'Nutrition',
    'Reading',
    'Finance',
    'Personal Growth',
  ];

  const toggleGoal = (goal) => {
    setForm(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal],
    }));
  };

  const handleFinish = () => {
    startWinterArc(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/40 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-xl bg-white border border-[#E2E8F0] rounded-2xl shadow-xl p-6 sm:p-8 relative">
        {/* Welcome Screen */}
        {screen === 'welcome' && (
          <div className="text-center py-6 space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#EFF6FF] border border-blue-200 text-[#2563EB] flex items-center justify-center mx-auto text-2xl font-bold">
              ❄️
            </div>

            <div>
              <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
                WINTER ARC
              </h1>
              <p className="text-sm font-semibold text-[#2563EB] mt-1">
                100 Days. One Version Better.
              </p>
              <p className="text-xs text-[#64748B] mt-2">
                October 1, 2026 → January 8, 2027
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto py-2">
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-xl font-bold text-[#0F172A] block">100 DAYS</span>
                <span className="text-[11px] text-[#64748B]">Duration</span>
              </div>
              <div className="p-3 rounded-xl bg-[#EFF6FF] border border-blue-200">
                <span className="text-xl font-bold text-[#2563EB] block">STARTING</span>
                <span className="text-[11px] text-[#2563EB] font-medium">TODAY</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setScreen('profile')}
                className="w-full max-w-xs mx-auto arc-btn-primary py-3 text-sm"
              >
                <span>Create My Profile</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 1: About You */}
        {screen === 'profile' && (
          <div className="space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">Step 1 of 3</span>
              <h2 className="text-xl font-bold text-[#0F172A] mt-0.5">About You</h2>
              <p className="text-xs text-[#64748B]">Enter your personal baseline measurements.</p>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full arc-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">Profile Photo URL (optional)</label>
                <input
                  type="text"
                  placeholder="https://..."
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
                    placeholder="23"
                    value={form.age}
                    onChange={e => setForm({ ...form, age: e.target.value })}
                    className="w-full arc-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">Height</label>
                  <input
                    type="text"
                    placeholder="180 cm"
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
                    placeholder="e.g. 80.0"
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
                    placeholder="e.g. 74.0"
                    value={form.targetWeight}
                    onChange={e => setForm({ ...form, targetWeight: e.target.value })}
                    className="w-full arc-input"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setScreen('goals')}
                disabled={!form.name.trim()}
                className="arc-btn-primary"
              >
                <span>Continue</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Goals */}
        {screen === 'goals' && (
          <div className="space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">Step 2 of 3</span>
              <h2 className="text-xl font-bold text-[#0F172A] mt-0.5">Your Winter Arc Goals</h2>
              <p className="text-xs text-[#64748B]">Select the pillars you want to transform.</p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
              {availableGoals.map((g) => {
                const selected = form.goals.includes(g);
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleGoal(g)}
                    className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                      selected
                        ? 'bg-[#EFF6FF] border-[#2563EB] text-[#2563EB]'
                        : 'bg-white border-[#E2E8F0] text-[#334155] hover:border-slate-300'
                    }`}
                  >
                    <span>{selected ? '✓ ' : '+ '}{g}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setScreen('profile')}
                className="arc-btn-secondary text-xs"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setScreen('targets')}
                className="arc-btn-primary text-xs"
              >
                <span>Next: Daily Targets</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Daily Targets & Challenge Confirmation */}
        {screen === 'targets' && (
          <div className="space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">Step 3 of 3</span>
              <h2 className="text-xl font-bold text-[#0F172A] mt-0.5">Daily Targets & Schedule</h2>
              <p className="text-xs text-[#64748B]">Configure your daily standards.</p>
            </div>

            <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1 text-xs">
              <div>
                <label className="block font-semibold text-[#334155] mb-1">Workout Target</label>
                <input
                  type="text"
                  value={form.dailyTargets.workout}
                  onChange={e => setForm({ ...form, dailyTargets: { ...form.dailyTargets, workout: e.target.value } })}
                  className="w-full arc-input"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#334155] mb-1">Study Target</label>
                <input
                  type="text"
                  value={form.dailyTargets.study}
                  onChange={e => setForm({ ...form, dailyTargets: { ...form.dailyTargets, study: e.target.value } })}
                  className="w-full arc-input"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#334155] mb-1">Coding Target</label>
                <input
                  type="text"
                  value={form.dailyTargets.coding}
                  onChange={e => setForm({ ...form, dailyTargets: { ...form.dailyTargets, coding: e.target.value } })}
                  className="w-full arc-input"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#334155] mb-1">Sleep Target</label>
                <input
                  type="text"
                  value={form.dailyTargets.sleep}
                  onChange={e => setForm({ ...form, dailyTargets: { ...form.dailyTargets, sleep: e.target.value } })}
                  className="w-full arc-input"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#334155] mb-1">Water Target</label>
                <input
                  type="text"
                  value={form.dailyTargets.water}
                  onChange={e => setForm({ ...form, dailyTargets: { ...form.dailyTargets, water: e.target.value } })}
                  className="w-full arc-input"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#334155] mb-1">Steps Target</label>
                <input
                  type="text"
                  value={form.dailyTargets.steps}
                  onChange={e => setForm({ ...form, dailyTargets: { ...form.dailyTargets, steps: e.target.value } })}
                  className="w-full arc-input"
                />
              </div>
            </div>

            {/* Official Challenge Start Confirmation */}
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5 text-xs">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-[#64748B]">Challenge Start:</span>
                <span className="text-[#2563EB] font-bold">DAY 1 · October 1, 2026</span>
              </div>
              <div className="flex items-center justify-between font-semibold">
                <span className="text-[#64748B]">Challenge End:</span>
                <span className="text-[#0F172A] font-bold">DAY 100 · January 8, 2027</span>
              </div>
              <div className="flex items-center justify-between text-[#64748B] pt-1 border-t border-[#E2E8F0]">
                <span>Total Duration:</span>
                <span>100 Full Days</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setScreen('goals')}
                className="arc-btn-secondary text-xs"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="arc-btn-primary text-xs"
              >
                <Sparkles size={14} />
                <span>Start My Winter Arc</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
