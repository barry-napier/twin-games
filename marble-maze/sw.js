// Service Worker for PWA functionality
// This minimal service worker enables the app to be installable

self.addEventListener('install', event => {
  // Skip waiting to activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  // Claim all clients immediately
  event.waitUntil(clients.claim());
});

// Handle fetch events by just returning network responses
// This allows the app to be installable without complex caching
self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request));
});