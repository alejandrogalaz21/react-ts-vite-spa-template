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
- **Toda URL pública debe estar en `src/routes/prerender.ts`.** Una URL fuera de la lista recibe el 404 del host.

## Capas

Las dependencias van en un solo sentido. Ninguna capa importa de una superior.

```
routes/   ──►  sections/*/views  ──►  sections/*/components  ──►  components/ui
   │                 │                        │
   │                 └──► sections/*/hooks ───┴──► actions ──► lib
   └──► seo, i18n, config                               └──► types (zod)
```

| Capa                                 | Qué contiene                                              | Reglas                                                                                                     |
| ------------------------------------ | --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `src/routes/*.tsx`                   | Módulos de ruta: `loader`, `meta`, componente por defecto | Delgados: resuelven locale y datos, declaran el `<head>` y renderizan **una** vista. Sin markup ni lógica. |
| `src/sections/<dominio>/views/`      | Cuerpo de una página                                      | Solo compone componentes de la sección. Sin estado ni efectos.                                             |
| `src/sections/<dominio>/components/` | Bloques de la sección (hero, formulario, tarjeta de post) | Leen textos con `useI18n()`. Si se usan en 2+ secciones, suben a `components/ui`.                          |
| `src/sections/<dominio>/hooks/`      | Hooks fachada (validación, mutaciones, queries)           | La vista solo renderiza lo que devuelven. Fábrica de keys `<dominio>Keys` para React Query.                |
| `src/actions/`                       | Acceso a datos: funciones `async` puras + mappers         | Sin React. Cambiar JSON por CMS/API solo toca este archivo.                                                |
| `src/lib/`                           | Singletons e infraestructura (`http`, `query-client`)     | Sin conocimiento del dominio.                                                                              |
| `src/types/`                         | Schemas de zod + tipos inferidos                          | Validan en el borde (contenido, formularios).                                                              |
| `src/components/ui/`                 | Primitivos del design system                              | Sin i18n, sin datos, sin router. Story + test.                                                             |
| `src/layout/`                        | Chrome del sitio (header, footer, shell)                  | Pueden leer i18n y config.                                                                                 |

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
├─ docs/                        Esta documentación + decisions/ (ADRs)
├─ e2e/                         Playwright: navegación, SEO, axe (a11y), formulario
├─ infra/cloudfront/            Referencia de la CloudFront Function de clean URLs
├─ openspec/                    Specs y changes (flujo spec-driven)
├─ public/                      Archivos servidos tal cual: íconos, manifest, OG, theme-init.js
├─ scripts/
│  ├─ build-tokens.mjs          design/tokens.json → src/styles/tokens.css (+ --check)
│  ├─ postbuild.mjs             robots.txt + sitemap.xml validado desde el HTML prerenderizado
│  ├─ seo/sitemap.mjs           Lógica pura del sitemap (con tests node:test)
│  ├─ serve-static.mjs          Preview local con el mismo contrato que el host
│  └─ deploy-aws.sh             Publicación a S3 + CloudFront en 4 pasadas
├─ src/
│  ├─ root.tsx                  Documento HTML, providers, error boundary raíz
│  ├─ routes.ts                 Tabla de rutas (una montura por locale)
│  ├─ routes/
│  │  ├─ _layout.tsx            Layout con SiteShell + error boundary con chrome
│  │  ├─ <página>.tsx           Módulo de ruta delgado (loader, meta, vista)
│  │  ├─ not-found.tsx          Catch-all, prerenderizado como /404
│  │  ├─ prerender.ts           Lista de URLs a prerenderizar
│  │  └─ route-locale.ts        Locale desde la URL del request
│  ├─ sections/<dominio>/
│  │  ├─ views/                 Cuerpo de página
│  │  ├─ components/            Bloques de la sección
│  │  └─ hooks/                 Fachadas (validación, mutaciones)
│  ├─ components/ui/<nombre>/   Primitivo: .tsx + .css + .stories.tsx + .test.tsx
│  ├─ layout/                   site-header, site-footer, site-shell
│  ├─ actions/                  Acceso a datos + mappers (+ tests con MSW)
│  ├─ analytics/                GA4 sin librería, Consent Mode v2, banner, page views
│  ├─ config/
│  │  ├─ env.schema.ts          Schema zod de VITE_* (lo usan vite.config, runtime y postbuild)
│  │  ├─ env.ts                 env validado para la app
│  │  └─ site.json / site.ts    Identidad del sitio (nombre, OG por defecto, email…)
│  ├─ content/<locale>/         Contenido (JSON) validado con zod en el build
│  ├─ i18n/
│  │  ├─ config.ts              LOCALES, DEFAULT_LOCALE, localizePath… (fuente única)
│  │  ├─ dictionaries/es.ts     Fuente del tipo Dictionary
│  │  ├─ dictionaries/en.ts     Tipado con Dictionary (falta una clave = error de compilación)
│  │  └─ index.ts               useI18n(), getDictionary()
│  ├─ seo/
│  │  ├─ meta.ts                buildMeta(): title, description, canonical, hreflang, OG, Twitter, robots, JSON-LD
│  │  └─ json-ld.ts             Builders schema.org (Organization, WebSite, BlogPosting, BreadcrumbList)
│  ├─ hooks/                    Hooks genéricos sin dominio (use-theme)
│  ├─ lib/                      http (fetch + timeout + HttpError), query-client
│  ├─ styles/
│  │  ├─ tokens.css             GENERADO desde design/tokens.json (no editar)
│  │  └─ global.css             @font-face, reset, base, utilidades de layout
│  ├─ test/                     setup de Vitest, render con router stub, servidor MSW
│  ├─ types/                    Schemas zod y tipos; globals.d.ts
│  └─ utils/                    Funciones puras (build-label, format-date)
├─ CLAUDE.md                    Reglas para agentes
├─ react-router.config.ts       appDirectory: src, ssr: false, prerender
├─ vite.config.ts               Plugin de RR, valida env, define __APP_VERSION__
├─ vitest.config.ts             jsdom + plugin React (sin RR), cobertura v8 con umbral 70%
├─ playwright.config.ts         e2e contra build/client servido por serve-static.mjs
├─ eslint.config.js             Flat config: TS type-checked, hooks, a11y, orden de imports
└─ knip.json                    Código y dependencias sin usar
```

## ¿Dónde pongo…?

| Necesito…                                        | Va en                                                                  |
| ------------------------------------------------ | ---------------------------------------------------------------------- |
| Una página nueva                                 | `src/routes/<x>.tsx` + `routes.ts` + `prerender.ts` (skill `new-page`) |
| Un bloque visual de una sola página              | `src/sections/<dominio>/components/`                                   |
| Un componente reutilizable (botón, input, badge) | `src/components/ui/<nombre>/` (skill `new-component`)                  |
| Llamar una API o leer contenido                  | `src/actions/<dominio>.ts`                                             |
| Estado o lógica de un formulario                 | `src/sections/<dominio>/hooks/use-<x>.ts`                              |
| Un texto visible                                 | `src/i18n/dictionaries/{es,en}.ts`                                     |
| Un color, tamaño o espacio                       | `design/tokens.json` → `npm run tokens`                                |
| Una variable de entorno                          | `src/config/env.schema.ts` + `.env.example` + `docs/configuration.md`  |
| Datos del sitio (nombre, email, OG)              | `src/config/site.json`                                                 |
| Un evento de analytics                           | `track('evento_snake_case', {...})` desde el hook de la sección        |
| Una función pura reutilizable                    | `src/utils/` (con test al lado)                                        |
| Un archivo servido tal cual (imagen, PDF)        | `public/`                                                              |

## Convenciones

- **Archivos y carpetas** en kebab-case. **Componentes** en PascalCase. **Hooks** con prefijo `use-`.
- **Código, identificadores y comentarios en inglés**; documentación y textos de producto en el idioma del proyecto.
- **JSDoc en cada export** público: qué hace y por qué, no cómo.
- **Sin `any`** (`@typescript-eslint/no-explicit-any: error`). `noUncheckedIndexedAccess` activo.
- **Tests al lado del código** (`x.ts` + `x.test.ts`). Stories al lado del componente.
- **Imports** con alias `~/` (= `src/`), ordenados por perfectionist. Excepción documentada: la cadena que carga `react-router.config.ts` (`routes/prerender.ts` → `actions/posts.ts`) usa imports relativos porque el alias aún no existe en ese momento.
- **Conventional Commits** validados por commitlint: `feat(blog): …`, `fix(seo): …`, `docs: …`.
