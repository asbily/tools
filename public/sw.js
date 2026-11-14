const CACHE_NAME = 'asbily-tools-v3';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/asbily.svg',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/pwa-maskable-512x512.png',
  '/apple-touch-icon.png',
  '/og-image.png',
  '/manifest.webmanifest',
];

// Populated automatically during production build; empty in dev mode
const BUILT_ASSETS = /* __PRECACHE_ASSETS__ */ [];
const ASSETS_TO_CACHE = Array.from(new Set([...CORE_ASSETS, ...BUILT_ASSETS]));

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        ASSETS_TO_CACHE.map((url) =>
          cache.add(new Request(url, { cache: 'reload' })).catch(() => undefined)
        )
      );
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
            return Promise.resolve();
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const reqUrl = new URL(event.request.url);
  if (reqUrl.origin !== self.location.origin) {
    return;
  }

  // Never intercept or cache crawler/verification files
  if (
    reqUrl.pathname === '/sitemap.xml' ||
    reqUrl.pathname === '/robots.txt' ||
    reqUrl.pathname.endsWith('.xml') ||
    reqUrl.pathname.endsWith('.txt')
  ) {
    return;
  }

  // Navigation requests: Network-first with cached SPA shell + offline fallback
  if (event.request.mode === 'navigate' || event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clone).catch(() => {});
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          const cached = await caches.match(event.request);
          if (cached) return cached;
          const appShell = (await caches.match('/index.html')) || (await caches.match('/'));
          if (appShell) return appShell;
          const offlineFallback = await caches.match('/offline.html');
          return offlineFallback || new Response('Offline', { status: 503, statusText: 'Offline' });
        })
    );
    return;
  }

  // Same-origin static assets (JS, CSS, SVG, PNG): Cache-first with background revalidation
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const networkFetch = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clone).catch(() => {});
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || networkFetch;
    })
  );
});
