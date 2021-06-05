const appCacheName = `app-${TIME}`;
const appCacheUrls = [
    '/build/bundle.css',
    '/build/bundle.js',
    '/icons/logo-192.png',
    '/icons/logo-512.png',
    '/manifest.webmanifest',
    '/',
];
const allowedCaches = [appCacheName];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(appCacheName)
            .then(cache => cache.addAll(appCacheUrls))
    );
});

if (PRODUCTION)
    self.addEventListener('fetch', event => {
        event.respondWith(
            caches.match(event.request)
                .then(response =>  response || fetch(event.request))
        );
    });

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames =>
            Promise.all(
                cacheNames.map(cacheName => {
                    if (allowedCaches.indexOf(cacheName) === -1)
                        return caches.delete(cacheName);
                })
            )
        )
    );
});
