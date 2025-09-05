// Service Worker for Rhythm Tap Hero PWA

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