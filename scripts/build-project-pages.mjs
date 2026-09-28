import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptDirectory, "..");
const siteUrl = "https://foxunderground0.github.io";
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(siteRoot, "assets/js/data.js"), "utf8"), context);
const projects = context.window.PROJECTS;
const manifestPath = path.join(siteRoot, "assets/media/manifest.json");
const media = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, "utf8")) : [];
const galleryMedia = media.filter((item) => !item.hideFromGallery);

function mediaTile(item, prefix = "") {
  const project = projects.find((project) => project.id === item.project);
  const label = project?.shortTitle || project?.title || "Gallery only";
  const kind = item.type === "video" ? "Video" : "Photo";
  const caption = `${label}. ${kind} ${Number(item.id.split("-").at(-1))}.`;
  const projectUrl = project ? `${prefix}projects/${encodeURIComponent(project.id)}.html` : "";
  const preview = item.type === "video" ? `<video class="media-hover-video" muted loop playsinline preload="none" data-video-src="${escapeHtml(localHref(item.src, prefix))}" aria-hidden="true"></video>` : "";
  return `<figure class="media-tile" data-project="${escapeHtml(item.project || "miscellaneous")}" data-type="${item.type}">
  <a class="media-open" href="${escapeHtml(localHref(item.src, prefix))}" data-media-id="${item.id}" data-type="${item.type}" data-caption="${escapeHtml(caption)}" data-label="${escapeHtml(label)}" data-project-url="${projectUrl}" data-poster="${item.poster ? escapeHtml(localHref(item.poster, prefix)) : ""}" aria-label="Open ${escapeHtml(caption)}">
    <img src="${escapeHtml(localHref(item.thumbnail, prefix))}" width="${item.width}" height="${item.height}" alt="${escapeHtml(caption)}" loading="lazy" decoding="async" fetchpriority="low">
    ${preview}
    ${item.type === "video" ? '<span class="video-badge" aria-hidden="true">▶ Video</span>' : ""}
    <span class="media-label">${escapeHtml(label)}</span>
  </a>
  <figcaption class="visually-hidden">${escapeHtml(caption)}${project ? ` <a href="${projectUrl}">Project details</a>` : ""}</figcaption>
</figure>`;
}

function prioritizeVideos(items) {
  const videos = items.filter((item) => item.type === "video");
  const images = items.filter((item) => item.type === "image");
  const ordered = [];
  let imageIndex = 0;
  for (const video of videos) {
    ordered.push(video);
    for (let spacer = 0; spacer < 2 && imageIndex < images.length; spacer++) {
      ordered.push(images[imageIndex++]);
    }
  }
  ordered.push(...images.slice(imageIndex));
  return ordered;
}

function mediaDialog(prefix = "") {
  return `<dialog class="media-viewer" aria-label="Media viewer">
  <div class="viewer-header"><p class="viewer-caption"></p><button class="viewer-close" type="button" aria-label="Close media viewer">Close</button></div>
  <div class="viewer-stage"></div>
  <div class="viewer-footer"><button class="viewer-prev" type="button" aria-label="Previous media">Previous</button><a class="viewer-project" href="${prefix}projects.html">Project details</a><button class="viewer-next" type="button" aria-label="Next media">Next</button></div>
</dialog>`;
}

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

function writeText(filePath, content) {
  fs.writeFileSync(filePath, content.replace(/[\t ]+$/gm, ""));
}

function artifactIcons(project, prefix = "") {
  const document = documentFor(project);
  const repository = repositoryFor(project);
  const hasMedia = galleryMedia.some((item) => item.project === project.id);
  const icons = [];

  if (document) {
    icons.push(`<a class="artifact-icon" href="${escapeHtml(localHref(document.url, prefix))}" title="PDF or writeup available" aria-label="Open PDF or writeup"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 1.5h6l3 3v10h-9zM9.5 1.5v3h3M5.5 8h5M5.5 10.5h5M5.5 13h3.5"/></svg></a>`);
  }

  if (repository) {
    icons.push(`<a class="artifact-icon" href="${escapeHtml(repository.url)}" title="Repository available" aria-label="Open repository"><svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="4" cy="3" r="1.5"/><circle cx="4" cy="13" r="1.5"/><circle cx="12" cy="6" r="1.5"/><path d="M4 4.5v7M5.5 5.5h3A3.5 3.5 0 0 0 12 2v2.5"/></svg></a>`);
  }

  if (hasMedia) {
    icons.push(`<a class="artifact-icon" href="${prefix}gallery.html?project=${encodeURIComponent(project.id)}" title="Photos or videos available" aria-label="Open project photos and videos"><svg viewBox="0 0 16 16" aria-hidden="true"><rect x="1.5" y="2" width="13" height="12" rx="1"/><circle cx="5" cy="5.5" r="1.2"/><path d="m2 12 3.5-3.5 2.2 2.2 2.1-2.1L14 13"/></svg></a>`);
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
  <div class="project-entry-meta">${project.year ? `${escapeHtml(project.year)}<br>` : ""}${escapeHtml(project.category)}</div>
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

function navigation(prefix, active = "projects") {
  return `<header class="site-header">
  <nav class="nav shell" aria-label="Main navigation">
    <a class="wordmark" href="${prefix}index.html"><img class="nav-avatar" src="${prefix}assets/images/profile.webp" alt="" width="30" height="30"><span>Umer Irfan</span></a>
    <div class="nav-links">
      <a href="${prefix}index.html">About</a>
      <a href="${prefix}index.html#publications">Publications</a>
      <a href="${prefix}projects.html"${active === "projects" ? ' aria-current="page"' : ""}>Projects</a>
      <a href="${prefix}gallery.html"${active === "gallery" ? ' aria-current="page"' : ""}>Gallery</a>
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
  const projectMedia = prioritizeVideos(galleryMedia.filter((item) => item.project === project.id));
  const presentation = project.presentation;
  const presentationUrl = presentation ? `${siteUrl}/${presentation.path}` : "";
  const presentationSection = presentation ? `<section class="presentation-section" id="presentation">
  <h2>Presentation</h2>
  <p><a href="${escapeHtml(localHref(presentation.path, prefix))}" target="_blank" rel="noopener">Open ${escapeHtml(presentation.label)} in PowerPoint for the web</a> · <a href="${escapeHtml(localHref(presentation.path, prefix))}" download>Download PowerPoint file</a></p>
  <iframe class="presentation-frame" src="https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(presentationUrl)}" title="${escapeHtml(presentation.label)}" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade"></iframe>
</section>` : "";
  const mediaSection = projectMedia.length ? `<section class="media-section" id="media">
  <div class="section-heading"><h2>Photos and videos</h2><a href="../gallery.html?project=${encodeURIComponent(project.id)}">Gallery</a></div>
  <div class="media-grid project-media">${projectMedia.map((item) => mediaTile(item, prefix)).join("\n")}</div>
</section>` : "";
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
  <link rel="canonical" href="${siteUrl}/projects/${encodeURIComponent(project.id)}.html">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeHtml(project.title)} | Umer Irfan">
  <meta property="og:description" content="${escapeHtml(project.summary)}">
  <title>${escapeHtml(project.title)} | Umer Irfan</title>
  <link rel="preload" href="../assets/css/styles.css" as="style">
  <link rel="preload" href="../assets/images/profile.webp" as="image" type="image/webp" fetchpriority="high">
  <link rel="stylesheet" href="../assets/css/styles.css">
  <script defer src="../assets/js/performance.js"></script>
  ${projectMedia.length ? '<script defer src="../assets/js/media.js"></script>' : ""}
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
          <p class="detail-meta">${[project.year, project.status, project.category].filter(Boolean).map((value) => `<span>${escapeHtml(value)}</span>`).join("")}</p>
          <p class="project-tags">${project.tags.map(escapeHtml).join(" · ")}</p>
          ${links ? `<p class="detail-actions">${links}</p>` : ""}
        </header>
        <div class="detail-copy">
          <section><h2>Motivation</h2><p>${escapeHtml(project.problem)}</p></section>
          <section><h2>Work completed</h2><ul>${project.work.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>
          <section><h2>Outputs</h2><ul>${project.outcomes.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>
          ${sourceSection}
        </div>
        ${presentationSection}
        ${documentSection}
        ${mediaSection}
      </article>
      ${related.length ? `<section class="content-section"><h2>Related projects</h2><div class="project-list">${related.map((item) => projectEntry(item, prefix)).join("\n")}</div></section>` : ""}
    </main>
  </div>
  <footer class="footer shell"><p>Copyright Umer Irfan 2026. This website contains unpublished research content owned by Umer Irfan. Reuse requires prior written consent. <a href="../LICENSE">License</a></p></footer>
  ${projectMedia.length ? mediaDialog(prefix) : ""}
</body>
</html>
`;
}

function galleryPage() {
  const taggedProjects = projects.filter((project) => galleryMedia.some((item) => item.project === project.id));
  const projectOrder = [...new Set(galleryMedia.map((item) => item.project || "miscellaneous"))];
  const galleryItems = projectOrder.flatMap((projectId) => prioritizeVideos(galleryMedia.filter((item) => (item.project || "miscellaneous") === projectId)));
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Project photos and videos from Umer Irfan. Research, hardware, teaching, and freelance work.">
  <meta name="theme-color" content="#ffffff">
  <link rel="canonical" href="${siteUrl}/gallery.html">
  <title>Gallery | Umer Irfan</title>
  <link rel="stylesheet" href="assets/css/styles.css">
  <script defer src="assets/js/media.js"></script>
  <script defer src="assets/js/performance.js"></script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  ${mobileProfile("")}
  ${navigation("", "gallery")}
  <div class="academic-layout shell">
    ${profile("")}
    <main id="main" class="academic-main gallery-page">
      <header class="page-header"><h2>Gallery</h2><p>Photos and videos from research, hardware, teaching, and freelance work.</p></header>
      <form class="gallery-controls" aria-label="Gallery filters">
        <label for="gallery-project">Project</label>
        <select id="gallery-project"><option value="all">All projects</option>${taggedProjects.map((project) => `<option value="${project.id}">${escapeHtml(project.shortTitle || project.title)}</option>`).join("")}<option value="miscellaneous">Gallery only</option></select>
        <label for="gallery-type">Media</label>
        <select id="gallery-type"><option value="all">Photos and videos</option><option value="image">Photos</option><option value="video">Videos</option></select>
      </form>
      <p class="gallery-count result-count" aria-live="polite">${galleryMedia.length} items</p>
      <div class="media-grid gallery-grid">${galleryItems.map((item) => mediaTile(item)).join("\n")}</div>
      <p class="gallery-empty" hidden>No media matches these filters.</p>
    </main>
  </div>
  <footer class="footer shell"><p>Copyright Umer Irfan 2026. This website contains unpublished research content owned by Umer Irfan. Reuse requires prior written consent. <a href="LICENSE">License</a></p></footer>
  ${mediaDialog()}
</body>
</html>
`;
}

const outputDirectory = path.join(siteRoot, "projects");
fs.mkdirSync(outputDirectory, { recursive: true });
for (const project of projects) {
  writeText(path.join(outputDirectory, `${project.id}.html`), projectPage(project));
}

const projectIndexPath = path.join(siteRoot, "projects.html");
const projectIndex = fs.readFileSync(projectIndexPath, "utf8");
const projectList = projects.map((project) => projectEntry(project)).join("\n");
const updatedIndex = projectIndex.replace(
  /<!-- PROJECT_LIST_START -->[\s\S]*<!-- PROJECT_LIST_END -->/,
  `<!-- PROJECT_LIST_START -->\n${projectList}\n        <!-- PROJECT_LIST_END -->`
);
writeText(projectIndexPath, updatedIndex);
writeText(path.join(siteRoot, "gallery.html"), galleryPage());

const sitemapPages = [
  `${siteUrl}/`,
  `${siteUrl}/projects.html`,
  `${siteUrl}/gallery.html`,
  ...projects.map((project) => `${siteUrl}/projects/${encodeURIComponent(project.id)}.html`)
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapPages.map((url) => `  <url><loc>${escapeHtml(url)}</loc></url>`).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(siteRoot, "sitemap.xml"), sitemap);
fs.writeFileSync(
  path.join(siteRoot, "robots.txt"),
  `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`
);

console.log(`Generated ${projects.length} static project pages and sitemap.xml.`);
