import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink } from 'lucide-react';

export type AdSlotType =
  | '728x90'
  | '300x250'
  | '320x50'
  | '468x60'
  | '160x600'
  | '160x300'
  | 'native'
  | 'responsive-header'
  | 'in-feed-banner'
  | 'in-feed-card';

interface AdSlotProps {
  type?: AdSlotType;
  className?: string;
  slotName?: string;
}

export const ADSTERRA_SMARTLINK_URL =
  'https://www.profitableratecpmnetwork.com/u3eqn3p98?key=2892f9f26e049737ea673e48542cacd6';

const ZONE_KEYS: Record<string, string> = {
  '728x90': (import.meta.env.VITE_ADSTERRA_KEY_728X90 || 'f07546d12075c9a97b8ec218621c2764').trim(),
  '300x250': (import.meta.env.VITE_ADSTERRA_KEY_300X250 || 'bd98fe4815a113f913e44b6bc31b5613').trim(),
  '320x50': (import.meta.env.VITE_ADSTERRA_KEY_320X50 || 'c826969c9327ec6a02cd195155bb56fd').trim(),
  '468x60': (import.meta.env.VITE_ADSTERRA_KEY_468X60 || 'cd23468046a69da7f1b921ce1d41f474').trim(),
  '160x600': (import.meta.env.VITE_ADSTERRA_KEY_160X600 || '73b496bea40568ad890c766b07ef430c').trim(),
  '160x300': (import.meta.env.VITE_ADSTERRA_KEY_160X300 || 'b114d5835a891f89ec3c776337a41389').trim(),
};

const NATIVE_SCRIPT_URL = (
  import.meta.env.VITE_ADSTERRA_NATIVE_URL ||
  'https://pl30635721.profitableratecpmnetwork.com/fd826692a873ac22a6dcd1b929e3d0ce/invoke.js'
).trim();

const NATIVE_CONTAINER_ID = (
  import.meta.env.VITE_ADSTERRA_NATIVE_CONTAINER_ID ||
  'container-fd826692a873ac22a6dcd1b929e3d0ce'
).trim();

const SLOT_DIMENSIONS: Record<string, { w: number; h: number }> = {
  '728x90': { w: 728, h: 90 },
  '300x250': { w: 300, h: 250 },
  '320x50': { w: 320, h: 50 },
  '468x60': { w: 468, h: 60 },
  '160x600': { w: 160, h: 600 },
  '160x300': { w: 160, h: 300 },
};

// Serialize Adsterra banner invoke.js execution in the real DOM so window.atOptions never collides across slots
let bannerQueue: Promise<void> = Promise.resolve();
function enqueueBannerLoad(task: () => Promise<void>): void {
  bannerQueue = bannerQueue.then(task, task);
}

const SmartlinkFallback: React.FC<{ slotName: string; compact?: boolean }> = ({
  slotName,
  compact = false,
}) => {
  if (compact) {
    return (
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-2 py-1">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 text-neutral-600 dark:text-neutral-300">
            Ad
          </span>
          <span className="font-semibold text-[#000000] dark:text-[#FFFFFF]">{slotName}</span>
          <span className="text-neutral-500 dark:text-neutral-400">
            · Partner offers keep Asbily Tools 100% free.
          </span>
        </div>
        <a
          href={ADSTERRA_SMARTLINK_URL}
          target="_blank"
          rel="noopener sponsored"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-[#000000] dark:text-[#FFFFFF] hover:bg-[#EDEDED] dark:hover:bg-white/10 text-xs font-semibold transition shrink-0"
        >
          <span>Explore Deals</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[300px] mx-auto py-4 px-3 text-center space-y-2.5">
      <div className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF]">
        Featured Partner Deals
      </div>
      <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
        Sponsored partner offers supporting free access to Asbily Tools.
      </p>
      <a
        href={ADSTERRA_SMARTLINK_URL}
        target="_blank"
        rel="noopener sponsored"
        className="inline-flex items-center justify-center gap-1.5 w-full px-4 py-2 rounded-xl bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] text-xs font-semibold hover:opacity-90 transition"
      >
        <span>Visit Partner</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
};

const DirectBanner: React.FC<{
  zoneKey: string;
  width: number;
  height: number;
  slotName: string;
}> = ({ zoneKey, width, height, slotName }) => {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<'loading' | 'loaded' | 'fallback'>('loading');

  useEffect(() => {
    let cancelled = false;
    let checkTimer: number | null = null;
    const safeKey = zoneKey.replace(/[^a-zA-Z0-9]/g, '');

    setStatus('loading');

    enqueueBannerLoad(
      () =>
        new Promise<void>((resolve) => {
          const el = hostRef.current;
          if (cancelled || !el || !el.isConnected) {
            resolve();
            return;
          }

          el.innerHTML = '';

          (window as unknown as Record<string, unknown>).atOptions = {
            key: safeKey,
            format: 'iframe',
            height,
            width,
            params: {},
          };

          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = `https://www.highrevenueformat.com/${safeKey}/invoke.js`;

          let finished = false;
          const finishQueueStep = () => {
            if (finished) return;
            finished = true;
            resolve();
          };

          const safetyTimeout = window.setTimeout(() => {
            if (!cancelled && el.querySelector('iframe, img, a, ins') === null) {
              setStatus('fallback');
            }
            finishQueueStep();
          }, 3500);

          script.onload = () => {
            window.clearTimeout(safetyTimeout);
            checkTimer = window.setTimeout(() => {
              if (!cancelled && hostRef.current) {
                const hasCreative = Boolean(
                  hostRef.current.querySelector('iframe, img, a, ins')
                );
                setStatus(hasCreative ? 'loaded' : 'fallback');
              }
              finishQueueStep();
            }, 350);
          };

          script.onerror = () => {
            window.clearTimeout(safetyTimeout);
            if (!cancelled) {
              setStatus('fallback');
            }
            finishQueueStep();
          };

          el.appendChild(script);
        })
    );

    return () => {
      cancelled = true;
      if (checkTimer !== null) {
        window.clearTimeout(checkTimer);
      }
      if (hostRef.current) {
        hostRef.current.innerHTML = '';
      }
    };
  }, [zoneKey, width, height]);

  const isHorizontal = width >= 468 || height <= 90;

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div
        ref={hostRef}
        className={
          status === 'fallback'
            ? 'hidden'
            : 'flex items-center justify-center max-w-full overflow-x-auto'
        }
        style={
          status === 'fallback'
            ? undefined
            : { minHeight: `${height}px`, minWidth: `${Math.min(width, 300)}px` }
        }
      />
      {status === 'fallback' && <SmartlinkFallback slotName={slotName} compact={isHorizontal} />}
    </div>
  );
};

const DirectNativeBanner: React.FC<{ slotName: string }> = ({ slotName }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<'loading' | 'loaded' | 'fallback'>('loading');

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');

    const safeContainerId = NATIVE_CONTAINER_ID.replace(/[^a-zA-Z0-9_-]/g, '');
    const el = containerRef.current;
    if (!el) return;

    el.innerHTML = '';

    // Remove previous native loader script so SPA route changes can re-initialize the container cleanly
    document
      .querySelectorAll('script[data-asbily-native="true"]')
      .forEach((node) => node.remove());

    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.setAttribute('data-asbily-native', 'true');
    script.src = NATIVE_SCRIPT_URL;

    const observer = new MutationObserver(() => {
      if (!cancelled && el.children.length > 0) {
        setStatus('loaded');
      }
    });
    observer.observe(el, { childList: true, subtree: true });

    script.onload = () => {
      window.setTimeout(() => {
        if (!cancelled) {
          setStatus(el.children.length > 0 ? 'loaded' : 'fallback');
        }
      }, 1500);
    };

    script.onerror = () => {
      if (!cancelled) {
        setStatus('fallback');
      }
    };

    const fallbackTimer = window.setTimeout(() => {
      if (!cancelled && el.children.length === 0) {
        setStatus('fallback');
      }
    }, 4500);

    // Insert script directly before/inside host wrapper so Adsterra finds #container-... in real DOM
    el.id = safeContainerId;
    el.parentElement?.appendChild(script);

    return () => {
      cancelled = true;
      observer.disconnect();
      window.clearTimeout(fallbackTimer);
      script.remove();
      el.innerHTML = '';
    };
  }, []);

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className={status === 'fallback' ? 'hidden' : 'w-full min-h-[100px]'}
      />
      {status === 'fallback' && <SmartlinkFallback slotName={slotName} compact />}
    </div>
  );
};

export const AdSlot: React.FC<AdSlotProps> = ({
  type = 'responsive-header',
  className = '',
  slotName = 'Sponsored Advertisement',
}) => {
  const [viewportWidth, setViewportWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  useEffect(() => {
    const check = () => setViewportWidth(window.innerWidth);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const resolvedSizeKey =
    type === 'responsive-header' || type === 'in-feed-banner'
      ? viewportWidth < 520
        ? '320x50'
        : viewportWidth < 768
          ? '468x60'
          : '728x90'
      : type === 'in-feed-card'
        ? '300x250'
        : type;

  const zoneKey = ZONE_KEYS[resolvedSizeKey];
  const dims = SLOT_DIMENSIONS[resolvedSizeKey];

  if (type === 'native' && NATIVE_SCRIPT_URL && NATIVE_CONTAINER_ID) {
    return (
      <div
        className={`w-full rounded-2xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505] p-3 sm:p-4 overflow-hidden ${className}`}
      >
        <div className="flex items-center justify-between gap-2 mb-2 px-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
            {slotName}
          </span>
          <a
            href={ADSTERRA_SMARTLINK_URL}
            target="_blank"
            rel="noopener sponsored"
            className="inline-flex items-center gap-1 text-[10px] font-medium text-neutral-500 hover:text-[#000000] dark:hover:text-[#FFFFFF] transition"
          >
            <span>Partner Deals</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
        <DirectNativeBanner slotName={slotName} />
      </div>
    );
  }

  if (zoneKey && dims) {
    return (
      <div
        className={`w-full rounded-xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505] p-2.5 flex flex-col items-center justify-center overflow-hidden ${className}`}
      >
        <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
          {slotName}
        </div>
        <DirectBanner zoneKey={zoneKey} width={dims.w} height={dims.h} slotName={slotName} />
      </div>
    );
  }

  return (
    <div
      className={`w-full rounded-xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505] p-3 ${className}`}
    >
      <SmartlinkFallback slotName={slotName} compact />
    </div>
  );
};
