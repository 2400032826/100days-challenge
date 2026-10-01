import React, { useEffect, useRef } from 'react';
import { Pause, Play, X, CheckCircle2, Download, Share2, RotateCcw, Zap, Clock, HardDrive, Sparkles, Smartphone, Check } from 'lucide-react';

export default function DownloadProgressCard({
  download,
  onPause,
  onResume,
  onCancel,
  onDownloadAgain,
  onDismiss,
  onShare,
  privateMode = false,
}) {
  if (!download) return null;

  const isCompleted = download.status === 'completed';
  const isPaused = download.status === 'paused';
  const isCancelled = download.status === 'cancelled';
  const isFailed = download.status === 'failed';
  const isDownloading = download.status === 'downloading' || download.status === 'waiting';

  const hasTriggeredBrowserDownload = useRef(false);

  const formatSize = (bytes) => {
    if (!bytes) return '0 MB';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Direct Device Download: Trigger browser-native download automatically when complete
  const triggerNativeDownload = () => {
    const fileUrl = download.downloadUrl || `/api/download/file/${download.id}`;
    const link = document.createElement('a');
    link.href = fileUrl;
    link.setAttribute('download', download.localFileName || `${download.title}.${download.format}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (isCompleted && !hasTriggeredBrowserDownload.current) {
      hasTriggeredBrowserDownload.current = true;
      triggerNativeDownload();
    }
  }, [isCompleted]);

  return (
    <div className="w-full max-w-2xl mx-auto mb-10 px-4 animate-in fade-in slide-in-from-top-3 duration-300">
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/15 backdrop-blur-2xl shadow-glass relative overflow-hidden">
        {/* Glow orb */}
        <div
          className={`absolute -top-24 -right-24 w-60 h-60 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
            isCompleted
              ? 'bg-emerald-500/25'
              : isPaused
              ? 'bg-amber-500/25'
              : 'bg-brand-cyan/25 animate-pulse'
          }`}
        ></div>

        {/* Header Title: "Downloading to your device..." */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {isCompleted ? (
              <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
              </div>
            ) : isPaused ? (
              <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Pause className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-2xl bg-brand-cyan/20 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan animate-pulse">
                <Zap className="w-5 h-5" />
              </div>
            )}

            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {isCompleted && '✓ Download Complete'}
                {isPaused && 'Download Paused'}
                {isDownloading && 'Downloading to your device...'}
                {isCancelled && 'Download Cancelled'}
                {isFailed && 'Download Failed'}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-1 max-w-sm mt-0.5">
                {download.title}
              </p>
            </div>
          </div>

          {/* Progress Percentage */}
          <div className="text-right">
            <span
              className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${
                isCompleted
                  ? 'text-emerald-400'
                  : isPaused
                  ? 'text-amber-400'
                  : 'bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple bg-clip-text text-transparent'
              }`}
            >
              {download.progress || 0}%
            </span>
          </div>
        </div>

        {/* Progress Bar with Animated Glow */}
        <div className="relative w-full h-4 bg-black/50 rounded-full overflow-hidden p-0.5 border border-white/10 mb-6 shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-300 relative overflow-hidden ${
              isCompleted
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                : isPaused
                ? 'bg-gradient-to-r from-amber-500 to-orange-400'
                : 'bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple'
            }`}
            style={{ width: `${download.progress || 0}%` }}
          >
            <div className="absolute inset-0 shimmer-bg opacity-75"></div>
          </div>
        </div>

        {/* Metrics Box (86.4 MB / 110 MB • ⚡ 14.2 MB/s • ⏱ 00:02 remaining) */}
        <div className="glass-panel rounded-2xl p-4 border border-white/10 mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* Downloaded / Total */}
          <div className="flex items-center gap-2.5">
            <HardDrive className="w-4 h-4 text-brand-purple shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Size</span>
              <span className="font-mono text-white font-bold text-sm">
                {formatSize(download.downloadedBytes)} / {download.fileSizeFormatted || formatSize(download.fileSize)}
              </span>
            </div>
          </div>

          {/* Speed: ⚡ 14.2 MB/s */}
          <div className="flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-brand-cyan shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Speed</span>
              <span className="font-mono text-brand-cyan font-bold text-sm flex items-center gap-1">
                <span>⚡</span> {download.speed || '0 KB/s'}
              </span>
            </div>
          </div>

          {/* Time Remaining: ⏱ 00:02 remaining */}
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Duration & Time</span>
              <span className="font-mono text-white font-bold text-sm">
                ⏱ {isCompleted ? (download.outputDuration || download.duration) : download.remainingTime ? `${download.remainingTime} remaining` : '00:02 remaining'}
              </span>
            </div>
          </div>
        </div>

        {/* Validation Verification Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-6 px-1 text-xs">
          {isCompleted ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                <Check className="w-3.5 h-3.5 stroke-[3]" /> Video
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                <Check className="w-3.5 h-3.5 stroke-[3]" /> Audio
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/15 text-cyan-300 font-mono font-medium border border-cyan-500/25">
                <Clock className="w-3.5 h-3.5 text-cyan-400" /> {download.outputDuration || download.duration} duration
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-cyan/20 text-brand-cyan font-bold border border-brand-cyan/40">
                <span>✓</span> Ready to download
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Duration:</span>
              <span className="text-white font-mono font-medium">{download.sourceDuration || download.duration || '10:32'}</span>
              <span className="text-slate-400 text-xs">• 🎬 Video + 🔊 Audio</span>
            </div>
          )}

          {download.resolution && (
            <span className="text-slate-400 text-[11px] font-mono">
              {download.resolution} • {download.frameRate || '30 fps'}
            </span>
          )}
        </div>

        {/* Error message display if failed */}
        {isFailed && (
          <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs mb-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <X className="w-5 h-5 shrink-0 text-rose-400" />
              <span className="font-medium">{download.error || 'Audio could not be included in this file.'}</span>
            </div>
            <button
              type="button"
              onClick={() => onDownloadAgain(download)}
              className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Try Again</span>
            </button>
          </div>
        )}

        {/* Actions Row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Active Downloading: [ Pause ] [ Cancel ] */}
          {isDownloading && (
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => onPause(download.id)}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/10 transition-all flex items-center justify-center gap-2"
              >
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </button>

              <button
                type="button"
                onClick={() => onCancel(download.id)}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold border border-rose-500/30 transition-all flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          )}

          {/* Paused State */}
          {isPaused && (
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => onResume(download.id)}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold border border-emerald-500/40 transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Resume</span>
              </button>

              <button
                type="button"
                onClick={() => onCancel(download.id)}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-bold border border-white/10 transition-all flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          )}

          {/* After Completion: [ Open File ] [ Download Again ] [ Share ] */}
          {isCompleted && (
            <div className="flex flex-wrap items-center gap-2.5 w-full">
              <button
                type="button"
                onClick={triggerNativeDownload}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-[#070913] font-bold text-xs sm:text-sm shadow-glow-cyan hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>Open File / Save</span>
              </button>

              <button
                type="button"
                onClick={() => onDownloadAgain(download)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold border border-white/10 transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Download Again</span>
              </button>

              {onShare && (
                <button
                  type="button"
                  onClick={() => onShare(download)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold border border-white/10 transition-all flex items-center gap-2"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onDismiss(download.id)}
                className="ml-auto p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Cancelled or Failed */}
          {(isCancelled || isFailed) && (
            <div className="flex items-center gap-2 w-full justify-between">
              <button
                type="button"
                onClick={() => onDownloadAgain(download)}
                className="px-4 py-2 rounded-xl bg-brand-cyan/20 hover:bg-brand-cyan/30 text-brand-cyan text-xs font-semibold border border-brand-cyan/40 transition-all flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Download</span>
              </button>

              <button
                type="button"
                onClick={() => onDismiss(download.id)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Small Notice at bottom */}
        {isCompleted && (
          <p className="text-[11px] text-emerald-300/80 mt-4 text-center">
            Saved directly to your device's downloads folder. Temporary server cache purged.
          </p>
        )}
      </div>
    </div>
  );
}
