const CACHE_VERSION = 'v1';
const SHELL_CACHE   = `thepour-shell-${CACHE_VERSION}`;
const ASSET_CACHE   = `thepour-assets-${CACHE_VERSION}`;

// Resources that form the app shell — always cached on install
const SHELL_URLS = [
  '/',
  '/manifest.json',
  '/apple-touch-icon.png',
];

// ── Install: cache the app shell ─────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then(cache => cache.addAll(SHELL_URLS))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: remove old caches ───────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== SHELL_CACHE && k !== ASSET_CACHE)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: routing strategy ───────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin requests (Supabase, Klaviyo, fonts, etc.)
  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  // Navigation requests → network first, fall back to cached shell
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() =>
          caches.match('/', { cacheName: SHELL_CACHE })
        )
    );
    return;
  }

  // Static assets (JS, CSS, images, fonts bundled with the app) → cache first
  if (
    url.pathname.startsWith('/static/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.startsWith('/splash/') ||
    /\.(png|ico|svg|woff2?|ttf)$/.test(url.pathname)
  ) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          if (!response.ok) return response;
          const clone = response.clone();
          caches.open(ASSET_CACHE).then(cache => cache.put(request, clone));
          return response;
        });
      })
    );
    return;
  }

  // Everything else → network only
});
