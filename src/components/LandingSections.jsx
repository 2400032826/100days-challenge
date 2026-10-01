import React, { useState } from 'react';
import { Sparkles, Zap, ShieldCheck, Smartphone, CheckCircle, ChevronDown, Download, Film, Music, Cpu, Lock, HelpCircle, HardDrive } from 'lucide-react';

export default function LandingSections({ onScrollToTop }) {
  const [openFaq, setOpenFaq] = useState(null);

  const steps = [
    {
      step: '01',
      title: 'Paste link or Drag & Drop',
      desc: 'Insert any permitted media URL from direct audio/video hosts, Creative Commons, or authorized public feeds.',
      gradient: 'from-brand-cyan to-blue-500',
    },
    {
      step: '02',
      title: 'Select format & quality',
      desc: 'Choose MP4, MP3, M4A, or WebM across resolution presets (1080p, 720p, 480p, 360p, 320 kbps).',
      gradient: 'from-brand-blue to-brand-purple',
    },
    {
      step: '03',
      title: 'Direct device download',
      desc: 'High-speed browser stream saves directly to your device storage (Android, iPhone, Windows, Mac, Linux).',
      gradient: 'from-brand-purple to-brand-pink',
    },
  ];

  const features = [
    {
      icon: Zap,
      title: 'Fast Direct Streaming',
      desc: 'High-throughput buffered download engine with real-time speed monitoring up to 15+ MB/s and instant browser attachment save.',
      color: 'text-brand-cyan',
    },
    {
      icon: HardDrive,
      title: 'Zero Permanent Server Storage',
      desc: 'We never store media files permanently on our servers. Processing buffers are temporary and purged automatically.',
      color: 'text-brand-blue',
    },
    {
      icon: ShieldCheck,
      title: 'Strict Ethical Compliance',
      desc: 'Engineered specifically for permitted and owned content. Never violates DRM, platform security, or copyright.',
      color: 'text-emerald-400',
    },
    {
      icon: Smartphone,
      title: 'PWA Mobile & Desktop',
      desc: 'Install directly to your iOS or Android home screen for an offline-ready, distraction-free native app feel.',
      color: 'text-purple-400',
    },
  ];

  const faqs = [
    {
      q: 'Where do downloaded files get saved?',
      a: 'Files are saved directly to your local device\'s default Downloads folder (on Windows, Mac, Linux, Android, and iOS browsers). GlassySave never keeps files permanently on the server.',
    },
    {
      q: 'Does GlassySave keep a copy of my videos on the server?',
      a: 'No. GlassySave operates on a zero-permanent-storage model. Temporary processing buffers are assigned short-lived signed tokens and automatically deleted immediately after transfer or within 10 minutes.',
    },
    {
      q: 'What is Private Download Mode?',
      a: 'When Private Mode is enabled, GlassySave does not record download history, does not store thumbnails or URLs, and purges all temporary files immediately upon completion.',
    },
    {
      q: 'Why did I see "Unable to process this link"?',
      a: 'GlassySave strictly respects content creator terms, copyright, and DRM protections. If a link belongs to private or copyright-restricted content on platforms like YouTube or Instagram, GlassySave displays a polite compliance notice with a link to open the original source rather than attempting to bypass restrictions.',
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 pt-12 pb-16 space-y-20">
      {/* 1. Tagline & Value Banner */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight">
          Download your permitted media.{' '}
          <span className="bg-gradient-to-r from-brand-cyan via-brand-purple to-brand-pink bg-clip-text text-transparent">
            Straight to your device.
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-300">
          Crafted with futuristic glassmorphism, zero permanent server storage, and direct browser-native saving.
        </p>
      </div>

      {/* 2. Three-Step Workflow */}
      <div>
        <div className="text-center mb-8">
          <span className="text-[11px] font-bold uppercase tracking-widest text-brand-cyan">
            Workflow
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
            How It Works in 3 Quick Steps
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="glass-panel glass-panel-hover rounded-3xl p-6 border border-white/10 relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                <span
                  className={`text-4xl font-black font-mono tracking-tighter bg-gradient-to-r ${s.gradient} bg-clip-text text-transparent block mb-3`}
                >
                  {s.step}
                </span>
                <h4 className="text-base font-bold text-white mb-2">{s.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle className="w-4 h-4 text-brand-cyan shrink-0" />
                <span>Direct Local Save</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Feature Highlights */}
      <div>
        <div className="text-center mb-8">
          <span className="text-[11px] font-bold uppercase tracking-widest text-brand-purple">
            Capabilities
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Engineered For Speed & Integrity
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="glass-panel rounded-3xl p-6 border border-white/10 flex items-start gap-4"
              >
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 shrink-0">
                  <Icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">{f.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Interactive FAQ Accordion */}
      <div>
        <div className="text-center mb-8">
          <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
            Questions
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="glass-panel rounded-2xl border border-white/10 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-white hover:text-brand-cyan transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-brand-purple shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-brand-cyan' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-300 leading-relaxed border-t border-white/5 animate-in fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Premium Footer */}
      <footer className="pt-10 border-t border-white/10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-cyan to-brand-purple flex items-center justify-center">
              <Download className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-white">GlassySave</span>
            <span className="text-xs text-slate-500">• Paste. Choose. Save.</span>
          </div>

          <p className="text-[11px] text-slate-400">
            © 2026 GlassySave. Direct local device downloads for permitted, owned, or Creative Commons media.
          </p>

          <button
            onClick={onScrollToTop}
            className="text-xs font-semibold text-brand-cyan hover:underline"
          >
            Back to Top ↑
          </button>
        </div>
      </footer>
    </div>
  );
}
