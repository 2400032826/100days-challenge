import React, { useState } from 'react';
import { Layers, Pause, Play, X, Trash2, RotateCcw, Clock, Zap, HardDrive, CheckCircle2, AlertCircle, FileVideo, FileAudio } from 'lucide-react';

export default function DownloadQueue({
  downloads,
  onPause,
  onResume,
  onCancel,
  onDownloadAgain,
  onDelete,
  onBulkAction,
}) {
  const [filterTab, setFilterTab] = useState('all');

  const filterTabs = [
    { id: 'all', label: 'All Tasks', count: downloads.length },
    { id: 'downloading', label: 'Downloading', count: downloads.filter(d => d.status === 'downloading').length },
    { id: 'waiting', label: 'Waiting', count: downloads.filter(d => d.status === 'waiting').length },
    { id: 'completed', label: 'Completed', count: downloads.filter(d => d.status === 'completed').length },
    { id: 'failed', label: 'Failed / Cancelled', count: downloads.filter(d => d.status === 'failed' || d.status === 'cancelled').length },
  ];

  const filteredItems = downloads.filter((d) => {
    if (filterTab === 'all') return true;
    if (filterTab === 'downloading') return d.status === 'downloading';
    if (filterTab === 'waiting') return d.status === 'waiting' || d.status === 'paused';
    if (filterTab === 'completed') return d.status === 'completed';
    if (filterTab === 'failed') return d.status === 'failed' || d.status === 'cancelled';
    return true;
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-brand-cyan" />
            <span>Download Queue</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage concurrent downloads and queued media tasks.
          </p>
        </div>

        {/* Global Bulk Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onBulkAction('pause-all')}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition-all"
          >
            <Pause className="w-3.5 h-3.5" />
            <span>Pause All</span>
          </button>

          <button
            onClick={() => onBulkAction('resume-all')}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Resume All</span>
          </button>

          <button
            onClick={() => onBulkAction('cancel-all')}
            className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/30 flex items-center gap-1.5 transition-all"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancel All</span>
          </button>

          <button
            onClick={() => onBulkAction('clear-completed')}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Completed</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterTab(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
              filterTab === tab.id
                ? 'bg-gradient-to-r from-brand-cyan/20 to-brand-purple/20 border border-brand-cyan text-white shadow-glow-cyan'
                : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                filterTab === tab.id ? 'bg-brand-cyan text-[#070913]' : 'bg-white/10 text-slate-300'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Queue Items List */}
      {filteredItems.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center border border-white/10">
          <Layers className="w-12 h-12 text-slate-500 mx-auto mb-3 opacity-60" />
          <h4 className="text-base font-bold text-white mb-1">Queue is empty</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No downloads currently match this filter. Paste a permitted media link to start.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => {
            const isCompleted = item.status === 'completed';
            const isPaused = item.status === 'paused';
            const isDownloading = item.status === 'downloading';
            const isWaiting = item.status === 'waiting';
            const isFailedOrCancelled = item.status === 'failed' || item.status === 'cancelled';

            return (
              <div
                key={item.id}
                className="glass-panel rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row items-stretch sm:items-center gap-4 relative overflow-hidden"
              >
                {/* Media Icon / Thumb */}
                <div className="w-16 h-12 rounded-xl bg-black/40 overflow-hidden shrink-0 relative border border-white/10">
                  {item.thumbnail ? (
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                  ) : item.mediaType === 'audio' ? (
                    <div className="w-full h-full flex items-center justify-center text-purple-400">
                      <FileAudio className="w-6 h-6" />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-cyan">
                      <FileVideo className="w-6 h-6" />
                    </div>
                  )}
                </div>

                {/* Info & Progress */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h5 className="text-sm font-bold text-white truncate max-w-md">
                      {item.title}
                    </h5>
                    <span className="text-xs font-mono font-bold text-slate-300 shrink-0">
                      {item.progress || 0}%
                    </span>
                  </div>

                  {/* Micro Progress Bar */}
                  <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isCompleted
                          ? 'bg-emerald-400'
                          : isPaused
                          ? 'bg-amber-400'
                          : isFailedOrCancelled
                          ? 'bg-rose-500'
                          : 'bg-brand-cyan shimmer-bg'
                      }`}
                      style={{ width: `${item.progress || 0}%` }}
                    ></div>
                  </div>

                  {/* Micro details */}
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                    <span className="uppercase font-mono px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-slate-300">
                      {item.format} • {item.quality}
                    </span>
                    <span>{item.fileSizeFormatted}</span>
                    {isDownloading && (
                      <span className="text-brand-cyan font-mono flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {item.speed}
                      </span>
                    )}
                    <span
                      className={`font-semibold capitalize ${
                        isCompleted
                          ? 'text-emerald-400'
                          : isPaused
                          ? 'text-amber-400'
                          : isDownloading
                          ? 'text-brand-cyan'
                          : isWaiting
                          ? 'text-slate-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 shrink-0 justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                  {isDownloading && (
                    <button
                      onClick={() => onPause(item.id)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white"
                      title="Pause"
                    >
                      <Pause className="w-4 h-4" />
                    </button>
                  )}

                  {isPaused && (
                    <button
                      onClick={() => onResume(item.id)}
                      className="p-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300"
                      title="Resume"
                    >
                      <Play className="w-4 h-4 fill-current" />
                    </button>
                  )}

                  {(isDownloading || isWaiting || isPaused) && (
                    <button
                      onClick={() => onCancel(item.id)}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300"
                      title="Cancel"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}

                  {(isCompleted || isFailedOrCancelled) && (
                    <>
                      <button
                        onClick={() => onDownloadAgain(item)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white"
                        title="Download again"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
