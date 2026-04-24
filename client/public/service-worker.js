/* eslint-disable no-restricted-globals */

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => {
      self.registration.unregister();
    })
  );
});

// Pass through all fetch requests, skipping cache entirely
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
