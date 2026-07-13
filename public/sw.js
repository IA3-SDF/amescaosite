// Service Worker pour PWA
const CACHE_NAME = "amescao-v1";
const URLS_TO_CACHE = [
  "/",
  "/home",
  "/events",
  "/albums",
  "/contact",
  "/support",
  "/AMESCAO.PrincipalLogoIcon.svg",
];

// Installation du service worker
self.addEventListener("install", (event) => {
  console.log("[SW] Installation en cours...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Cache ouvert");
      return cache.addAll(URLS_TO_CACHE).catch((err) => {
        console.warn("[SW] Erreur lors de la mise en cache:", err);
        // Continue même si certaines ressources échouent
        return Promise.resolve();
      });
    }),
  );
  self.skipWaiting();
});

// Activation du service worker
self.addEventListener("activate", (event) => {
  console.log("[SW] Activation en cours...");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("[SW] Suppression de l'ancien cache:", cacheName);
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
  self.clients.claim();
});

// Stratégie de récupération: Network First, fallback to Cache
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Ignorer les requêtes non-GET
  if (request.method !== "GET") {
    return;
  }

  // Ignorer les requêtes vers des domaines externes
  if (!request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Ne mettre en cache que les réponses réussies
        if (!response || response.status !== 200) {
          return response;
        }

        // Cloner la réponse
        const responseToCache = response.clone();

        // Mettre en cache en arrière-plan
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });

        return response;
      })
      .catch(() => {
        // En cas d'erreur réseau, récupérer du cache
        return caches.match(request).then((response) => {
          if (response) {
            return response;
          }
          // Retourner une page offline si disponible
          if (request.destination === "document") {
            return caches.match("/");
          }
        });
      }),
  );
});

// Mise à jour du service worker
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
