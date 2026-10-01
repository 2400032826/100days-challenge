import React from 'react';
import { X, ShieldCheck, FileText, Info } from 'lucide-react';

export default function LegalModals({ activeModal, onClose }) {
  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-white/15 max-h-[85vh] overflow-y-auto relative shadow-glass animate-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {activeModal === 'about' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-cyan/20 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan">
                <Info className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">About GlassySave</h3>
            </div>
            <div className="text-xs sm:text-sm text-slate-300 space-y-3 leading-relaxed">
              <p>
                <strong>GlassySave</strong> is a state-of-the-art media download manager designed with a futuristic glassmorphic aesthetic.
              </p>
              <p>
                Our core philosophy is simple: empower creators, students, and professionals to download and archive media they own or have verified legal permission to access.
              </p>
              <p>
                The platform features a modular <em>MediaProvider</em> architecture, real-time buffered stream simulation, multi-format export, and instant Progressive Web App (PWA) readiness.
              </p>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-400 mt-4">
                Version 1.0.0 • React, Vite, Express, MongoDB • 100% Permitted Operations
              </div>
            </div>
          </div>
        )}

        {activeModal === 'privacy' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">Privacy Policy</h3>
            </div>
            <div className="text-xs sm:text-sm text-slate-300 space-y-3 leading-relaxed">
              <p>
                At GlassySave, your privacy is paramount. We operate on a strict <strong>Zero Data Harvesting</strong> model:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-400 text-xs">
                <li>We do not record personal identifiable information (PII).</li>
                <li>Temporary file streams stored on server disks are permanently purged within 60 minutes.</li>
                <li>We do not process, intercept, or request private account credentials or session cookies.</li>
                <li>All network calls use server-side SSRF validation to prevent unauthorized network requests.</li>
              </ul>
            </div>
          </div>
        )}

        {activeModal === 'terms' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-purple/20 border border-brand-purple/30 flex items-center justify-center text-brand-purple">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">Terms of Service & DMCA</h3>
            </div>
            <div className="text-xs sm:text-sm text-slate-300 space-y-3 leading-relaxed">
              <p>
                By using GlassySave, you explicitly certify that you own the rights to the content being processed or possess explicit permission from the copyright owner (e.g. Creative Commons license or public domain attribution).
              </p>
              <div className="p-3.5 rounded-xl bg-brand-purple/10 border border-brand-purple/20 text-xs text-purple-200">
                <strong>Platform Integrity:</strong> GlassySave strictly abides by the Terms of Service of platforms including YouTube and Instagram. Any request targeting DRM-protected, paywalled, or restricted private media is automatically rejected with an advisory notice.
              </div>
              <p className="text-xs text-slate-400">
                For DMCA or copyright notices, requests can be submitted for instantaneous blocklisting of any authorized provider pattern.
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
