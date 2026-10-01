import React from 'react';
import { Zap, Sparkles, Check, Film, Music, Shield } from 'lucide-react';

export default function FormatQualitySelector({
  media,
  selectedFormat,
  setSelectedFormat,
  selectedQuality,
  setSelectedQuality,
  onStartDownload,
  isQueueing = false,
  privateMode = false,
}) {
  if (!media) return null;

  const formats = [
    { id: 'mp4', name: 'MP4', label: 'MP4 Video', type: 'video', icon: Film },
    { id: 'mp3', name: 'MP3', label: 'MP3 Audio', type: 'audio', icon: Music },
    { id: 'm4a', name: 'M4A', label: 'M4A Audio', type: 'audio', icon: Music },
    { id: 'webm', name: 'WebM', label: 'WebM Video', type: 'video', icon: Film },
  ];

  const currentType = selectedFormat === 'mp3' || selectedFormat === 'm4a' ? 'audio' : 'video';
  const availableQualities = media.qualities[currentType] || [];
  const currentQualityObj = availableQualities.find((q) => q.id === selectedQuality) || availableQualities[0];

  const handleFormatChange = (fmtId) => {
    setSelectedFormat(fmtId);
    const newType = fmtId === 'mp3' || fmtId === 'm4a' ? 'audio' : 'video';
    const newQualities = media.qualities[newType] || [];
    if (newQualities.length > 0) {
      setSelectedQuality(newQualities[0].id);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-10 px-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-white/15 backdrop-blur-2xl shadow-glass relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-gradient-to-tr from-brand-cyan to-brand-purple flex items-center justify-center text-xs font-bold text-white shadow-glow-cyan">
              2
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Select Format & Quality
            </h3>
          </div>
          {privateMode && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-brand-pink/20 text-pink-300 border border-brand-pink/30 flex items-center gap-1 font-mono">
              <Shield className="w-3 h-3" />
              Private Stream
            </span>
          )}
        </div>

        {/* 1. Format: [ MP4 ] [ MP3 ] [ M4A ] [ WebM ] */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
            Format
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {formats.map((fmt) => {
              const isSelected = selectedFormat === fmt.id;
              const Icon = fmt.icon;
              return (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => handleFormatChange(fmt.id)}
                  className={`p-3 rounded-2xl border text-center transition-all duration-200 relative ${
                    isSelected
                      ? 'bg-gradient-to-br from-brand-cyan/25 to-brand-purple/25 border-brand-cyan shadow-glow-cyan text-white'
                      : 'bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.07] hover:border-white/20'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-brand-cyan flex items-center justify-center text-[#070913]">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                  <Icon className={`w-4 h-4 mx-auto mb-1 ${isSelected ? 'text-brand-cyan' : 'text-slate-400'}`} />
                  <span className="text-sm font-bold block">{fmt.name}</span>
                  <span className="text-[10px] text-slate-400 font-normal">{fmt.type}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Quality Options: [ 1080p ] [ 720p ] [ 480p ] [ 360p ] */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Quality ({currentType.toUpperCase()})
            </label>
            <span className="text-[11px] text-slate-400">Estimated file size included</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {availableQualities.map((q) => {
              const isSelected = selectedQuality === q.id;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setSelectedQuality(q.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between ${
                    isSelected
                      ? 'bg-white/15 border-brand-purple shadow-glow-purple text-white'
                      : 'bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.07] hover:border-white/20'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold truncate">{q.label}</span>
                      {q.id === 'best' && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-brand-pink/20 text-brand-pink border border-brand-pink/30">
                          PRO
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">{q.resolution}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-block px-2.5 py-1 rounded-xl bg-white/10 text-xs font-mono font-medium text-slate-200 border border-white/10">
                      ~{q.sizeFormatted}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. PRIMARY CTA: ⚡ DOWNLOAD TO DEVICE (Most prominent element) */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onStartDownload}
            disabled={isQueueing}
            className="w-full relative group overflow-hidden rounded-2xl p-5 sm:p-6 bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple text-white font-extrabold text-lg sm:text-xl shadow-glow-cyan hover:shadow-glow-purple active:scale-[0.99] transition-all duration-300 border border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Shimmer light sweep */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/40 shadow-inner">
                  <Zap className="w-7 h-7 text-white fill-white animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="tracking-wider">⚡ DOWNLOAD TO DEVICE</span>
                  </div>
                  <p className="text-xs text-white/85 font-normal">
                    Direct browser download • Zero permanent server storage
                  </p>
                </div>
              </div>

              {/* Selection Summary Pill */}
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 text-xs font-mono">
                <span className="uppercase text-brand-cyan font-bold">{selectedFormat}</span>
                <span className="text-white/40">•</span>
                <span>{currentQualityObj?.label}</span>
                <span className="text-white/40">•</span>
                <span className="text-emerald-300 font-bold">~{currentQualityObj?.sizeFormatted}</span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
