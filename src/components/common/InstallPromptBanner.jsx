import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X } from 'lucide-react';

export default function InstallPromptBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setDismissed(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  if (!deferredPrompt || dismissed) return null;

  const handleInstall = async () => {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setDismissed(true);
  };

  return (
    <div className="bg-[#EFF6FF] border-b border-blue-200 px-4 py-2.5 flex items-center justify-between text-xs text-[#0F172A] z-40">
      <div className="flex items-center gap-2">
        <Smartphone size={16} className="text-[#2563EB] shrink-0" />
        <span className="font-semibold">
          Install <strong>Winter Arc</strong> on your device for fast fullscreen daily tracking.
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleInstall}
          className="px-3 py-1 bg-[#2563EB] text-white rounded-lg font-bold text-xs hover:bg-blue-700 transition-colors shadow-sm"
        >
          Install
        </button>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="p-1 text-[#64748B] hover:text-[#0F172A]"
          title="Dismiss"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
