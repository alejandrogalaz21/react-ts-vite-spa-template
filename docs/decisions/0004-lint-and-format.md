# 0004. ESLint 10 flat + jsx-a11y-x + Prettier

**Estado:** Aceptada · **Fecha:** 2026-11-02

## Contexto

- `alejandrogalaz.space` usa ESLint 8 con `.eslintrc` legacy, sin a11y ni Prettier.
- `kettuimx` no tiene linter ni formateador.
- ESLint 9 ya figura como "no longer supported" en npm.
- `eslint-plugin-jsx-a11y` no publica desde 2024 y su peer llega solo a ESLint 9.

## Decisión

- **ESLint 10** con flat config (`eslint.config.js`):
  - `typescript-eslint` `recommendedTypeChecked` (solo en TS).
  - `react-hooks` (`recommended-latest`).
  - **`eslint-plugin-jsx-a11y-x`**: fork mantenido por es-tooling/e18e, con peer ESLint 9 y 10.
  - `perfectionist` para el orden de imports.
- **Prettier 3** para formato. `eslint-config-prettier` apaga las reglas de estilo.
- **husky + lint-staged + commitlint** (Conventional Commits).

## Alternativas

- **Biome 2**: más rápido y una sola herramienta, pero sus reglas de a11y y hooks no igualan a jsx-a11y y react-hooks.
- **ESLint 9 + jsx-a11y original**: funciona hoy, pero ambos están sin mantenimiento.

## Consecuencias

- Si `eslint-plugin-jsx-a11y` vuelve a publicar con soporte para ESLint 10, evaluar volver al original (mismo set de reglas).
- `typescript-eslint` limita la versión de TypeScript (ver 0006).
