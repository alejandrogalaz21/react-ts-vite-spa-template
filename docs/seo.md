# SEO

El objetivo: que un crawler o una vista previa de enlace reciban el HTML completo de cada página sin ejecutar JavaScript, y que el build falle si los metadatos son inconsistentes.

## Piezas

| Pieza                   | Archivo                                                  | Qué hace                                                                                                                                                 |
| ----------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Prerender               | `react-router.config.ts` + `src/app/routes/prerender.ts` | Un `index.html` por URL y locale, con contenido, `<title>`, meta y JSON-LD.                                                                              |
| `<head>` por página     | `src/shared/seo/meta.ts` → `buildMeta()`                 | title, description, robots, canonical, hreflang (+ `x-default`), Open Graph (con `og:locale` e imagen 1200×630), Twitter card, JSON-LD.                  |
| Datos estructurados     | `src/shared/seo/json-ld.ts`                              | `Organization` y `WebSite` en home, `BlogPosting` en posts, `BreadcrumbList` en páginas internas. Salen de config y contenido, nunca fijos en la página. |
| Sitemap y robots        | `scripts/postbuild.mjs` + `scripts/seo/sitemap.mjs`      | Lee el `<head>` de cada HTML del build y genera `sitemap.xml` con alternates `xhtml:link` y `robots.txt` con la línea `Sitemap:`.                        |
| 404 real                | `src/app/routes/not-found.tsx` + host                    | `/404/index.html` con `noindex`; el host lo sirve con status 404.                                                                                        |
| Entornos no productivos | `VITE_ALLOW_INDEXING=false`                              | `noindex` en todo, `robots.txt` con `Disallow: /`, sin sitemap.                                                                                          |

## Reglas que el build garantiza

`scripts/postbuild.mjs` falla (y con él `npm run build` y CI) cuando:

- Una página indexable no tiene canonical.
- Un canonical apunta a otra ruta.
- Un canonical o alternate está fuera de `VITE_SITE_URL`.
- Los hreflang no son recíprocos entre versiones de idioma.
- No hay ninguna página indexable.

`e2e/seo.spec.ts` comprueba en el sitio servido que cada URL del sitemap:

- Responde 200.
- Trae un solo `<h1>`, title, description, canonical y `og:image` absoluta.

También verifica el JSON-LD de un post y que una ruta desconocida responde 404 con `noindex`.

## Agregar SEO a una página

```ts
export function meta({ loaderData }: Route.MetaArgs) {
  return buildMeta({
    title: t.title,
    description: t.description,
    path: '/pricing', // siempre locale-neutral
    locale: loaderData.locale,
    image: '/og/pricing.png', // opcional
    jsonLd: breadcrumbJsonLd(locale, [
      [t.nav.home, '/'],
      [t.nav.pricing, '/pricing'],
    ]),
  });
}
```

## Pendiente conocido

- **CSP estricta.** React Router incrusta scripts inline en el HTML prerenderizado (contexto de hidratación). Para `script-src 'self'` sin `unsafe-inline` hace falta externalizarlos (como hace `alejandrogalaz.space` con `externalize-inline-scripts.mjs`) o usar hashes. `theme-init.js` ya es externo por esta razón.
- **Imágenes OG por página.** Hoy todas usan `og-default.png` salvo que la página pase `image`.
