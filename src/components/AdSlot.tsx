import React from 'react';

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

export const AdSlot: React.FC<AdSlotProps> = ({
  type = 'responsive-header',
  className = '',
  slotName = 'Sponsored',
}) => {
  // Generate isolated iframe HTML for standard Adsterra atOptions banners
  const createBannerHtml = (key: string, width: number, height: number) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body {
          width: 100%;
          height: 100%;
          max-width: 100%;
          overflow: hidden;
          background: transparent;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      </style>
    </head>
    <body>
      <script type="text/javascript">
        atOptions = {
          'key' : '${key}',
          'format' : 'iframe',
          'height' : ${height},
          'width' : ${width},
          'params' : {}
        };
      </script>
      <script type="text/javascript" src="https://www.highrevenueformat.com/${key}/invoke.js"></script>
    </body>
    </html>
  `;

  // Generate HTML for Adsterra Native Banner
  const createNativeHtml = () => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body {
          width: 100%;
          max-width: 100%;
          margin: 0;
          padding: 4px;
          overflow-x: hidden;
          background: transparent;
          font-family: system-ui, -apple-system, sans-serif;
          display: flex;
          justify-content: center;
        }
        #container-fd826692a873ac22a6dcd1b929e3d0ce {
          width: 100%;
          max-width: 100%;
        }
      </style>
    </head>
    <body>
      <div id="container-fd826692a873ac22a6dcd1b929e3d0ce"></div>
      <script async="async" data-cfasync="false" src="https://pl30635721.profitableratecpmnetwork.com/fd826692a873ac22a6dcd1b929e3d0ce/invoke.js"></script>
    </body>
    </html>
  `;

  // In-Feed Card: Blends naturally into the tools grid like a card
  if (type === 'in-feed-card') {
    return (
      <div
        className={`group relative border border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl p-4 bg-neutral-50/50 dark:bg-neutral-900/40 transition flex flex-col items-center justify-center text-center overflow-hidden max-w-full w-full ${className}`}
      >
        <div className="flex items-center justify-between w-full mb-2">
          <span className="text-[10px] tracking-wider uppercase font-semibold text-neutral-400 dark:text-neutral-500 select-none">
            {slotName}
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-200/60 dark:bg-neutral-800 text-neutral-500 font-mono">
            Ad
          </span>
        </div>
        <div className="w-full flex justify-center items-center overflow-hidden max-w-full">
          <div className="w-[300px] h-[250px] max-w-full overflow-hidden flex items-center justify-center rounded border border-neutral-200/50 dark:border-neutral-800/50 bg-white dark:bg-black/40">
            <iframe
              title="Adsterra 300x250 Medium Rectangle"
              srcDoc={createBannerHtml('bd98fe4815a113f913e44b6bc31b5613', 300, 250)}
              width="300"
              height="250"
              className="border-0 max-w-full select-none"
              style={{ maxWidth: '100%', height: '250px' }}
              loading="lazy"
              scrolling="no"
            />
          </div>
        </div>
      </div>
    );
  }

  // In-Feed Banner: Clean, non-intrusive full-width divider across grid columns
  if (type === 'in-feed-banner') {
    return (
      <div className={`col-span-full py-4 w-full max-w-full overflow-hidden flex flex-col items-center ${className}`}>
        <div className="w-full max-w-5xl flex items-center gap-3 mb-2 px-1">
          <div className="h-px bg-neutral-200 dark:border-neutral-800 flex-1"></div>
          <span className="text-[10px] tracking-wider uppercase font-medium text-neutral-400 dark:text-neutral-500 select-none">
            {slotName}
          </span>
          <div className="h-px bg-neutral-200 dark:border-neutral-800 flex-1"></div>
        </div>

        {/* Desktop >= 768px: 728x90 Leaderboard */}
        <div className="hidden md:flex justify-center w-full max-w-[728px] h-[90px] overflow-hidden rounded-lg border border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-50/40 dark:bg-neutral-900/40">
          <iframe
            title="Adsterra 728x90 Banner"
            srcDoc={createBannerHtml('f07546d12075c9a97b8ec218621c2764', 728, 90)}
            width="728"
            height="90"
            className="border-0 max-w-full"
            style={{ width: '728px', height: '90px', maxWidth: '100%' }}
            loading="lazy"
            scrolling="no"
          />
        </div>

        {/* Mobile & Small Screen: 320x50 Banner */}
        <div className="flex md:hidden justify-center w-full max-w-[320px] h-[50px] overflow-hidden rounded-lg border border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-50/40 dark:bg-neutral-900/40">
          <iframe
            title="Adsterra 320x50 Mobile Banner"
            srcDoc={createBannerHtml('c826969c9327ec6a02cd195155bb56fd', 320, 50)}
            width="320"
            height="50"
            className="border-0 max-w-full"
            style={{ width: '320px', height: '50px', maxWidth: '100%' }}
            loading="lazy"
            scrolling="no"
          />
        </div>
      </div>
    );
  }

  // Responsive Header: 728x90 on Desktop/Tablet, 320x50 on Mobile phones
  if (type === 'responsive-header') {
    return (
      <div className={`w-full max-w-full flex flex-col items-center my-4 overflow-hidden ${className}`}>
        <div className="text-[10px] tracking-wider uppercase font-medium text-neutral-400 dark:text-neutral-500 mb-1.5 select-none">
          {slotName}
        </div>

        {/* Desktop / Tablet: 728x90 */}
        <div className="hidden md:flex justify-center w-full max-w-[728px] h-[90px] overflow-hidden rounded-lg border border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-50/40 dark:bg-neutral-900/40">
          <iframe
            title="Adsterra 728x90 Banner"
            srcDoc={createBannerHtml('f07546d12075c9a97b8ec218621c2764', 728, 90)}
            width="728"
            height="90"
            className="border-0 max-w-full"
            style={{ width: '728px', height: '90px', maxWidth: '100%' }}
            loading="lazy"
            scrolling="no"
          />
        </div>

        {/* Mobile: 320x50 */}
        <div className="flex md:hidden justify-center w-full max-w-[320px] h-[50px] overflow-hidden rounded-lg border border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-50/40 dark:bg-neutral-900/40">
          <iframe
            title="Adsterra 320x50 Mobile Banner"
            srcDoc={createBannerHtml('c826969c9327ec6a02cd195155bb56fd', 320, 50)}
            width="320"
            height="50"
            className="border-0 max-w-full"
            style={{ width: '320px', height: '50px', maxWidth: '100%' }}
            loading="lazy"
            scrolling="no"
          />
        </div>
      </div>
    );
  }

  // 300x250 Medium Rectangle (High CPM)
  if (type === '300x250') {
    return (
      <div className={`w-full max-w-full flex flex-col items-center my-4 overflow-hidden ${className}`}>
        <div className="text-[10px] tracking-wider uppercase font-medium text-neutral-400 dark:text-neutral-500 mb-1 select-none">
          {slotName}
        </div>
        <div className="w-[300px] max-w-full h-[250px] overflow-hidden rounded-lg border border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-50/40 dark:bg-neutral-900/40 flex items-center justify-center">
          <iframe
            title="Adsterra 300x250 Medium Rectangle"
            srcDoc={createBannerHtml('bd98fe4815a113f913e44b6bc31b5613', 300, 250)}
            width="300"
            height="250"
            className="border-0 max-w-full"
            style={{ width: '300px', height: '250px', maxWidth: '100%' }}
            loading="lazy"
            scrolling="no"
          />
        </div>
      </div>
    );
  }

  // 728x90 Leaderboard Explicit
  if (type === '728x90') {
    return (
      <div className={`w-full max-w-full flex flex-col items-center my-4 overflow-hidden ${className}`}>
        <div className="text-[10px] tracking-wider uppercase font-medium text-neutral-400 dark:text-neutral-500 mb-1 select-none">
          {slotName}
        </div>
        <div className="w-full max-w-[728px] h-[90px] overflow-hidden rounded-lg border border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-50/40 dark:bg-neutral-900/40 flex justify-center">
          <iframe
            title="Adsterra 728x90 Banner"
            srcDoc={createBannerHtml('f07546d12075c9a97b8ec218621c2764', 728, 90)}
            width="728"
            height="90"
            className="border-0 max-w-full"
            style={{ width: '728px', height: '90px', maxWidth: '100%' }}
            loading="lazy"
            scrolling="no"
          />
        </div>
      </div>
    );
  }

  // 320x50 Mobile Explicit
  if (type === '320x50') {
    return (
      <div className={`w-full max-w-full flex flex-col items-center my-3 overflow-hidden ${className}`}>
        <div className="text-[10px] tracking-wider uppercase font-medium text-neutral-400 dark:text-neutral-500 mb-1 select-none">
          {slotName}
        </div>
        <div className="w-full max-w-[320px] h-[50px] overflow-hidden rounded-lg border border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-50/40 dark:bg-neutral-900/40 flex justify-center">
          <iframe
            title="Adsterra 320x50 Banner"
            srcDoc={createBannerHtml('c826969c9327ec6a02cd195155bb56fd', 320, 50)}
            width="320"
            height="50"
            className="border-0 max-w-full"
            style={{ width: '320px', height: '50px', maxWidth: '100%' }}
            loading="lazy"
            scrolling="no"
          />
        </div>
      </div>
    );
  }

  // 468x60 Classic Banner
  if (type === '468x60') {
    return (
      <div className={`w-full max-w-full flex flex-col items-center my-3 overflow-hidden ${className}`}>
        <div className="text-[10px] tracking-wider uppercase font-medium text-neutral-400 dark:text-neutral-500 mb-1 select-none">
          {slotName}
        </div>
        <div className="w-full max-w-[468px] h-[60px] overflow-hidden rounded-lg border border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-50/40 dark:bg-neutral-900/40 flex justify-center">
          <iframe
            title="Adsterra 468x60 Banner"
            srcDoc={createBannerHtml('cd23468046a69da7f1b921ce1d41f474', 468, 60)}
            width="468"
            height="60"
            className="border-0 max-w-full"
            style={{ width: '468px', height: '60px', maxWidth: '100%' }}
            loading="lazy"
            scrolling="no"
          />
        </div>
      </div>
    );
  }

  // 160x600 Wide Skyscraper
  if (type === '160x600') {
    return (
      <div className={`w-full max-w-full flex flex-col items-center my-4 overflow-hidden ${className}`}>
        <div className="text-[10px] tracking-wider uppercase font-medium text-neutral-400 dark:text-neutral-500 mb-1 select-none">
          {slotName}
        </div>
        <div className="w-[160px] max-w-full h-[600px] overflow-hidden rounded-lg border border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-50/40 dark:bg-neutral-900/40 flex justify-center">
          <iframe
            title="Adsterra 160x600 Skyscraper"
            srcDoc={createBannerHtml('73b496bea40568ad890c766b07ef430c', 160, 600)}
            width="160"
            height="600"
            className="border-0 max-w-full"
            style={{ width: '160px', height: '600px', maxWidth: '100%' }}
            loading="lazy"
            scrolling="no"
          />
        </div>
      </div>
    );
  }

  // 160x300 Skyscraper
  if (type === '160x300') {
    return (
      <div className={`w-full max-w-full flex flex-col items-center my-4 overflow-hidden ${className}`}>
        <div className="text-[10px] tracking-wider uppercase font-medium text-neutral-400 dark:text-neutral-500 mb-1 select-none">
          {slotName}
        </div>
        <div className="w-[160px] max-w-full h-[300px] overflow-hidden rounded-lg border border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-50/40 dark:bg-neutral-900/40 flex justify-center">
          <iframe
            title="Adsterra 160x300 Skyscraper"
            srcDoc={createBannerHtml('b114d5835a891f89ec3c776337a41389', 160, 300)}
            width="160"
            height="300"
            className="border-0 max-w-full"
            style={{ width: '160px', height: '300px', maxWidth: '100%' }}
            loading="lazy"
            scrolling="no"
          />
        </div>
      </div>
    );
  }

  // Native Banner Grid
  return (
    <div className={`w-full max-w-full flex flex-col items-center my-6 overflow-hidden ${className}`}>
      <div className="text-[10px] tracking-wider uppercase font-medium text-neutral-400 dark:text-neutral-500 mb-1.5 select-none">
        {slotName}
      </div>
      <div className="w-full max-w-5xl min-h-[160px] rounded-xl border border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-50/30 dark:bg-neutral-900/30 overflow-hidden flex justify-center">
        <iframe
          title="Adsterra Native Banner"
          srcDoc={createNativeHtml()}
          width="100%"
          height="160"
          className="w-full min-h-[160px] border-0 max-w-full"
          loading="lazy"
          scrolling="no"
        />
      </div>
    </div>
  );
};
