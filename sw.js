// Service Worker para KLIKO (PWA Oficial de Orcera)
const CACHE_NAME = 'kliko-cache-v3';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manual.html',
  './manifest.json',
  './css/styles.css',
  './js/app.js',
  './js/data-ejes.js',
  './js/supabase-client.js',
  './js/qrcode.min.js',
  './favicon.svg',
  './favicon.png',
  './favicon-32x32.png',
  './favicon-16x16.png',
  './apple-touch-icon.png',
  './android-chrome-192x192.png',
  './android-chrome-512x512.png',
  './img/kliko_logo_clean.png',
  './img/kliko_emblem.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Cachear cada recurso de forma resiliente para evitar fallos globales
      const cachePromises = ASSETS_TO_CACHE.map((url) => {
        return cache.add(url).catch((err) => {
          console.warn(`[KLIKO SW] Error cacheando ${url}:`, err);
        });
      });
      return Promise.all(cachePromises);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Solo interceptar peticiones GET dentro del mismo origen
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    // ignoreSearch: true permite que 'styles.css?v=...' coincida con 'styles.css' en caché
    caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
      if (cachedResponse) {
        // En segundo plano revalidar con la red
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse);
            });
          }
        }).catch(() => {});
        return cachedResponse;
      }
      
      // Si no estaba en caché, pedir a la red y guardar en caché si es exitoso
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && event.request.url.startsWith(self.location.origin)) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Si la red falla por estar sin conexión o servidor detenido, reintentar caché ignorando parámetros
        return caches.match(event.request, { ignoreSearch: true });
      });
    })
  );
});
