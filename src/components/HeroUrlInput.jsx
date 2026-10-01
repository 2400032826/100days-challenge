import React, { useState, useEffect, useRef } from 'react';
import {
  Link2,
  Clipboard,
  X,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Youtube,
  Instagram,
  Film,
  Music,
  Globe,
  AlertCircle,
  ExternalLink,
  Lock,
  Shield,
  RotateCcw
} from 'lucide-react';
import { detectUrlPlatform } from '../utils/urlDetector';

export default function HeroUrlInput({
  url,
  setUrl,
  isAnalyzing,
  onAnalyzeImmediately,
  onUrlChange,
  analyzedMedia,
  error,
  setError,
  processError,
  setProcessError,
  privateMode,
  setPrivateMode,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [clipboardNotice, setClipboardNotice] = useState(null);
  const inputRef = useRef(null);

  // Local instant detection
  const detected = detectUrlPlatform(url);

  // Global Ctrl+V / Cmd+V listener on window when not focused on another input
  useEffect(() => {
    const handleGlobalKeyDown = async (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
        const activeEl = document.activeElement;
        if (activeEl !== inputRef.current && activeEl?.tagName !== 'INPUT' && activeEl?.tagName !== 'TEXTAREA') {
          try {
            if (navigator.clipboard && navigator.clipboard.readText) {
              const text = await navigator.clipboard.readText();
              if (text && (text.startsWith('http://') || text.startsWith('https://'))) {
                handleInstantInput(text.trim());
              }
            }
          } catch (err) {
            setClipboardNotice('Please paste your link using Ctrl + V');
            setTimeout(() => setClipboardNotice(null), 3000);
          }
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Handle instant input change with zero delay
  const handleInstantInput = (newUrl) => {
    setUrl(newUrl);
    setError(null);
    setProcessError(null);
    setClipboardNotice(null);

    const check = detectUrlPlatform(newUrl);
    if (check.isValid) {
      onAnalyzeImmediately(newUrl.trim());
    } else {
      onUrlChange(newUrl);
    }
  };

  // Direct onPaste event on input element
  const handleInputPaste = (e) => {
    const pastedText = e.clipboardData?.getData('text') || '';
    if (pastedText && (pastedText.startsWith('http://') || pastedText.startsWith('https://'))) {
      e.preventDefault();
      handleInstantInput(pastedText.trim());
    }
  };

  // Button: [ 📋 Paste Link ]
  const handlePasteButtonClick = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          handleInstantInput(text.trim());
          return;
        }
      }
      setClipboardNotice('Please paste your link using Ctrl + V');
      setTimeout(() => setClipboardNotice(null), 3500);
    } catch (err) {
      setClipboardNotice('Please paste your link using Ctrl + V');
      setTimeout(() => setClipboardNotice(null), 3500);
    }
  };

  // Drag & drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedText = e.dataTransfer.getData('text/plain') || e.dataTransfer.getData('text/uri-list');
    if (droppedText) {
      handleInstantInput(droppedText.trim());
    }
  };

  const handleClear = () => {
    setUrl('');
    setError(null);
    setProcessError(null);
    setClipboardNotice(null);
    onUrlChange('');
    if (inputRef.current) inputRef.current.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && url.trim()) {
      onAnalyzeImmediately(url.trim());
    }
  };

  const quickSamples = [
    {
      label: '▶ YouTube Sample',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
    {
      label: '◎ Instagram Reel',
      url: 'https://www.instagram.com/reel/C-nature-sample/',
    },
    {
      label: '▣ Direct 4K MP4',
      url: 'https://images.unsplash.com/direct-sample-media.mp4',
    },
    {
      label: '🎵 Direct Audio MP3',
      url: 'https://archive.org/details/beethoven-symphony-no-5-cc.mp3',
    },
  ];

  return (
    <div className="w-full text-center max-w-4xl mx-auto pt-4 sm:pt-8 md:pt-12 pb-4 px-4">
      {/* Top Tagline & Private Download Mode Switch */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-md shadow-sm">
          <span className="w-2 h-2 rounded-full bg-gradient-to-r from-brand-cyan to-brand-purple animate-ping"></span>
          <span className="text-xs font-semibold tracking-widest uppercase bg-gradient-to-r from-brand-cyan via-purple-300 to-brand-pink bg-clip-text text-transparent">
            DIRECT TO DEVICE
          </span>
        </div>

        <button
          type="button"
          onClick={() => setPrivateMode(!privateMode)}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-md transition-all duration-300 ${
            privateMode
              ? 'bg-brand-purple/25 border-brand-purple text-purple-200 shadow-glow-purple'
              : 'bg-white/[0.04] border-white/10 text-slate-400 hover:text-slate-200'
          }`}
          title="Toggle Private Download Mode"
        >
          <Lock className={`w-3.5 h-3.5 ${privateMode ? 'text-brand-pink' : 'text-slate-400'}`} />
          <span>Private Mode: {privateMode ? 'ON' : 'OFF'}</span>
          <span
            className={`w-2 h-2 rounded-full ${
              privateMode ? 'bg-brand-pink animate-pulse' : 'bg-slate-500'
            }`}
          />
        </button>
      </div>

      {/* Private Mode Banner */}
      {privateMode && (
        <div className="max-w-xl mx-auto mb-6 px-4 py-2 rounded-2xl bg-brand-purple/15 border border-brand-purple/30 text-purple-200 text-xs flex items-center justify-center gap-2 animate-in fade-in duration-200">
          <Shield className="w-4 h-4 text-brand-pink shrink-0" />
          <span>Private mode enabled: Zero history, zero server retention, direct device stream.</span>
        </div>
      )}

      {/* Main Heading */}
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-3 leading-tight">
        Download your media.{' '}
        <span className="bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple bg-clip-text text-transparent block sm:inline">
          Straight to your device.
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-slate-300 text-sm sm:text-lg max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
        Choose your format. Choose your quality. Save it locally.
      </p>

      {/* URL Input Card */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative group max-w-3xl mx-auto transition-transform duration-200 ${
          isDragging ? 'scale-[1.02]' : ''
        }`}
      >
        {/* Glow border */}
        <div
          className={`absolute -inset-0.5 bg-gradient-to-r from-brand-cyan via-brand-purple to-brand-pink rounded-3xl blur-md transition duration-500 ${
            isDragging
              ? 'opacity-100 ring-2 ring-brand-cyan'
              : 'opacity-40 group-hover:opacity-75 group-focus-within:opacity-100'
          }`}
        ></div>

        <div className="relative glass-panel rounded-3xl p-3 sm:p-4 border border-white/15 backdrop-blur-2xl shadow-glass text-left">
          {/* Main Input Row */}
          <div className="flex items-center gap-2 min-h-[46px]">
            <Link2 className="w-5 h-5 text-brand-cyan shrink-0 ml-1" />
            
            <input
              ref={inputRef}
              type="text"
              value={url}
              onChange={(e) => handleInstantInput(e.target.value)}
              onPaste={handleInputPaste}
              onKeyDown={handleKeyDown}
              disabled={false} // Never disabled so user can always edit freely
              placeholder="Paste your video or media link..."
              className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none min-w-0"
              autoComplete="off"
              spellCheck="false"
            />

            {url && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Fast [ 📋 Paste Link ] Button */}
            <button
              type="button"
              onClick={handlePasteButtonClick}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
              title="Paste from clipboard"
            >
              <Clipboard className="w-3.5 h-3.5 text-brand-cyan" />
              <span className="hidden xs:inline">Paste Link</span>
              <span className="xs:hidden">Paste</span>
            </button>

            {/* Analyze Action Button */}
            <button
              type="button"
              onClick={() => onAnalyzeImmediately(url.trim())}
              disabled={!url.trim() || isAnalyzing}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple text-white shadow-glow-cyan hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 flex items-center gap-1.5"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span className="hidden sm:inline">Analyzing...</span>
                </>
              ) : (
                <>
                  <span>Analyze</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          {/* Sub-status: Instant Local URL & Platform Detection */}
          {detected.isValid && (
            <div className="mt-2.5 pt-2.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Valid URL</span>
                </span>
                <span className="text-white/20">•</span>
                <span className="px-2.5 py-0.5 rounded-lg bg-white/10 border border-white/15 text-white font-semibold">
                  {detected.platformLabel}
                </span>
              </div>

              {/* Status Badge */}
              <div className="text-[11px] font-mono">
                {analyzedMedia ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    ✓ Media ready
                  </span>
                ) : isAnalyzing ? (
                  <span className="text-brand-cyan flex items-center gap-1.5 animate-pulse">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Analyzing media...
                  </span>
                ) : (
                  <span className="text-slate-400">Ready to analyze</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Analyzing Progress Shimmer Card */}
      {isAnalyzing && (
        <div className="max-w-3xl mx-auto mt-4 glass-panel rounded-2xl p-4 border border-brand-cyan/30 bg-brand-cyan/[0.03] shadow-glass animate-in fade-in slide-in-from-top-2 duration-200 text-left">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white">
              <span className="animate-spin text-brand-cyan">⏳</span>
              <span>Analyzing media...</span>
            </div>
            <span className="text-[11px] font-mono text-brand-cyan">Resolving public stream</span>
          </div>

          {/* Glowing Shimmer Bar */}
          <div className="relative w-full h-2 rounded-full overflow-hidden bg-black/40 border border-white/10">
            <div className="absolute inset-y-0 left-0 w-3/4 rounded-full bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple">
              <div className="absolute inset-0 shimmer-bg opacity-75"></div>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Fetching stream resolution, audio bitrate, and container formats...
          </p>
        </div>
      )}

      {/* Clipboard Permission Fallback Notice */}
      {clipboardNotice && (
        <div className="max-w-md mx-auto mt-3 p-2.5 rounded-xl bg-white/10 border border-white/20 text-xs text-slate-200 text-center animate-in fade-in duration-200">
          📋 {clipboardNotice}
        </div>
      )}

      {/* Standard Error Card when URL cannot be processed */}
      {processError && (
        <div className="max-w-2xl mx-auto mt-5 p-5 rounded-3xl bg-white/[0.05] border border-white/15 text-slate-100 backdrop-blur-2xl text-left animate-in fade-in slide-in-from-top-2 duration-200 shadow-glass">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                <AlertCircle className="w-4 h-4" />
              </div>
              <h4 className="text-sm sm:text-base font-bold text-white">
                {processError.title || 'Unable to process this URL'}
              </h4>
            </div>

            <button
              onClick={() => setProcessError(null)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-400 mb-2">Possible reasons:</p>
          <ul className="text-xs text-slate-300 space-y-1 mb-4 pl-4 list-disc marker:text-slate-500">
            {(processError.reasons || [
              'Unsupported source',
              'Media unavailable',
              'Source requires authentication',
              'Download method unavailable',
              'Network error'
            ]).map((reason, idx) => (
              <li key={idx}>{reason}</li>
            ))}
          </ul>

          {/* Action buttons: [ Open Original ] and [ Try Again ] */}
          <div className="flex items-center gap-2 pt-3 border-t border-white/10">
            {processError.originalUrl && (
              <a
                href={processError.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/15 flex items-center gap-1.5 transition-all"
              >
                <span>Open Original</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              type="button"
              onClick={() => onAnalyzeImmediately(url.trim())}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue text-white text-xs font-semibold shadow-glow-cyan flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      )}

      {/* General Error Banner */}
      {error && !processError && (
        <div className="max-w-2xl mx-auto mt-4 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 backdrop-blur-xl flex items-start gap-3 text-left animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs sm:text-sm text-rose-200/90 leading-relaxed">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="p-1 rounded-lg text-rose-400 hover:text-rose-200 hover:bg-rose-500/20"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Supported Indicators */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-slate-400">
        <span className="font-medium text-slate-400 mr-1 text-[11px] uppercase tracking-wider">
          Supported:
        </span>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/5">
          <Youtube className="w-3.5 h-3.5 text-red-400" />
          <span>YouTube</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/5">
          <Instagram className="w-3.5 h-3.5 text-pink-400" />
          <span>Instagram</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/5">
          <Film className="w-3.5 h-3.5 text-brand-cyan" />
          <span>Direct Video</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/5">
          <Music className="w-3.5 h-3.5 text-purple-400" />
          <span>Direct Audio</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/5">
          <Globe className="w-3.5 h-3.5 text-brand-cyan" />
          <span>Web Links</span>
        </div>
      </div>

      {/* Quick Test Samples */}
      <div className="mt-4 pt-3 flex flex-wrap items-center justify-center gap-2">
        <span className="text-[11px] text-slate-400">Quick Test:</span>
        {quickSamples.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleInstantInput(sample.url)}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
          >
            {sample.label}
          </button>
        ))}
      </div>
    </div>
  );
}
