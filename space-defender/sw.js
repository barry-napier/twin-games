// Service Worker for Space Defender PWA

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

// Handle fetch events
self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request));
});