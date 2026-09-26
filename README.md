# Umer Irfan website

Static portfolio for GitHub Pages.

## Local preview

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000` from inside this folder.

## Publish

Push the contents of this folder to the root of a GitHub Pages repository. Enable Pages for the branch in the repository settings.

The site has no build step and no external runtime dependency.

The critical stylesheet, profile image, and page scripts are preloaded. A service worker caches HTML, CSS, JavaScript, and the profile image after the first visit. Large PDFs remain outside the service worker cache and embedded documents load lazily.

## Content

- `index.html` contains the home page
- `projects.html` contains search and filters
- `project.html` renders project details from the query string
- `assets/js/data.js` contains project content and links
- `assets/docs` contains the CV and portfolio
- `assets/papers` contains public papers
- `assets/writeups` contains public project writeups

Project manuscripts and writeups supplied for the website are linked from their project pages. Public papers are stored under `assets/papers`. Project manuscripts are stored under `assets/writeups`.

The website and its contents are distributed under the all rights reserved terms in `LICENSE`.
