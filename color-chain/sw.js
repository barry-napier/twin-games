// Service Worker for Color Chain Reaction PWA

self.addEventListener('install', () => {
  // Skip waiting to activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  // Claim all clients immediately
  event.waitUntil(clients.claim());
});

// Handle fetch events by returning network responses
self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request));
});