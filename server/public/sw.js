// Essence Yogurt Service Worker - Minimal version
// Just clears old caches without forcing reloads

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys.map(key => caches.delete(key)));
    }).then(() => {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Just pass through - no caching
  event.respondWith(fetch(event.request));
});
