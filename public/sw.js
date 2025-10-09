const CACHE = 'sr-cache-v2-shell';
const ASSETS = ['/', '/manifest.json', '/icons/icon.svg'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // Let app code manage /data/ caching regardless of basePath (/dash)
  if (url.pathname.includes('/data/')) return;
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
