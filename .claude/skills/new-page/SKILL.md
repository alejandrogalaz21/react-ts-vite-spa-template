---
name: new-page
description: Crea una página nueva (ruta) en este template con prerender, SEO completo, i18n y e2e. Úsala cuando pidan "agrega una página", "nueva ruta", "nueva sección con URL propia" o una landing interna.
---

# Nueva página

Una página = una URL por locale, prerenderizada, con `<head>` completo y cubierta por e2e.

## Pasos

1. **Textos**: agrega la clave de la página en `src/i18n/dictionaries/es.ts` (incluye `meta.title` y `meta.description`) y la misma clave en `en.ts`. TypeScript falla si falta en algún locale.
2. **Vista**: crea `src/sections/<dominio>/views/<nombre>-view.tsx`. La vista compone componentes; lee textos con `useI18n()`. Exactamente un `<h1>` por página (usa `SectionHeader as="h1"` o un `h1` directo).
3. **Ruta**: crea `src/routes/<nombre>.tsx` siguiendo `src/routes/about.tsx`:
   - `loader({ request })` devuelve `{ locale: getRouteLocale(request), ...datos }`.
   - `meta({ loaderData })` devuelve `buildMeta({ title, description, path: '/<nombre>', locale, jsonLd? })`.
   - El componente por defecto solo renderiza la vista.
4. **Registro**: agrega `route('<nombre>', 'routes/<nombre>.tsx', { id: id('<nombre>') })` dentro de `pages()` en `src/routes.ts`.
5. **Prerender**: agrega `'/<nombre>'` a `STATIC_PATHS` en `src/routes/prerender.ts`. Si la ruta tiene parámetros, genera sus valores ahí (ver blog).
6. **Navegación** (opcional): agrega el item a `NAV_ITEMS` en `src/layout/site-header.tsx` y su texto en `nav`.
7. **e2e**: agrega la ruta a `PAGES` en `e2e/a11y.spec.ts`. `e2e/seo.spec.ts` la valida sola vía sitemap.
8. **Verifica**: `npm run typecheck && npm run lint && npm test && npm run test:e2e`.

## Reglas

- Nada de lógica en `src/routes/*`: datos en `src/actions/`, estado en hooks de la sección.
- `path` de `buildMeta` es siempre locale-neutral (`/about`, nunca `/en/about`).
- Si la página no debe indexarse (gracias, preview), pasa `noindex: true`: queda fuera del sitemap.
