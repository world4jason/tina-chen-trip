const CACHE_NAME = 'tina-chen-trip-v2';
const APP_FILES = [
  './',
  './index.html',
  './trip-base.js',
  './trip-days-1.js',
  './trip-days-2.js',
  './trip-days-3.js',
  './trip-days-4.js',
  './trip-days-5.js',
  './trip-days-6.js',
  './trip-days-7.js',
  './paper-schedule.js',
  './app-v2.js'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response && response.ok && new URL(event.request.url).origin === self.location.origin) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
