const CACHE_NAME = 'cache-v1';
const urlsToCache = [
  "/index.html",
  "/restaurant.html",
  "/css/styles.css",
  "/data/restaurants.json",
  "/img/1.jpg",
  "/img/2.jpg",
  "/img/3.jpg",
  "/img/4.jpg",
  "/img/5.jpg",
  "/img/6.jpg",
  "/img/7.jpg",
  "/img/8.jpg",
  "/img/9.jpg",
  "/img/10.jpg",
  "/js/main.js",
  "/js/restaurant_info.js",
  "/js/dbhelper.js",
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) { return response }

        // Clone the request. A request is a stream and
        // can only be consumed once.
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then(response => {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response. A response is a stream and
            // can only be consumed once.
            const responseClone = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseClone);
              });

            return response;
          });
      })
  );
});
