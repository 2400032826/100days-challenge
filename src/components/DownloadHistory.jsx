import React, { useState } from 'react';
import { History, Search, Filter, RotateCcw, Trash2, Share2, Download, Film, Music, CheckCircle2, AlertCircle, Calendar, HardDrive } from 'lucide-react';

export default function DownloadHistory({
  downloads,
  onDownloadAgain,
  onDelete,
  onShare,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filterOptions = [
    { id: 'all', label: 'All Items' },
    { id: 'video', label: 'Videos' },
    { id: 'audio', label: 'Audio' },
    { id: 'completed', label: 'Completed' },
    { id: 'failed', label: 'Failed' },
  ];

  const filteredHistory = downloads.filter((item) => {
    // Filter matching
    if (filterType === 'video' && item.mediaType !== 'video') return false;
    if (filterType === 'audio' && item.mediaType !== 'audio') return false;
    if (filterType === 'completed' && item.status !== 'completed') return false;
    if (filterType === 'failed' && item.status !== 'failed' && item.status !== 'cancelled') return false;

    // Search query matching
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchCreator = item.creator?.toLowerCase().includes(q);
      const matchFormat = item.format?.toLowerCase().includes(q);
      if (!matchTitle && !matchCreator && !matchFormat) return false;
    }

    return true;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSaveToDevice = (item) => {
    const fileUrl = `/api/download/file/${item.id}`;
    const link = document.createElement('a');
    link.href = fileUrl;
    link.setAttribute('download', item.localFileName || `${item.title}.${item.format}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <History className="w-7 h-7 text-brand-purple" />
            <span>Download History</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Archived logs of your permitted media downloads.
          </p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="glass-panel rounded-2xl p-3 border border-white/10 mb-6 flex flex-col sm:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, creator, or format..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.04] text-xs sm:text-sm text-white placeholder-slate-400 border border-white/10 focus:border-brand-purple focus:outline-none"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setFilterType(opt.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterType === opt.id
                  ? 'bg-brand-purple/20 border border-brand-purple text-purple-200 shadow-glow-purple'
                  : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* History Grid / List */}
      {filteredHistory.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center border border-white/10">
          <History className="w-12 h-12 text-slate-500 mx-auto mb-3 opacity-60" />
          <h4 className="text-base font-bold text-white mb-1">No downloads found</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery
              ? 'Try modifying your search keywords or active filters.'
              : 'Your downloaded media history will appear here once downloads finish.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHistory.map((item) => {
            const isCompleted = item.status === 'completed';
            const isFailed = item.status === 'failed' || item.status === 'cancelled';

            return (
              <div
                key={item.id}
                className="glass-panel glass-panel-hover rounded-2xl p-4 border border-white/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-3 mb-3">
                    {/* Thumbnail */}
                    <div className="w-20 h-14 rounded-xl bg-black/40 overflow-hidden shrink-0 relative border border-white/10">
                      {item.thumbnail ? (
                        <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          {item.mediaType === 'audio' ? <Music className="w-5 h-5" /> : <Film className="w-5 h-5" />}
                        </div>
                      )}
                      <div className="absolute bottom-1 right-1 px-1 rounded bg-black/70 text-[9px] font-mono text-white">
                        {item.duration || '--:--'}
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white line-clamp-1 mb-1" title={item.title}>
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-400 truncate mb-1">
                        {item.creator || 'Open Media'}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {formatDate(item.completedAt || item.createdAt)}
                        </span>
                        <span>•</span>
                        <span className="uppercase font-mono text-brand-cyan">
                          {item.format} ({item.quality})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Size & Status */}
                  <div className="flex items-center justify-between text-xs py-2 border-t border-white/5 mb-3">
                    <span className="text-slate-400 flex items-center gap-1">
                      <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.fileSizeFormatted}</span>
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                        isCompleted
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                          : isFailed
                          ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                          : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      <span className="capitalize">{item.status}</span>
                    </span>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
                  {isCompleted && (
                    <button
                      onClick={() => handleSaveToDevice(item)}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition-all"
                    >
                      <Download className="w-3.5 h-3.5 text-brand-cyan" />
                      <span>Save</span>
                    </button>
                  )}

                  <button
                    onClick={() => onDownloadAgain(item)}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Redownload</span>
                  </button>

                  <div className="flex items-center gap-1 ml-auto">
                    {onShare && (
                      <button
                        onClick={() => onShare(item)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
                        title="Share link"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
