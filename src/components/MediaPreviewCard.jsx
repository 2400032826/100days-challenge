import React from 'react';
import { Play, Clock, HardDrive, User, Film, Music, Volume2, VolumeX, AlertTriangle } from 'lucide-react';

export default function MediaPreviewCard({ media }) {
  if (!media) return null;

  const getSourceBadge = (src) => {
    switch (src) {
      case 'youtube':
        return { label: '▶ YouTube', color: 'bg-red-500/20 text-red-300 border-red-500/30' };
      case 'instagram':
        return { label: '◎ Instagram', color: 'bg-pink-500/20 text-pink-300 border-pink-500/30' };
      case 'direct':
        return { label: '▣ Direct Media', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' };
      default:
        return { label: '🌐 Web Media', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
    }
  };

  const badge = getSourceBadge(media.source);

  return (
    <div className="w-full max-w-3xl mx-auto mb-8 px-4 animate-in fade-in zoom-in-95 duration-300">
      <div className="glass-panel rounded-3xl p-4 sm:p-6 border border-white/15 backdrop-blur-2xl shadow-glass relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start relative z-10">
          {/* Thumbnail with overlay */}
          <div className="relative w-full sm:w-56 aspect-video sm:aspect-[4/3] rounded-2xl overflow-hidden shrink-0 group border border-white/10 shadow-lg">
            <img
              src={media.thumbnail}
              alt={media.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Play overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-glow-purple group-hover:scale-110 transition-transform">
                {media.mediaType === 'audio' ? (
                  <Music className="w-6 h-6 text-brand-cyan" />
                ) : (
                  <Play className="w-6 h-6 text-brand-cyan fill-brand-cyan ml-0.5" />
                )}
              </div>
            </div>

            {/* Duration badge */}
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-md text-[11px] font-mono text-white flex items-center gap-1 border border-white/10">
              <Clock className="w-3 h-3 text-slate-300" />
              <span>{media.duration}</span>
            </div>
          </div>

          {/* Media Info */}
          <div className="flex-1 min-w-0 text-left w-full">
            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider border ${badge.color}`}
              >
                {badge.label}
              </span>

              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/5 border border-white/10 text-slate-300">
                {media.mediaType === 'audio' ? (
                  <Music className="w-3 h-3 text-purple-400" />
                ) : (
                  <Film className="w-3 h-3 text-brand-cyan" />
                )}
                <span className="capitalize">{media.mediaType}</span>
              </span>
            </div>

            {/* Title */}
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 leading-snug line-clamp-2">
              {media.title}
            </h3>

            {/* Stream Availability Badges (🎬 Video ✓ | 🔊 Audio ✓ | ⚠ Audio unavailable) */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {media.hasVideo !== false && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
                  <span>🎬</span> Video ✓
                  <span className="text-[10px] text-cyan-400/80 font-normal font-mono">({media.videoCodec || 'H.264'})</span>
                </span>
              )}

              {media.hasAudio !== false ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                  <span>🔊</span> Audio ✓
                  <span className="text-[10px] text-emerald-400/80 font-normal font-mono">({media.audioCodec || 'AAC'})</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  ⚠ Audio unavailable
                </span>
              )}

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs">
                {media.resolution || '1080p'}
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-xs">
                {media.frameRate || '30 fps'}
              </span>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-4 pt-3 border-t border-white/10 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                <span>
                  <strong className="text-slate-400 font-normal">Original duration: </strong>
                  <span className="text-white font-mono font-medium">{media.originalDuration || media.duration}</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>
                  <strong className="text-slate-400 font-normal">Available download duration: </strong>
                  <span className="text-emerald-300 font-mono font-medium">{media.availableDuration || media.duration}</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">
                  <strong className="text-slate-400 font-normal">Creator: </strong>
                  {media.creator}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <HardDrive className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>
                  <strong className="text-slate-400 font-normal">Est. Size: </strong>
                  {media.fileSizeEstimate}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
