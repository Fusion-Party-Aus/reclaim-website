const VALID_BRANCH_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function createServiceWorkerScript(branch: string): string {
  if (!VALID_BRANCH_SLUG.test(branch)) {
    throw new Error(`Invalid service worker branch slug: ${branch}`)
  }

  return `const CACHE_NAME = 'fusion-${branch}-v1';
const CACHE_PREFIX = 'fusion-${branch}-';
const OFFLINE_URL = '/offline';
const PRECACHE_ASSETS = ['/', '/offline', '/solo-full-colour.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
      .catch((error) => caches.delete(CACHE_NAME).then(() => { throw error; }))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => Promise.all(
        cacheNames
          .filter((cacheName) => cacheName.startsWith(CACHE_PREFIX) && cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
        }
        return response;
      })
      .catch(() => caches.open(CACHE_NAME).then((cache) => cache.match(event.request)).then((cached) => {
        if (cached) return cached;
        if (event.request.mode === 'navigate') {
          return caches.open(CACHE_NAME)
            .then((cache) => cache.match(OFFLINE_URL))
            .then((offline) => offline || new Response('Offline', { status: 503 }));
        }
        return new Response('Offline', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({ 'Content-Type': 'text/plain' })
        });
      }))
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    event.waitUntil(self.skipWaiting().catch((error) => console.error('skipWaiting failed:', error)));
  }
});
`
}
