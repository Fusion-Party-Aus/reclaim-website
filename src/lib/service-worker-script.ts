const VALID_BRANCH_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function createServiceWorkerScript(branch: string): string {
  if (!VALID_BRANCH_SLUG.test(branch)) {
    throw new Error(`Invalid service worker branch slug: ${branch}`)
  }

  return `const CACHE_NAME = 'fusion-${branch}-v2';
const CACHE_PREFIX = 'fusion-${branch}-';
const OFFLINE_URL = '/offline';
const PRECACHE_ASSETS = ['/', '/offline', '/solo-full-colour.svg'];
function isPublicResponse(response) {
  return response.status === 200 && !/private|no-store/i.test(response.headers.get('Cache-Control') || '') && !/noindex/i.test(response.headers.get('X-Robots-Tag') || '');
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => Promise.all(PRECACHE_ASSETS.map(async (asset) => {
        const response = await fetch(asset, { credentials: 'same-origin', cache: 'no-store' });
        if (isPublicResponse(response)) await cache.put(asset, response.clone());
      })))
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
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/') || url.pathname.startsWith('/preview') || url.searchParams.has('preview')) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (isPublicResponse(response)) {
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
