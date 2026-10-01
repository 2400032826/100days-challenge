import React from 'react';
import { Plus } from 'lucide-react';

export default function EmptyState({
  icon: Icon,
  title = 'No data yet',
  description = 'Add your first entry to start tracking.',
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div className={`p-8 sm:p-12 text-center flex flex-col items-center justify-center bg-white border border-dashed border-[#E2E8F0] rounded-2xl ${className}`}>
      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-3">
          <Icon size={22} />
        </div>
      )}
      <h3 className="text-sm font-bold text-[#0F172A]">{title}</h3>
      <p className="text-xs text-[#64748B] max-w-sm mt-1 mb-4">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="arc-btn-primary text-xs py-2 px-3.5"
        >
          <Plus size={14} />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}
