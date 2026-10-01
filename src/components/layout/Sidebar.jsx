import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  CalendarCheck,
  Compass,
  CheckSquare,
  Dumbbell,
  BookOpen,
  Code,
  Moon,
  Utensils,
  DollarSign,
  PenLine,
  BarChart3,
  Award,
  User,
  Settings,
  Plus,
  CalendarDays,
} from 'lucide-react';

export default function Sidebar() {
  const { data, currentDayNumber, openQuickAdd } = useApp();
  const user = data.user || {};

  const mainNav = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/today', label: 'Today', icon: CalendarCheck },
    { to: '/routine', label: 'My Routine', icon: CalendarDays },
    { to: '/journey', label: '100-Day Journey', icon: Compass },
    { to: '/habits', label: 'Habits', icon: CheckSquare },
    { to: '/fitness', label: 'Fitness', icon: Dumbbell },
    { to: '/study', label: 'Study', icon: BookOpen },
    { to: '/coding', label: 'Coding', icon: Code },
    { to: '/sleep', label: 'Sleep', icon: Moon },
    { to: '/nutrition', label: 'Nutrition', icon: Utensils },
    { to: '/finance', label: 'Finance', icon: DollarSign },
    { to: '/journal', label: 'Journal', icon: PenLine },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/achievements', label: 'Achievements', icon: Award },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
      isActive
        ? 'bg-[#EFF6FF] text-[#2563EB]'
        : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
    }`;

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-white border-r border-[#E2E8F0] z-30 select-none">
      {/* Top Header: Brand + Avatar + Name + Day N / 100 */}
      <div className="p-5 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs">
            ❄
          </div>
          <span className="font-extrabold text-sm tracking-wide text-[#0F172A]">
            WINTER ARC
          </span>
        </div>

        {/* User Card */}
        <NavLink to="/profile" className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F8FAFC] transition-colors">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover border border-[#E2E8F0]"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#EFF6FF] text-[#2563EB] font-bold text-sm flex items-center justify-center border border-blue-200">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <span className="text-xs font-bold text-[#0F172A] block truncate">
              {user.name || 'Set Up Profile'}
            </span>
            <span className="text-[11px] font-semibold text-[#2563EB] block">
              DAY {currentDayNumber} / 100
            </span>
          </div>
        </NavLink>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {/* Quick Add CTA */}
        <button
          type="button"
          onClick={() => openQuickAdd('task')}
          className="w-full mb-3 arc-btn-primary py-2 text-xs"
        >
          <Plus size={15} />
          <span>+ Quick Entry</span>
        </button>

        {mainNav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={navClass}>
              <Icon size={16} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Bottom: Settings */}
      <div className="p-3 border-t border-[#E2E8F0]">
        <NavLink to="/settings" className={navClass}>
          <Settings size={16} />
          <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  );
}
