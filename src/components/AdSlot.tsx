import React, { useEffect, useState } from 'react';
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

const ADSTERRA_SMARTLINK_URL =
  'https://www.profitableratecpmnetwork.com/u3eqn3p98?key=2892f9f26e049737ea673e48542cacd6';

const ZONE_KEYS: Record<string, string | undefined> = {
  '728x90': import.meta.env.VITE_ADSTERRA_KEY_728X90,
  '300x250': import.meta.env.VITE_ADSTERRA_KEY_300X250,
  '320x50': import.meta.env.VITE_ADSTERRA_KEY_320X50,
  '468x60': import.meta.env.VITE_ADSTERRA_KEY_468X60,
  '160x600': import.meta.env.VITE_ADSTERRA_KEY_160X600,
  '160x300': import.meta.env.VITE_ADSTERRA_KEY_160X300,
};

const SLOT_DIMENSIONS: Record<string, { w: number; h: number }> = {
  '728x90': { w: 728, h: 90 },
  '300x250': { w: 300, h: 250 },
  '320x50': { w: 320, h: 50 },
  '468x60': { w: 468, h: 60 },
  '160x600': { w: 160, h: 600 },
  '160x300': { w: 160, h: 300 },
};

const BannerIframe: React.FC<{ zoneKey: string; width: number; height: number; title: string }> = ({
  zoneKey,
  width,
  height,
  title,
}) => {
  const safeKey = zoneKey.replace(/[^a-zA-Z0-9]/g, '');
  const srcDoc = `<!doctype html><html><body style="margin:0;padding:0;display:flex;justify-content:center;align-items:center;background:transparent;overflow:hidden;"><script type="text/javascript">atOptions={'key':'${safeKey}','format':'iframe','height':${height},'width':${width},'params':{}};</script><script type="text/javascript" src="https://www.highrevenueformat.com/${safeKey}/invoke.js"></script></body></html>`;

  return (
    <iframe
      title={title}
      srcDoc={srcDoc}
      width={width}
      height={height}
      sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin"
      className="border-0 max-w-full overflow-hidden mx-auto block"
      loading="lazy"
    />
  );
};

export const AdSlot: React.FC<AdSlotProps> = ({
  type = 'responsive-header',
  className = '',
  slotName = 'Sponsored Advertisement',
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const resolvedSizeKey =
    type === 'responsive-header' || type === 'in-feed-banner'
      ? isMobile
        ? '320x50'
        : '728x90'
      : type === 'in-feed-card'
        ? '300x250'
        : type;

  const zoneKey = ZONE_KEYS[resolvedSizeKey]?.trim();
  const dims = SLOT_DIMENSIONS[resolvedSizeKey];
  const nativeUrl = import.meta.env.VITE_ADSTERRA_NATIVE_URL?.trim();
  const nativeContainerId = import.meta.env.VITE_ADSTERRA_NATIVE_CONTAINER_ID?.trim();

  if (type === 'native' && nativeUrl && nativeContainerId) {
    const nativeSrcDoc = `<!doctype html><html><body style="margin:0;padding:0;background:transparent;"><script async="async" data-cfasync="false" src="${nativeUrl.replace(/"/g, '&quot;')}"></script><div id="${nativeContainerId.replace(/[^a-zA-Z0-9_-]/g, '')}"></div></body></html>`;
    return (
      <div
        className={`w-full rounded-xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505] p-3 text-center ${className}`}
      >
        <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
          {slotName}
        </div>
        <iframe
          title={slotName}
          srcDoc={nativeSrcDoc}
          className="w-full min-h-[120px] border-0"
          sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin"
          loading="lazy"
        />
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
        <BannerIframe zoneKey={zoneKey} width={dims.w} height={dims.h} title={slotName} />
      </div>
    );
  }

  // Verified Adsterra Direct/Smartlink Sponsored Card when banner zone keys are not set
  const isCompactBanner =
    type === 'responsive-header' || type === 'in-feed-banner' || type === '728x90' || type === '320x50' || type === '468x60';

  if (type === 'in-feed-banner') {
    return (
      <div
        className={`col-span-full rounded-2xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${className}`}
      >
        <div className="space-y-0.5">
          <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
            Sponsored · Ad
          </div>
          <div className="text-xs sm:text-sm font-semibold text-[#000000] dark:text-[#FFFFFF]">
            Featured Partner Offers — Supports Free Access to Asbily Tools
          </div>
        </div>
        <a
          href={ADSTERRA_SMARTLINK_URL}
          target="_blank"
          rel="noopener sponsored"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] text-xs font-semibold hover:opacity-90 transition shrink-0"
        >
          <span>Explore Partner Deals</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    );
  }

  if (isCompactBanner) {
    return (
      <div
        className={`w-full rounded-xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505] px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${className}`}
      >
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 text-neutral-600 dark:text-neutral-300">
            Ad
          </span>
          <span className="font-semibold text-[#000000] dark:text-[#FFFFFF]">
            {slotName}
          </span>
          <span className="text-neutral-500 dark:text-neutral-400">
            · Partner recommendations keep Asbily Tools free with zero paywalls.
          </span>
        </div>
        <a
          href={ADSTERRA_SMARTLINK_URL}
          target="_blank"
          rel="noopener sponsored"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-[#000000] dark:text-[#FFFFFF] hover:bg-[#EDEDED] dark:hover:bg-white/10 text-xs font-semibold transition shrink-0"
        >
          <span>Visit Partner</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    );
  }

  return (
    <div
      className={`w-full max-w-[340px] rounded-2xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505] p-5 text-center space-y-3 ${className}`}
    >
      <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
        {slotName} · Ad
      </div>
      <div className="text-sm font-bold text-[#000000] dark:text-[#FFFFFF]">
        Featured Partner Deals
      </div>
      <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
        Sponsored offers and software deals from Asbily Tools advertising partners.
      </p>
      <a
        href={ADSTERRA_SMARTLINK_URL}
        target="_blank"
        rel="noopener sponsored"
        className="inline-flex items-center justify-center gap-1.5 w-full px-4 py-2.5 rounded-xl bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] text-xs font-semibold hover:opacity-90 transition"
      >
        <span>Open Partner Offer</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
};
