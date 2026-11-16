import React, { useState } from 'react';
import { Download, RefreshCw, WifiOff, X } from 'lucide-react';
import { usePWAInstall, useOnlineStatus, useServiceWorkerUpdate } from '../hooks/usePWA';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) return null;

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="inline-flex items-center justify-center gap-1.5 p-1.5 sm:px-3 sm:py-2 rounded-lg border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-[#000000] dark:text-[#FFFFFF] hover:bg-[#F6F6F6] dark:hover:bg-white/10 text-xs font-semibold transition whitespace-nowrap shrink-0 cursor-pointer"
        aria-label="Install Asbily Tools app"
        title="Install Asbily Tools app"
      >
        <Download className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
        <span className="hidden sm:inline">Install App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center justify-center gap-1.5 p-1.5 sm:px-3 sm:py-2 rounded-lg border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-[#000000] dark:text-[#FFFFFF] hover:bg-[#F6F6F6] dark:hover:bg-white/10 text-xs font-semibold transition whitespace-nowrap shrink-0 cursor-pointer"
          aria-label="Install on iOS"
          title="Install on iOS"
        >
          <Download className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
          <span className="hidden sm:inline">Install</span>
        </button>

        {showIOSGuide && (
          <div
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ios-install-title"
          >
            <div className="w-full max-w-sm rounded-2xl border border-black/10 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 id="ios-install-title" className="text-base font-bold text-[#000000] dark:text-[#FFFFFF]">
                  Install Asbily Tools on iOS
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-[#000000] dark:hover:text-[#FFFFFF] cursor-pointer"
                  aria-label="Close installation guide"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <ol className="space-y-2 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed list-decimal pl-4">
                <li>Tap the <strong>Share</strong> button in the Safari toolbar.</li>
                <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
                <li>Confirm by tapping <strong>Add</strong>.</li>
              </ol>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] text-xs font-semibold cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 z-[9990] flex items-center gap-2 rounded-xl border border-white/15 bg-[#090909] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] px-3.5 py-2 text-xs font-semibold shadow-xl"
    >
      <WifiOff className="w-3.5 h-3.5 shrink-0" />
      <span>Offline Mode — Cached tools remain available locally</span>
    </div>
  );
};

export const SwUpdateBanner: React.FC = () => {
  const { updateAvailable, applyUpdate } = useServiceWorkerUpdate();
  const [dismissed, setDismissed] = useState(false);

  if (!updateAvailable || dismissed) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-[9990] flex items-center gap-3 rounded-xl border border-white/15 bg-[#090909] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] px-4 py-2.5 text-xs font-medium shadow-xl"
    >
      <span>A new version of Asbily Tools is ready.</span>
      <button
        type="button"
        onClick={applyUpdate}
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FFFFFF] dark:bg-[#000000] text-[#000000] dark:text-[#FFFFFF] font-semibold cursor-pointer"
      >
        <RefreshCw className="w-3 h-3" />
        <span>Update</span>
      </button>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="p-0.5 opacity-70 hover:opacity-100 cursor-pointer"
        aria-label="Dismiss update notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
