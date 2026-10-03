# Umer Irfan website

Static portfolio for GitHub Pages.

## Local preview

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000` from inside this folder.

## Publish

Push the contents of this folder to the root of a GitHub Pages repository. Enable Pages for the branch in the repository settings.

The published site has no deployment build step and no external runtime dependency.

Academic project content is stored in `assets/js/data.js`. Professional editorial content is in `scripts/build-editions.mjs`. After editing either, regenerate both editions with:

```sh
node scripts/build-project-pages.mjs
node scripts/build-editions.mjs
```

The root site and `/projects/*.html` remain academic for old links. `/academic/` repeats that edition. `/professional/` has its own homepage, index, and static project pages. Both editions share CSS, JavaScript, and media assets. The academic PDF remains under `assets/docs/Umer_Irfan_CV.pdf`; the separate professional PDF is `assets/docs/Umer_Irfan_Professional_CV.pdf`.

The root-level `../todo.txt` tracks source and screenshot material not yet available for publication. Do not copy it into the Pages repository. Never publish API keys, service-account files, private source, or demo-fixture data.

The service worker keeps only the small site shell in its cache. It prefetches at most one HTML page after a visitor hovers over a same-site link for 250 ms. Leaving the link or clicking cancels that request. It does not fetch a page's images, videos, PDFs, or other media speculatively. Gallery thumbnails load as they approach the viewport. Videos stream directly when previewed or opened and are never copied into the service worker cache.

## Content

- `index.html` contains the home page
- `projects.html` contains search and filters
- `projects/*.html` contains crawlable project detail pages
- `gallery.html` contains a static photo and video gallery with project filters
- `project.html` redirects older query string project links to the static pages
- `assets/js/data.js` contains project content and links
- `assets/docs` contains the CV and portfolio
- `assets/papers` contains public papers
- `assets/writeups` contains public project writeups
- `assets/media` contains compressed images, video previews, MP4 clips, and a media manifest

To refresh media from the named project folders in Downloads, use `python3 scripts/import-media.py` with Pillow and FFmpeg available. This creates optimized website copies and keeps the source files intact. Then regenerate the HTML with `node scripts/build-project-pages.mjs`. Images use WebP with separate thumbnails. Videos use H.264 MP4 with a preview image. The media viewer supports project links, previous and next controls, arrow keys, and Escape.

Project manuscripts and writeups supplied for the website are linked from their project pages. Public papers are stored under `assets/papers`. Project manuscripts are stored under `assets/writeups`.

The service worker caches the small site shell and prefetches at most one HTML page after a same site link is hovered for 250 ms. It cancels that request when the pointer leaves or a link is clicked. It does not prefetch page media. Gallery thumbnails load lazily near the viewport. Videos bypass the service worker cache and stream directly when previewed or opened.

The website and its contents are distributed under the all rights reserved terms in `LICENSE`.
