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
    const moonPixels = Array.from({ length: 16 }, (_, y) =>
      Array.from({ length: 16 }, (_, x) => Math.hypot(x - 7.5, y - 7.5) <= 8 ? "#" : ".")
    );
    const craters = [
      [3, 10, "s"], [4, 9, "s"], [4, 10, "m"], [4, 11, "s"],
      [5, 4, "s"], [5, 5, "m"], [5, 6, "s"], [6, 4, "m"], [6, 5, "s"], [6, 6, "m"], [7, 5, "s"],
      [6, 10, "s"], [6, 11, "m"], [6, 12, "s"], [7, 10, "m"], [7, 11, "s"], [7, 12, "m"], [8, 10, "s"], [8, 11, "m"],
      [8, 4, "s"], [9, 4, "m"], [9, 5, "s"], [9, 6, "m"], [10, 5, "s"], [10, 6, "m"],
      [10, 10, "s"], [11, 9, "m"], [11, 10, "s"], [11, 11, "m"], [12, 10, "s"]
    ];
    for (const [row, column, shade] of craters) moonPixels[row][column] = shade;
    for (const row of moonPixels) {
      for (const pixel of row) {
        const cell = document.createElement("span");
        if (pixel === "#") cell.className = "pixel-moon-lit";
        if (pixel === "s") cell.className = "pixel-moon-soft";
        if (pixel === "m") cell.className = "pixel-moon-shade";
        moon.append(cell);
      }
    }
    sky.append(moon);

    const starPositions = [
      [5, 6], [14, 13], [23, 5], [32, 10], [41, 4], [51, 14],
      [62, 7], [73, 12], [82, 4], [95, 17],
      [7, 26], [19, 22], [36, 28], [58, 23], [78, 29], [92, 24],
      [3, 42], [12, 37], [88, 39], [97, 46],
      [5, 58], [15, 54], [86, 61], [94, 55],
      [2, 76], [11, 83], [89, 80], [98, 72]
    ];
    for (const [index, [x, y]] of starPositions.entries()) {
      const star = document.createElement("span");
      star.className = `pixel-star pixel-star-${["dot", "cross", "tiny", "spark"][index % 4]}`;
      if (y > 30) star.classList.add("pixel-star-low");
      star.style.setProperty("--star-x", `${x}%`);
      star.style.setProperty("--star-edge", x < 50 ? "4px" : "calc(100% - 6px)");
      star.style.top = `${y}%`;
      star.style.animationDelay = `${-((x * 7 + y * 3) % 29) / 10}s`;
      star.style.animationDuration = `${4 + (index % 5)}s`;
      sky.append(star);
    }

    for (const [x, y, delay, shape] of [[19, 8, 3, "short"], [72, 17, 11, "long"], [88, 29, 19, "medium"]]) {
      const shootingStar = document.createElement("span");
      shootingStar.className = `pixel-shooting-star shooting-star-${shape}`;
      shootingStar.style.left = `${x}%`;
      shootingStar.style.top = `${y}%`;
      shootingStar.style.animationDelay = `${delay}s`;
      sky.append(shootingStar);
    }

    const cloudLayers = [
      { name: "far", rate: .12, clouds: [[8, 14, 68, .4], [44, 8, 44, .35], [88, 37, 140, .12], [-5, 60, 180, .12]] },
      { name: "middle", rate: .06, clouds: [[18, 8, 54, .6], [63, 4, 40, .55], [94, 28, 100, .26], [5, 45, 126, .1], [26, 18, 78, .2]] },
      { name: "near", rate: .025, clouds: [[76, 17, 72, .3], [-9, 32, 150, .14], [89, 57, 160, .1], [4, 24, 116, .22]] }
    ];
    for (const [layerIndex, { name, rate, clouds }] of cloudLayers.entries()) {
      const layer = document.createElement("div");
      layer.className = `pixel-cloud-layer cloud-layer-${name}`;
      layer.dataset.parallaxRate = rate;
      for (const [index, [x, y, width, opacity]] of clouds.entries()) {
        const cloud = document.createElement("span");
        cloud.className = `pixel-cloud cloud-shape-${["wide", "wisp", "rounded"][(index + layerIndex) % 3]}`;
        cloud.style.left = `${x}%`;
        cloud.style.top = `${y}%`;
        cloud.style.width = `${width}px`;
        cloud.style.height = `${Math.round(width / 3)}px`;
        cloud.style.opacity = opacity;
        cloud.style.animationDelay = `${-Math.abs(x)}s`;
        if (name !== "far") {
          cloud.style.animationDuration = `${(name === "near" ? 12 : 20) + index * 3}s`;
          cloud.style.setProperty("--cloud-travel", `${(name === "near" ? 48 : 28) + index * 6}px`);
        }
        layer.append(cloud);
      }
      sky.append(layer);
    }
    document.body.insertBefore(sky, document.body.firstChild);

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      let frame = 0;
      const layers = [...sky.querySelectorAll(".pixel-cloud-layer")];
      const update = () => {
        const offset = Math.min(window.scrollY, sky.offsetHeight);
        for (const layer of layers) layer.style.setProperty("--cloud-offset", `${offset * Number(layer.dataset.parallaxRate)}px`);
        frame = 0;
      };
      window.addEventListener("scroll", () => {
        if (!frame) frame = window.requestAnimationFrame(update);
      }, { passive: true });
      update();
    }
  }

  function initStickyHeader() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const brand = header.querySelector(".wordmark");
    const profilePhoto = [...document.querySelectorAll(".profile-photo")].find((photo) => photo.getClientRects().length);
    const revealAt = profilePhoto
      ? profilePhoto.getBoundingClientRect().bottom + window.scrollY
      : header.getBoundingClientRect().bottom + window.scrollY;
    const update = () => {
      header.classList.toggle("is-stuck", header.getBoundingClientRect().top <= 0 && window.scrollY > 0);
      const showBrand = window.scrollY >= revealAt;
      header.classList.toggle("is-scrolled", showBrand);
      if (brand) {
        brand.tabIndex = showBrand ? 0 : -1;
        brand.setAttribute("aria-hidden", String(!showBrand));
      }
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
  const copyrightYear = document.querySelector("#year");
  if (copyrightYear) copyrightYear.textContent = new Date().getFullYear();
  registerServiceWorker();
})();
