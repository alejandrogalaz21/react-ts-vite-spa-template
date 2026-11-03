# Testing y calidad

## Pirámide

| Nivel             | Herramienta                                         | Dónde                   | Qué cubre                                                                    |
| ----------------- | --------------------------------------------------- | ----------------------- | ---------------------------------------------------------------------------- |
| Tipos             | TypeScript 6 strict + `noUncheckedIndexedAccess`    | todo                    | Contratos, diccionarios completos, props                                     |
| Lint              | ESLint 10 (type-checked) + jsx-a11y-x + react-hooks | todo                    | Bugs comunes, a11y estática, reglas de hooks                                 |
| Unit / componente | Vitest 5 + Testing Library + MSW 3                  | `src/**/*.test.ts(x)`   | Lógica: `api/` de features, hooks, i18n, SEO, componentes con comportamiento |
| Scripts           | `node:test`                                         | `scripts/**/*.test.mjs` | Generación de tokens y sitemap                                               |
| e2e               | Playwright (móvil Pixel 7 + desktop Chrome)         | `e2e/`                  | Navegación, SEO del HTML servido, formulario, hidratación sin errores        |
| Accesibilidad     | `@axe-core/playwright`                              | `e2e/a11y.spec.ts`      | WCAG 2.2 A/AA en cada plantilla, tema claro y oscuro                         |
| Visual / docs     | Storybook 10                                        | `src/**/*.stories.tsx`  | Primitivos del design system                                                 |
| Código muerto     | knip                                                | `knip.json`             | Exports, archivos y dependencias sin usar                                    |

## Comandos

```bash
npm run check          # tokens, tipos, lint, formato, knip, unit, scripts y build: lo mismo que CI
npm test               # unit
npm run test:watch
npm run test:coverage  # umbral 70% en líneas, ramas, funciones y sentencias
npm run test:scripts
npm run test:e2e       # construye y sirve build/client; luego Playwright
npm run storybook
```

## Reglas

- **Consulta por rol accesible** (`getByRole('button', { name: … })`), no por clase ni test id. Si no puedes encontrar algo por rol, probablemente tampoco un lector de pantalla.
- **Red siempre mockeada.** MSW corre con `onUnhandledFrame: 'error'`: una petición sin handler rompe el test.
- **`renderWithProviders(ui, { path })`** (`src/shared/test/render.tsx`) monta router y QueryClient. El `path` define el locale.
- **La cobertura unitaria apunta a lógica.** Rutas, vistas y componentes presentacionales de `home` quedan fuera del umbral porque e2e los renderiza, navega y audita con axe (`vitest.config.ts`).
- **e2e contra el build real.** `scripts/serve-static.mjs` imita al host: clean URLs, redirección de `/` final y 404 real.
- **Cada página nueva** entra en `PAGES` de `e2e/a11y.spec.ts`.

## Git hooks

- `pre-commit`: `lint-staged` (eslint --fix + prettier sobre lo staged).
- `commit-msg`: `commitlint` con Conventional Commits.

Se instalan con `npm install` (script `prepare`).
