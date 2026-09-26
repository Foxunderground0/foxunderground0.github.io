document.addEventListener("DOMContentLoaded", () => {
  const list = document.querySelector("#project-list");
  const count = document.querySelector("#result-count");
  const search = document.querySelector("#project-search");
  const filters = document.querySelector("#category-filters");
  const empty = document.querySelector("#empty-state");
  const categories = ["All", ...new Set(window.PROJECTS.map((project) => project.category))];
  const initialCategory = new URLSearchParams(window.location.search).get("category");
  let activeCategory = categories.includes(initialCategory) ? initialCategory : "All";
  const orderedProjects = window.PROJECTS
    .map((project, index) => ({ project, index }))
    .sort((a, b) => {
      const score = (item) => {
        const hasDocument = Boolean(item.project.documents?.length || item.project.document);
        const hasRepository = (item.project.links || []).some((link) => link.url.includes("github.com/"));
        return hasDocument ? 0 : hasRepository ? 1 : 2;
      };
      return score(a) - score(b) || a.index - b.index;
    })
    .map(({ project }) => project);

  filters.innerHTML = categories
    .map(
      (category) =>
        `<button class="filter-button${category === activeCategory ? " active" : ""}" type="button" data-category="${window.escapeHtml(category)}">${window.escapeHtml(category)}</button>`
    )
    .join("");

  function render() {
    const query = search.value.trim().toLowerCase();
    const visible = orderedProjects.filter((project) => {
      const categoryMatch = activeCategory === "All" || project.category === activeCategory;
      const haystack = [project.title, project.summary, project.category, project.status, ...project.tags]
        .join(" ")
        .toLowerCase();
      return categoryMatch && haystack.includes(query);
    });

    list.innerHTML = visible.map(window.projectCard).join("");
    count.textContent = `${visible.length} project${visible.length === 1 ? "" : "s"}`;
    empty.hidden = visible.length !== 0;
  }

  filters.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-category]");
    if (!button) return;
    activeCategory = button.dataset.category;
    filters.querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
    render();
  });

  search.addEventListener("input", render);
  render();
  window.revealElements();
});
