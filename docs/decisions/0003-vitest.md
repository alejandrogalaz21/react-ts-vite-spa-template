# 0003. Vitest en lugar de Jest

**Estado:** Aceptada · **Fecha:** 2026-11-02

## Contexto

Los dos repos de referencia usan Jest, cada uno con su propio transform:

- `alejandrogalaz.space`: `ts-jest` más un `tsconfig.jest.json` en CommonJS y `moduleNameMapper` duplicando los alias.
- `kettuimx`: `@swc/jest`.

## Decisión

Vitest 5, con jsdom, Testing Library y MSW 3. `vitest.config.ts` reutiliza el pipeline de Vite: los mismos alias (`resolve.tsconfigPaths`), ESM y TS sin transform aparte. La cobertura v8 tiene un umbral del 70%.

## Consecuencias

- Una sola forma de resolver módulos para app, tests y Storybook.
- Al migrar tests de Jest, la API es casi idéntica (`vi` en lugar de `jest`).
