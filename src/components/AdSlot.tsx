import React, { useEffect, useId, useState } from 'react';
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
      sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-forms"
      className="border-0 max-w-full overflow-hidden mx-auto block"
      loading="lazy"
    />
  );
};

const NativeBannerIframe: React.FC<{ title: string }> = ({ title }) => {
  const frameId = useId();
  const [height, setHeight] = useState(220);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (
        event.data &&
        typeof event.data === 'object' &&
        event.data.type === 'asbily-native-ad-height' &&
        event.data.frameId === frameId &&
        typeof event.data.height === 'number' &&
        event.data.height >= 80
      ) {
        setHeight(Math.min(Math.max(event.data.height, 120), 900));
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [frameId]);

  const safeUrl = NATIVE_SCRIPT_URL.replace(/"/g, '&quot;');
  const safeContainer = NATIVE_CONTAINER_ID.replace(/[^a-zA-Z0-9_-]/g, '');
  const safeFrameId = frameId.replace(/[^a-zA-Z0-9_-]/g, '');

  const nativeSrcDoc = `<!doctype html><html><head><style>html,body{margin:0;padding:0;background:transparent;width:100%;overflow-x:hidden;font-family:system-ui,-apple-system,sans-serif;}</style></head><body><script async="async" data-cfasync="false" src="${safeUrl}"></script><div id="${safeContainer}"></div><script>(function(){var f="${safeFrameId}";function report(){var h=Math.max(document.body.scrollHeight,document.documentElement.scrollHeight);if(h>0){parent.postMessage({type:"asbily-native-ad-height",frameId:f,height:h},"*");}}if(typeof ResizeObserver!=="undefined"){new ResizeObserver(report).observe(document.body);}setInterval(report,1000);window.addEventListener("load",report);})();</script></body></html>`;

  return (
    <iframe
      title={title}
      srcDoc={nativeSrcDoc}
      style={{ height: `${height}px` }}
      className="w-full border-0 overflow-hidden block transition-[height] duration-200"
      sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-forms"
      loading="lazy"
    />
  );
};

export const AdSlot: React.FC<AdSlotProps> = ({
  type = 'responsive-header',
  className = '',
  slotName = 'Sponsored Advertisement',
}) => {
  const [viewportWidth, setViewportWidth] = useState<number>(1024);

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
        className={`w-full rounded-2xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505] p-3 sm:p-4 text-center overflow-hidden ${className}`}
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
        <NativeBannerIframe title={slotName} />
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

  return (
    <div
      className={`w-full rounded-xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505] px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${className}`}
    >
      <div className="text-xs text-neutral-600 dark:text-neutral-400">
        <span className="font-mono text-[10px] uppercase tracking-wider mr-2 text-neutral-500">Ad</span>
        <span className="font-semibold text-[#000000] dark:text-[#FFFFFF]">{slotName}</span>
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
};
