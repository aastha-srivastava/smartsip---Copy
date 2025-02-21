const CACHE_NAME = 'smartsipp-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/192.png',
  '/512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

self.addEventListener("push", (event) => {
    const data = event.data ? event.data.json() : {};
    self.registration.showNotification(data.title || "SmartSipp", {
      body: data.body || "It's time to drink water!",
      icon: "/icons/icon-192x192.png",
    });
  });
  