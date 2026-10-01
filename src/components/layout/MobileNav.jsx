import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck,
  Compass,
  Layers,
  User,
  X,
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
  Settings,
  CalendarDays,
  SlidersHorizontal,
} from 'lucide-react';

export default function MobileNav() {
  const [trackOpen, setTrackOpen] = useState(false);

  const trackerItems = [
    { to: '/setup', label: 'Routine Setup', icon: SlidersHorizontal },
    { to: '/routine', label: 'My Routine', icon: CalendarDays },
    { to: '/today', label: 'Checklist', icon: CalendarCheck },
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
    `flex flex-col items-center justify-center flex-1 py-2 text-[10px] font-semibold transition-colors ${
      isActive ? 'text-[#2563EB]' : 'text-[#64748B] hover:text-[#0F172A]'
    }`;

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E2E8F0] px-2 flex items-center justify-around select-none shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
        <NavLink to="/" end className={navClass}>
          <LayoutDashboard size={18} className="mb-0.5" />
          <span>Home</span>
        </NavLink>

        <NavLink to="/setup" className={navClass}>
          <SlidersHorizontal size={18} className="mb-0.5" />
          <span>Setup</span>
        </NavLink>

        <NavLink to="/journey" className={navClass}>
          <Compass size={18} className="mb-0.5" />
          <span>Progress</span>
        </NavLink>

        <NavLink to="/settings" className={navClass}>
          <Settings size={18} className="mb-0.5" />
          <span>Settings</span>
        </NavLink>

        <button
          type="button"
          onClick={() => setTrackOpen(true)}
          className="flex flex-col items-center justify-center flex-1 py-2 text-[10px] font-semibold text-[#64748B] hover:text-[#0F172A]"
        >
          <Layers size={18} className="mb-0.5" />
          <span>More</span>
        </button>
      </nav>

      {/* Track Overlay Drawer */}
      {trackOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="fixed inset-0" onClick={() => setTrackOpen(false)} />
          <div className="relative bg-white border-t border-[#E2E8F0] rounded-t-3xl p-5 shadow-2xl z-10 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-4">
              <span className="text-sm font-bold text-[#0F172A]">Trackers & Insights</span>
              <button
                type="button"
                onClick={() => setTrackOpen(false)}
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {trackerItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setTrackOpen(false)}
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-blue-300 text-center transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center text-[#2563EB] mb-1.5 shadow-sm">
                      <Icon size={16} />
                    </div>
                    <span className="text-[11px] font-semibold text-[#0F172A]">
                      {item.label}
                    </span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
