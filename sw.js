// Service Worker para KLIKO (PWA Oficial de Orcera)
const CACHE_NAME = 'kliko-cache-v5';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  './',
  './index.html',
  'manual.html',
  'manifest.json',
  'css/styles.css',
  'js/app.js',
  'js/data-ejes.js',
  'js/supabase-client.js',
  'js/qrcode.min.js',
  'favicon.svg',
  'favicon.png',
  'favicon-32x32.png',
  'favicon-16x16.png',
  'apple-touch-icon.png',
  'android-chrome-192x192.png',
  'android-chrome-512x512.png',
  'img/kliko_logo_clean.png',
  'img/kliko_emblem.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
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
  if (event.request.method !== 'GET') return;

  // Intercepción especial para navegación (abrir la PWA / recargar página)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(async () => {
          // Si no hay conexión o falla la red, servir la app desde la caché
          const cached = await caches.match(event.request, { ignoreSearch: true });
          if (cached) return cached;
          const fallback = await caches.match('/index.html', { ignoreSearch: true }) ||
                           await caches.match('./index.html', { ignoreSearch: true }) ||
                           await caches.match('/', { ignoreSearch: true }) ||
                           await caches.match('./', { ignoreSearch: true });
          return fallback;
        })
    );
    return;
  }

  // Intercepción para recursos estáticos (CSS, JS, imágenes, fuentes)
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
      if (cachedResponse) {
        // En segundo plano busca actualizar la caché si hay red
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse);
            });
          }
        }).catch(() => {});
        return cachedResponse;
      }

      // Si no estaba en caché, pedir a la red
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && event.request.url.startsWith(self.location.origin)) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        return caches.match(event.request, { ignoreSearch: true });
      });
    })
  );
});
