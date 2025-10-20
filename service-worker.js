const CACHE_NAME = 'inventory-pro-v1';
const OFFLINE_URL = '/CGP/index.html';
const ASSETS = [
  '/CGP/index.html',
  '/CGP/manifest.json',
  '/CGP/icon-192.png',
  '/CGP/icon-512.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS).catch(()=>{}))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(resp => {
        if (resp && resp.type === 'basic') {
          const copy = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return resp;
      }).catch(() => caches.match(OFFLINE_URL));
    })
  );
});
