(function () {
  const mobileRouteKey = "hide-profile-on-next-page";
  let prefetchTimer = null;
  let pendingPrefetchUrl = null;
  let scrollFrame = 0;

  function initSkyScene() {
    if (document.querySelector(".pixel-sky")) return;
    const sky = document.createElement("div");
    sky.className = "pixel-sky";
    sky.setAttribute("aria-hidden", "true");

    const moon = document.createElement("span");
    moon.className = "pixel-moon";
    const moonRows = ["..####..", ".######.", "########", "########", "########", ".######.", "..####..", "...##..."];
    for (const row of moonRows) {
      for (const pixel of row) {
        const cell = document.createElement("span");
        if (pixel === "#") cell.className = "pixel-moon-lit";
        if (pixel === ".") cell.className = "pixel-moon-shade";
        moon.append(cell);
      }
    }
    sky.append(moon);

    const starPositions = [
      [5, 24], [11, 66], [17, 17], [23, 48], [29, 78], [35, 29],
      [41, 62], [47, 13], [53, 42], [59, 76], [65, 24], [71, 57],
      [77, 14], [83, 72], [89, 38], [95, 63], [8, 42], [38, 84],
      [68, 86], [91, 15]
    ];
    for (const [x, y] of starPositions) {
      const star = document.createElement("span");
      star.className = "pixel-star";
      star.style.left = `${x}%`;
      star.style.top = `${y}%`;
      star.style.animationDelay = `${((x * 7 + y * 3) % 29) / 10}s`;
      sky.append(star);
    }

    for (const cloudClass of ["pixel-cloud-one", "pixel-cloud-two", "pixel-cloud-three"]) {
      const cloud = document.createElement("span");
      cloud.className = `pixel-cloud ${cloudClass}`;
      sky.append(cloud);
    }
    document.body.insertBefore(sky, document.body.firstChild);
  }

  function initStickyHeader() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const update = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 72);
      scrollFrame = 0;
    };
    const onScroll = () => {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
  }

  function isMobileLayout() {
    return window.matchMedia("(max-width: 760px)").matches;
  }

  function isInternalPageLink(anchor) {
    const href = anchor.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.endsWith(".pdf") || href === "LICENSE") return false;
    const url = new URL(href, window.location.href);
    url.hash = "";
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
    const siteRoot = document.querySelector('meta[name="site-root"]')?.content || "./";
    const serviceWorkerUrl = new URL("sw.js", new URL(siteRoot, document.baseURI));
    navigator.serviceWorker.register(serviceWorkerUrl)
      .catch(() => {});
  }

  function prefetchInternalPage(anchor) {
    const href = anchor.getAttribute("href");
    if (!href || href.startsWith("#") || href.endsWith(".pdf") || href === "LICENSE") return;

    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin || !/\.html$/.test(url.pathname) || url.pathname === window.location.pathname) return;
    if (pendingPrefetchUrl === url.href) return;
    cancelPrefetch();
    pendingPrefetchUrl = url.href;
    prefetchTimer = window.setTimeout(() => {
      navigator.serviceWorker.controller?.postMessage({ type: "PREFETCH_PAGE", url: url.href });
      prefetchTimer = null;
    }, 250);
  }

  function cancelPrefetch() {
    if (prefetchTimer !== null) window.clearTimeout(prefetchTimer);
    prefetchTimer = null;
    if (pendingPrefetchUrl) navigator.serviceWorker.controller?.postMessage({ type: "CANCEL_PREFETCH", url: pendingPrefetchUrl });
    pendingPrefetchUrl = null;
  }

  document.addEventListener("pointerover", (event) => {
    const anchor = event.target.closest("a[href]");
    if (anchor) prefetchInternalPage(anchor);
  }, { passive: true });

  document.addEventListener("pointerout", (event) => {
    const anchor = event.target.closest("a[href]");
    if (anchor && !anchor.contains(event.relatedTarget)) cancelPrefetch();
  }, { passive: true });

  document.addEventListener("focusin", (event) => {
    const anchor = event.target.closest("a[href]");
    if (anchor) prefetchInternalPage(anchor);
  });

  document.addEventListener("focusout", (event) => {
    const anchor = event.target.closest("a[href]");
    if (anchor && !anchor.contains(event.relatedTarget)) cancelPrefetch();
  });

  document.addEventListener("click", (event) => {
    const anchor = event.target.closest("a[href]");
    if (!anchor || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    cancelPrefetch();
    if (isMobileLayout() && isInternalPageLink(anchor)) sessionStorage.setItem(mobileRouteKey, "1");
  });

  document.addEventListener("DOMContentLoaded", positionBelowMobileProfile);

  initSkyScene();
  initStickyHeader();
  registerServiceWorker();
})();
