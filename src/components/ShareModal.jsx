import React, { useState } from 'react';
import { X, Copy, Check, Share2, ExternalLink } from 'lucide-react';

export default function ShareModal({ item, onClose }) {
  if (!item) return null;
  const [copied, setCopied] = useState(false);

  const shareUrl = window.location.origin + `?source=${encodeURIComponent(item.url || '')}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: `Check out ${item.title} on GlassySave`,
          url: shareUrl,
        });
        onClose();
      } catch (err) {
        // User dismissed
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel rounded-3xl max-w-md w-full p-6 border border-white/15 relative shadow-glass animate-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-brand-cyan/20 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Share Permitted Media</h3>
            <p className="text-xs text-slate-400">Share download parameters or link</p>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 mb-4">
          <h4 className="text-xs font-bold text-white truncate mb-1">{item.title}</h4>
          <span className="text-[11px] text-slate-400 font-mono uppercase">
            {item.format} • {item.quality} • {item.fileSizeFormatted}
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3 py-2 rounded-xl bg-white/[0.04] text-xs text-slate-300 border border-white/10 select-all"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {navigator.share && (
            <button
              onClick={handleNativeShare}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-purple text-white font-bold text-xs shadow-glow-cyan flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Share via System Share Sheet</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
