alert('changes synced')
const CACHE_NAME = "lender-cache-v1";
const ASSETS = [
  "/",                // Root
  "/index.html",
  "/upload.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "https://cdn.jsdelivr.net/npm/chart.js"
];

// Install event – cache the app shell
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // Activate worker immediately
});

// Activate event – clean old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim(); // Take control immediately
});

// Fetch event – return cached file or fetch from network
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Serve from cache if found, else from network
      return response || fetch(event.request);
    }).catch(err => {
      // Optional: show offline fallback here
      return new Response("You're offline.");
    })
  );
});
