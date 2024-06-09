// Attempt to fix firefox image loading delay issues

const CACHE_NAME = 'image-cache-v1';
const imagesToCache = [
    '/images/hyperchill_gradients/blue-green-gradient.jpg',
    '/images/hyperchill_gradients/red-orange-gradient.jpg',
    '/images/hyperchill_gradients/lemon-lime-gradient.jpg',
    '/images/hyperchill_gradients/blue-purple-gradient.jpg',
    '/images/hyperchill_gradients/purple-pink-gradient.jpg',
    '/images/hyperchill_gradients/black-gradient.jpg',
    '/images/iStock/iStock-1253862403-mid-edit.jpg',
    '/images/iStock/iStock-1306875579-mid.jpg',
    '/images/iStock/iStock-1394258314-mid.jpg',
    '/images/iStock/iStock-1253862403-mid-orange.jpg',
    '/images/iStock/iStock-1306875579-mid-invert.jpg',
    '/images/iStock/iStock-1394258314-mid-green-pixelated.jpg',
    '/images/iStock/iStock-1253862403-small.jpg',
    '/images/iStock/iStock-1306875579-small.jpg',
    '/images/iStock/iStock-1394258314-small.jpg',
    '/images/iStock/iStock-1253862403-small-orange.jpg',
    '/images/iStock/iStock-1306875579-small-invert.jpg',
    '/images/iStock/iStock-1394258314-small-green-pixelated.jpg'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(imagesToCache);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).then(fetchResponse => {
                return caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, fetchResponse.clone());
                    return fetchResponse;
                });
            });
        })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
