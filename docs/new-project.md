# Empezar un proyecto desde la base

Checklist para convertir esta base en un sitio real. Sigue el orden: cada paso deja el repo en verde.

## 1. Copia

```bash
git clone <este-repo> mi-sitio && cd mi-sitio
rm -rf .git && git init -b main
npm install
npm run check && npm run test:e2e   # todo en verde antes de tocar nada
```

## 2. Identidad

- [ ] `package.json`: `name`, `description`, `version` (`0.1.0`).
- [ ] `src/shared/config/site.json`: nombre, email, `twitterHandle`, `themeColor`.
- [ ] `public/`: favicons, íconos PWA, `og-default.png` (1200×630) y `site.webmanifest`.
- [ ] `.env.local` con `VITE_SITE_URL` real.

## 3. Diseño

- [ ] `design/tokens.json` con la paleta y tipografía de la marca, y luego `npm run tokens`.
- [ ] Fuente: cambia `@font-face` en `src/shared/styles/global.css` y la dependencia `@fontsource-variable/*`.
- [ ] Si hay design system de marca (skill), aplícalo a los tokens, no a los componentes.

## 4. Idiomas

- [ ] Ajusta `LOCALES` y `DEFAULT_LOCALE` (`src/shared/i18n/config.ts`).
- [ ] Reemplaza el lorem ipsum de `src/features/*/i18n/*`, `src/shared/i18n/dictionaries/*` y `src/features/blog/content/*`.

## 5. Páginas

- [ ] Borra lo que no aplique (`blog`, `about`…): ruta en `src/app/routes.ts`, archivo en `src/app/routes/`, carpeta en `src/features/`, flag en `features.ts`, entrada en `prerender.ts` y en `e2e/`.
- [ ] Páginas nuevas con la skill `new-page`.
- [ ] `npm run knip` para encontrar lo que quedó huérfano.

## 6. Módulos opcionales

| Módulo                     | Quitar si…                         | Cómo                                                                                                                                                                  |
| -------------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Analytics + consentimiento | no hay GA4                         | Borra `src/shared/analytics/`, `<ConsentBanner />` y `useAnalytics()` de `site-shell.tsx`, `track()` de los hooks, la sección de consentimiento de `privacy-view.tsx` |
| React Query                | no hay datos en vivo ni mutaciones | Quita `QueryClientProvider` de `root.tsx`, `src/shared/lib/query-client.ts` y la dependencia; el formulario puede usar `useState`                                     |
| Blog                       | no hay contenido largo             | Ver paso 5, más `src/features/blog/api/posts*`, `src/features/blog/types.ts` y `src/features/blog/content/`                                                           |
| i18n                       | sitio de un idioma                 | `LOCALES = ['es']` (ver `docs/i18n.md`)                                                                                                                               |

## 7. Deploy

- [ ] Infra (bucket, CloudFront, SSM, rol OIDC) en el repo de infraestructura.
- [ ] Environment `prod` en GitHub con las variables de `docs/deploy.md`.
- [ ] Protección de `main` con el check requerido **`ci result`**.

## 8. Documentación

- [ ] `README.md`: describe el proyecto real (quita la tabla comparativa de la base).
- [ ] `CLAUDE.md`: agrega lo específico (marca, tablero, convenciones de tickets).
- [ ] `docs/openspec/config.yaml`: agrega restricciones del dominio.
