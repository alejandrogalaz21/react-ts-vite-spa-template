# Configuración

## Variables de entorno

Todas son `VITE_*` y **públicas**: Vite las incrusta en el bundle. Nunca pongas un secreto aquí.

El schema está en `src/config/env.schema.ts` y se aplica en tres lugares:

1. `vite.config.ts`: el build falla antes de empaquetar si un valor es inválido.
2. `src/config/env.ts`: acceso tipado en la app (`import { env } from '~/config/env'`).
3. `scripts/postbuild.mjs`: el sitemap usa el mismo origen que los canonical.

Un valor vacío cuenta como "no definido" y toma el default.

| Variable                 | Default               | Uso                                                                                       |
| ------------------------ | --------------------- | ----------------------------------------------------------------------------------------- |
| `VITE_SITE_URL`          | `https://example.com` | Origen canónico sin `/` final. Canonical, hreflang, OG, sitemap.                          |
| `VITE_ALLOW_INDEXING`    | `true`                | `false` en staging/previews: `noindex` en cada página, `robots.txt` cerrado, sin sitemap. |
| `VITE_GA_MEASUREMENT_ID` | vacío                 | `G-XXXXXXXXXX`. Vacío = sin analytics. Solo carga en builds de producción.                |
| `VITE_API_URL`           | vacío                 | Base de la API. El formulario hace `POST {VITE_API_URL}/contact`. Vacío = envío simulado. |
| `VITE_APP_COMMIT`        | vacío                 | SHA del build, visible en el footer. CI lo define con `github.sha`.                       |

Local: copia `.env.example` a `.env.local`. CI: variables del environment `prod` en GitHub (ver `docs/deploy.md`).

Variable nueva: agrégala al schema, a `.env.example`, a esta tabla y, si aplica, a `deploy.yml`.

## Identidad del sitio

`src/config/site.json`: nombre, nombre corto, imagen OG por defecto, color de tema, usuario de X/Twitter y email de contacto. Lo leen el `<head>`, el JSON-LD y el footer.

Acompáñalo de:

- `public/site.webmanifest` (nombre y colores de la PWA).
- `public/favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `icon-512-maskable.png`.
- `public/og-default.png` (1200×630).

## Design tokens

`design/tokens.json` es la fuente única de color (tema claro y oscuro), tipografía, espacio, radios y layout.

```bash
npm run tokens         # regenera src/styles/tokens.css
npm run tokens:check   # CI: falla si el CSS no coincide con el JSON
```

El CSS generado se versiona: dev, tests y Storybook no dependen de un paso de build. Detalle en `docs/design-system.md`.

## Locales

`src/i18n/config.ts`: `LOCALES`, `DEFAULT_LOCALE` (sin prefijo en la URL) y `LOCALE_TAGS` (para `og:locale` e `Intl`). Ver `docs/i18n.md`.
