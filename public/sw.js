const CACHE_NAME = 'hekling-cache-v2'; // Endre versjonsnummeret når du gjør endringer
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/style.css',
  '/script.js',
];

//Installer Service Worker og legg til cache
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Tving oppdatering av SW umiddelbart
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

//Hent fra cache, men sjekk for oppdateringer
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).then((fetchResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, fetchResponse.clone()); // Oppdater cache
            return fetchResponse;
          });
        })
      );
    })
  );
});

//Aktiver ny SW og fjern gammel cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim(); // Tving bruk av ny service worker umiddelbart
});
