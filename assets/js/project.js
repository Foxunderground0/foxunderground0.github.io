document.addEventListener("DOMContentLoaded", () => {
  const id = new URLSearchParams(window.location.search).get("id");
  const project = window.PROJECTS.find((item) => item.id === id);
  const root = document.querySelector("#project-detail");

  if (project) {
    window.location.replace(`projects/${encodeURIComponent(project.id)}.html`);
    return;
  }

  if (!project) {
    document.title = "Project not found | Umer Irfan";
    root.innerHTML = "<h1>Project not found</h1><p>This project is not in the archive.</p>";
    return;
  }

  document.title = `${project.title} | Umer Irfan`;

  const links = (project.links || [])
    .map((link) => `<a href="${window.escapeHtml(link.url)}">${window.escapeHtml(link.label)}</a>`)
    .join(" ");
  const work = project.work.map((item) => `<li>${window.escapeHtml(item)}</li>`).join("");
  const outcomes = project.outcomes.map((item) => `<li>${window.escapeHtml(item)}</li>`).join("");
  const sources = (project.sources || [])
    .map((source) => `<li><a href="${window.escapeHtml(source.url)}">${window.escapeHtml(source.label)}</a></li>`)
    .join("");

  root.innerHTML = `
    <header class="detail-header">
      <div class="project-title-line detail-title-line"><h1>${window.escapeHtml(project.title)}</h1>${window.artifactIcons(project)}</div>
      <p class="detail-lead">${window.escapeHtml(project.summary)}</p>
      <p class="detail-meta"><span>${window.escapeHtml(project.year)}</span><span>${window.escapeHtml(project.status)}</span><span>${window.escapeHtml(project.category)}</span></p>
      <p class="project-tags">${project.tags.map(window.escapeHtml).join(" · ")}</p>
      ${links ? `<p class="detail-actions">${links}</p>` : ""}
    </header>
    <div class="detail-copy">
      <section><h2>Motivation</h2><p>${window.escapeHtml(project.problem)}</p></section>
      <section><h2>Work completed</h2><ul>${work}</ul></section>
      <section><h2>Outputs</h2><ul>${outcomes}</ul></section>
      ${sources ? `<section><h2>Selected sources</h2><ul class="source-list">${sources}</ul></section>` : ""}
    </div>
    ${(project.documents?.length || project.document) ? `
      <section class="document-section">
        <h2>Documents</h2>
        <ul class="document-list">${(project.documents || [{ label: "Project document", url: project.document }]).map((document) => `<li><a href="${window.escapeHtml(document.url)}">${window.escapeHtml(document.label)}</a></li>`).join("")}</ul>
        <iframe class="document-frame" src="${window.escapeHtml(project.documents?.[0]?.url || project.document)}" title="${window.escapeHtml(project.title)} document" loading="lazy"></iframe>
      </section>` : ""}`;

  const related = window.PROJECTS
    .filter((item) => item.id !== project.id && item.category === project.category)
    .slice(0, 3);

  if (related.length) {
    document.querySelector("#related-projects").innerHTML = related.map(window.projectCard).join("");
    document.querySelector("#related-section").hidden = false;
  }
});
