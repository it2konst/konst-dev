# konst-dev

[Русская версия](README.ru.md)

[![CI](https://github.com/it2konst/konst-dev/actions/workflows/ci.yml/badge.svg)](https://github.com/it2konst/konst-dev/actions/workflows/ci.yml)

My portfolio site, built with Nuxt 4. Each project is one JSON file in the repository: commit the file, and the site rebuilds with a new card, a project page and both languages. No CMS, no database, no admin panel.

![konst-dev home page, light theme on the left and dark on the right](docs/screenshots/overview.png)

> **In progress.** The shell is done: design tokens, light and dark themes, English and Russian, the layout, tests and CI. Projects arrive in the next stage of the [roadmap](#roadmap).

## Features

- Static site: every page is pre-rendered to HTML, so it loads fast and hosts anywhere
- English at `/` and Russian at `/ru`, each page with its own address, a canonical link and hreflang alternates for search engines
- The first visit follows the browser language; after that the choice is kept
- The language link opens the same page in the other language, not the home page
- Light, dark and system themes; the theme is applied before the first paint, so pages never flash
- Design tokens in two layers: a raw SCSS palette and semantic CSS custom properties that components use
- Every text color passes WCAG AA on every surface in both themes, and a test keeps it that way
- No pure white or black, softened contrast for long reading
- Fonts (Onest and JetBrains Mono) are bundled with the site: no requests to font CDNs
- Keyboard friendly: a skip link, visible focus everywhere, toggle buttons that announce their state
- Respects reduced motion
- Responsive down to phone width; on phones the navigation gets its own row instead of a hidden menu
- Localized 404 and error pages

## Tech stack

| Area            | Tools                                                    |
| --------------- | -------------------------------------------------------- |
| Framework       | Nuxt 4, Vue 3, TypeScript (strict)                       |
| Rendering       | Static generation with `nuxt generate`, hosted on Vercel |
| Styles          | SCSS, design tokens as CSS custom properties, no UI kit  |
| Localization    | @nuxtjs/i18n                                             |
| Themes          | @nuxtjs/color-mode                                       |
| Fonts           | @fontsource-variable/onest, jetbrains-mono               |
| Quality         | ESLint (@nuxt/eslint), Prettier, vue-tsc                 |
| Tests           | Vitest, @nuxt/test-utils, happy-dom                      |
| CI              | GitHub Actions                                           |
| Package manager | pnpm                                                     |

## Getting started

Requires Node.js 22 or newer and pnpm 10.

```bash
pnpm install
pnpm dev
```

The dev server runs at http://localhost:3000.

| Script              | What it does                                   |
| ------------------- | ---------------------------------------------- |
| `pnpm dev`          | Start the dev server                           |
| `pnpm generate`     | Build the static site into `.output/public`    |
| `pnpm preview`      | Serve the built site locally                   |
| `pnpm build`        | Build for a Node server (not used for hosting) |
| `pnpm lint`         | Lint and auto-fix                              |
| `pnpm lint:check`   | Lint without changing files                    |
| `pnpm format`       | Format the project with Prettier               |
| `pnpm format:check` | Check formatting                               |
| `pnpm type-check`   | Run vue-tsc through `nuxt typecheck`           |
| `pnpm test`         | Run all tests once                             |
| `pnpm test:watch`   | Run tests on every change                      |

### Site address

Canonical and hreflang links need the public address of the site. It defaults to `https://konst-dev.vercel.app`; to use another one, set `NUXT_PUBLIC_SITE_URL` in the hosting settings.

## Tests

Tests run with Vitest locally and on every push in GitHub Actions, together with lint, formatting, type-check and the static build.

- **Design tokens:** the test reads the SCSS token files and checks every text color against every surface in both themes for WCAG AA contrast, plus text on the accent fill. Change the palette in a way that hurts readability, and CI fails.
- **Translations:** English and Russian have the same keys, no empty strings and no long dashes.
- **Components**, mounted in a real Nuxt app: the theme switch marks one option as pressed and changes the theme; the language link points to the same page in the other language.

## Project structure

```text
app/
  assets/styles/
    tokens/      raw palette, semantic colors, type, space, radius, motion
    base/        reset, typography, buttons, page blocks, utilities
    _mixins.scss breakpoints and helpers, available in every component
  components/
    layout/      header and footer
    ui/          theme switch, language link
  composables/   shared head tags: title, description, hreflang
  layouts/       page frame with the skip link
  pages/         home, projects, about
  error.vue      404 and error page
i18n/locales/    English and Russian messages
test/
  unit/          tokens and translations
  nuxt/          components inside Nuxt
```

## Roadmap

1. ~~Shell: tooling, design tokens, themes, EN/RU, layout, tests and CI~~ ✓
2. Projects as data: a typed Nuxt Content collection, one JSON file per project, the project grid
3. Project pages and filters: a page per project with screenshots and a write-up, filtering by stack, optimized images
4. Home page: the hero and featured projects
5. About and contacts: experience, skills, links
6. SEO and sharing: Open Graph images, sitemap, favicon
7. Polish: motion, an accessibility pass, Lighthouse, deploy guide

## Author

Made by [it2konst](https://github.com/it2konst). Issues and suggestions are welcome in [GitHub Issues](https://github.com/it2konst/konst-dev/issues).

## License

[MIT](LICENSE)
