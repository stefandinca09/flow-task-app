const CACHE_NAME = 'flow-v1';
const ASSETS_TO_CACHE = [
  'TODO.html',
  'manifest.json',
  'assets/images/flow-logo.png',
  'assets/images/flow-icon-192.png',
  'assets/images/flow-icon-512.png',
  'assets/images/flow-icon.svg'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching assets...');
      // Cache each asset individually to avoid total failure
      return Promise.all(
        ASSETS_TO_CACHE.map((asset) =>
          cache.add(asset).catch((error) => {
            console.warn(`Failed to cache ${asset}:`, error);
            // Continue even if individual assets fail
          })
        )
      );
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
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

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request).then((response) => {
      // Don't cache non-successful responses
      if (!response || response.status !== 200) {
        return response;
      }

      // Cache successful responses
      const responseToCache = response.clone();
      caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, responseToCache);
      });

      return response;
    }).catch(() => {
      // Offline - return cached version
      return caches.match(event.request);
    })
  );
});
