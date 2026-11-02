# 0001. React Router 8 framework mode con prerender estático

**Estado:** Aceptada · **Fecha:** 2026-11-02

## Contexto

Los sitios base (landings, portafolios, sitios de marca) necesitan SEO real: HTML completo por URL, metadatos por página y sitemap. No queremos operar un servidor.

- `alejandrogalaz.space` usa `vite-react-ssg` 0.8. Funciona, pero exige `react-router-dom ^6`, requiere `script: 'defer'` para hidratar bien y un script que externalice los inline.
- `kettuimx` no tiene router ni SEO más allá de `index.html`.

## Decisión

React Router 8 en framework mode, con `ssr: false` y `prerender` (`react-router.config.ts`):

- Rutas en `src/routes.ts`, módulos de ruta con `loader` (en build), `meta` y `ErrorBoundary`.
- Code splitting por ruta automático.
- Tipos generados por ruta (`./+types/<ruta>`).
- Salida 100% estática en `build/client/`.

## Alternativas

- **vite-react-ssg**: bloquea en Router 6. Mantenimiento de un solo autor.
- **Next.js export / Astro**: cambian de framework; fuera del objetivo "SPA React + Vite".
- **SPA pura + react-helmet**: los crawlers sin JS no ven contenido ni metadatos.

## Consecuencias

- Los `loader` corren solo en el build; no hay `action`. Datos en vivo con React Query.
- Toda URL pública debe listarse en `src/routes/prerender.ts`.
- `react-router.config.ts` carga módulos antes de que exista el alias `~`: esa cadena usa imports relativos.
- Las peticiones de datos llegan como `/<ruta>.data`; `getRouteLocale` quita el sufijo.
- Vitest y Storybook usan su propia config de Vite, sin el plugin de React Router.
