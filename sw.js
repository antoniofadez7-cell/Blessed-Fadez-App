const CACHE = "blessedfadez-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
  "./sw.js",
  "./cut_1.jpeg","./cut_2.jpeg","./cut_3.jpeg","./cut_4.jpeg","./cut_5.jpeg",
  "./cut_6.jpeg","./cut_7.jpeg","./cut_8.jpeg","./cut_9.jpeg","./cut_10.jpeg"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => (k !== CACHE ? caches.delete(k) : null))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request).catch(() => caches.match("./")))
  );
});
