import React from 'react';

export default function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  badge,
  badgeType = 'accent',
  onClick,
  className = '',
}) {
  const badgeColors = {
    accent: 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    muted: 'bg-[#1E232B] text-[#8B929E] border border-[#242932]',
  };

  return (
    <div
      onClick={onClick}
      className={`arc-card p-4 md:p-5 flex flex-col justify-between arc-card-hover ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#8B929E]">
          {title}
        </span>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-[#181D24] border border-[#242932] flex items-center justify-center text-sky-400 shrink-0">
            <Icon size={16} />
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl md:text-3xl font-bold tracking-tight text-[#F5F7FA]">
            {value}
          </span>
          {badge && (
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${badgeColors[badgeType] || badgeColors.accent}`}>
              {badge}
            </span>
          )}
        </div>
        {subtext && (
          <p className="mt-1 text-xs text-[#8B929E] truncate">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
}
