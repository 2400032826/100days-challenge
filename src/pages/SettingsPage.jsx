import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  requestNotificationPermission,
  getNotificationPermissionStatus,
  isNotificationSupported,
} from '../utils/notifications';
import {
  Settings as SettingsIcon,
  Bell,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  ShieldAlert,
  User,
  Target,
  Calendar,
  Smartphone,
  CheckCircle2,
  Clock,
  Sparkles,
  Volume2,
} from 'lucide-react';
import ConfirmDialog from '../components/common/ConfirmDialog';

export default function SettingsPage() {
  const {
    data,
    updateUserProfile,
    updateSettings,
    updateNotificationSettings,
    updatePreferences,
    sendTestNotification,
    exportData,
    importData,
    resetWinterArc,
    showToast,
  } = useApp();

  const fileInputRef = useRef(null);

  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  const user = data.user || {};
  const notifSettings = data.notificationSettings || {
    enabled: false,
    times: {
      workout: '17:30',
      water: '10:00',
      meals: '13:00',
      study: '09:00',
      coding: '14:00',
      activity: '19:00',
      sleep: '22:30',
      journal: '21:30',
      habits: '12:00',
      weekly: '10:00',
    },
    reminders: {
      workout: false,
      water: false,
      meals: false,
      study: false,
      coding: false,
      activity: false,
      sleep: false,
      journal: false,
      habits: false,
      weekly: false,
    },
  };

  const preferences = data.preferences || {
    workoutTime: '17:30',
    studyTime: '09:00',
    codingTime: '14:00',
  };

  const [permStatus, setPermStatus] = useState(getNotificationPermissionStatus());

  // Listen for PWA beforeinstallprompt
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) {
      showToast('To install: tap Share and select "Add to Home Screen" on mobile, or click the install icon in your browser URL bar.', 'info');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      showToast('Winter Arc installed successfully!', 'success');
    }
    setDeferredPrompt(null);
  };

  const handleRequestPermission = async () => {
    const res = await requestNotificationPermission();
    setPermStatus(res.status);
    if (res.status === 'granted') {
      updateNotificationSettings({ enabled: true, permissionStatus: 'granted' });
      showToast('Notifications enabled!', 'success');
    } else if (res.status === 'denied') {
      showToast('Notification permission was blocked in browser settings.', 'warning');
    }
  };

  const handleToggleReminder = (key) => {
    if (permStatus !== 'granted') {
      handleRequestPermission();
      return;
    }

    const currentReminders = notifSettings.reminders || {};
    const willEnable = !currentReminders[key];

    updateNotificationSettings({
      reminders: {
        ...currentReminders,
        [key]: willEnable,
      },
    });
  };

  const handleTimeChange = (key, timeVal) => {
    const currentTimes = notifSettings.times || {};
    updateNotificationSettings({
      times: {
        ...currentTimes,
        [key]: timeVal,
      },
    });
  };

  // Profile targets state
  const [profileForm, setProfileForm] = useState({
    name: user.name || '',
    age: user.age || '',
    height: user.height || '',
    startingWeight: user.startingWeight || '',
    targetWeight: user.targetWeight || '',
  });

  const [targetsForm, setTargetsForm] = useState({
    workoutMinutes: user.dailyTargets?.workoutMinutes || 45,
    studyHours: user.dailyTargets?.studyHours || 2,
    codingHours: user.dailyTargets?.codingHours || 2,
    sleepHours: user.dailyTargets?.sleepHours || 8,
    waterLiters: user.dailyTargets?.waterLiters || 3.0,
    steps: user.dailyTargets?.steps || 10000,
    readingMinutes: user.dailyTargets?.readingMinutes || 30,
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUserProfile({
      name: profileForm.name.trim() || 'Arc Warrior',
      age: profileForm.age,
      height: profileForm.height,
      startingWeight: profileForm.startingWeight ? Number(profileForm.startingWeight) : null,
      targetWeight: profileForm.targetWeight ? Number(profileForm.targetWeight) : null,
    });
  };

  const handleSaveTargets = (e) => {
    e.preventDefault();
    updateUserProfile({
      dailyTargets: {
        workoutMinutes: Number(targetsForm.workoutMinutes) || 45,
        studyHours: Number(targetsForm.studyHours) || 2,
        codingHours: Number(targetsForm.codingHours) || 2,
        sleepHours: Number(targetsForm.sleepHours) || 8,
        waterLiters: Number(targetsForm.waterLiters) || 3.0,
        steps: Number(targetsForm.steps) || 10000,
        readingMinutes: Number(targetsForm.readingMinutes) || 30,
      },
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        importData(json);
      } catch (err) {
        showToast('Invalid backup file. Could not parse JSON.', 'danger');
      }
    };
    reader.readAsText(file);
  };

  const handleDeleteAll = () => {
    localStorage.clear();
    resetWinterArc();
    showToast('All stored records permanently deleted.', 'danger');
  };

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      {/* Header */}
      <div className="arc-card p-6 sm:p-8 bg-white border border-[#E2E8F0] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-bold">
            <SettingsIcon size={20} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A]">Settings & Preferences</h1>
            <p className="text-xs text-[#64748B] mt-0.5">
              Configure personal profile, PWA mobile install, smart contextual notifications, and data persistence.
            </p>
          </div>
        </div>
      </div>

      {/* 1. MOBILE INSTALLATION / PWA SECTION */}
      <div className="arc-card p-6 bg-white border border-[#E2E8F0] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <Smartphone size={18} className="text-[#2563EB]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#0F172A]">
              Mobile Experience & PWA
            </h2>
          </div>
          {isInstalled && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Installed as App ✓
            </span>
          )}
        </div>

        <p className="text-xs text-[#64748B]">
          Winter Arc is a full Progressive Web App. Install it on your phone or desktop for an app-like fullscreen experience with offline access and fast performance.
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
          <div>
            <span className="text-xs font-bold text-[#0F172A] block">
              {isInstalled ? 'Winter Arc is running as a Standalone App' : 'Install Winter Arc on This Device'}
            </span>
            <span className="text-[11px] text-[#64748B] block mt-0.5">
              Launch directly from your home screen or dock without browser bars.
            </span>
          </div>

          <button
            type="button"
            onClick={handleInstallPWA}
            className="arc-btn-primary text-xs py-2 px-4 shrink-0"
          >
            {isInstalled ? 'App Installed ✓' : 'Install Winter Arc'}
          </button>
        </div>
      </div>

      {/* 2. SMART CONTEXTUAL NOTIFICATIONS */}
      <div className="arc-card p-6 bg-white border border-[#E2E8F0] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-[#2563EB]" />
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#0F172A]">
                Smart Contextual Notifications
              </h2>
              <span className="text-[11px] text-[#64748B]">
                Permission Status: <strong className="capitalize">{permStatus}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {permStatus !== 'granted' ? (
              <button
                type="button"
                onClick={handleRequestPermission}
                className="arc-btn-primary text-xs py-1.5 px-3"
              >
                Enable Notifications
              </button>
            ) : (
              <button
                type="button"
                onClick={sendTestNotification}
                className="arc-btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
              >
                <Sparkles size={13} />
                <span>Send Test Reminder</span>
              </button>
            )}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900">
          <span className="font-bold block">Anti-Spam Safety Guarantee</span>
          Reminders are contextual based on your actual scheduled workout and study topics. You receive a maximum of 1 reminder per configured activity per day.
        </div>

        {/* Toggles List */}
        <div className="space-y-3 pt-1">
          {[
            { key: 'workout', label: 'Workout Reminder', desc: 'Contextual notification with today\'s split (e.g. "Today\'s workout: Chest + Triceps")' },
            { key: 'water', label: 'Water Hydration Reminder', desc: 'Hydration prompt to drink water and maintain your daily intake target' },
            { key: 'meals', label: 'Meals & Nutrition Reminder', desc: 'Timed reminder for breakfast, lunch, or dinner boundary' },
            { key: 'study', label: 'Study & Course Reminder', desc: 'Notifies your scheduled course and next incomplete topic' },
            { key: 'coding', label: 'Coding Practice Reminder', desc: 'Notifies your scheduled programming language block' },
            { key: 'activity', label: 'Daily Activity & Steps Reminder', desc: 'Reminder to hit your daily non-negotiable step count' },
            { key: 'sleep', label: 'Sleep Wind-Down Boundary', desc: '30-minute boundary alert before your target bedtime' },
            { key: 'journal', label: 'Evening Reflection & Win', desc: 'Gentle prompt to log your daily win and friction analysis' },
            { key: 'habits', label: 'Daily Habit Checkpoint', desc: 'Midday check-in to ensure you do not break the habit chain' },
            { key: 'weekly', label: 'Sunday Weekly Retrospective', desc: 'Sunday morning prompt to review the past week\'s execution' },
          ].map((item) => {
            const isChecked = notifSettings.reminders?.[item.key] === true;
            const timeVal = notifSettings.times?.[item.key] || '18:00';

            return (
              <div
                key={item.key}
                className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <span className="text-xs font-bold text-[#0F172A] block">{item.label}</span>
                  <span className="text-[11px] text-[#64748B] block mt-0.5">{item.desc}</span>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <input
                    type="time"
                    value={timeVal}
                    onChange={(e) => handleTimeChange(item.key, e.target.value)}
                    className="arc-input text-xs py-1 px-2 w-28 text-center"
                    disabled={!isChecked}
                  />

                  <button
                    type="button"
                    onClick={() => handleToggleReminder(item.key)}
                    className={`w-9 h-5 rounded-full transition-colors flex items-center px-0.5 ${
                      isChecked ? 'bg-[#2563EB] justify-end' : 'bg-[#CBD5E1] justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Challenge Timeline Information */}
      <div className="arc-card p-6 bg-white border border-[#E2E8F0] shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#E2E8F0]">
          <Calendar size={18} className="text-[#2563EB]" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#0F172A]">Challenge Timeline (Locked)</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="text-xs text-[#64748B] block font-medium">Start Date (Day 1)</span>
            <span className="text-base font-bold text-[#0F172A] mt-1 block">October 1, 2026</span>
          </div>
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="text-xs text-[#64748B] block font-medium">End Date (Day 100)</span>
            <span className="text-base font-bold text-[#0F172A] mt-1 block">January 8, 2027</span>
          </div>
          <div className="p-4 rounded-xl bg-[#EFF6FF] border border-blue-200">
            <span className="text-xs text-[#2563EB] block font-medium">Total Duration</span>
            <span className="text-base font-bold text-[#2563EB] mt-1 block">100 Consecutive Days</span>
          </div>
        </div>
      </div>

      {/* 4. Profile Information */}
      <div className="arc-card p-6 bg-white border border-[#E2E8F0] shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#E2E8F0]">
          <User size={18} className="text-[#2563EB]" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#0F172A]">Personal Profile</h2>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#0F172A] block mb-1">Your Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="arc-input w-full"
                placeholder="e.g. Venkat"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#0F172A] block mb-1">Age</label>
              <input
                type="number"
                value={profileForm.age}
                onChange={(e) => setProfileForm({ ...profileForm, age: e.target.value })}
                className="arc-input w-full"
                placeholder="e.g. 24"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#0F172A] block mb-1">Height</label>
              <input
                type="text"
                value={profileForm.height}
                onChange={(e) => setProfileForm({ ...profileForm, height: e.target.value })}
                className="arc-input w-full"
                placeholder="e.g. 5'10 or 178 cm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#0F172A] block mb-1">Starting Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={profileForm.startingWeight}
                onChange={(e) => setProfileForm({ ...profileForm, startingWeight: e.target.value })}
                className="arc-input w-full"
                placeholder="e.g. 78.5"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#0F172A] block mb-1">Target Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={profileForm.targetWeight}
                onChange={(e) => setProfileForm({ ...profileForm, targetWeight: e.target.value })}
                className="arc-input w-full"
                placeholder="e.g. 72.0"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" className="arc-btn-primary">
              Save Profile
            </button>
          </div>
        </form>
      </div>

      {/* 5. Daily Targets Configuration */}
      <div className="arc-card p-6 bg-white border border-[#E2E8F0] shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#E2E8F0]">
          <Target size={18} className="text-[#2563EB]" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#0F172A]">Daily Targets</h2>
        </div>

        <form onSubmit={handleSaveTargets} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#0F172A] block mb-1">Workout (Minutes / Day)</label>
              <input
                type="number"
                value={targetsForm.workoutMinutes}
                onChange={(e) => setTargetsForm({ ...targetsForm, workoutMinutes: e.target.value })}
                className="arc-input w-full"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#0F172A] block mb-1">Study (Hours / Day)</label>
              <input
                type="number"
                step="0.5"
                value={targetsForm.studyHours}
                onChange={(e) => setTargetsForm({ ...targetsForm, studyHours: e.target.value })}
                className="arc-input w-full"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#0F172A] block mb-1">Coding (Hours / Day)</label>
              <input
                type="number"
                step="0.5"
                value={targetsForm.codingHours}
                onChange={(e) => setTargetsForm({ ...targetsForm, codingHours: e.target.value })}
                className="arc-input w-full"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#0F172A] block mb-1">Sleep (Hours / Night)</label>
              <input
                type="number"
                step="0.5"
                value={targetsForm.sleepHours}
                onChange={(e) => setTargetsForm({ ...targetsForm, sleepHours: e.target.value })}
                className="arc-input w-full"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#0F172A] block mb-1">Water (Liters / Day)</label>
              <input
                type="number"
                step="0.5"
                value={targetsForm.waterLiters}
                onChange={(e) => setTargetsForm({ ...targetsForm, waterLiters: e.target.value })}
                className="arc-input w-full"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#0F172A] block mb-1">Daily Steps Target</label>
              <input
                type="number"
                step="500"
                value={targetsForm.steps}
                onChange={(e) => setTargetsForm({ ...targetsForm, steps: e.target.value })}
                className="arc-input w-full"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#0F172A] block mb-1">Reading (Minutes / Day)</label>
              <input
                type="number"
                value={targetsForm.readingMinutes}
                onChange={(e) => setTargetsForm({ ...targetsForm, readingMinutes: e.target.value })}
                className="arc-input w-full"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" className="arc-btn-primary">
              Save Daily Targets
            </button>
          </div>
        </form>
      </div>

      {/* 6. Data Backup, Import & Export */}
      <div className="arc-card p-6 bg-white border border-[#E2E8F0] shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#E2E8F0]">
          <Download size={18} className="text-[#16A34A]" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#0F172A]">Data Persistence & Backup</h2>
        </div>

        <p className="text-xs text-[#64748B]">
          All your Winter Arc data is stored securely in your browser's local storage. You can export a full JSON snapshot anytime or restore from a previous backup.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={exportData}
            className="arc-btn-primary flex items-center gap-2"
          >
            <Download size={16} />
            <span>Export My Data (JSON)</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="arc-btn-secondary flex items-center gap-2"
          >
            <Upload size={16} />
            <span>Import Backup (JSON)</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json"
            className="hidden"
          />
        </div>
      </div>

      {/* 7. Danger Zone */}
      <div className="arc-card p-6 bg-white border border-red-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-red-100 text-[#DC2626]">
          <ShieldAlert size={18} />
          <h2 className="text-sm font-bold uppercase tracking-wider">Danger Zone</h2>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#0F172A] block">Reset Winter Arc Challenge</span>
            <span className="text-xs text-[#64748B] block mt-0.5">
              Reset all challenge trackers, habits, logs, and day scores to clean zero state starting Day 1.
            </span>
          </div>
          <button
            onClick={() => setConfirmResetOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-semibold transition-colors shrink-0"
          >
            Reset Challenge (Day 1)
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-red-100">
          <div>
            <span className="text-xs font-bold text-[#DC2626] block">Permanently Wipe All Data</span>
            <span className="text-xs text-[#64748B] block mt-0.5">
              Delete all local storage records and restart the initial onboarding flow.
            </span>
          </div>
          <button
            onClick={() => setConfirmDeleteOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#DC2626] hover:bg-red-700 text-white text-xs font-semibold shadow-sm transition-all shrink-0"
          >
            Delete All Data
          </button>
        </div>
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={confirmResetOpen}
        onClose={() => setConfirmResetOpen(false)}
        onConfirm={resetWinterArc}
        title="Reset Winter Arc Challenge?"
        message="This will reset all your daily trackers, logs, and habit records. Your challenge will restart from Day 1 (October 1, 2026) with zero records."
        confirmText="Yes, Reset Challenge"
        danger={false}
      />

      <ConfirmDialog
        isOpen={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleDeleteAll}
        title="Permanently Delete All Data?"
        message="This will completely wipe your Winter Arc local browser storage and return to the onboarding setup. This action cannot be undone."
        confirmText="Permanently Delete Everything"
        danger={true}
      />
    </div>
  );
}
