# Arquitectura

Template para SPAs estáticas con React 19 + TypeScript + React Router 8 en _framework mode_. No hay servidor en runtime: cada URL pública se prerenderiza a HTML en el build y el host solo sirve archivos.

## Flujo de una petición

```
build:   routes.ts ─► prerender.ts (lista de URLs) ─► loader + meta + vista ─► build/client/<ruta>/index.html
                                                                              build/client/<ruta>.data
         postbuild.mjs ─► lee el <head> de cada HTML ─► valida canonical/hreflang ─► sitemap.xml + robots.txt

runtime: host (S3/CloudFront, Netlify, nginx…) ─► /about → about/index.html (HTML completo, sin JS)
         navegador hidrata ─► navegación cliente: pide /en/blog.data (generado en el build), no HTML
```

Consecuencias:

- **Los `loader` corren solo en el build.** Sirven para contenido y SEO. Los datos en vivo del cliente van con React Query.
- **No hay `action`.** Los formularios llaman APIs con `useMutation`.
- **Toda URL pública debe estar en `src/app/routes/prerender.ts`.** Una URL fuera de la lista recibe el 404 del host.

## Capas: `app → features → shared`

`src/` tiene tres carpetas. Las dependencias van en un solo sentido y ESLint lo fuerza (`no-restricted-imports` en `eslint.config.js`):

```
src/app/ ──────────► src/features/<dominio>/index.ts ──────────► src/shared/
 root, rutas,          (API pública de cada feature)               ui, i18n, seo, config,
 layout                                                            feature-flags, analytics,
   │                                                               lib, hooks, utils, styles
   └───────────────────────────────────────────────────────────────►
```

| Regla                                                 | Por qué                                                                      |
| ----------------------------------------------------- | ---------------------------------------------------------------------------- |
| `shared/` no importa de `app/` ni de `features/`      | Lo compartido no conoce el dominio; se puede copiar a otro proyecto tal cual |
| `features/` no importa de `app/` ni de otra feature   | Cada feature se borra o se copia como una carpeta                            |
| `app/` importa una feature solo por su `index.ts`     | El interior de la feature se puede reorganizar sin tocar las rutas           |
| Dentro de una feature, imports relativos              | Deja claro qué es interno y qué viene de `shared/`                           |
| Entre carpetas, alias `#app/` `#features/` `#shared/` | La regla ve la capa en el import; `../../` está prohibido                    |

¿Dos features necesitan lo mismo? Va a `shared/`. ¿Una página combina dos features? Se componen en la ruta, en `app/`.

### Dentro de una feature

```
views/  ──►  components/  ──►  hooks/  ──►  api/  ──►  types.ts
                                              └──► content/ (JSON del dominio)
```

| Carpeta       | Qué contiene                                              | Reglas                                                                                      |
| ------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `views/`      | Cuerpo de una página                                      | Solo compone componentes. Sin estado ni efectos.                                            |
| `components/` | Bloques de la feature (hero, formulario, tarjeta de post) | Leen textos con `use<X>Text()`. Si los usan 2+ features, suben a `shared/ui` (sin i18n).    |
| `hooks/`      | Fachadas (validación, mutaciones, queries)                | La vista solo renderiza lo que devuelven. Fábrica de keys `<dominio>Keys` para React Query. |
| `api/`        | Acceso a datos: funciones `async` puras + mappers         | Sin React. Cambiar JSON por CMS/API solo toca esta carpeta.                                 |
| `types.ts`    | Schemas de zod + tipos inferidos                          | Validan en el borde (contenido, formularios).                                               |
| `content/`    | Contenido del dominio por locale (`es.json`, `en.json`)   | Validado con zod en el build.                                                               |
| `i18n/`       | Textos de la feature: `es.ts` (fuente del tipo), `en.ts`  | `use<X>Text()` en componentes; `<x>Text[locale]` en `meta` (exportado por `index.ts`).      |
| `index.ts`    | API pública                                               | Solo lo que `app/` necesita: vistas y funciones para `loader`.                              |

### `app/`

| Carpeta / archivo | Qué contiene                                              | Reglas                                                                                                     |
| ----------------- | --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `root.tsx`        | Documento HTML, providers, error boundary raíz            | `appDirectory` de React Router = `src/app`.                                                                |
| `routes.ts`       | Tabla de rutas                                            | Una montura por locale con `id` propio.                                                                    |
| `routes/*.tsx`    | Módulos de ruta: `loader`, `meta`, componente por defecto | Delgados: resuelven locale y datos, declaran el `<head>` y renderizan **una** vista. Sin markup ni lógica. |
| `layout/`         | Chrome del sitio (header, footer, shell)                  | Pueden leer i18n, config y flags.                                                                          |

## Árbol: dónde va cada cosa

```
.
├─ .claude/                     Tooling de Claude Code (ver docs/ai-tooling.md)
│  ├─ settings.json             Permisos del proyecto + hook de formateo
│  ├─ hooks/format-file.mjs     PostToolUse: eslint --fix + prettier al archivo editado
│  ├─ skills/                   new-page, new-component, new-feature, react-router (oficial), openspec-*
│  └─ commands/opsx/            /opsx:propose, apply, archive… (generados por OpenSpec)
├─ .github/
│  ├─ workflows/ci.yml          PR y main: calidad, build+e2e, storybook, job agregador "ci result"
│  ├─ workflows/deploy.yml      Build sin credenciales + deploy opcional (vars.DEPLOY_TARGET)
│  ├─ dependabot.yml            Actualizaciones agrupadas semanales
│  ├─ pull_request_template.md
│  └─ ISSUE_TEMPLATE/
├─ .husky/                      pre-commit (lint-staged) y commit-msg (commitlint)
├─ .storybook/                  Storybook 10 con su propio vite.config.ts (sin plugin de RR)
├─ .vscode/                     Extensiones recomendadas y formateo al guardar
├─ design/tokens.json           FUENTE de los design tokens (color, tipo, espacio, radios)
├─ docs/                        Esta documentación
│  ├─ decisions/                ADRs
│  └─ openspec/                 Specs y changes (flujo spec-driven); comandos openspec desde docs/
├─ e2e/                         Playwright: navegación, SEO, axe (a11y), formulario
├─ infra/cloudfront/            Referencia de la CloudFront Function de clean URLs
├─ public/                      Archivos servidos tal cual: íconos, manifest, OG, theme-init.js
├─ scripts/
│  ├─ build-tokens.mjs          design/tokens.json → src/shared/styles/tokens.css (+ --check)
│  ├─ postbuild.mjs             robots.txt + sitemap.xml validado desde el HTML prerenderizado
│  ├─ seo/sitemap.mjs           Lógica pura del sitemap (con tests node:test)
│  ├─ serve-static.mjs          Preview local con el mismo contrato que el host
│  └─ deploy-aws.sh             Publicación a S3 + CloudFront en 4 pasadas
├─ src/
│  ├─ app/                      Arranque y cableado (appDirectory de React Router)
│  │  ├─ root.tsx               Documento HTML, providers, error boundary raíz
│  │  ├─ routes.ts              Tabla de rutas (una montura por locale)
│  │  ├─ routes/
│  │  │  ├─ _layout.tsx         Layout con SiteShell + error boundary con chrome
│  │  │  ├─ <página>.tsx        Módulo de ruta delgado (loader, meta, vista de una feature)
│  │  │  ├─ not-found.tsx       Catch-all, prerenderizado como /404
│  │  │  ├─ coming-soon-meta.ts <head> noindex de una página con su flag apagada
│  │  │  ├─ prerender.ts        Lista de URLs a prerenderizar (la carga react-router.config.ts)
│  │  │  └─ route-locale.ts     Locale desde la URL del request
│  │  └─ layout/                site-header, site-footer, site-shell
│  ├─ features/                 Un dominio por carpeta, autocontenido
│  │  ├─ blog/
│  │  │  ├─ api/                posts.ts, posts.mapper.ts (+ test)
│  │  │  ├─ content/            es.json, en.json (validados con zod en el build)
│  │  │  ├─ i18n/               es.ts (fuente de BlogText), en.ts, index.ts (blogText, useBlogText)
│  │  │  ├─ components/         post-card
│  │  │  ├─ views/              blog-list-view, post-view
│  │  │  ├─ types.ts            Schema zod de Post
│  │  │  └─ index.ts            API pública
│  │  ├─ contact/               api/ hooks/ components/ views/ types.ts index.ts
│  │  ├─ home/  about/  services/  legal/
│  │  └─ status/                not-found, coming-soon y error views
│  └─ shared/                   Sin conocimiento de features
│     ├─ ui/<nombre>/           Primitivo: .tsx + .css + .stories.tsx + .test.tsx
│     ├─ i18n/
│     │  ├─ config.ts           LOCALES, DEFAULT_LOCALE, localizePath… (fuente única)
│     │  ├─ dictionaries/es.ts  Textos del chrome (nav, tema, consentimiento, footer); fuente de Dictionary
│     │  ├─ dictionaries/en.ts  Tipado con Dictionary (falta una clave = error de compilación)
│     │  └─ index.ts            useI18n(), getDictionary(), useLocaleText(), LocaleTexts
│     ├─ seo/
│     │  ├─ meta.ts             buildMeta(): title, description, canonical, hreflang, OG, Twitter, robots, JSON-LD
│     │  └─ json-ld.ts          Builders schema.org (Organization, WebSite, BlogPosting, BreadcrumbList)
│     ├─ config/
│     │  ├─ env.schema.ts       Schema zod de VITE_* (lo usan vite.config, runtime y postbuild)
│     │  ├─ env.ts              env validado para la app
│     │  ├─ features.ts         Feature flags de páginas y componentes (build-time)
│     │  └─ site.json / site.ts Identidad del sitio (nombre, OG por defecto, email…)
│     ├─ feature-flags/         isEnabled, isPageEnabled, useFeatureFlag, <FeatureGate>
│     ├─ analytics/             GA4 sin librería, Consent Mode v2, banner, page views
│     ├─ lib/                   http (fetch + timeout + HttpError), query-client
│     ├─ hooks/                 Hooks genéricos sin dominio (use-theme)
│     ├─ utils/                 Funciones puras (build-label, format-date)
│     ├─ styles/
│     │  ├─ tokens.css          GENERADO desde design/tokens.json (no editar)
│     │  └─ global.css          @font-face, reset, base, utilidades de layout
│     ├─ test/                  setup de Vitest, render con router stub, servidor MSW
│     └─ types/globals.d.ts     Globales de build (__APP_VERSION__)
├─ CLAUDE.md                    Reglas para agentes
├─ react-router.config.ts       appDirectory: src/app, ssr: false, prerender
├─ vite.config.ts               Plugin de RR, valida env, define __APP_VERSION__
├─ vitest.config.ts             jsdom + plugin React (sin RR), cobertura v8 con umbral 70%
├─ playwright.config.ts         e2e contra build/client servido por serve-static.mjs
├─ eslint.config.js             Flat config: TS type-checked, hooks, a11y, orden de imports, fronteras
└─ knip.json                    Código y dependencias sin usar
```

## ¿Dónde pongo…?

| Necesito…                                         | Va en                                                                                                           |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Una página nueva                                  | Vista en `src/features/<dominio>/` + `src/app/routes/<x>.tsx` + `routes.ts` + `prerender.ts` (skill `new-page`) |
| Una funcionalidad con datos                       | `src/features/<dominio>/` completa (skill `new-feature`)                                                        |
| Un bloque visual de una sola feature              | `src/features/<dominio>/components/`                                                                            |
| Un componente reutilizable (botón, input, badge)  | `src/shared/ui/<nombre>/` (skill `new-component`)                                                               |
| Llamar una API o leer contenido                   | `src/features/<dominio>/api/`                                                                                   |
| Estado o lógica de un formulario                  | `src/features/<dominio>/hooks/use-<x>.ts`                                                                       |
| Algo que usan dos features                        | `src/shared/` (en la subcarpeta que corresponda)                                                                |
| Header, footer o algo del chrome del sitio        | `src/app/layout/`                                                                                               |
| Un texto visible de una feature                   | `src/features/<dominio>/i18n/{es,en}.ts`                                                                        |
| Un texto del chrome (nav, footer, consentimiento) | `src/shared/i18n/dictionaries/{es,en}.ts`                                                                       |
| Un color, tamaño o espacio                        | `design/tokens.json` → `npm run tokens`                                                                         |
| Una variable de entorno                           | `src/shared/config/env.schema.ts` + `.env.example` + `docs/configuration.md`                                    |
| Datos del sitio (nombre, email, OG)               | `src/shared/config/site.json`                                                                                   |
| Encender o apagar una página o un bloque          | `src/shared/config/features.ts` + `<FeatureGate flag="…">`                                                      |
| Un evento de analytics                            | `track('evento_snake_case', {...})` desde el hook de la feature                                                 |
| Una función pura reutilizable                     | `src/shared/utils/` (con test al lado)                                                                          |
| Un archivo servido tal cual (imagen, PDF)         | `public/`                                                                                                       |

## Feature flags

Los flags viven en `src/shared/config/features.ts` y se resuelven en el **build**: cambiar uno requiere recompilar. Viajan en el bundle público, así que sirven para liberar trabajo, nunca para proteger contenido.

| Flag apagado          | Efecto                                                                                                     |
| --------------------- | ---------------------------------------------------------------------------------------------------------- |
| `pages.<nombre>`      | La URL sigue existiendo y muestra "Próximamente" con `noindex`; sale del menú, del 404 y del `sitemap.xml` |
| `components.<nombre>` | Todo `<FeatureGate flag="components.<nombre>">` deja de renderizar (o muestra su `fallback`)               |

- **Datos** en `src/shared/config/features.ts`; **lógica** en `src/shared/feature-flags/`.
- En componentes: `<FeatureGate>` o `useFeatureFlag()`. En `meta`, `loader` y `prerender.ts`: `isEnabled()` / `isPageEnabled()`.
- `useFeatureFlag()` es el punto único para pasar a flags remotos (A/B, remote config) sin tocar a quien lo usa.
- Demo: `/services` está apagada por defecto. Pon `pages.services: true` y aparece en el menú y en el sitemap.

## Convenciones

- **Archivos y carpetas** en kebab-case. **Componentes** en PascalCase. **Hooks** con prefijo `use-`.
- **Código, identificadores y comentarios en inglés**; documentación y textos de producto en el idioma del proyecto.
- **JSDoc en cada export** público: qué hace y por qué, no cómo.
- **Sin `any`** (`@typescript-eslint/no-explicit-any: error`). `noUncheckedIndexedAccess` activo.
- **Tests al lado del código** (`x.ts` + `x.test.ts`). Stories al lado del componente.
- **Imports**: Alias por capa `#app/*`, `#features/*`, `#shared/*` (subpath imports de Node en `package.json`, espejados en `paths` de `tsconfig.json`) para cruzar carpetas; relativos (`./`, `../`) solo dentro de una misma feature o módulo. ESLint rechaza subir dos niveles (`../../`). Ordenados por perfectionist. Los alias son estándar de Node, así que también resuelven en `react-router.config.ts`. Única excepción a la API pública: `app/routes/prerender.ts` importa `#features/blog/api/posts` (esa cadena no puede cargar vistas ni CSS).
- **Conventional Commits** validados por commitlint: `feat(blog): …`, `fix(seo): …`, `docs: …`.
