// NyaySwarm Service Worker v1.0
// Handles: offline caching, background sync, install prompt

const CACHE_NAME = "nyayswarm-v1";
const OFFLINE_URL = "/offline.html";

// Assets to cache immediately on install (app shell)
const PRECACHE_ASSETS = [
  "/",
  "/index.html",
  "/offline.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

// ── INSTALL: cache app shell ──────────────────────────────
self.addEventListener("install", (event) => {
  console.log("[NyaySwarm SW] Installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => {
      console.log("[NyaySwarm SW] App shell cached");
      return self.skipWaiting(); // activate immediately
    })
  );
});

// ── ACTIVATE: clean old caches ────────────────────────────
self.addEventListener("activate", (event) => {
  console.log("[NyaySwarm SW] Activating...");
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => {
            console.log("[NyaySwarm SW] Deleting old cache:", key);
            return caches.delete(key);
          })
      )
    ).then(() => self.clients.claim()) // take control immediately
  );
});

// ── FETCH: smart caching strategy ─────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Skip API calls to backend — always need fresh data
  if (url.port === "8000" || url.hostname === "127.0.0.1" && url.port === "8000") return;

  // Skip Supabase API calls
  if (url.hostname.includes("supabase.co")) return;

  // Skip external CDN (fonts, etc) — let them handle their own cache
  if (!url.origin.includes(self.location.origin) &&
      !url.hostname.includes("fonts.googleapis.com") &&
      !url.hostname.includes("fonts.gstatic.com")) return;

  // For navigation requests (page loads): network first, fallback to cache, then offline page
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache fresh navigation responses
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() =>
          caches.match(request)
            .then((cached) => cached || caches.match(OFFLINE_URL))
        )
    );
    return;
  }

  // For static assets (JS, CSS, images, fonts): cache first, network fallback
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request)
        .then((response) => {
          // Only cache successful responses
          if (!response || response.status !== 200 || response.type === "error") {
            return response;
          }
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => {
          // Return placeholder for failed image requests
          if (request.destination === "image") {
            return new Response(
              '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><text y="30" font-size="30">⚖</text></svg>',
              { headers: { "Content-Type": "image/svg+xml" } }
            );
          }
        });
    })
  );
});

// ── BACKGROUND SYNC: retry failed queries ─────────────────
self.addEventListener("sync", (event) => {
  if (event.tag === "retry-query") {
    event.waitUntil(retryFailedQueries());
  }
});

async function retryFailedQueries() {
  // In a full implementation, retrieve pending queries from IndexedDB
  // and retry them when back online
  console.log("[NyaySwarm SW] Retrying failed queries...");
}

// ── PUSH NOTIFICATIONS (future feature) ───────────────────
self.addEventListener("push", (event) => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title || "NyaySwarm", {
      body: data.body || "Your legal document is ready",
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-72.png",
      data: { url: data.url || "/" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || "/")
  );
});

console.log("[NyaySwarm SW] Service worker loaded");
