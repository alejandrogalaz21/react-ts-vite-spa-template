---
name: new-component
description: Crea un componente del design system (src/components/ui) con estilos por tokens, story y test. Úsala cuando pidan un componente reutilizable, un primitivo de UI o "agrega un componente".
---

# Nuevo componente de UI

Los componentes de `src/components/ui/` son primitivos reutilizables entre proyectos.

## Pasos

1. Crea la carpeta `src/components/ui/<nombre>/` (kebab-case) con:
   - `<nombre>.tsx`: componente en PascalCase, props tipadas con `interface <Nombre>Props`, JSDoc en cada export.
   - `<nombre>.css`: clases BEM (`.<nombre>`, `.<nombre>__parte`, `.<nombre>--variante`). Solo `var(--color-*)`, `var(--space-*)`, `var(--radius-*)`: nada de hex ni números mágicos.
   - `<nombre>.stories.tsx`: una story por variante/estado (default, disabled, error, etc.).
   - `<nombre>.test.tsx`: si tiene comportamiento (estado, eventos, ARIA). Consulta por rol accesible (`getByRole`), no por clase.
2. Exporta desde `src/components/ui/index.ts`.
3. Verifica: `npm run lint && npm test && npm run build-storybook`.

## Reglas

- **Sin i18n**: los textos llegan por props. Si necesita `useI18n`, no es UI: va en `src/layout/` o en una sección.
- **Sin datos ni rutas**: nada de fetch, React Query ni `useLocation`. Para enlaces, acepta `className` y deja que el llamador use `<Link className={buttonClassName()}>`.
- **Accesible por defecto**: elementos nativos (`button`, `a`, `input`), objetivo táctil ≥ 44px (`var(--layout-touch-target)`), foco visible heredado de `:focus-visible`, iconos `aria-hidden`.
- Si un componente se usa en una sola sección, vive en `src/sections/<dominio>/components/`, no aquí.
