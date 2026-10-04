document.addEventListener("DOMContentLoaded", () => {
  const list = document.querySelector("#project-list");
  const entries = Array.from(list.querySelectorAll(".project-entry"));
  const count = document.querySelector("#result-count");
  const search = document.querySelector("#project-search");
  const filters = document.querySelector("#category-filters");
  const empty = document.querySelector("#empty-state");
  const categories = ["All", ...new Set(entries.map((entry) => entry.dataset.category))];
  const requestedCategory = new URLSearchParams(window.location.search).get("category");
  let activeCategory = categories.includes(requestedCategory) ? requestedCategory : "All";

  filters.innerHTML = categories
    .map((category) => `<button class="filter-button${category === activeCategory ? " active" : ""}" type="button" aria-pressed="${category === activeCategory}" data-category="${category}">${category}</button>`)
    .join("");

  function render() {
    const query = search.value.trim().toLowerCase();
    let visibleCount = 0;

    for (const entry of entries) {
      const categoryMatch = activeCategory === "All" || entry.dataset.category === activeCategory;
      const searchMatch = query.split(/\s+/).every((term) => entry.dataset.search.includes(term));
      entry.hidden = !(categoryMatch && searchMatch);
      if (!entry.hidden) visibleCount += 1;
    }

    for (const group of list.querySelectorAll(".professional-project-group")) {
      group.hidden = !group.querySelector(".project-entry:not([hidden])");
    }

    count.textContent = `${visibleCount} project${visibleCount === 1 ? "" : "s"}`;
    empty.hidden = visibleCount !== 0;
  }

  filters.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-category]");
    if (!button) return;
    activeCategory = button.dataset.category;
    filters.querySelectorAll("button").forEach((item) => {
      item.classList.toggle("active", item === button);
      item.setAttribute("aria-pressed", String(item === button));
    });
    render();
  });

  search.addEventListener("input", render);
  render();
});
