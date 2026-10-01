import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';

// 15 Route Pages
import DashboardPage from './pages/DashboardPage';
import TodayPage from './pages/TodayPage';
import JourneyPage from './pages/JourneyPage';
import HabitsPage from './pages/HabitsPage';
import FitnessPage from './pages/FitnessPage';
import StudyPage from './pages/StudyPage';
import CodingPage from './pages/CodingPage';
import SleepPage from './pages/SleepPage';
import NutritionPage from './pages/NutritionPage';
import FinancePage from './pages/FinancePage';
import JournalPage from './pages/JournalPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AchievementsPage from './pages/AchievementsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import RoutinePage from './pages/RoutinePage';
import SetupPage from './pages/SetupPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="setup" element={<SetupPage />} />
            <Route path="today" element={<TodayPage />} />
            <Route path="routine" element={<RoutinePage />} />
            <Route path="journey" element={<JourneyPage />} />
            <Route path="habits" element={<HabitsPage />} />
            <Route path="fitness" element={<FitnessPage />} />
            <Route path="study" element={<StudyPage />} />
            <Route path="coding" element={<CodingPage />} />
            <Route path="sleep" element={<SleepPage />} />
            <Route path="nutrition" element={<NutritionPage />} />
            <Route path="finance" element={<FinancePage />} />
            <Route path="journal" element={<JournalPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="achievements" element={<AchievementsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
