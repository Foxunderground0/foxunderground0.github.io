(function () {
  const prefetchedPages = new Set();

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator) || window.location.protocol === "file:") return;
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }

  function prefetchInternalPage(anchor) {
    const href = anchor.getAttribute("href");
    if (!href || href.startsWith("#") || href.endsWith(".pdf") || href === "LICENSE") return;

    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return;

    if (prefetchedPages.has(url.href)) return;
    prefetchedPages.add(url.href);

    const prefetch = document.createElement("link");
    prefetch.rel = "prefetch";
    prefetch.as = "document";
    prefetch.href = href;
    document.head.append(prefetch);
  }

  document.addEventListener("pointerover", (event) => {
    const anchor = event.target.closest("a[href]");
    if (anchor) prefetchInternalPage(anchor);
  }, { passive: true });

  document.addEventListener("focusin", (event) => {
    const anchor = event.target.closest("a[href]");
    if (anchor) prefetchInternalPage(anchor);
  });

  window.addEventListener("load", () => {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(registerServiceWorker, { timeout: 2500 });
    } else {
      window.setTimeout(registerServiceWorker, 750);
    }
  });
})();
