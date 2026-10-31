// Service worker for the installable reader and admin apps.
// Our own files: always try the network first (so a new version shows at once), fall back to the copy
// saved last time when offline. Versioned libraries from CDNs: saved copy first. Firebase data
// (Firestore, login) is never touched here, so book pages are never stored on the phone by this file.
const CACHE = "chemophile-v1";
const SHELL = [
  "read.html", "admin.html", "css/app.css", "js/chapters.js", "js/fb.js", "js/flipbook.js", "js/install.js",
  "js/firebase-config.js", "assets/logo/icon-192.png", "assets/logo/icon-512.png", "assets/logo/icon-96.png"
];
const CDN = ["www.gstatic.com", "cdn.jsdelivr.net", "cdnjs.cloudflare.com", "fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).catch(() => {}).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET") return;
  if (url.origin === location.origin) {
    e.respondWith(fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then(hit => hit || (req.mode === "navigate" ? caches.match("read.html") : Response.error()))));
    return;
  }
  if (CDN.includes(url.hostname) && (url.hostname !== "www.gstatic.com" || url.pathname.startsWith("/firebasejs/"))) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok || res.type === "opaque") { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    })));
  }
});
