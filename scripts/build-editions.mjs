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

const esc = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const save = (name, value) => {
  const target = path.join(root, name);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, value);
};
const load = (name) => fs.readFileSync(path.join(root, name), "utf8");
const sitePath = (from, target) => path.posix.relative(path.posix.dirname(from), target) || "./";
const asset = (page, target) => sitePath(page, target);

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
    summary: "A low-latency voice automation prototype built for a startup exploring a Carl Zeiss sales opportunity.",
    problem: "A useful telephone agent has to listen, transcribe, respond and return speech quickly enough for conversation.",
    work: ["Built the streaming service with Node.js and WebSockets.", "Integrated WebRTC voice activity detection, Whisper transcription and GPT-4 response generation.", "Tuned buffering and pipeline stages under Asif Mufti's supervision."],
    outcomes: ["Reduced spoken response latency to under four seconds.", "Built a sales demo prototype. Carl Zeiss was a prospective customer, not a deployment."],
    links: [{ label: "Asif Mufti", url: "https://www.researchgate.net/profile/Asif-Mufti" }],
    figures: [{ src: "assets/figures/voice-pipeline.svg", alt: "Voice agent pipeline from incoming speech to generated reply", caption: "Prototype pipeline. Speech is segmented, transcribed and passed to response generation before playback." }]
  },
  {
    id: "wellness-lamp", title: "Wellness Lamp", year: "2026", category: "Product and app",
    status: "Public source", tags: ["React Native", "TypeScript", "BLE", "ESP32"],
    summary: "A mobile-controlled lamp with mood-based color palettes and synchronized ESP32 nodes.",
    problem: "A small lighting device needs a usable control interface and reliable state sharing across nodes.",
    work: ["Built React Native screens for color, brightness, themes and sound.", "Implemented palette selection from mood inputs and BLE device control.", "Developed ESP32 firmware that synchronizes multiple nodes over ESP-NOW."],
    outcomes: ["Published the application and firmware source.", "Built an end-to-end path from app interaction to coordinated lamp output."],
    links: [{ label: "Public repository", url: "https://github.com/Foxunderground0/Wellness-Lamp" }],
    figures: [{ src: "assets/figures/wellness-palettes.webp", alt: "Wellness Lamp preset palettes", caption: "Preset palettes used in the mobile control interface." }]
  },
  {
    id: "fintelligent", title: "Fintelligent Website", year: "2026", category: "Client website",
    status: "Live website", tags: ["Next.js", "React", "TypeScript", "Responsive UI"],
    summary: "A public Next.js website for an equipment-finance consultancy.",
    problem: "Prospective clients need a clear account of the firm's services and a direct path to make contact.",
    work: ["Built responsive pages with Next.js, React and TypeScript.", "Organized service information and contact paths for the public site."],
    outcomes: ["Published the client website at fintelligent.cc."],
    links: [{ label: "Live website", url: "https://fintelligent.cc/" }],
    figures: [{ src: "assets/figures/fintelligent-home.webp", alt: "Fintelligent public website homepage", caption: "Live website homepage captured from the public site." }]
  },
  {
    id: "makers-dashboard", title: "Makers Lab Dashboard", year: "2024", category: "Full-stack software",
    status: "Public source", tags: ["React", "Express", "PostgreSQL", "Docker Compose"],
    summary: "A lab operations dashboard for equipment, staff, tasks and usage records.",
    problem: "A shared fabrication lab needs one place to manage resources and daily work.",
    work: ["Built React data views and forms backed by an Express service and PostgreSQL.", "Tracked equipment, people, tasks and usage records.", "Packaged frontend, backend and database with Docker Compose."],
    outcomes: ["Released the full-stack application as public source."],
    links: [{ label: "Public repository", url: "https://github.com/Foxunderground0/Makers-Lab-Dashboard" }],
    figures: [{ src: "assets/figures/makers-dashboard.webp", alt: "Makers Lab task dashboard populated with sample records", caption: "Application running locally with synthetic task records for this screenshot." }]
  },
  {
    id: "violet-peer-tutoring", title: "Violet Peer Tutoring", year: "2026", category: "App and AI prototype",
    status: "Team course project", tags: ["Android", "Java", "Firebase", "AI assistant"],
    summary: "An Android peer tutoring app with locally prototyped AI guidance and flashcard features.",
    problem: "Students need ways to find tutors, plan sessions and study between meetings.",
    work: ["Contributed to the Android and Firebase application.", "Prototyped an AI study assistant and generated flashcard flow in a local development branch."],
    outcomes: ["Built populated tutoring and scheduling screens.", "AI screens are local prototype work and are not represented as part of the public repository."],
    links: [],
    figures: [{ src: "assets/figures/violet-ai.svg", alt: "Diagram of local AI assistant and generated flashcard prototype", caption: "Local prototype feature flow. It is not a screenshot of a deployed AI service." }, { src: "assets/figures/violet-schedule.webp", alt: "Violet tutoring schedule in a demo account", caption: "Representative scheduling screen from a demo account. AI prototype screens will be added after capture." }]
  },
  {
    id: "project-x", title: "Project X Camera Firmware", year: "2024 to 2025", category: "Professional work",
    status: "Private source", tags: ["ESP32", "Camera", "OTA", "MQTT"],
    summary: "Camera-device firmware for updates, connectivity and operational telemetry.",
    problem: "A connected camera needs a way to receive updates and report device state after installation.",
    work: ["Worked on ESP32 camera firmware and device connection paths.", "Implemented OTA update fetching and MQTT heartbeat and error telemetry."],
    outcomes: ["Created the device-side update and reporting path.", "The React Native application and separate backend evidence will be added when available."],
    links: [],
    figures: [{ src: "assets/figures/project-x-flow.svg", alt: "Project X device update and telemetry flow", caption: "Firmware-side flow. This diagram does not claim validated TLS for OTA or MQTT." }]
  },
  {
    ...byId["parda"], category: "Applied AI research", shortTitle: "PARDA",
    summary: "Conversation-aware privacy redaction and speaker voice replacement for smart glasses.",
    work: ["Extended SEAL-style redaction, an adversarial sensitive-content anonymisation method, from static text to multi-speaker conversation with retrieval and persistent context.", "Distilled an adversary and anonymizer workflow into a 2B model using 717 CANDOR conversations.", "Evaluated quantized components on Raspberry Pi 5."],
    outcomes: ["On 143 held-out conversations, model-judged leakage fell from 0.502 to 0.378 while utility rose from 0.875 to 0.900.", "First-author manuscript submitted to IEEE PerCom 2027. Complete end-to-end real-time deployment is not claimed."],
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
  { ...byId.pixelpacker, category: "Applied AI research" },
  { ...byId.watchtower, category: "Applied AI research" }
];
const order = ["voice-agent", "project-x", "wellness-lamp", "fintelligent", "makers-dashboard", "violet-peer-tutoring", "parda", "kissan-dost", "wearables", "redis-cache", "poki-api", "watchtower", "pixelpacker"];
professional.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));

function proShell(page, title, main, active = "about", description = "Software engineering and applied AI work by Umer Irfan.") {
  const link = (target) => asset(page, target);
  const cv = link("assets/docs/Umer_Irfan_Professional_CV.pdf");
  const academicCv = link("assets/docs/Umer_Irfan_CV.pdf");
  const image = link("assets/images/profile.webp");
  const contacts = `<ul class="profile-links"><li><a href="mailto:umerirfan1205@gmail.com">Email</a></li><li><a href="https://github.com/Foxunderground0">GitHub</a></li><li><a href="https://www.linkedin.com/in/umer-irfan--">LinkedIn</a></li><li><a href="${cv}">Professional CV</a></li><li><a href="${academicCv}">Academic CV</a></li></ul>`;
  const nav = `<header class="site-header"><nav class="nav shell" aria-label="Main navigation"><a class="wordmark" href="${link("professional/index.html")}"><img class="nav-avatar" src="${image}" alt="" width="30" height="30"><span>Umer Irfan</span></a><div class="nav-links">${switchFor("professional", page)}<a href="${link("professional/index.html")}"${active === "about" ? ' aria-current="page"' : ""}>About</a><a href="${link("professional/projects.html")}"${active === "projects" ? ' aria-current="page"' : ""}>Projects</a><a href="${cv}">CV</a><a href="${link("professional/index.html")}#contact">Contact</a></div></nav></header>`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="${esc(description)}"><meta name="theme-color" content="#ffffff"><meta name="site-root" content="${asset(page, ".")}/"><link rel="canonical" href="${origin}/${page}"><meta property="og:title" content="${esc(title)} | Umer Irfan"><meta property="og:description" content="${esc(description)}"><title>${esc(title)} | Umer Irfan</title><link rel="stylesheet" href="${link("assets/css/styles.css")}"><script defer src="${link("assets/js/performance.js")}"></script></head><body><a class="skip-link" href="#main">Skip to content</a><aside class="mobile-profile shell" aria-label="Profile"><img class="profile-photo" src="${image}" alt="Umer Irfan" width="269" height="275"><div class="mobile-profile-copy"><h1>Umer Irfan</h1><p>Software engineering and applied AI. BSc Computer Science at LUMS.</p></div>${contacts}</aside>${nav}<div class="academic-layout shell"><aside class="profile" aria-label="Profile"><img class="profile-photo" src="${image}" alt="Umer Irfan" width="269" height="275"><h1>Umer Irfan</h1><p>Software engineering and applied AI. BSc Computer Science at LUMS.</p><p>Minor in Computer Engineering<br>Lahore, Pakistan</p>${contacts}</aside><main id="main" class="academic-main">${main}</main></div><footer class="footer shell"><p>Copyright Umer Irfan 2026. Unpublished research content may not be reproduced without permission. <a href="${link("LICENSE")}">License</a></p></footer></body></html>`;
}

function entry(page, p) {
  const url = asset(page, `professional/projects/${p.id}.html`);
  const search = [p.title, p.summary, p.category, ...p.tags, ...p.work].join(" ").toLowerCase();
  return `<article class="project-entry" data-category="${esc(p.category)}" data-search="${esc(search)}"><div><div class="project-title-line"><h3><a href="${url}">${esc(p.shortTitle || p.title)}</a></h3></div><p>${esc(p.summary)}</p><p class="project-tags">${p.tags.slice(0, 4).map(esc).join(" · ")}</p></div><div class="project-entry-meta">${esc(p.year)}<br>${esc(p.category)}</div></article>`;
}

const home = "professional/index.html";
const homeMain = `<section class="content-section"><h2>About</h2><p>I am a Computer Science undergraduate at LUMS. I built a real-time sales voice agent and worked on Urdu conversational guidance grounded in live sensor data. My other work includes React and React Native applications.</p><p>This edition focuses on software and applied ML. The <a href="${asset(home, "academic/index.html")}">academic edition</a> has my hardware-security work and full publication list.</p></section>
<section class="content-section"><h2>Professional experience</h2><div class="experience-list"><article><h3><a href="projects/voice-agent.html">Streaming Voice Agent</a></h3><p>AI/ML Engineer. Aug 2024 to Mar 2025. Built a sales demo prototype under <a href="https://www.researchgate.net/profile/Asif-Mufti">Asif Mufti</a>. WebSockets, WebRTC VAD, Whisper and GPT-4. Spoken responses in under four seconds. Carl Zeiss was a prospective customer.</p></article><article><h3><a href="projects/project-x.html">Project X</a></h3><p>React Native Engineer. Nov 2024 to Jun 2025. Built smart-camera Android flows and worked on ESP32 update and telemetry firmware. The case study currently covers the firmware.</p></article><article><h3><a href="https://www.theuniapp.com/">U.n.I Social App</a></h3><p>DevOps Engineer. May to Jul 2024. Built container delivery workflows with GitHub Actions, EC2 and NGINX.</p></article></div></section>
<section class="content-section"><div class="section-heading"><h2>Selected projects</h2><a href="projects.html">All projects</a></div><div class="project-list">${professional.slice(0, 5).map((p) => entry(home, p)).join("\n")}</div></section>
<section class="content-section"><h2>Applied AI research</h2><ul class="plain-list"><li><a href="projects/kissan-dost.html">Kissan-Dost</a>. Accepted at IEEE DCOSS-IoT 2026. Urdu WhatsApp voice and text guidance grounded in field sensor data.</li><li><a href="projects/wearables.html">LLM-Enhanced Wearables</a>. Public preprint. A low-cost wearable paired with plain-language WhatsApp health feedback.</li><li><a href="projects/parda.html">PARDA</a>. First-author manuscript submitted to IEEE PerCom 2027. Retrieval-aware audio privacy with a distilled 2B model.</li></ul></section>
<section id="contact" class="content-section contact"><h2>Contact</h2><p><a href="mailto:umerirfan1205@gmail.com">Email</a> · <a href="https://github.com/Foxunderground0">GitHub</a> · <a href="https://www.linkedin.com/in/umer-irfan--">LinkedIn</a> · <a href="${asset(home, "assets/docs/Umer_Irfan_Professional_CV.pdf")}">Professional CV</a></p></section>`;
save(home, proShell(home, "Professional work", homeMain));

const index = "professional/projects.html";
const listMain = `<header class="page-header"><h2>Projects</h2><p>Professional work, product builds and applied AI research. Work is ordered by relevance to software and AI roles.</p></header><section class="project-controls" aria-label="Project filters"><label for="project-search">Search</label><input id="project-search" type="search" autocomplete="off"><div id="category-filters" class="filter-list" aria-label="Filter by category"></div></section><p id="result-count" class="result-count"></p><section id="project-list" class="project-list" aria-live="polite">${professional.map((p) => entry(index, p)).join("\n")}</section><p id="empty-state" hidden>No projects match this search.</p>`;
save(index, proShell(index, "Professional projects", listMain, "projects").replace("</head>", `<script defer src="${asset(index, "assets/js/projects.js")}"></script></head>`));

for (const p of professional) {
  const page = `professional/projects/${p.id}.html`;
  const list = (items) => `<ul>${items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;
  const links = (p.links || []).filter((x) => !/private/i.test(x.label)).map((x) => `<a href="${esc(/^https?:/.test(x.url) ? x.url : asset(page, x.url))}">${esc(x.label)}</a>`).join(" · ");
  const figs = (p.figures || []).map((f) => `<figure class="pro-figure"><img src="${asset(page, f.src)}" alt="${esc(f.alt)}" loading="lazy" decoding="async"><figcaption>${esc(f.caption)}</figcaption></figure>`).join("");
  const docs = (p.documents || []).map((d) => `<li><a href="${esc(/^https?:/.test(d.url) ? d.url : asset(page, d.url))}">${esc(d.label)}</a></li>`).join("");
  const content = `<p><a href="${asset(page, index)}">Back to projects</a></p><article class="detail-page"><header class="detail-header"><h1>${esc(p.title)}</h1><p class="detail-lead">${esc(p.summary)}</p><p class="detail-meta"><span>${esc(p.year)}</span><span>${esc(p.status)}</span><span>${esc(p.category)}</span></p><p class="project-tags">${p.tags.map(esc).join(" · ")}</p>${links ? `<p class="detail-actions">${links}</p>` : ""}</header><div class="detail-copy">${figs ? `<section class="pro-visuals" aria-label="Selected visuals">${figs}</section>` : ""}<section><h2>Problem</h2><p>${esc(p.problem)}</p></section><section><h2>Work</h2>${list(p.work)}</section><section><h2>Result</h2>${list(p.outcomes)}</section>${docs ? `<section><h2>Paper and documents</h2><ul class="document-list">${docs}</ul></section>` : ""}</div></article>`;
  save(page, proShell(page, p.title, content, "projects", p.summary));
}

// Include both editions and retained legacy URLs in search discovery.
const urls = ["/", "/projects.html", "/gallery.html", ...academic.map((p) => `/projects/${p.id}.html`), "/academic/", "/academic/projects.html", "/academic/gallery.html", ...academic.map((p) => `/academic/projects/${p.id}.html`), "/professional/", "/professional/projects.html", ...professional.map((p) => `/professional/projects/${p.id}.html`)];
save("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${origin}${url}</loc></url>`).join("\n")}\n</urlset>\n`);
console.log(`Built academic edition and ${professional.length} professional project pages.`);
