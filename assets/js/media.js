document.addEventListener("DOMContentLoaded", () => {
  const tiles = Array.from(document.querySelectorAll(".media-tile"));
  const projectFilter = document.querySelector("#gallery-project");
  const typeFilter = document.querySelector("#gallery-type");
  const count = document.querySelector(".gallery-count");
  const empty = document.querySelector(".gallery-empty");
  const viewer = document.querySelector(".media-viewer");
  if (!viewer) return;
  const stage = viewer.querySelector(".viewer-stage");
  const caption = viewer.querySelector(".viewer-caption");
  const projectLink = viewer.querySelector(".viewer-project");
  let activeLink = null;

  function filter() {
    const project = projectFilter?.value || "all";
    const type = typeFilter?.value || "all";
    let visible = 0;
    for (const tile of tiles) {
      tile.hidden = !(project === "all" || tile.dataset.project === project) || !(type === "all" || tile.dataset.type === type);
      if (!tile.hidden) visible++;
    }
    if (count) count.textContent = `${visible} item${visible === 1 ? "" : "s"}`;
    if (empty) empty.hidden = visible !== 0;
    if (projectFilter) {
      const url = new URL(window.location.href);
      if (project === "all") url.searchParams.delete("project");
      else url.searchParams.set("project", project);
      history.replaceState(null, "", url);
    }
  }

  if (projectFilter) {
    const requested = new URLSearchParams(window.location.search).get("project");
    if (Array.from(projectFilter.options).some((option) => option.value === requested)) projectFilter.value = requested;
    projectFilter.addEventListener("change", filter);
    typeFilter.addEventListener("change", filter);
    projectFilter.closest("form").addEventListener("submit", (event) => event.preventDefault());
    filter();
  }

  function visibleLinks() {
    return tiles.filter((tile) => !tile.hidden).map((tile) => tile.querySelector(".media-open"));
  }

  function show(link) {
    activeLink = link;
    stage.replaceChildren();
    const isVideo = link.dataset.type === "video";
    const element = document.createElement(isVideo ? "video" : "img");
    element.src = link.href;
    if (isVideo) {
      element.controls = true;
      element.playsInline = true;
      element.preload = "metadata";
      element.poster = link.dataset.poster;
    } else {
      element.alt = link.dataset.caption;
    }
    stage.append(element);
    const links = visibleLinks();
    caption.textContent = `${link.dataset.caption} ${links.indexOf(link) + 1} of ${links.length}`;
    projectLink.hidden = !link.dataset.projectUrl;
    projectLink.href = link.dataset.projectUrl || "#";
    projectLink.textContent = link.dataset.label;
    if (!viewer.open) {
      viewer.showModal();
      document.body.classList.add("viewer-open");
    }
  }

  function move(direction) {
    const links = visibleLinks();
    if (links.length) show(links[(links.indexOf(activeLink) + direction + links.length) % links.length]);
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest(".media-open");
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || typeof viewer.showModal !== "function") return;
    event.preventDefault();
    show(link);
  });
  viewer.querySelector(".viewer-close").addEventListener("click", () => viewer.close());
  viewer.querySelector(".viewer-prev").addEventListener("click", () => move(-1));
  viewer.querySelector(".viewer-next").addEventListener("click", () => move(1));
  viewer.addEventListener("click", (event) => {
    if (event.target === viewer) {
      const rect = viewer.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) viewer.close();
    }
  });
  viewer.addEventListener("close", () => {
    stage.replaceChildren();
    document.body.classList.remove("viewer-open");
    activeLink?.focus({ preventScroll: true });
  });
  viewer.addEventListener("keydown", (event) => {
    if (event.target.tagName === "VIDEO") return;
    if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
    if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
  });
});
