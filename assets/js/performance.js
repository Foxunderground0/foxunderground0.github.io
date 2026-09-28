(function () {
  const prefetchedPages = new Set();
  const mobileRouteKey = "hide-profile-on-next-page";

  function isMobileLayout() {
    return window.matchMedia("(max-width: 760px)").matches;
  }

  function isInternalPageLink(anchor) {
    const href = anchor.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.endsWith(".pdf") || href === "LICENSE") return false;
    const url = new URL(href, window.location.href);
    return url.origin === window.location.origin && /\.html$/.test(url.pathname);
  }

  function positionBelowMobileProfile() {
    if (!isMobileLayout() || window.location.hash || sessionStorage.getItem(mobileRouteKey) !== "1") return;
    sessionStorage.removeItem(mobileRouteKey);
    const navigation = document.querySelector(".site-header");
    if (!navigation) return;
    window.requestAnimationFrame(() => window.scrollTo({ top: navigation.offsetTop, left: 0, behavior: "auto" }));
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator) || window.location.protocol === "file:") return;
    if (navigator.storage?.persist) navigator.storage.persist().catch(() => false);
    const siteRoot = document.querySelector('meta[name="site-root"]')?.content || "./";
    const serviceWorkerUrl = new URL("sw.js", new URL(siteRoot, document.baseURI));
    const requestPreload = () => navigator.serviceWorker.controller?.postMessage({ type: "PRELOAD_SITE_CONTENT" });
    navigator.serviceWorker.addEventListener("controllerchange", requestPreload);
    navigator.serviceWorker.register(serviceWorkerUrl)
      .then(() => navigator.serviceWorker.ready)
      .then((registration) => registration.active?.postMessage({ type: "PRELOAD_SITE_CONTENT" }))
      .catch(() => {});
  }

  function prefetchInternalPage(anchor) {
    const href = anchor.getAttribute("href");
    if (!href || href.startsWith("#") || href.endsWith(".pdf") || href === "LICENSE") return;

    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin || !/\.html$/.test(url.pathname)) return;

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

  document.addEventListener("click", (event) => {
    if (!isMobileLayout() || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = event.target.closest("a[href]");
    if (anchor && isInternalPageLink(anchor)) sessionStorage.setItem(mobileRouteKey, "1");
  });

  document.addEventListener("DOMContentLoaded", positionBelowMobileProfile);

  registerServiceWorker();
})();
