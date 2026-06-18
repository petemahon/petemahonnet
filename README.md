# petemahon.net

[![Build and deploy](https://github.com/petemahon/petemahonnet/actions/workflows/hugo.yaml/badge.svg)](https://github.com/petemahon/petemahonnet/actions/workflows/hugo.yaml)
[![Built with Hugo](https://img.shields.io/badge/built%20with-Hugo-ff4088?logo=hugo&logoColor=white)](https://gohugo.io)
[![Theme: hello-friend-ng](https://img.shields.io/badge/theme-hello--friend--ng-b06500)](https://github.com/rhazdon/hugo-theme-hello-friend-ng)
[![Deployed to GitHub Pages](https://img.shields.io/badge/deployed-GitHub%20Pages-222?logo=github)](https://petemahon.net)
[![Licence: CC0 1.0](https://img.shields.io/badge/licence-CC0%201.0-lightgrey)](LICENSE)
[![Last commit](https://img.shields.io/github/last-commit/petemahon/petemahonnet)](https://github.com/petemahon/petemahonnet/commits/main)

The source for [petemahon.net](https://petemahon.net) (also served as mahon.pro), a
personal [Hugo](https://gohugo.io) static site covering cybersecurity and technology
writing, plus a recipes section.

## Stack

- **Generator:** Hugo (extended)
- **Theme:** [hello-friend-ng](https://github.com/rhazdon/hugo-theme-hello-friend-ng) (git submodule)
- **Hosting:** GitHub Pages, fronted by Cloudflare
- **Build/deploy:** GitHub Actions (`.github/workflows/hugo.yaml`) on every push to `main`

## Layout

| Path | What's there |
| --- | --- |
| `content/` | Posts, the about page, and other pages |
| `layouts/` | Custom template overrides on top of the theme |
| `assets/` | SCSS/JS processed by Hugo Pipes |
| `static/` | Files copied verbatim into the site |
| `data/`, `i18n/` | Site data files and translations |
| `archetypes/` | Templates for new content |
| `hugo.toml` | Site configuration |

## Local development

Clone with submodules so the theme comes along:

```sh
git clone --recurse-submodules <repo-url>
# or, if already cloned:
git submodule update --init --recursive
```

Run a live-reloading local server:

```sh
hugo server -D    # -D includes draft posts
```

Build the static site into `public/`:

```sh
hugo --minify
```

## Deployment

Pushing to `main` triggers the GitHub Actions workflow, which builds the site with the
pinned Hugo version and publishes it to GitHub Pages. There is no manual deploy step.

## Licence

Content and configuration are released under [CC0 1.0](LICENSE). The bundled theme keeps
its own upstream licence.
