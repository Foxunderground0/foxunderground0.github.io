const CACHE_NAME = "umer-irfan-site-v26";
const CORE_ASSETS = ["./assets/css/styles.css", "./assets/js/performance.js"];
let speculativePage = null;

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) => Promise.all(
      names.filter((name) => name.startsWith("umer-irfan-site-") && name !== CACHE_NAME).map((name) => caches.delete(name))
    ))
  );
  self.clients.claim();
});

self.addEventListener("message", (event) => {
  const message = event.data || {};
  if (message.type === "CANCEL_PREFETCH") {
    if (!message.url || speculativePage?.url === message.url) speculativePage?.controller.abort();
    return;
  }
  if (message.type === "PREFETCH_PAGE") event.waitUntil(prefetchOnePage(message.url));
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    if (speculativePage?.url === url.href) speculativePage.controller.abort();
    event.respondWith(serveNavigation(request, url));
    return;
  }

  // Stream videos directly. Never wait for a full video to be cached before playback.
  if (url.pathname.toLowerCase().endsWith(".mp4")) {
    event.respondWith(fetch(request));
    return;
  }

  event.respondWith(serveAsset(request, url));
});

async function serveNavigation(request, url) {
  const cache = await caches.open(CACHE_NAME);
  return (await cache.match(url.href)) || fetch(request);
}

async function serveAsset(request, url) {
  if (request.headers.has("range")) return fetch(request);
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(url.href);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok && response.status === 200) cache.put(url.href, response.clone()).catch(() => {});
  return response;
}

async function prefetchOnePage(rawUrl) {
  let url;
  try { url = new URL(rawUrl); } catch { return; }
  if (url.origin !== self.location.origin || !/\.html$/.test(url.pathname)) return;

  speculativePage?.controller.abort();
  const task = { url: url.href, controller: new AbortController() };
  speculativePage = task;
  try {
    const cache = await caches.open(CACHE_NAME);
    if (await cache.match(task.url)) return;
    const response = await fetch(task.url, { credentials: "same-origin", signal: task.controller.signal });
    if (response.ok && response.status === 200) await cache.put(task.url, response);
  } catch (error) {
    if (error.name !== "AbortError") console.warn("Could not prefetch next page", task.url, error);
  } finally {
    if (speculativePage === task) speculativePage = null;
  }
}
