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

Project content is stored in `assets/js/data.js`. After editing project data, regenerate the crawlable project index and individual HTML pages with:

```sh
node scripts/build-project-pages.mjs
```

The service worker starts a parallel background preload on every page visit. It first caches the opening ten seconds of every video using byte ranges. It then caches complete videos, images, documents, and project pages. Cached videos support byte-range playback. The current content set is about 170 MB, so the first visit can use substantial bandwidth and storage. Cache failures are handled without blocking the page.

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

The website and its contents are distributed under the all rights reserved terms in `LICENSE`.
