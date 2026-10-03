const CACHE_NAME = "chefhub-mobile-v1";
const APP_FILES = [
  "./", "./index.html", "./styles.css", "./app.js", "./manifest.webmanifest",
  "./assets/icon-192.png", "./assets/icon-512.png", "./assets/icon-180.png",
  "./assets/chefhub-brand.jpeg", "./assets/delivery-truck.png",
  "./assets/product-range.png", "./assets/product-fridge.png", "./assets/product-utensils.png",
  "./assets/product-griddle.png", "./assets/product-display.png", "./assets/product-mixer.png"
];
self.addEventListener("install", event => event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_FILES)).then(() => self.skipWaiting())));
self.addEventListener("activate", event => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    const copy = response.clone();
    caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match("./"))));
});
