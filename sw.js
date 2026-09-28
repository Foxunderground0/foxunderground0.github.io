const CACHE_NAME = "umer-irfan-site-v7";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./projects.html",
  "./gallery.html",
  "./project.html",
  "./404.html",
  "./robots.txt",
  "./sitemap.xml",
  "./preload-manifest.json",
  "./LICENSE",
  "./assets/css/styles.css",
  "./assets/images/profile.webp",
  "./assets/js/data.js",
  "./assets/js/render.js",
  "./assets/js/site.js",
  "./assets/js/projects.js",
  "./assets/js/project.js",
  "./assets/js/media.js",
  "./assets/js/performance.js"
];
const fullRequests = new Map();
let preloadTask = null;

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)))
    )
  );
  self.clients.claim();
});

self.addEventListener("message", (event) => {
  if (event.data?.type !== "PRELOAD_SITE_CONTENT") return;
  preloadTask ||= preloadAllContent().finally(() => { preloadTask = null; });
  event.waitUntil(preloadTask);
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
          return response;
        })
        .catch(async () => (await caches.match(request, { ignoreSearch: true })) || caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(serveCachedOrFetch(request, url));
});

async function serveCachedOrFetch(request, url) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(url.href);
  const range = request.headers.get("range");
  if (cached) return range ? responseForRange(cached, range) : cached;

  if (range) {
    const startup = await cache.match(startupCacheKey(url.href));
    if (startup) {
      const partial = await responseForStartupRange(startup, range);
      if (partial) return partial;
    }
    return fetch(request);
  }
  return fetchAndCache(url.href, request);
}

async function fetchAndCache(url, request = new Request(url, { credentials: "same-origin" })) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(url);
  if (cached) return cached;
  if (fullRequests.has(url)) {
    const pendingResponse = await fullRequests.get(url);
    if (pendingResponse) return pendingResponse.clone();
    const warmed = await cache.match(url);
    if (warmed) return warmed;
  }

  const pending = (async () => {
    const response = await fetch(request);
    if (response.ok && response.status === 200) {
      try {
        await cache.put(url, response.clone());
      } catch (error) {
        console.warn("Could not cache site resource", url, error);
      }
    }
    return response;
  })().finally(() => fullRequests.delete(url));
  fullRequests.set(url, pending);
  return (await pending).clone();
}

async function preloadOne(url) {
  const cache = await caches.open(CACHE_NAME);
  if (await cache.match(url)) {
    if (url.toLowerCase().endsWith(".mp4")) await cache.delete(startupCacheKey(url));
    return;
  }
  if (fullRequests.has(url)) {
    try {
      await fullRequests.get(url);
    } catch {}
    if (await cache.match(url)) {
      if (url.toLowerCase().endsWith(".mp4")) await cache.delete(startupCacheKey(url));
      return;
    }
  }

  for (let attempt = 0; attempt < 2; attempt++) {
    const pending = (async () => {
      const response = await fetch(url, { credentials: "same-origin" });
      if (!response.ok || response.status !== 200) throw new Error(`Preload returned ${response.status}`);
      // Consume the response directly. Cloning an unused video stream can retain it in memory.
      await cache.put(url, response);
    })();
    fullRequests.set(url, pending);
    try {
      await pending;
      if (url.toLowerCase().endsWith(".mp4")) await cache.delete(startupCacheKey(url));
      return;
    } catch (error) {
      if (attempt === 1) throw error;
    } finally {
      if (fullRequests.get(url) === pending) fullRequests.delete(url);
    }
  }
}

async function responseForRange(response, rangeHeader) {
  const blob = await response.blob();
  const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader);
  if (!match || (!match[1] && !match[2])) {
    return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${blob.size}` } });
  }

  const suffixLength = match[1] ? null : Number(match[2]);
  const start = match[1] ? Number(match[1]) : Math.max(0, blob.size - suffixLength);
  const requestedEnd = match[2] && match[1] ? Number(match[2]) : blob.size - 1;
  if (start >= blob.size || requestedEnd < start) {
    return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${blob.size}` } });
  }

  const end = Math.min(requestedEnd, blob.size - 1);
  const part = blob.slice(start, end + 1, blob.type);
  const headers = new Headers(response.headers);
  headers.set("Accept-Ranges", "bytes");
  headers.set("Content-Range", `bytes ${start}-${end}/${blob.size}`);
  headers.set("Content-Length", String(part.size));
  headers.delete("Content-Encoding");
  return new Response(part, { status: 206, statusText: "Partial Content", headers });
}

function startupCacheKey(url) {
  const key = new URL(url);
  key.searchParams.set("__startup_buffer", "10s");
  return key.href;
}

async function responseForStartupRange(response, rangeHeader) {
  const blob = await response.blob();
  const total = Number(response.headers.get("x-preload-total")) || blob.size;
  const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader);
  if (!match || (!match[1] && !match[2])) return null;

  const start = match[1] ? Number(match[1]) : Math.max(0, total - Number(match[2]));
  const requestedEnd = match[2] && match[1] ? Number(match[2]) : total - 1;
  if (start >= blob.size || requestedEnd < start) return null;

  const end = Math.min(requestedEnd, blob.size - 1);
  const part = blob.slice(start, end + 1, blob.type);
  const headers = new Headers(response.headers);
  headers.set("Accept-Ranges", "bytes");
  headers.set("Content-Range", `bytes ${start}-${end}/${total}`);
  headers.set("Content-Length", String(part.size));
  headers.delete("Content-Encoding");
  headers.delete("X-Preload-Total");
  return new Response(part, { status: 206, statusText: "Partial Content", headers });
}

async function preloadAllContent() {
  let manifest;
  try {
    const response = await fetch(new URL("preload-manifest.json", self.registration.scope));
    if (!response.ok) throw new Error(`Preload manifest returned ${response.status}`);
    manifest = await response.json();
  } catch (error) {
    console.warn("Could not read preload manifest", error);
    return;
  }

  const absolute = manifest.assets.map((file) => new URL(file, self.registration.scope).href);
  const startupRanges = manifest.videoStartup.map((item) => ({ ...item, url: new URL(item.url, self.registration.scope).href }));
  const videos = absolute.filter((url) => url.toLowerCase().endsWith(".mp4"));
  const other = absolute.filter((url) => !url.toLowerCase().endsWith(".mp4"));
  const total = absolute.length + startupRanges.length;
  let finished = 0;
  let failed = 0;

  async function preloadVideoStart(item) {
    const cache = await caches.open(CACHE_NAME);
    if (await cache.match(item.url) || await cache.match(startupCacheKey(item.url))) {
      finished++;
      return;
    }
    try {
      const response = await fetch(item.url, {
        credentials: "same-origin",
        headers: { Range: `bytes=0-${item.bytes - 1}` }
      });
      if (response.status === 200) {
        await cache.put(item.url, response);
      } else if (response.status === 206) {
        const range = response.headers.get("content-range") || "";
        const totalMatch = /\/(\d+)$/.exec(range);
        const headers = new Headers(response.headers);
        headers.delete("Content-Range");
        headers.delete("Content-Encoding");
        headers.set("Accept-Ranges", "bytes");
        headers.set("X-Preload-Total", String(item.size || Number(totalMatch?.[1]) || item.bytes));
        const buffered = new Response(response.body, { status: 200, headers });
        await cache.put(item.bytes >= item.size ? item.url : startupCacheKey(item.url), buffered);
      } else {
        throw new Error(`Video buffer request returned ${response.status}`);
      }
    } catch (error) {
      failed++;
      console.warn("Could not preload video startup buffer", item.url, error);
    }
    finished++;
  }

  async function fillPool(queue, workerCount) {
    let next = 0;
    const workers = Array.from({ length: Math.min(workerCount, queue.length) }, async () => {
      while (next < queue.length) {
        const url = queue[next++];
        try {
          await preloadOne(url);
        } catch (error) {
          failed++;
          console.warn("Could not preload site resource", url, error);
        }
        finished++;
      }
    });
    await Promise.all(workers);
  }

  // Start each video's first ten seconds concurrently while images and documents warm in parallel.
  const otherAssetsTask = fillPool(other, 12);
  await Promise.all(startupRanges.map(preloadVideoStart));
  await Promise.all([otherAssetsTask, fillPool(videos, videos.length)]);
  const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
  for (const client of clients) client.postMessage({ type: "SITE_CONTENT_PRELOADED", total, finished, failed });
}
