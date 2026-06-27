// Minimal service worker: cache the app shell so the page opens offline and
// installs as a PWA. The TensorFlow.js model + CDN libs are fetched network-
// first (they need the network on first run, then the browser HTTP-caches them).
const CACHE = "lod-v1";
const SHELL = [
  ".",
  "index.html",
  "manifest.webmanifest",
  "icons/icon-192.png",
  "icons/icon-512.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (url.origin === location.origin) {
    // app shell: cache-first
    e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
  }
  // cross-origin (CDN, model weights): let the browser handle + HTTP-cache it
});
