self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(clients.claim());
});

self.addEventListener("fetch", (e) => {
  // A simple empty fetch handler is enough to satisfy the PWA criteria
  // for the browser to fire the beforeinstallprompt event.
});
