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
npm run tokens         # design/tokens.json → src/styles/tokens.css
```

## Definición de terminado

Un cambio está terminado solo si `npm run check` y `npm run test:e2e` pasan. Además, según el cambio:

- **Página nueva**: entra en `e2e/a11y.spec.ts`.
- **Componente de UI**: tiene story.
- **Lógica**: tiene test unitario.
- **Texto visible**: existe en todos los diccionarios.

## Arquitectura (detalle en docs/architecture.md)

Capas en un solo sentido: `routes → sections/views → sections/components → components/ui`, y `sections/hooks → actions → lib`.

- `src/routes/*.tsx`: delgados. `loader` (corre en el **build**) + `meta` con `buildMeta()` + una vista. Sin lógica ni markup.
- `src/sections/<dominio>/{views,components,hooks}`: la página y su lógica.
- `src/components/ui/`: primitivos sin i18n, sin datos, sin router.
- `src/actions/`: acceso a datos async + mappers. `src/lib/`: http, query-client.
- `src/i18n/`: locale en la URL; `es.ts` define el tipo `Dictionary`.
- `src/seo/`: `buildMeta()` y builders JSON-LD. Único lugar que emite tags SEO.
- `src/config/env.schema.ts`: schema zod de `VITE_*`. Nunca leas `import.meta.env` directo.

## Reglas duras

- No hay runtime server: **sin `action`**, los `loader` solo leen datos de build. Datos en vivo con React Query.
- **Toda URL pública en `src/routes/prerender.ts`**. Si falta, el host responde 404.
- **Texto visible solo vía diccionario.** Nada de literales en JSX.
- **Estilos solo con tokens** (`var(--color-*)`, `var(--space-*)`…). Clases BEM, un `.css` por componente.
- **Un `<h1>` por página.** Elementos nativos, objetivo táctil ≥ 44px, foco visible, iconos `aria-hidden`.
- **Código, identificadores y comentarios en inglés.** JSDoc en cada export. Sin `any`.
- **Archivos en kebab-case**, componentes en PascalCase. Alias `~/` = `src/`. Excepción: `routes/prerender.ts` → `actions/posts.ts` (y lo que importe) usa imports relativos, porque `react-router.config.ts` los carga sin alias.
- **`VITE_*` son públicas**: nunca secretos.
- **Commits**: Conventional Commits (`feat(scope): …`), validados por commitlint.

## Skills del proyecto

- `new-page`: página o ruta nueva completa.
- `new-component`: primitivo de UI con story y test.
- `new-feature`: funcionalidad con datos por capas.
- `react-router`: referencia oficial del framework.
- `/opsx:propose`, `/opsx:apply`, `/opsx:archive`: cambios grandes con OpenSpec (`openspec/`).

## MCP

`.mcp.json` trae `context7` (docs actuales de librerías: úsalo antes de asumir APIs de React Router 8, Vite 8, zod 4, MSW 3) y `playwright` (inspeccionar el sitio).

## Gotchas conocidos

- Las peticiones de datos llegan como `/<ruta>.data`; usa `getRouteLocale(request)`, que quita el sufijo.
- MSW 3: la opción es `onUnhandledFrame`, no `onUnhandledRequest`.
- Vitest y Storybook no cargan el plugin de React Router (configs propias).
- TypeScript fijo en 6.x hasta que `typescript-eslint` soporte 7 (docs/decisions/0006).
