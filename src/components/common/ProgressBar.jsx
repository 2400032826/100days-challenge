import React from 'react';

export default function ProgressBar({
  value = 0,
  max = 100,
  height = 'h-2',
  color = 'bg-[#2563EB]',
  bgColor = 'bg-[#E2E8F0]',
  showLabel = false,
  label = '',
  className = '',
}) {
  const percentage = max > 0 ? Math.min(100, Math.max(0, Math.round((value / max) * 100))) : 0;

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1 text-xs">
          <span className="text-[#64748B] font-medium">{label}</span>
          <span className="text-[#0F172A] font-bold">{percentage}%</span>
        </div>
      )}
      <div className={`w-full ${bgColor} rounded-full overflow-hidden ${height}`}>
        <div
          className={`${height} ${color} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
