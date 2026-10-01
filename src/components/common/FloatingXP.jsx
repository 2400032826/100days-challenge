import React from 'react';
import { useApp } from '../../context/AppContext';
import { Zap } from 'lucide-react';

export default function FloatingXP() {
  const { floatingXp } = useApp();

  if (!floatingXp || floatingXp.length === 0) return null;

  return (
    <div className="fixed bottom-20 right-6 md:bottom-10 md:right-10 z-50 pointer-events-none flex flex-col gap-2 items-end">
      {floatingXp.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#181D24]/95 border border-sky-400/40 text-sky-300 shadow-lg shadow-sky-500/20 text-xs font-bold animate-float-up backdrop-blur-md"
        >
          <Zap size={14} className="fill-sky-400 text-sky-400 animate-pulse" />
          <span>+{item.amount} XP</span>
          {item.label && <span className="text-[#8B929E] font-normal text-[11px]">· {item.label}</span>}
        </div>
      ))}
    </div>
  );
}
