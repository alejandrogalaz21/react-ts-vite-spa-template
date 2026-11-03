---
name: new-page
description: Crea una página nueva (ruta) en este template con prerender, SEO completo, i18n y e2e. Úsala cuando pidan "agrega una página", "nueva ruta", "nueva sección con URL propia" o una landing interna.
---

# Nueva página

Una página = una URL por locale, prerenderizada, con `<head>` completo y cubierta por e2e.

## Pasos

1. **Textos**: en `src/features/<dominio>/i18n/es.ts` y `en.ts` (incluye `meta.title` y `meta.description`). Si la feature es nueva, crea su `i18n/` copiando `src/features/about/i18n/`. TypeScript falla si falta en algún locale.
2. **Vista**: crea `src/features/<dominio>/views/<nombre>-view.tsx` y expórtala en `src/features/<dominio>/index.ts`. La vista compone componentes; lee textos con `use<X>Text()`. Exactamente un `<h1>` por página (usa `SectionHeader as="h1"` o un `h1` directo).
3. **Ruta**: crea `src/app/routes/<nombre>.tsx` siguiendo `src/app/routes/about.tsx`:
   - `loader({ request })` devuelve `{ locale: getRouteLocale(request), ...datos }`.
   - `meta({ loaderData })` devuelve `buildMeta({ title, description, path: '/<nombre>', locale, jsonLd? })`, con textos de `<x>Text[locale].meta` (exportado por `#features/<dominio>`).
   - Al inicio de `meta`: `if (!isPageEnabled('<nombre>')) return comingSoonMeta(locale, '/<nombre>');`.
   - Importa la vista de `#features/<dominio>` y `ComingSoonView` de `#features/status`.
   - El componente por defecto solo renderiza la vista dentro de `<FeatureGate flag="pages.<nombre>" fallback={<ComingSoonView />}>`.
4. **Flag**: agrega `<nombre>: true` (o `false` si aún no se publica) en `pages` de `src/shared/config/features.ts`.
5. **Registro**: agrega `route('<nombre>', 'routes/<nombre>.tsx', { id: id('<nombre>') })` dentro de `pages()` en `src/app/routes.ts`.
6. **Prerender**: agrega `'/<nombre>'` a `STATIC_PATHS` en `src/app/routes/prerender.ts`. Si la ruta tiene parámetros, genera sus valores ahí (ver blog).
7. **Navegación** (opcional): agrega el item a `NAV_ITEMS` en `src/app/layout/site-header.tsx` y su texto en `nav` de `src/shared/i18n/dictionaries/{es,en}.ts`. El menú oculta solo las páginas apagadas.
8. **e2e**: agrega la ruta a `PAGES` en `e2e/a11y.spec.ts`. `e2e/seo.spec.ts` la valida sola vía sitemap.
9. **Verifica**: `npm run typecheck && npm run lint && npm test && npm run test:e2e`.

## Reglas

- Nada de lógica en `src/app/routes/*`: datos en `features/<dominio>/api/`, estado en `features/<dominio>/hooks/`.
- `path` de `buildMeta` es siempre locale-neutral (`/about`, nunca `/en/about`).
- Si la página no debe indexarse (gracias, preview), pasa `noindex: true`: queda fuera del sitemap.
