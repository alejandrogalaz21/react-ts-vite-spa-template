# 0006. TypeScript 6.0, no 7.0

**Estado:** Aceptada (revisar cada trimestre) · **Fecha:** 2026-11-02

## Contexto

TypeScript 7 (compilador nativo) es la última versión en npm. `typescript-eslint` 8.72 declara el peer `typescript >=4.8.4 <6.1.0`.

## Decisión

Fijar `typescript@^6.0.3`. Además, `tsconfig.json` activa:

- `strict`
- `noUncheckedIndexedAccess`
- `noImplicitOverride`
- `noImplicitReturns`
- `verbatimModuleSyntax`
- `allowImportingTsExtensions`, para que `vite.config.ts` y `scripts/postbuild.mjs` importen el schema de env `.ts`. Node 24 elimina los tipos de forma nativa.

## Revisar cuando

`typescript-eslint` publique soporte para TS 7. Entonces subir y medir el tiempo de `npm run typecheck`.
