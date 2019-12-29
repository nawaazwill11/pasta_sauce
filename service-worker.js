const CACHE_NAME = 'pom-v-100';
const FILES_TO_CACHE = [
    '/',
    '/img/app-icon.svg',
    '/img/ham-white.svg',
    '/img/cross-white.svg',
    '/img/start.svg',
    '/img/stop.svg',
    '/img/pause.svg',
    'https://fonts.googleapis.com/css?family=Merienda+One&display=swap'
];
self.addEventListener('install', (event) => {
    console.log('[ServiceWorker] Installing');
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            console.log('Opened cache', CACHE_NAME);
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
        .then(function (response) {
            if (response) {
                console.log('Found ', event.request.url, ' in cache');
                return response;
            }
            return fetch(event.request)
            .then(function (response) {
                if (!response || response.status !== 200 || response.type !=='basic') {
                    return response;
                }
                let responseToCache = response.clone();
                caches.open(CACHE_NAME)
                .then(cache => {
                    cache.put(event.request, responseToCache);
                })
                return response;
            })
        })
    );
});
self.addEventListener('activate', (event) => {
    let cacheKeepList = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then((keyList) => {
          return Promise.all(keyList.map((key) => {
            if (cacheKeepList.indexOf(key) === -1) {
              console.log('[ServiceWorker] Removing old cache', key);
              return caches.delete(key);
            }
          }));
        })
    );
});