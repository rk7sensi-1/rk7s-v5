const CACHE_NAME = 'spotify-pwa-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Instalação
self.addEventListener('install', event => {
  console.log('[SW] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Cache aberto');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[SW] Arquivos cacheados');
        return self.skipWaiting();
      })
      .catch(err => console.error('[SW] Erro ao cachear:', err))
  );
});

// Ativar
self.addEventListener('activate', event => {
  console.log('[SW] Ativando...');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Deletando cache antigo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('[SW] Servindo do cache:', event.request.url);
          return response;
        }
        console.log('[SW] Buscando da rede:', event.request.url);
        return fetch(event.request);
      })
      .catch(err => {
        console.error('[SW] Erro no fetch:', err);
        return caches.match('./index.html');
      })
  );
});
