import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptDirectory, "..");
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(siteRoot, "assets/js/data.js"), "utf8"), context);
const projects = context.window.PROJECTS;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function localHref(url, prefix = "") {
  return /^https?:|^mailto:/.test(url) ? url : `${prefix}${url}`;
}

function documentFor(project) {
  return project.documents?.[0] || (project.document ? { label: "Project document", url: project.document } : null);
}

function repositoryFor(project) {
  return (project.links || []).find((link) => link.url.includes("github.com/"));
}

function artifactIcons(project, prefix = "") {
  const document = documentFor(project);
  const repository = repositoryFor(project);
  const icons = [];

  if (document) {
    icons.push(`<a class="artifact-icon" href="${escapeHtml(localHref(document.url, prefix))}" title="PDF or writeup available" aria-label="Open PDF or writeup"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 1.5h6l3 3v10h-9zM9.5 1.5v3h3M5.5 8h5M5.5 10.5h5M5.5 13h3.5"/></svg></a>`);
  }

  if (repository) {
    icons.push(`<a class="artifact-icon" href="${escapeHtml(repository.url)}" title="Repository available" aria-label="Open repository"><svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="4" cy="3" r="1.5"/><circle cx="4" cy="13" r="1.5"/><circle cx="12" cy="6" r="1.5"/><path d="M4 4.5v7M5.5 5.5h3A3.5 3.5 0 0 0 12 2v2.5"/></svg></a>`);
  }

  return icons.length ? `<span class="artifact-links">${icons.join("")}</span>` : "";
}

function projectEntry(project, prefix = "") {
  const search = [project.title, project.summary, project.category, project.status, ...project.tags].join(" ").toLowerCase();
  return `<article class="project-entry" data-category="${escapeHtml(project.category)}" data-search="${escapeHtml(search)}">
  <div>
    <div class="project-title-line"><h3><a href="${prefix}projects/${encodeURIComponent(project.id)}.html">${escapeHtml(project.shortTitle || project.title)}</a></h3>${artifactIcons(project, prefix)}</div>
    <p>${escapeHtml(project.summary)}</p>
    <p class="project-tags">${project.tags.slice(0, 4).map(escapeHtml).join(" · ")}</p>
  </div>
  <div class="project-entry-meta">${escapeHtml(project.year)}<br>${escapeHtml(project.category)}</div>
</article>`;
}

function profile(prefix) {
  return `<aside class="profile" aria-label="Profile">
  <img class="profile-photo" src="${prefix}assets/images/profile.webp" alt="Umer Irfan" width="269" height="275" decoding="async" fetchpriority="high">
  <h1>Umer Irfan</h1>
  <p>Undergraduate researcher in embedded systems, hardware security, and computer architecture.</p>
  <p>BSc Computer Science. Minor in Computer Engineering. LUMS.</p>
  <ul class="profile-links">
    <li><a href="mailto:umerirfan1205@gmail.com">Email</a></li>
    <li><a href="https://github.com/Foxunderground0">GitHub</a></li>
    <li><a href="https://www.linkedin.com/in/umer-irfan--">LinkedIn</a></li>
    <li><a href="${prefix}assets/docs/Umer_Irfan_CV.pdf">Curriculum vitae</a></li>
    <li><a href="${prefix}assets/docs/Umer_Irfan_Portfolio.pdf">Extended portfolio</a></li>
  </ul>
</aside>`;
}

function mobileProfile(prefix) {
  return `<aside class="mobile-profile shell" aria-label="Profile">
  <img class="profile-photo" src="${prefix}assets/images/profile.webp" alt="Umer Irfan" width="269" height="275" decoding="async" fetchpriority="high">
  <div class="mobile-profile-copy">
    <h1>Umer Irfan</h1>
    <p>Undergraduate researcher in embedded systems, hardware security, and computer architecture.</p>
    <p>BSc Computer Science. Minor in Computer Engineering. LUMS.</p>
  </div>
  <ul class="profile-links">
    <li><a href="mailto:umerirfan1205@gmail.com">Email</a></li>
    <li><a href="https://github.com/Foxunderground0">GitHub</a></li>
    <li><a href="https://www.linkedin.com/in/umer-irfan--">LinkedIn</a></li>
    <li><a href="${prefix}assets/docs/Umer_Irfan_CV.pdf">CV</a></li>
    <li><a href="${prefix}assets/docs/Umer_Irfan_Portfolio.pdf">Extended portfolio</a></li>
  </ul>
</aside>`;
}

function navigation(prefix) {
  return `<header class="site-header">
  <nav class="nav shell" aria-label="Main navigation">
    <a class="wordmark" href="${prefix}index.html">Umer Irfan</a>
    <div class="nav-links">
      <a href="${prefix}index.html">About</a>
      <a href="${prefix}index.html#publications">Publications</a>
      <a href="${prefix}projects.html" aria-current="page">Projects</a>
      <a href="${prefix}assets/docs/Umer_Irfan_Portfolio.pdf">Extended portfolio</a>
      <a href="${prefix}assets/docs/Umer_Irfan_CV.pdf">CV</a>
      <a href="${prefix}index.html#contact">Contact</a>
    </div>
  </nav>
</header>`;
}

function projectPage(project) {
  const prefix = "../";
  const related = projects.filter((item) => item.id !== project.id && item.category === project.category).slice(0, 3);
  const links = (project.links || []).map((link) => `<a href="${escapeHtml(localHref(link.url, prefix))}">${escapeHtml(link.label)}</a>`).join(" ");
  const documents = project.documents || (project.document ? [{ label: "Project document", url: project.document }] : []);
  const sources = project.sources || [];
  const documentSection = documents.length ? `<section class="document-section">
  <h2>Documents</h2>
  <ul class="document-list">${documents.map((document) => `<li><a href="${escapeHtml(localHref(document.url, prefix))}">${escapeHtml(document.label)}</a></li>`).join("")}</ul>
  <iframe class="document-frame" src="${escapeHtml(localHref(documents[0].url, prefix))}" title="${escapeHtml(project.title)} document" loading="lazy"></iframe>
</section>` : "";
  const sourceSection = sources.length ? `<section><h2>Selected sources</h2><ul class="source-list">${sources.map((source) => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.label)}</a></li>`).join("")}</ul></section>` : "";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escapeHtml(project.summary)}">
  <meta name="keywords" content="${escapeHtml(project.tags.join(", "))}">
  <meta name="theme-color" content="#ffffff">
  <meta name="site-root" content="../">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeHtml(project.title)} | Umer Irfan">
  <meta property="og:description" content="${escapeHtml(project.summary)}">
  <title>${escapeHtml(project.title)} | Umer Irfan</title>
  <link rel="preload" href="../assets/css/styles.css" as="style">
  <link rel="preload" href="../assets/images/profile.webp" as="image" type="image/webp" fetchpriority="high">
  <link rel="stylesheet" href="../assets/css/styles.css">
  <script defer src="../assets/js/performance.js"></script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  ${mobileProfile(prefix)}
  ${navigation(prefix)}
  <div class="academic-layout shell">
    ${profile(prefix)}
    <main id="main" class="academic-main detail-page">
      <p><a href="../projects.html">Back to projects</a></p>
      <article>
        <header class="detail-header">
          <div class="project-title-line detail-title-line"><h1>${escapeHtml(project.title)}</h1>${artifactIcons(project, prefix)}</div>
          <p class="detail-lead">${escapeHtml(project.summary)}</p>
          <p class="detail-meta"><span>${escapeHtml(project.year)}</span><span>${escapeHtml(project.status)}</span><span>${escapeHtml(project.category)}</span></p>
          <p class="project-tags">${project.tags.map(escapeHtml).join(" · ")}</p>
          ${links ? `<p class="detail-actions">${links}</p>` : ""}
        </header>
        <div class="detail-copy">
          <section><h2>Motivation</h2><p>${escapeHtml(project.problem)}</p></section>
          <section><h2>Work completed</h2><ul>${project.work.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>
          <section><h2>Outputs</h2><ul>${project.outcomes.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>
          ${sourceSection}
        </div>
        ${documentSection}
      </article>
      ${related.length ? `<section class="content-section"><h2>Related projects</h2><div class="project-list">${related.map((item) => projectEntry(item, prefix)).join("\n")}</div></section>` : ""}
    </main>
  </div>
  <footer class="footer shell"><p>Copyright Umer Irfan 2026. This website contains unpublished research content owned by Umer Irfan. Reuse requires prior written consent. <a href="../LICENSE">License</a></p></footer>
</body>
</html>
`;
}

const outputDirectory = path.join(siteRoot, "projects");
fs.mkdirSync(outputDirectory, { recursive: true });
for (const project of projects) {
  fs.writeFileSync(path.join(outputDirectory, `${project.id}.html`), projectPage(project));
}

const projectIndexPath = path.join(siteRoot, "projects.html");
const projectIndex = fs.readFileSync(projectIndexPath, "utf8");
const projectList = projects.map((project) => projectEntry(project)).join("\n");
const updatedIndex = projectIndex.replace(
  /<!-- PROJECT_LIST_START -->[\s\S]*<!-- PROJECT_LIST_END -->/,
  `<!-- PROJECT_LIST_START -->\n${projectList}\n        <!-- PROJECT_LIST_END -->`
);
fs.writeFileSync(projectIndexPath, updatedIndex);

console.log(`Generated ${projects.length} static project pages.`);
