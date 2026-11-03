# CLAUDE.md

Base para SPAs estáticas: React 19 + TypeScript 6 + Vite 8 + React Router 8 (framework mode, `ssr: false` + prerender). Cada URL se prerenderiza a HTML; no hay servidor en runtime.

## Comandos

```bash
npm run dev            # http://localhost:5173
npm run build          # react-router build + postbuild (sitemap/robots validados)
npm run preview        # sirve build/client como el host (clean URLs, 404 real), puerto 4173
npm run check          # tokens, tipos, lint, formato, knip, unit, scripts, build (= CI)
npm run test:e2e       # Playwright + axe contra el build
npm run storybook      # primitivos de UI
npm run tokens         # design/tokens.json → src/shared/styles/tokens.css
```

## Definición de terminado

Un cambio está terminado solo si `npm run check` y `npm run test:e2e` pasan. Además, según el cambio:

- **Página nueva**: entra en `e2e/a11y.spec.ts`.
- **Componente de UI**: tiene story.
- **Lógica**: tiene test unitario.
- **Texto visible**: existe en todos los locales (`es.ts` y `en.ts` de la feature o del diccionario global).

## Arquitectura (detalle en docs/architecture.md)

Tres carpetas, dependencias en un solo sentido: **`app → features → shared`** (ESLint lo fuerza con `no-restricted-imports`).

- `src/app/`: `root.tsx`, `routes.ts`, `routes/*.tsx` y `layout/` (header, footer, shell). Es el `appDirectory` de React Router. Las rutas son delgadas: `loader` (corre en el **build**) + `meta` con `buildMeta()` + una vista.
- `src/features/<dominio>/`: todo lo del dominio junto: `api/` (datos + mappers), `types.ts` (zod), `hooks/`, `components/`, `views/`, `content/`, `i18n/` (textos de la feature). Su `index.ts` es la API pública: `app/` importa `#features/<dominio>`, nunca rutas internas. Una feature **no** importa otra.
- `src/shared/`: sin conocimiento de features.
  - `ui/`: primitivos sin i18n, sin datos, sin router.
  - `i18n/`: locale en la URL; `useI18n()` y el diccionario global (solo chrome: nav, tema, consentimiento, footer). `useLocaleText()` para los textos de cada feature.
  - `seo/`: `buildMeta()` y builders JSON-LD. Único lugar que emite tags SEO.
  - `config/`: `env.schema.ts` (zod de `VITE_*`; nunca leas `import.meta.env` directo), `site.json`, `features.ts` (flags).
  - `feature-flags/`, `analytics/`, `lib/` (http, query-client), `hooks/`, `utils/`, `styles/`, `test/`.
- Página apagada en `features.ts` = "Próximamente" con `noindex`.

## Reglas duras

- No hay runtime server: **sin `action`**, los `loader` solo leen datos de build. Datos en vivo con React Query.
- **Toda URL pública en `src/app/routes/prerender.ts`**. Si falta, el host responde 404.
- **Toda página tiene su flag** `pages.<nombre>` en `src/shared/config/features.ts`, y su ruta la respeta (`comingSoonMeta` + `<FeatureGate>`).
- **Texto visible solo vía i18n.** Textos de una feature en `features/<x>/i18n/{es,en}.ts` (`use<X>Text()`, y `<x>Text[locale]` en `meta`); del chrome en `shared/i18n/dictionaries`. Nada de literales en JSX.
- **Estilos solo con tokens** (`var(--color-*)`, `var(--space-*)`…). Clases BEM, un `.css` por componente.
- **Un `<h1>` por página.** Elementos nativos, objetivo táctil ≥ 44px, foco visible, iconos `aria-hidden`.
- **Código, identificadores y comentarios en inglés.** JSDoc en cada export. Sin `any`.
- **Archivos en kebab-case**, componentes en PascalCase. Alias por capa `#app/*`, `#features/*`, `#shared/*` (subpath imports de Node en `package.json`, espejados en `paths` de `tsconfig.json`) para cruzar carpetas; relativos (`./`, `../`) solo dentro de una misma feature o módulo. ESLint rechaza subir dos niveles (`../../`). Excepción: `app/routes/prerender.ts` importa `#features/blog/api/posts` directo (con `eslint-disable` justificado), porque `react-router.config.ts` no puede cargar las vistas; esa cadena no lleva JSX ni CSS.
- **`VITE_*` son públicas**: nunca secretos.
- **Commits**: Conventional Commits (`feat(scope): …`), validados por commitlint.

## Skills del proyecto

- `new-page`: página o ruta nueva completa.
- `new-component`: primitivo de UI con story y test.
- `new-feature`: carpeta `src/features/<dominio>/` completa (datos, hooks, componentes, vista).
- `react-router`: referencia oficial del framework.
- `/opsx:propose`, `/opsx:apply`, `/opsx:archive`: cambios grandes con OpenSpec (`docs/openspec/`).

**OpenSpec vive en `docs/openspec/`**, así que la raíz de OpenSpec es `docs/`. La CLI busca `openspec/` desde el directorio actual hacia arriba y no admite otra ruta. Corre **todo** comando `openspec` (incluido `openspec context --json` de las skills) desde `docs/`: `cd docs && openspec …`. Desde la raíz del repo no lo encuentra y puede resolver otro `openspec/` de un directorio superior.

## MCP

`.mcp.json` trae `context7` (docs actuales de librerías: úsalo antes de asumir APIs de React Router 8, Vite 8, zod 4, MSW 3) y `playwright` (inspeccionar el sitio).

## Gotchas conocidos

- Las peticiones de datos llegan como `/<ruta>.data`; usa `getRouteLocale(request)`, que quita el sufijo.
- MSW 3: la opción es `onUnhandledFrame`, no `onUnhandledRequest`.
- Vitest y Storybook no cargan el plugin de React Router (configs propias).
- TypeScript fijo en 6.x hasta que `typescript-eslint` soporte 7 (docs/decisions/0006).
