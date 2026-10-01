import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Moon, Sun, Clock, Zap, BatteryCharging } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';

export default function SleepPage() {
  const { activeDayNumber, currentDayData, logSleep, isFutureDay } = useApp();

  const sleepData = currentDayData?.sleep;
  const isFuture = isFutureDay(activeDayNumber);

  const [form, setForm] = useState({
    sleepTime: sleepData?.sleepTime || '23:00',
    wakeTime: sleepData?.wakeTime || '07:00',
    quality: sleepData?.quality || 8,
    energy: sleepData?.energy || 8,
  });

  // Calculate duration automatically from sleepTime and wakeTime
  const calculatedDuration = React.useMemo(() => {
    if (!form.sleepTime || !form.wakeTime) return 8;
    const [sh, sm] = form.sleepTime.split(':').map(Number);
    const [wh, wm] = form.wakeTime.split(':').map(Number);
    let startMin = sh * 60 + sm;
    let endMin = wh * 60 + wm;
    if (endMin <= startMin) endMin += 24 * 60; // Crosses midnight
    return Math.round(((endMin - startMin) / 60) * 10) / 10;
  }, [form.sleepTime, form.wakeTime]);

  const handleSave = (e) => {
    e.preventDefault();
    logSleep(activeDayNumber, {
      ...form,
      durationHours: calculatedDuration,
    });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="arc-card p-6 sm:p-8 bg-white border border-[#E2E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] block">
            CIRCADIAN RECOVERY
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1">
            SLEEP TRACKER
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Log sleep and wake times. Duration is calculated automatically.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-[#EFF6FF] text-[#2563EB] text-xs font-bold">
          Target: 8.0 Hours
        </div>
      </div>

      {/* Sleep Status / Entry Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Day Sleep Status */}
        <div className="arc-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-4">
              <h3 className="text-sm font-bold text-[#0F172A]">Day {activeDayNumber} Sleep Record</h3>
              <span className="text-xs text-[#64748B]">
                {sleepData ? 'Recorded' : 'Not recorded'}
              </span>
            </div>

            {!sleepData ? (
              <EmptyState
                icon={Moon}
                title="No sleep data recorded yet"
                description="Enter your bedtime and wake time to automatically log your rest."
              />
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[#64748B] block">Calculated Duration</span>
                    <span className="text-3xl font-extrabold text-[#2563EB] block mt-1">
                      {sleepData.durationHours} hrs
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#64748B] block">Window</span>
                    <span className="text-xs font-bold text-[#0F172A] block mt-1">
                      {sleepData.sleepTime} → {sleepData.wakeTime}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-[#E2E8F0]">
                    <span className="text-[#64748B] block">Sleep Quality</span>
                    <span className="text-base font-bold text-[#0F172A] mt-1 block">
                      {sleepData.quality} / 10
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[#E2E8F0]">
                    <span className="text-[#64748B] block">Morning Energy</span>
                    <span className="text-base font-bold text-[#0F172A] mt-1 block">
                      {sleepData.energy} / 10
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Log Sleep Form */}
        <div className="arc-card p-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-4">
            <h3 className="text-sm font-bold text-[#0F172A]">Log Day {activeDayNumber} Sleep</h3>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">Bedtime</label>
                <input
                  type="time"
                  value={form.sleepTime}
                  disabled={isFuture}
                  onChange={e => setForm({ ...form, sleepTime: e.target.value })}
                  className="w-full arc-input"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">Wake Time</label>
                <input
                  type="time"
                  value={form.wakeTime}
                  disabled={isFuture}
                  onChange={e => setForm({ ...form, wakeTime: e.target.value })}
                  className="w-full arc-input"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#EFF6FF] border border-blue-200 text-xs text-[#2563EB] font-semibold flex justify-between items-center">
              <span>Automatic Sleep Duration:</span>
              <span className="font-mono text-sm">{calculatedDuration} hours</span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-[#334155] mb-1">
                <span>Sleep Quality</span>
                <span>{form.quality} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={form.quality}
                disabled={isFuture}
                onChange={e => setForm({ ...form, quality: Number(e.target.value) })}
                className="w-full accent-blue-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-[#334155] mb-1">
                <span>Morning Energy</span>
                <span>{form.energy} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={form.energy}
                disabled={isFuture}
                onChange={e => setForm({ ...form, energy: Number(e.target.value) })}
                className="w-full accent-amber-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isFuture}
                className="w-full arc-btn-primary"
              >
                Save Sleep Record
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
