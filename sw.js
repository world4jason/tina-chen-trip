const CACHE_NAME = 'tina-chen-trip-v3';
const APP_FILES = [
  './',
  './index.html',
  './trip-base.js?v=20260825-3',
  './trip-days-1.js?v=20260825-3',
  './trip-days-2.js?v=20260825-3',
  './trip-days-3.js?v=20260825-3',
  './trip-days-4.js?v=20260825-3',
  './trip-days-5.js?v=20260825-3',
  './trip-days-6.js?v=20260825-3',
  './trip-days-7.js?v=20260825-3',
  './paper-schedule.js?v=20260825-3',
  './app-v2.js?v=20260825-3'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});

// Online: always ask the network first so GitHub Pages updates show immediately.
// Offline: fall back to the last successfully cached copy.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    try {
      const response = await fetch(event.request, { cache: 'no-store' });
      if (response && response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      }
      return response;
    } catch (error) {
      const cached = await caches.match(event.request);
      if (cached) return cached;
      if (event.request.mode === 'navigate') {
        return caches.match('./index.html');
      }
      throw error;
    }
  })());
});
