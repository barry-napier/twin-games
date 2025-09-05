const CACHE_NAME = 'twin-games-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  // Featured Games
  '/marble-maze/index.html',
  '/rhythm-tap/index.html',
  '/color-chain/index.html',
  '/space-defender/index.html',
  // Educational Games
  '/alphabet-adventure/index.html',
  '/number-counting/index.html',
  '/counting-cookies/index.html',
  '/color-mixing-lab/index.html',
  '/shape-sorter/index.html',
  '/shape-puzzle/index.html',
  '/story-sequencer/index.html',
  // Memory Games
  '/memory-cards/index.html',
  '/animal-memory/index.html',
  '/animal-memory-match/index.html',
  '/color-match/index.html',
  // Action Games
  '/balloon-pop/index.html',
  '/bubble-pop/index.html',
  '/catch-a-critter/index.html',
  '/catch-the-stars/index.html',
  // Music Games
  '/animal-sounds/index.html',
  '/animal-piano/index.html',
  '/musical-drums/index.html',
  // Creative Games
  '/drawing-canvas/index.html',
  '/paint-and-draw/index.html',
  '/dress-up-doll/index.html'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(response => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          // Cache the fetched response for future use
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(() => {
        // Offline fallback
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      })
  );
});