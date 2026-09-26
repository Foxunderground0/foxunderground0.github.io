(function () {
  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function projectCard(project) {
    return `
      <article class="project-entry">
        <div>
          <div class="project-title-line">
            <h3><a href="projects/${encodeURIComponent(project.id)}.html">${escapeHtml(project.shortTitle || project.title)}</a></h3>
            ${artifactIcons(project)}
          </div>
          <p>${escapeHtml(project.summary)}</p>
          <p class="project-tags">${project.tags.slice(0, 4).map(escapeHtml).join(" · ")}</p>
        </div>
        <div class="project-entry-meta">${escapeHtml(project.year)}<br>${escapeHtml(project.category)}</div>
      </article>`;
  }

  function artifactIcons(project) {
    const document = project.documents?.[0]?.url || project.document;
    const repository = (project.links || []).find((link) => link.url.includes("github.com/"));
    const icons = [];

    if (document) {
      icons.push(`<a class="artifact-icon" href="${escapeHtml(document)}" title="PDF or writeup available" aria-label="Open PDF or writeup">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 1.5h6l3 3v10h-9zM9.5 1.5v3h3M5.5 8h5M5.5 10.5h5M5.5 13h3.5"/></svg>
      </a>`);
    }

    if (repository) {
      icons.push(`<a class="artifact-icon" href="${escapeHtml(repository.url)}" title="Repository available" aria-label="Open repository">
        <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="4" cy="3" r="1.5"/><circle cx="4" cy="13" r="1.5"/><circle cx="12" cy="6" r="1.5"/><path d="M4 4.5v7M5.5 5.5h3A3.5 3.5 0 0 0 12 2v2.5"/></svg>
      </a>`);
    }

    return icons.length ? `<span class="artifact-links">${icons.join("")}</span>` : "";
  }

  window.escapeHtml = escapeHtml;
  window.projectCard = projectCard;
  window.artifactIcons = artifactIcons;
  window.revealElements = function () {};
})();
