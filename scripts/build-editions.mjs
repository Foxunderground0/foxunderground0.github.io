import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

// Run after build-project-pages.mjs. Root pages remain the legacy academic URLs.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const origin = "https://foxunderground0.github.io";
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root, "assets/js/data.js"), "utf8"), ctx);
const academic = ctx.window.PROJECTS;
const byId = Object.fromEntries(academic.map((item) => [item.id, item]));
const galleryManifest = JSON.parse(fs.readFileSync(path.join(root, "assets/media/manifest.json"), "utf8"));
const galleryMedia = galleryManifest.filter((item) => !item.hideFromGallery);

const esc = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const save = (name, value) => {
  const target = path.join(root, name);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, value);
};
const load = (name) => fs.readFileSync(path.join(root, name), "utf8");
const sitePath = (from, target) => path.posix.relative(path.posix.dirname(from), target) || "./";
const asset = (page, target) => sitePath(page, target);
const mediaDialog = (projectsUrl) => `<dialog class="media-viewer" aria-label="Media viewer">
  <div class="viewer-header"><p class="viewer-caption"></p><button class="viewer-close" type="button" aria-label="Close media viewer">Close</button></div>
  <div class="viewer-stage"></div>
  <div class="viewer-footer"><button class="viewer-prev" type="button" aria-label="Previous media">Previous</button><a class="viewer-project" href="${projectsUrl}">Project details</a><button class="viewer-next" type="button" aria-label="Next media">Next</button></div>
</dialog>`;

// The original URLs keep their full content. Add one compact switch to the shared nav.
const switchFor = (edition, page) => `<span class="edition-switch" aria-label="Portfolio edition"><a href="${asset(page, "academic/index.html")}"${edition === "academic" ? ' aria-current="page"' : ""}>Academic</a><a href="${asset(page, "professional/index.html")}"${edition === "professional" ? ' aria-current="page"' : ""}>Professional</a></span>`;
for (const page of ["index.html", "projects.html", "gallery.html", ...academic.map((p) => `projects/${p.id}.html`)]) {
  let html = load(page);
  if (!html.includes('class="edition-switch"')) html = html.replace(/(<div class="nav-links">)/, `$1\n      ${switchFor("academic", page)}`);
  save(page, html);
}

// Duplicate only HTML. All heavy media, PDFs, CSS and JS remain shared at root.
function academicCopy(source, target) {
  let html = load(source);
  const sourceDir = path.posix.dirname(source);
  const targetDir = path.posix.dirname(target);
  html = html.replace(/(\b(?:href|src|data-video-src|data-poster|data-project-url)="|<meta name="site-root" content=")([^"]+)(")/g, (all, open, url, close) => {
    if (/^(?:https?:|mailto:|#|data:|\/)/.test(url)) return all;
    const [raw, suffix = ""] = url.split(/(?=[?#])/);
    let resolved = path.posix.normalize(path.posix.join(sourceDir, raw));
    if (resolved === "index.html" || resolved === "projects.html" || resolved === "gallery.html" || /^projects\/[^/]+\.html$/.test(resolved)) resolved = `academic/${resolved}`;
    const rebased = path.posix.relative(targetDir, resolved) || "./";
    return `${open}${rebased}${suffix}${close}`;
  });
  // Local project links must stay inside the new academic edition.
  // Keep the established root URL canonical to avoid duplicate search results.
  html = html.replace(/(<link rel="canonical" href=")[^"]+("\s*>)/, `$1${origin}/${source === "index.html" ? "" : source}$2`);
  if (!html.includes('name="site-root"')) html = html.replace('<meta name="theme-color" content="#ffffff">', `<meta name="theme-color" content="#ffffff">\n  <meta name="site-root" content="${asset(target, ".")}/">`);
  html = html.replace(/<span class="edition-switch"[\s\S]*?<\/span>/, switchFor("academic", target));
  save(target, html);
}
for (const source of ["index.html", "projects.html", "gallery.html", ...academic.map((p) => `projects/${p.id}.html`)]) {
  academicCopy(source, `academic/${source}`);
}

const professional = [
  {
    id: "voice-agent", title: "Streaming Voice Agent", year: "2024 to 2025", category: "Professional work",
    status: "Sales demo prototype", tags: ["Voice AI", "Node.js", "WebSockets", "Whisper"],
    summary: "A low-latency voice automation prototype built for a startup exploring a ZEISS sales opportunity.",
    problem: "A useful telephone agent has to listen, transcribe, respond and return speech quickly enough for conversation.",
    work: ["Built the streaming service with Node.js and WebSockets.", "Integrated WebRTC voice activity detection, Whisper transcription and GPT-4 response generation.", "Tuned buffering and pipeline stages under Asif Mufti's supervision."],
    outcomes: ["Delivered spoken responses in under four seconds for a conversational sales demo.", "Demonstrated the system for a prospective ZEISS opportunity."],
    links: [{ label: "Asif Mufti", url: "https://www.researchgate.net/profile/Asif-Mufti" }],
    figures: [{ src: "assets/figures/voice-pipeline.svg", alt: "Voice agent pipeline from incoming speech to generated reply", caption: "Prototype pipeline. Speech is segmented, transcribed and passed to response generation before playback." }]
  },
  {
    id: "wellness-lamp", title: "Wellness Lamp", year: "2026", category: "Product and app",
    status: "Public source", tags: ["React Native", "TypeScript", "BLE", "ESP32"],
    summary: "A mobile-controlled lamp with mood-based color palettes and synchronized ESP32 nodes.",
    problem: "A small lighting device needs a usable control interface and reliable state sharing across nodes.",
    work: ["Built React Native screens for color, brightness, themes and sound.", "Implemented palette selection from mood inputs and BLE device control.", "Developed ESP32 firmware that synchronizes multiple nodes over ESP-NOW."],
    outcomes: ["One mobile interface controlled color and sound across synchronized lamp nodes.", "Published the application and firmware source."],
    links: [{ label: "Public repository", url: "https://github.com/Foxunderground0/Wellness-Lamp" }],
    figures: [{ src: "assets/figures/wellness-palettes.webp", alt: "Wellness Lamp preset palettes", caption: "Preset palettes used in the mobile control interface." }]
  },
  {
    id: "fintelligent", title: "Fintelligent Website", year: "2026", category: "Client website",
    status: "Live website", tags: ["Next.js", "React", "TypeScript", "Responsive UI"],
    summary: "A public Next.js website for an equipment-finance consultancy.",
    problem: "Prospective clients need a clear account of the firm's services and a direct path to make contact.",
    work: ["Built responsive pages with Next.js, React and TypeScript.", "Organized service information and contact paths for the public site."],
    outcomes: ["Published the client website at fintelligent.cc so visitors could find services and contact the firm."],
    links: [{ label: "Live website", url: "https://fintelligent.cc/" }],
    figures: [{ src: "assets/figures/fintelligent-home.webp", alt: "Fintelligent public website homepage", caption: "Live website homepage captured from the public site." }]
  },
  {
    id: "makers-dashboard", title: "Makers Lab Dashboard", year: "2024", category: "Full-stack software",
    status: "Public source", tags: ["React", "Express", "PostgreSQL", "Docker Compose"],
    summary: "A lab operations dashboard for equipment, staff, tasks and usage records.",
    problem: "A shared fabrication lab needs one place to manage resources and daily work.",
    work: ["Built React data views and forms backed by an Express service and PostgreSQL.", "Tracked equipment, people, tasks and usage records.", "Packaged frontend, backend and database with Docker Compose."],
    outcomes: ["Brought lab equipment, staff, tasks and activity into one operations interface.", "Released the full-stack application as public source."],
    links: [{ label: "Public repository", url: "https://github.com/Foxunderground0/Makers-Lab-Dashboard" }],
    figures: [{ src: "assets/figures/makers-dashboard.webp", alt: "Makers Lab task dashboard populated with sample records", caption: "Application running locally with synthetic task records for this screenshot." }]
  },
  {
    id: "violet-peer-tutoring", title: "Violet Peer Tutoring", year: "2026", category: "App and AI prototype",
    status: "Team course project", tags: ["Android", "Java", "Firebase", "AI assistant"],
    summary: "An Android peer tutoring app with locally prototyped AI guidance and flashcard features.",
    problem: "Students need ways to find tutors, plan sessions and study between meetings.",
    work: ["Contributed to the Android and Firebase application.", "Prototyped an AI study assistant and generated flashcard flow in a local development branch."],
    outcomes: ["Built tutoring and scheduling screens for students and tutors.", "Prototyped AI guidance and flashcards for study between sessions."],
    links: [],
    figures: [{ src: "assets/figures/violet-ai.svg", alt: "Diagram of local AI assistant and generated flashcard prototype", caption: "AI assistant and flashcard prototype flow." }, { src: "assets/figures/violet-schedule.webp", alt: "Violet tutoring schedule in a demo account", caption: "Scheduling screen with demo account data." }]
  },
  {
    id: "project-x", title: "Project X Camera Firmware", year: "2024 to 2025", category: "Professional work",
    status: "Private source", tags: ["ESP32", "Camera", "OTA", "MQTT"],
    summary: "Camera-device firmware for updates, connectivity and operational telemetry.",
    problem: "A connected camera needs a way to receive updates and report device state after installation.",
    work: ["Worked on ESP32 camera firmware and device connection paths.", "Implemented OTA update fetching and MQTT heartbeat and error telemetry."],
    outcomes: ["Gave installed cameras a device-side path for firmware updates and operational reporting."],
    links: [],
    figures: [{ src: "assets/figures/project-x-flow.svg", alt: "Project X device update and telemetry flow", caption: "Firmware-side flow. This diagram does not claim validated TLS for OTA or MQTT." }]
  },
  {
    ...byId["parda"], category: "Applied AI research", shortTitle: "PARDA",
    summary: "Conversation-aware privacy redaction and speaker voice replacement for smart glasses.",
    work: ["Extended SEAL-style redaction, an adversarial sensitive-content anonymisation method, from static text to multi-speaker conversation with retrieval and persistent context.", "Distilled an adversary and anonymizer workflow into a 2B model using 717 CANDOR conversations.", "Evaluated quantized components on Raspberry Pi 5."],
    outcomes: ["On 143 held-out conversations, model-judged leakage fell from 0.502 to 0.378 while utility rose from 0.875 to 0.900.", "First-author manuscript submitted to IEEE PerCom 2027."],
    figures: [{ src: "assets/figures/parda-pipeline.webp", alt: "PARDA paper pipeline figure", caption: "Paper pipeline. Context and retrieval inform privacy redaction before speech output." }, { src: "assets/figures/parda-evaluation.webp", alt: "PARDA paper privacy and utility comparison on held-out conversations", caption: "Paper Figure 10. Full-precision privacy and utility comparison on 143 held-out conversations." }]
  },
  {
    ...byId["kissan-dost"], category: "Applied AI research", shortTitle: "Kissan-Dost",
    summary: "Urdu WhatsApp voice and text advice grounded in live field measurements.",
    figures: [{ src: "assets/figures/kissan-system.webp", alt: "Kissan-Dost paper system figure", caption: "Paper system view. Field sensors feed a gateway and conversational interface." }, { src: "assets/figures/kissan-chat.webp", alt: "Kissan-Dost WhatsApp interface from paper", caption: "Paper example of farmer-facing WhatsApp guidance." }, { src: "assets/figures/kissan-engagement.webp", alt: "Kissan-Dost paper chart comparing dashboard and chatbot use", caption: "Paper Figure 11. Daily interactions during the dashboard and chatbot phases of the pilot." }]
  },
  {
    ...byId.wearables, category: "Applied AI research", shortTitle: "LLM-Enhanced Wearables",
    summary: "Low-cost sensing and plain-language WhatsApp health feedback for users with limited health literacy.",
    figures: [{ src: "assets/figures/wearables-system.webp", alt: "Wearable health guidance system from paper", caption: "Paper system view. Wearable measurements become plain-language feedback." }, { src: "assets/figures/wearables-prototype.webp", alt: "Guardian Angel wearable prototype and companion app from paper", caption: "Paper Figure 2. PCB, assembled prototype, wrist use and companion app." }]
  },
  { ...byId["redis-cache"], category: "Full-stack software" },
  { ...byId["poki-api"], category: "Software and ML" },
  { ...byId.pixelpacker, category: "Applied AI research", summary: "Neural compression for wildlife cameras that beat JPEG at low bitrates while reducing edge encoder memory 36-fold.", outcomes: ["Reported over ten times lower bitrate than JPEG's maximum-compression setting at comparable perceptual quality.", "Reduced image payloads for bandwidth-constrained wildlife camera links."] },
  { ...byId.watchtower, category: "Applied AI research" }
];
const order = ["voice-agent", "project-x", "wellness-lamp", "fintelligent", "makers-dashboard", "violet-peer-tutoring", "parda", "kissan-dost", "wearables", "redis-cache", "poki-api", "watchtower", "pixelpacker"];
professional.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
const primaryProjectIds = new Set(professional.map((p) => p.id));
const otherAcademic = academic
  .filter((p) => !primaryProjectIds.has(p.id))
  .map((p) => ({
    ...p,
    category: "Other Academic Projects",
    summary: String(p.summary || "").replace(/\*\*(.*?)\*\*/g, "$1"),
    overview: (p.overview || []).map((x) => String(x).replace(/\*\*(.*?)\*\*/g, "$1")),
    work: (p.work || []).map((x) => String(x).replace(/\*\*(.*?)\*\*/g, "$1")),
    outcomes: (p.outcomes || []).map((x) => String(x).replace(/\*\*(.*?)\*\*/g, "$1"))
  }));
const allProfessionalProjects = [...professional, ...otherAcademic];

function proShell(page, title, main, active = "about", description = "Software engineering and applied AI work by Umer Irfan.") {
  const link = (target) => asset(page, target);
  const cv = link("assets/docs/Umer_Irfan_Professional_CV.pdf");
  const academicCv = link("assets/docs/Umer_Irfan_CV.pdf");
  const portfolio = link("assets/docs/Umer_Irfan_Portfolio.pdf");
  const image = link("assets/images/profile.webp");
  const contacts = `<ul class="profile-links"><li><a href="mailto:umerirfan1205@gmail.com">Email</a></li><li><a href="https://github.com/Foxunderground0">GitHub</a></li><li><a href="https://www.linkedin.com/in/umer-irfan--">LinkedIn</a></li><li><a href="${cv}">Professional CV</a></li><li><a href="${academicCv}">Academic CV</a></li><li><a href="${portfolio}">Extended portfolio</a></li></ul>`;
  const nav = `<header class="site-header"><nav class="nav shell" aria-label="Main navigation"><a class="wordmark" href="${link("professional/index.html")}"><img class="nav-avatar" src="${image}" alt="" width="30" height="30"><span>Umer Irfan</span></a><div class="nav-links">${switchFor("professional", page)}<a href="${link("professional/index.html")}"${active === "about" ? ' aria-current="page"' : ""}>About</a><a href="${link("professional/projects.html")}"${active === "projects" ? ' aria-current="page"' : ""}>Projects</a><a href="${link("professional/gallery.html")}"${active === "gallery" ? ' aria-current="page"' : ""}>Gallery</a><a href="${portfolio}">Extended portfolio</a><a href="${cv}">CV</a><a href="${link("professional/index.html")}#contact">Contact</a></div></nav></header>`;
  const galleryScript = page === "professional/gallery.html" ? `<script defer src="${link("assets/js/media.js")}"></script>` : "";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="${esc(description)}"><meta name="theme-color" content="#ffffff"><meta name="site-root" content="${asset(page, ".")}/"><link rel="canonical" href="${origin}/${page}"><meta property="og:title" content="${esc(title)} | Umer Irfan"><meta property="og:description" content="${esc(description)}"><title>${esc(title)} | Umer Irfan</title><link rel="preload" href="${link("assets/images/profile.webp")}" as="image" type="image/webp" fetchpriority="high"><link rel="stylesheet" href="${link("assets/css/styles.css")}"><script defer src="${link("assets/js/performance.js")}"></script>${galleryScript}</head><body><a class="skip-link" href="#main">Skip to content</a><aside class="mobile-profile shell" aria-label="Profile"><img class="profile-photo" src="${image}" alt="Umer Irfan" width="269" height="275" decoding="async" fetchpriority="high"><div class="mobile-profile-copy"><h1>Umer Irfan</h1><p>Software engineering and applied AI.</p><p>BSc Computer Science. Minor in Computer Engineering. LUMS.</p></div>${contacts}</aside>${nav}<div class="academic-layout shell"><aside class="profile" aria-label="Profile"><img class="profile-photo" src="${image}" alt="Umer Irfan" width="269" height="275" decoding="async" fetchpriority="high"><h1>Umer Irfan</h1><p>Software engineering and applied AI.</p><p>BSc Computer Science<br>Minor in Computer Engineering<br>Lahore University of Management Sciences</p><p>Lahore, Pakistan</p>${contacts}</aside><main id="main" class="academic-main">${main}</main></div><footer class="footer shell"><p>Copyright Umer Irfan 2026. Unpublished research content may not be reproduced without permission. <a href="${link("LICENSE")}">License</a></p></footer>${page === "professional/gallery.html" ? mediaDialog(asset(page, "professional/projects.html")) : ""}</body></html>`;
}

function entry(page, p) {
  const url = asset(page, `professional/projects/${p.id}.html`);
  const search = [p.title, p.summary, p.category, ...p.tags, ...p.work].join(" ").toLowerCase();
  const document = p.documents?.[0] || (p.document ? { url: p.document } : null);
  const repository = (p.links || []).find((item) => /github\.com\//i.test(item.url));
  const hasMedia = galleryMedia.some((item) => item.project === p.id);
  const icons = [];
  if (document) {
    const href = /^https?:/.test(document.url) ? document.url : asset(page, document.url);
    icons.push(`<a class="artifact-icon" href="${esc(href)}" title="Project writeup available" aria-label="Open project writeup"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 1.5h6l3 3v10h-9zM9.5 1.5v3h3M5.5 8h5M5.5 10.5h5M5.5 13h3.5"/></svg></a>`);
  }
  if (repository) icons.push(`<a class="artifact-icon" href="${esc(repository.url)}" title="Repository available" aria-label="Open project repository"><svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="4" cy="3" r="1.5"/><circle cx="4" cy="13" r="1.5"/><circle cx="12" cy="6" r="1.5"/><path d="M4 4.5v7M5.5 5.5h3A3.5 3.5 0 0 0 12 2v2.5"/></svg></a>`);
  if (hasMedia) icons.push(`<a class="artifact-icon" href="${asset(page, "professional/gallery.html")}?project=${encodeURIComponent(p.id)}" title="Project photos or videos available" aria-label="Open project gallery"><svg viewBox="0 0 16 16" aria-hidden="true"><rect x="1.5" y="2" width="13" height="12" rx="1"/><circle cx="5" cy="5.5" r="1.2"/><path d="m2 12 3.5-3.5 2.2 2.2 2.1-2.1L14 13"/></svg></a>`);
  const artifactLinks = icons.length ? `<span class="artifact-links">${icons.join("")}</span>` : "";
  return `<article class="project-entry" data-category="${esc(p.category)}" data-search="${esc(search)}"><div><div class="project-title-line"><h3><a href="${url}">${esc(p.shortTitle || p.title)}</a></h3>${artifactLinks}</div><p>${esc(p.summary)}</p><p class="project-tags">${p.tags.slice(0, 4).map(esc).join(" · ")}</p></div><div class="project-entry-meta">${esc(p.year)}<br>${esc(p.category)}</div></article>`;
}

const home = "professional/index.html";
const homeMain = `<section class="content-section" aria-labelledby="professional-about"><h2 id="professional-about">About</h2><p>I am a Computer Science undergraduate at LUMS. My work includes a real-time sales voice agent, full-stack and mobile applications, and applied ML systems that turn sensor data into spoken or written guidance.</p><h3>Education</h3><p><strong>Lahore University of Management Sciences</strong>. BSc Computer Science. Minor in Computer Engineering. 2023 to 2027.</p></section>
<section class="content-section" aria-labelledby="professional-experience"><h2 id="professional-experience">Professional experience</h2><div class="experience-list"><article><div class="experience-heading"><h3><a href="projects/voice-agent.html">AI/ML Engineer | Streaming Voice Agent</a></h3><span>Aug 2024 to Mar 2025</span></div><p>Built a sales voice demo under <a href="https://www.researchgate.net/profile/Asif-Mufti">Asif Mufti</a>. WebSockets, WebRTC VAD, Whisper and GPT-4 delivered spoken responses in under four seconds. ZEISS was a prospective customer.</p></article><article><div class="experience-heading"><h3><a href="projects/project-x.html">React Native Engineer | Project X</a></h3><span>Nov 2024 to Jun 2025</span></div><p>Built smart-camera onboarding and notifications, with ESP32 update and telemetry firmware.</p></article><article><div class="experience-heading"><h3><a href="https://www.theuniapp.com/">DevOps Engineer | U.n.I Social App</a></h3><span>May to Jul 2024</span></div><p>Automated container delivery with GitHub Actions, EC2 and NGINX.</p></article></div></section>
<section class="content-section"><div class="section-heading"><h2>Selected projects</h2><a href="projects.html">All projects</a></div><div class="project-list">${professional.slice(0, 5).map((p) => entry(home, p)).join("\n")}</div></section>
<section class="content-section"><h2>Applied AI research</h2><ul class="plain-list"><li><a href="projects/kissan-dost.html">Kissan-Dost</a>. Accepted at IEEE DCOSS-IoT 2026. Urdu WhatsApp voice and text guidance grounded in field sensor data.</li><li><a href="projects/wearables.html">LLM-Enhanced Wearables</a>. Public preprint. A low-cost wearable paired with plain-language WhatsApp health feedback.</li><li><a href="projects/parda.html">PARDA</a>. First-author manuscript submitted to IEEE PerCom 2027. Retrieval-aware audio privacy with a distilled 2B model.</li><li><a href="projects/pixelpacker.html">PixelPacker</a>. An INT8 neural image encoder with a 36-fold smaller memory footprint for wildlife camera links.</li></ul></section>
<section class="content-section"><h2>Independent builds</h2><ul class="plain-list"><li><a href="projects/jpeg-codec.html">JPEG decoder</a> and <a href="https://github.com/Foxunderground0/CPP-Based-ASCII-Raycaster">ASCII raycaster</a>. Implemented in C++ to study compression and rendering from first principles.</li><li><a href="projects/rizz8.html">RIZZ-8</a>. Built an eight-bit processor from 74-series logic, eight PCBs, a custom ISA and a Python assembler.</li></ul></section>
<section class="content-section" aria-labelledby="leadership-heading"><h2 id="leadership-heading">Leadership and management</h2><div class="experience-list"><article><div class="experience-heading"><h3>Convener | LUMS Science Symposium</h3><span>2024</span></div><p>Led a week-long program for 550 participants and managed 150 team members across seven departments. Coordinated university approvals and sponsor outreach. Secured PKR 200,000 in cash and in-kind sponsorships and delivered PKR 800,000 net profit for the society.</p></article><article><div class="experience-heading"><h3>Event Head | AI Nexus</h3><span>2024 to 2025</span></div><p>Selected 12 recruits from 300 applicants and assigned team roles. Managed four months of preparation for a three-day competition round with 90 participants.</p></article></div></section>
<section id="contact" class="content-section contact"><h2>Contact</h2><p><a href="mailto:umerirfan1205@gmail.com">Email</a> · <a href="https://github.com/Foxunderground0">GitHub</a> · <a href="https://www.linkedin.com/in/umer-irfan--">LinkedIn</a> · <a href="${asset(home, "assets/docs/Umer_Irfan_Professional_CV.pdf")}">Professional CV</a></p></section>`;
save(home, proShell(home, "Professional work", homeMain));

const index = "professional/projects.html";
const listMain = `<header class="page-header"><h2>Projects</h2><p>Professional work, product builds and applied AI research.</p></header><section class="project-controls" aria-label="Project filters"><label for="project-search">Search</label><input id="project-search" type="search" autocomplete="off"><div id="category-filters" class="filter-list" aria-label="Filter by category"></div></section><p id="result-count" class="result-count"></p><section id="project-list" class="project-list" aria-live="polite"><section class="professional-project-group"><h3 class="project-group-heading">Main Projects</h3>${professional.map((p) => entry(index, p)).join("\n")}</section><section class="professional-project-group"><h3 class="project-group-heading">Other Academic Projects</h3>${otherAcademic.map((p) => entry(index, p)).join("\n")}</section></section><p id="empty-state" hidden>No projects match this search.</p>`;
save(index, proShell(index, "Professional projects", listMain, "projects").replace("</head>", `<script defer src="${asset(index, "assets/js/projects.js")}"></script></head>`));

for (const p of allProfessionalProjects) {
  const page = `professional/projects/${p.id}.html`;
  const list = (items = []) => `<ul>${items.map((x) => `<li>${esc(String(x).replace(/\*\*(.*?)\*\*/g, "$1"))}</li>`).join("")}</ul>`;
  const links = (p.links || []).filter((x) => !/private/i.test(x.label)).map((x) => `<a href="${esc(/^https?:/.test(x.url) ? x.url : asset(page, x.url))}">${esc(x.label)}</a>`).join(" · ");
  const figs = (p.figures || []).map((f) => `<figure class="pro-figure"><img src="${asset(page, f.src)}" alt="${esc(f.alt)}" loading="lazy" decoding="async"><figcaption>${esc(f.caption)}</figcaption></figure>`).join("");
  const docs = (p.documents || []).map((d) => `<li><a href="${esc(/^https?:/.test(d.url) ? d.url : asset(page, d.url))}">${esc(d.label)}</a></li>`).join("");
  const content = `<p><a href="${asset(page, index)}">Back to projects</a></p><article class="detail-page"><header class="detail-header"><h1>${esc(p.title)}</h1><p class="detail-lead">${esc(p.summary)}</p><p class="detail-meta"><span>${esc(p.year)}</span><span>${esc(p.status)}</span><span>${esc(p.category)}</span></p><p class="project-tags">${p.tags.map(esc).join(" · ")}</p>${links ? `<p class="detail-actions">${links}</p>` : ""}</header><div class="detail-copy">${figs ? `<section class="pro-visuals" aria-label="Selected visuals">${figs}</section>` : ""}<section><h2>Problem</h2><p>${esc(p.problem)}</p></section><section><h2>Work</h2>${list(p.work)}</section><section><h2>Result</h2>${list(p.outcomes)}</section>${docs ? `<section><h2>Paper and documents</h2><ul class="document-list">${docs}</ul></section>` : ""}</div></article>`;
  save(page, proShell(page, p.title, content, "projects", p.summary));
}

const galleryPage = "professional/gallery.html";
const galleryProjects = academic.filter((p) => galleryMedia.some((item) => item.project === p.id));
const galleryPriority = ["pitm", "rizz8", "cardy", "motion-coupled", "kissan-dost", "wearables", "imd-security", "wristband", "voltage-trace-bench", "wit-long-range"];
const galleryProjectIds = [...new Set(galleryMedia.map((item) => item.project || "miscellaneous"))];
galleryProjectIds.sort((a, b) => {
  const ai = galleryPriority.indexOf(a);
  const bi = galleryPriority.indexOf(b);
  return (ai < 0 ? galleryPriority.length : ai) - (bi < 0 ? galleryPriority.length : bi);
});
const galleryItems = galleryProjectIds.flatMap((id) => {
  const items = galleryMedia.filter((item) => (item.project || "miscellaneous") === id);
  const videos = items.filter((item) => item.type === "video");
  const images = items.filter((item) => item.type !== "video");
  const ordered = [];
  let imageIndex = 0;
  for (const video of videos) {
    ordered.push(video);
    for (let spacer = 0; spacer < 2 && imageIndex < images.length; spacer++) ordered.push(images[imageIndex++]);
  }
  ordered.push(...images.slice(imageIndex));
  return ordered;
});
const proGalleryTile = (item) => {
  const project = academic.find((p) => p.id === item.project);
  const label = project?.shortTitle || project?.title || "Gallery only";
  const kind = item.type === "video" ? "Video" : "Photo";
  const caption = `${label}. ${kind} ${Number(item.id.split("-").at(-1))}.`;
  const projectUrl = project ? asset(galleryPage, `professional/projects/${encodeURIComponent(project.id)}.html`) : "";
  const preview = item.type === "video" ? `<video class="media-hover-video" muted loop playsinline preload="none" data-video-src="${esc(asset(galleryPage, item.src))}" aria-hidden="true"></video>` : "";
  return `<figure class="media-tile" data-project="${esc(item.project || "miscellaneous")}" data-type="${esc(item.type)}"><a class="media-open" href="${esc(asset(galleryPage, item.src))}" data-media-id="${esc(item.id)}" data-type="${esc(item.type)}" data-caption="${esc(caption)}" data-label="${esc(label)}" data-project-url="${projectUrl}" data-poster="${item.poster ? esc(asset(galleryPage, item.poster)) : ""}" aria-label="Open ${esc(caption)}"><img src="${esc(asset(galleryPage, item.thumbnail))}" width="${item.width}" height="${item.height}" alt="${esc(caption)}" loading="lazy" decoding="async" fetchpriority="low">${preview}${item.type === "video" ? '<span class="video-badge" aria-hidden="true">▶ Video</span>' : ""}<span class="media-label">${esc(label)}</span></a><figcaption class="visually-hidden">${esc(caption)}${project ? ` <a href="${projectUrl}">Project details</a>` : ""}</figcaption></figure>`;
};
const galleryMain = `<header class="page-header"><h2>Gallery</h2><p>Project photos and videos from research, software and hardware work.</p></header><form class="gallery-controls" aria-label="Gallery filters"><label for="gallery-project">Project</label><select id="gallery-project"><option value="all">All projects</option>${galleryProjects.map((p) => `<option value="${esc(p.id)}">${esc(p.shortTitle || p.title)}</option>`).join("")}<option value="miscellaneous">Gallery only</option></select><label for="gallery-type">Media</label><select id="gallery-type"><option value="all">Photos and videos</option><option value="image">Photos</option><option value="video">Videos</option></select></form><p class="gallery-count result-count" aria-live="polite">${galleryMedia.length} items</p><div class="media-grid gallery-grid">${galleryItems.map(proGalleryTile).join("\n")}</div><p class="gallery-empty" hidden>No media matches these filters.</p>`;
save(galleryPage, proShell(galleryPage, "Professional gallery", galleryMain, "gallery"));

// Include both editions and retained legacy URLs in search discovery.
const urls = ["/", "/projects.html", "/gallery.html", ...academic.map((p) => `/projects/${p.id}.html`), "/academic/", "/academic/projects.html", "/academic/gallery.html", ...academic.map((p) => `/academic/projects/${p.id}.html`), "/professional/", "/professional/projects.html", "/professional/gallery.html", ...allProfessionalProjects.map((p) => `/professional/projects/${p.id}.html`)];
save("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${origin}${url}</loc></url>`).join("\n")}\n</urlset>\n`);
console.log(`Built academic edition and ${allProfessionalProjects.length} professional project pages plus the professional gallery.`);
