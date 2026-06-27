// Minimal service worker: cache the app shell so the page opens offline and
// installs as a PWA. The TensorFlow.js model + CDN libs are fetched network-
// first (they need the network on first run, then the browser HTTP-caches them).
const CACHE = "lod-v2";
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
  if (url.origin !== location.origin) return; // CDN/model weights: browser handles + HTTP-caches

  // HTML document: network-first so a redeploy shows up immediately; fall back
  // to cache when offline.
  if (e.request.mode === "navigate" || url.pathname.endsWith("/") || url.pathname.endsWith("index.html")) {
    e.respondWith(
      fetch(e.request)
        .then((r) => { const c = r.clone(); caches.open(CACHE).then((ca) => ca.put(e.request, c)); return r; })
        .catch(() => caches.match(e.request).then((r) => r || caches.match("index.html")))
    );
    return;
  }
  // other shell assets (manifest, icons): cache-first
  e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
});
