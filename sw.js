const CACHE = '3dream-v3';
const FILES = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];
const CDN = [
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.4',
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.4/chart.umd.min.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c =>
      c.addAll(FILES)
        // los CDN se cachean si se puede, pero un fallo no bloquea la instalación
        .then(() => Promise.allSettled(CDN.map(u => c.add(u))))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      if (e.request.method === 'GET' && res.ok) {
        const clon = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clon));
      }
      return res;
    }))
  );
});
