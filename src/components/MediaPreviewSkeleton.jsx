import React from 'react';

export default function MediaPreviewSkeleton() {
  return (
    <div className="w-full max-w-3xl mx-auto mb-8 px-4 animate-in fade-in duration-300">
      {/* Skeleton Media Card */}
      <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-white/15 backdrop-blur-2xl shadow-glass relative overflow-hidden mb-6">
        <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
          {/* Skeleton Thumbnail */}
          <div className="w-full sm:w-56 aspect-video sm:aspect-[4/3] rounded-2xl bg-white/5 border border-white/10 shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 shimmer-bg opacity-40"></div>
          </div>

          {/* Skeleton Meta Lines */}
          <div className="flex-1 w-full space-y-3">
            {/* Badges */}
            <div className="flex items-center gap-2">
              <div className="w-20 h-5 rounded-full bg-white/10 shimmer-bg"></div>
              <div className="w-16 h-5 rounded-full bg-white/5 shimmer-bg"></div>
            </div>

            {/* Title Line 1 & Line 2 */}
            <div className="w-4/5 h-6 rounded-xl bg-white/10 shimmer-bg"></div>
            <div className="w-3/5 h-4 rounded-lg bg-white/5 shimmer-bg"></div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
              <div className="w-24 h-4 rounded bg-white/5 shimmer-bg"></div>
              <div className="w-20 h-4 rounded bg-white/5 shimmer-bg"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Skeleton Format & Quality Controls */}
      <div className="glass-panel rounded-3xl p-6 border border-white/15 backdrop-blur-2xl shadow-glass space-y-5">
        <div className="flex items-center justify-between">
          <div className="w-36 h-5 rounded-lg bg-white/10 shimmer-bg"></div>
          <div className="w-16 h-4 rounded bg-white/5 shimmer-bg"></div>
        </div>

        {/* Format tabs skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 rounded-2xl bg-white/5 border border-white/10 shimmer-bg"></div>
          ))}
        </div>

        {/* Quality options skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 rounded-2xl bg-white/5 border border-white/10 shimmer-bg"></div>
          ))}
        </div>

        {/* CTA Button skeleton */}
        <div className="w-full h-16 rounded-2xl bg-white/10 border border-white/15 shimmer-bg"></div>
      </div>
    </div>
  );
}
