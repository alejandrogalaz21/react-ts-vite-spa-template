# 0009. Estructura por features: `app → features → shared`

**Estado:** Aceptada · **Fecha:** 2026-11-02 · Rama `base-v2-features`

## Contexto

En `base-v1`, `src/` tenía 17 carpetas que mezclaban capas (`actions`, `lib`, `utils`), dominios (`sections`) y módulos transversales (`i18n`, `seo`, `analytics`). Un dominio quedaba repartido: el blog vivía en `sections/blog`, `actions/posts*`, `types/post.ts` y `content/*`. Los nombres `actions` (choca con el `action` de React Router y las Actions de React 19) y `sections` no son estándar.

## Decisión

Tres carpetas en `src/`, con dependencias en un solo sentido:

- `app/`: `root.tsx`, `routes.ts`, módulos de ruta y `layout/`. Es el `appDirectory` de React Router.
- `features/<dominio>/`: `api/`, `types.ts`, `hooks/`, `components/`, `views/`, `content/` y un `index.ts` con la API pública.
- `shared/`: `ui/`, `i18n/`, `seo/`, `config/`, `feature-flags/`, `analytics/`, `lib/`, `hooks/`, `utils/`, `styles/`, `test/`.

Imports entre carpetas con alias por capa: `#app/*`, `#features/*`, `#shared/*` (subpath imports de Node en `package.json`, espejados en `paths` de `tsconfig.json`). Son estándar de Node, así que los resuelven Vite, Vitest, Storybook y también el loader de `react-router.config.ts`, que no lee `tsconfig`.

Reglas, forzadas con `no-restricted-imports` en `eslint.config.js` (sin plugins extra, con la opción `regex`; `group` usa sintaxis gitignore, donde `#` es comentario):

- `shared/` no importa `#app/*` ni `#features/*`.
- `features/` no importa `#app/*` ni otra feature.
- `app/` importa features solo por `#features/<dominio>`, nunca rutas internas.
- Ningún import relativo sube dos niveles (`../../`): cruzar carpetas exige alias, y el alias deja ver la capa.

Cada feature es dueña de sus textos (`features/<x>/i18n/{es,en}.ts`). `shared/i18n` solo guarda el chrome del sitio y el mecanismo genérico (`LocaleTexts<T>`, `useLocaleText`).

Para que `shared/seo` no dependa del blog, `articleJsonLd` recibe un tipo estructural (`ArticleInput`) en lugar de `Post`.

## Alternativas

- **Mantener `base-v1` con orden mínimo** (agrupar transversales en `core/`): barato, pero el dominio sigue repartido.
- **Feature-Sliced Design**: reglas muy estrictas y tooling propio (`steiger`). Excesivo para sitios estáticos: distinguir _widget_, _feature_ y _entity_ cuesta más de lo que aporta.
- **Colocación por ruta** (`app/routes/<página>/…`): simple para landings, pero lo compartido no tiene un lugar natural y las rutas engordan.
- **`eslint-plugin-boundaries`**: más expresivo y resuelve rutas reales, pero suma un plugin y un resolver. `no-restricted-imports` con alias por capa más la prohibición de `../../` cubre los casos reales.
- **Alias `@/` o `~/`** (paths de `tsconfig`): no los resuelve el loader de `react-router.config.ts`, así que `prerender.ts` y su cadena necesitaban imports relativos. `@app/…` además se confunde con paquetes npm con scope.
- **Diccionario central con todos los textos**: cada feature dependía de un archivo de `shared/` que conocía todos los dominios.

## Consecuencias

- Borrar o copiar una funcionalidad es una carpeta en `features/` más su ruta.
- La regla de `../../` es una aproximación: un `../` de un módulo de `shared/` a otro pasa. Si hiciera falta precisión total, migrar a `eslint-plugin-boundaries`.
- Los alias se declaran en dos lugares (`package.json` y `tsconfig.json`): agregar una capa exige tocar ambos.
- `app/routes/prerender.ts` importa `#features/blog/api/posts` (con `eslint-disable` justificado): `react-router.config.ts` no puede cargar vistas ni CSS. Esa cadena debe quedar sin JSX.
- Agregar un locale obliga a crear un archivo por feature; TypeScript señala cada uno que falte.
