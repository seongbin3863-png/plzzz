const SHELL_CACHE = 'eungwonmap-shell-v1';
const RUNTIME_CACHE = 'eungwonmap-runtime-v1';

const SHELL_URLS = [
  '/',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== SHELL_CACHE && key !== RUNTIME_CACHE).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// 네트워크 우선, 실패 시 캐시로 폴백 — 오프라인에서도 최근에 본 화면(앱 셸)이 뜨도록 함
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || !request.url.startsWith(self.location.origin)) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, response.clone()));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('/')))
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, response.clone()));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
