# react-ts-vite-spa-template

Base para crear SPAs con React + TypeScript + Vite. Reúne las buenas prácticas de **alejandrogalaz.space** y **kettuimx-landing**, actualizadas a las versiones actuales del ecosistema. Incluye un sitio de ejemplo con lorem ipsum para revisar cada pieza paso a paso.

> **Rama `base-v1`**: primera propuesta, para evaluación.

## Qué incluye

- **Prerender estático por URL** con React Router 8 (framework mode, `ssr: false`). Cada página sale como HTML completo, sin servidor.
- **SEO completo y validado en el build**:
  - Metadatos: title, description, canonical, hreflang, Open Graph, Twitter y JSON-LD.
  - Archivos: sitemap y robots.
  - 404 real con `noindex`.
- **i18n por URL** (`/` en español, `/en` en inglés) con textos tipados por feature.
- **Design tokens** en JSON → CSS, temas claro y oscuro sin parpadeo, Inter self-hosted (solo latin).
- **Analytics GA4 sin librería** con Consent Mode v2, banner y page views por navegación.
- **Formulario accesible** con zod + React Query + MSW.
- **Calidad**:
  - Tipos: TS strict.
  - Lint: ESLint 10 (con a11y), Prettier y knip.
  - Tests: Vitest (54 tests, ~90% de líneas en lógica) y Playwright + axe (54 e2e, móvil y desktop, ambos temas).
  - Componentes: Storybook 10.
- **CI/CD**:
  - GitHub Actions con el check requerido `ci result`.
  - Deploy opcional a S3 + CloudFront vía OIDC.
  - Dependabot agrupado, plantillas de PR e issues.
- **Tooling de IA**: `CLAUDE.md`, skills (`new-page`, `new-component`, `new-feature`, `react-router`, OpenSpec), hook de formateo y MCP de proyecto (Context7, Playwright).

## Empezar

Requiere Node 24 (`.nvmrc`; mínimo 22).

```bash
npm install
npm run dev            # http://localhost:5173
```

Recorrido sugerido del sitio lorem:

| Paso | Dónde                                 | Qué observar                                                   |
| ---- | ------------------------------------- | -------------------------------------------------------------- |
| 1    | `/`                                   | Hero, servicios, números y CTA; tema claro/oscuro en el header |
| 2    | `/en`                                 | Mismo sitio en inglés; el selector ES/EN conserva la página    |
| 3    | `/blog` → un post                     | Contenido desde JSON validado con zod; JSON-LD `BlogPosting`   |
| 4    | `/contact`                            | Validación accesible, foco al primer error y envío simulado    |
| 5    | `/privacy`                            | Estado del consentimiento de analytics                         |
| 6    | `/lo-que-sea`                         | 404 con chrome del sitio y sugerencias de páginas              |
| 6b   | `/services`                           | "Próximamente": página con su flag apagada (`features.ts`)     |
| 7    | `npm run build && npm run preview`    | El build estático en `:4173`; ver `build/client/sitemap.xml`   |
| 8    | Ver código fuente de cualquier página | HTML completo prerenderizado, con todos los meta               |
| 9    | `npm run storybook`                   | Primitivos de UI en ambos temas                                |
| 10   | `npm run check && npm run test:e2e`   | Todo lo que corre CI                                           |

## Scripts

| Script                                  | Qué hace                                                                     |
| --------------------------------------- | ---------------------------------------------------------------------------- |
| `dev`                                   | Servidor de desarrollo con HMR                                               |
| `build`                                 | Prerender en `build/client` + `sitemap.xml`/`robots.txt` validados           |
| `preview`                               | Sirve `build/client` con el contrato del host (clean URLs, 404 real)         |
| `typecheck`                             | Genera tipos de rutas + `tsc`                                                |
| `lint` / `lint:fix`                     | ESLint                                                                       |
| `format` / `format:check`               | Prettier                                                                     |
| `test` / `test:watch` / `test:coverage` | Vitest                                                                       |
| `test:scripts`                          | Tests de los scripts de build (`node:test`)                                  |
| `test:e2e`                              | Playwright + axe contra el build                                             |
| `storybook` / `build-storybook`         | Storybook                                                                    |
| `tokens` / `tokens:check`               | Genera / verifica `src/shared/styles/tokens.css`                             |
| `knip`                                  | Código y dependencias sin usar                                               |
| `check`                                 | Todo lo anterior salvo e2e y Storybook: lo mismo que el job de calidad de CI |

## Estructura resumida

```
src/                            app → features → shared (ESLint fuerza el sentido)
  app/                          root.tsx, routes.ts, routes/ (delgadas + prerender.ts), layout/
  features/<dominio>/           api/ types.ts hooks/ components/ views/ content/ i18n/ + index.ts
  shared/
    ui/<nombre>/                primitivos: .tsx .css .stories.tsx .test.tsx
    i18n/  seo/  config/        locale + chrome, buildMeta + JSON-LD, env + site.json + features.ts
    feature-flags/  analytics/  FeatureGate/useFeatureFlag, GA4 + consentimiento
    lib/  hooks/  utils/        http/query-client, hooks y funciones genéricas
    styles/  test/              tokens + global.css, setup de Vitest/MSW
design/tokens.json              fuente de los design tokens
scripts/                        tokens, postbuild (sitemap/robots), preview, deploy AWS
e2e/                            Playwright + axe
docs/                           arquitectura, guías y decisiones (ADR)
```

El árbol completo, con qué va en cada carpeta, está en [docs/architecture.md](docs/architecture.md).

## Documentación

| Doc                                       | Contenido                                                                  |
| ----------------------------------------- | -------------------------------------------------------------------------- |
| [architecture.md](docs/architecture.md)   | Flujo build/runtime, capas, árbol completo, "¿dónde pongo…?", convenciones |
| [configuration.md](docs/configuration.md) | Variables de entorno, `site.json`, tokens, locales                         |
| [seo.md](docs/seo.md)                     | Prerender, `buildMeta`, JSON-LD, sitemap validado, pendientes              |
| [i18n.md](docs/i18n.md)                   | Locale en URL, diccionarios tipados, agregar o quitar idiomas              |
| [design-system.md](docs/design-system.md) | Tokens, temas, componentes, reglas de estilo                               |
| [testing.md](docs/testing.md)             | Pirámide de tests, comandos, reglas, git hooks                             |
| [deploy.md](docs/deploy.md)               | Contrato del host, GitHub Actions, AWS, otros hosts                        |
| [ai-tooling.md](docs/ai-tooling.md)       | CLAUDE.md, skills, MCP, hooks, OpenSpec                                    |
| [new-project.md](docs/new-project.md)     | Checklist para arrancar un proyecto real desde esta base                   |
| [decisions/](docs/decisions/README.md)    | ADRs: por qué cada elección                                                |

## Stack

| Capa               | Paquete                                            | Versión                                               |
| ------------------ | -------------------------------------------------- | ----------------------------------------------------- |
| UI                 | react / react-dom                                  | 19.3                                                  |
| Router + prerender | react-router / @react-router/dev                   | 8.5                                                   |
| Build              | vite                                               | 8.3                                                   |
| Lenguaje           | typescript                                         | 6.0 ([ADR 0006](docs/decisions/0006-typescript-6.md)) |
| Datos cliente      | @tanstack/react-query                              | 5.105                                                 |
| Validación         | zod                                                | 4.6                                                   |
| Unit               | vitest + @testing-library/react + msw              | 5.1 / 16.3 / 3.0                                      |
| e2e + a11y         | @playwright/test + @axe-core/playwright            | 1.64 / 4.14                                           |
| Lint / formato     | eslint + typescript-eslint + jsx-a11y-x + prettier | 10.14 / 8.72 / 0.2 / 3.9                              |
| Componentes        | storybook                                          | 10.6                                                  |
| Git hooks          | husky + lint-staged + commitlint                   | 9.1 / 17.6 / 21.2                                     |
| Código muerto      | knip                                               | 6.44                                                  |

## `base-v1` frente a `base-v2-features`

Mismo sitio, mismas pruebas; cambia cómo se organiza `src/` (ADR [0009](docs/decisions/0009-feature-folders.md)).

| Aspecto                      | `base-v1`                                                       | `base-v2-features`                                    |
| ---------------------------- | --------------------------------------------------------------- | ----------------------------------------------------- |
| Carpetas en la raíz de `src` | 17                                                              | 3 (`app`, `features`, `shared`)                       |
| Dónde vive el blog           | `sections/blog`, `actions/posts*`, `types/post.ts`, `content/*` | `features/blog/` (todo junto)                         |
| Rutas importan               | Cualquier archivo interno                                       | Solo `#features/<dominio>` (su `index.ts`)            |
| Reglas de dependencia        | Documentadas                                                    | Documentadas y forzadas por ESLint                    |
| Alias                        | `~/` (= `src/`); `prerender.ts` con relativos                   | `#app/` `#features/` `#shared/` (Node), sin relativos |
| Textos                       | Un diccionario con todo                                         | Cada feature tiene su `i18n/`; global solo el chrome  |
| Borrar una funcionalidad     | 4–5 carpetas + rutas                                            | 1 carpeta + rutas                                     |
| `appDirectory` de RR         | `src`                                                           | `src/app`                                             |

## Comparativa: qué contiene esta rama

Cómo resuelve `base-v2-features` cada aspecto frente a los dos proyectos de referencia. **Origen** indica de dónde se tomó la práctica.

| Aspecto               | alejandrogalaz.space           | kettuimx (landing)                       | **base-v2-features**                                                        | Origen                                   |
| --------------------- | ------------------------------ | ---------------------------------------- | --------------------------------------------------------------------------- | ---------------------------------------- |
| React / Vite / TS     | 18 / 5 / 5.6                   | 18 / 5 / 5.5                             | **19.3 / 8.3 / 6.0**                                                        | Actualizado                              |
| Router                | RR 6 + vite-react-ssg 0.8      | Sin router (anclas)                      | **RR 8 framework mode**                                                     | Nuevo                                    |
| Prerender / SSG       | Sí (vite-react-ssg)            | No                                       | **Sí, nativo de RR (`ssr:false` + `prerender`)**                            | alejandrogalaz.space, sin la dependencia |
| Code splitting        | No                             | No                                       | **Por ruta, automático**                                                    | Nuevo                                    |
| Arquitectura          | Capas `view → hooks → actions` | `components / sections / pages`          | **`app → features → shared`, features autocontenidas, fronteras en ESLint** | Nuevo                                    |
| Estado servidor       | React Query (`initialData`)    | `useState`                               | **Loaders en build + React Query para mutaciones/datos vivos**              | alejandrogalaz.space                     |
| HTTP                  | axios (sin usar)               | —                                        | **`fetch` + timeout + `HttpError`** (0 KB)                                  | Nuevo                                    |
| Validación            | —                              | Validadores manuales                     | **zod 4 (env, contenido, formularios)**                                     | Nuevo                                    |
| Estilos               | CSS + BEM + tokens.json        | MUI 5 + Emotion                          | **CSS + BEM + tokens.json, sin runtime**                                    | alejandrogalaz.space                     |
| Temas                 | Tokens dark/light sin toggle   | Solo claro                               | **Claro/oscuro, toggle, sin parpadeo (CSP-safe)**                           | Nuevo                                    |
| Fuentes               | Google Fonts (CDN)             | Fontsource, todos los subsets            | **Fontsource self-hosted, solo latin**                                      | kettuimx, corregido                      |
| i18n                  | URL, JSON con casts `as`       | Estado React, `Dictionary` tipado        | **URL + `Dictionary` tipado, fuente única de locales**                      | Ambos                                    |
| `<head>` por página   | `<Head>`, JSON-LD fijo         | Solo `index.html`                        | **`buildMeta()` + JSON-LD desde datos**                                     | alejandrogalaz.space                     |
| hreflang / canonical  | Sí                             | No                                       | **Sí, recíprocos y validados**                                              | alejandrogalaz.space                     |
| Sitemap / robots      | Generado y validado            | No                                       | **Generado y validado + modo noindex por entorno**                          | alejandrogalaz.space                     |
| 404                   | Sin ruta 404                   | —                                        | **Prerenderizado, status 404, `noindex`**                                   | Nuevo                                    |
| Manifest / íconos PWA | No                             | No                                       | **Sí**                                                                      | Nuevo                                    |
| Analytics             | No                             | GA4 + Consent Mode v2                    | **GA4 + Consent v2 + page views SPA**                                       | kettuimx                                 |
| Env                   | Sin `.env.example` ni tipado   | Validado (duplicado build/runtime)       | **Un schema zod para build, runtime y postbuild**                           | kettuimx, sin duplicar                   |
| Versión en footer     | Rama sin mergear               | `v0.2.0 · sha`                           | **`v0.1.0 · sha`**                                                          | kettuimx                                 |
| Error boundary        | No                             | No                                       | **Raíz + layout (con chrome)**                                              | Nuevo                                    |
| Accesibilidad         | H1 único, foco visible         | Touch target 44px                        | **Skip link, landmarks, 44px, reduced-motion, axe en e2e (claro y oscuro)** | Ambos + nuevo                            |
| Lint                  | ESLint 8 legacy                | Ninguno                                  | **ESLint 10 flat, type-checked, a11y, hooks**                               | Nuevo                                    |
| Formato               | Manual                         | Ninguno                                  | **Prettier + EditorConfig**                                                 | Nuevo                                    |
| Git hooks / commits   | Convención sin validar         | Convención sin validar                   | **husky + lint-staged + commitlint**                                        | Nuevo                                    |
| Unit tests            | Jest + ts-jest                 | Jest + SWC                               | **Vitest 5 + MSW 3, umbral de cobertura 70%**                               | Nuevo                                    |
| e2e                   | Playwright (2 proyectos)       | Playwright (móvil, desktop, consent)     | **Playwright móvil + desktop + axe + hidratación sin errores**              | Ambos                                    |
| Storybook             | 8                              | Planeado                                 | **10**                                                                      | alejandrogalaz.space                     |
| Código muerto         | —                              | —                                        | **knip en CI**                                                              | Nuevo                                    |
| CI                    | Build + tests + e2e            | Typecheck + tests + e2e, job `ci result` | **Calidad + e2e + storybook, job `ci result`**                              | kettuimx                                 |
| Deploy                | S3 + CloudFront, prefijo fijo  | S3 + CloudFront, prefijo fijo            | **Agnóstico; AWS opcional y parametrizado**                                 | Ambos, generalizado                      |
| Dependencias          | Manual                         | Manual                                   | **Dependabot agrupado**                                                     | Nuevo                                    |
| Plantillas GitHub     | —                              | Issue (ticket)                           | **PR + bug + feature**                                                      | kettuimx + nuevo                         |
| CLAUDE.md             | Arquitectura + marca           | Comandos + reglas + estado               | **Reglas genéricas + definición de terminado + gotchas**                    | Ambos                                    |
| Skills                | OpenSpec                       | OpenSpec                                 | **OpenSpec + react-router oficial + new-page/component/feature**            | Ambos + nuevo                            |
| Hooks de Claude       | —                              | —                                        | **Formateo automático en Edit/Write**                                       | Nuevo                                    |
| MCP de proyecto       | —                              | —                                        | **`.mcp.json`: Context7 + Playwright**                                      | Nuevo                                    |
| ADRs                  | —                              | —                                        | **7 decisiones documentadas**                                               | Nuevo                                    |

### Qué quedó fuera de la base (a propósito)

- **Marca y contenido.** Tokens, fuentes y textos de cada sitio, la skill `design-system-alejandro-galaz`, tableros y convenciones de tickets (`KMX-`).
- **Notificaciones** del repo privado `github-workflows`.
- **Entorno UAT** de `kettuimx-kmx-19` (sin commitear allí). Si se adopta, iría como un segundo environment en `deploy.yml`.
- **Externalizar scripts inline** para una CSP estricta. Pendiente documentado en [docs/seo.md](docs/seo.md).
