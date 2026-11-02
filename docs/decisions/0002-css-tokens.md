# 0002. CSS plano con design tokens, sin UI kit

**Estado:** Aceptada · **Fecha:** 2026-11-02

## Contexto

- `alejandrogalaz.space` usa `tokens.json` → CSS generado + CSS por componente con BEM. Es liviano y sin runtime.
- `kettuimx` usa MUI 5 + Emotion. Es rápido para armar UI, pero suma decenas de KB de JS, un runtime de estilos y literales que escapan a los tokens.

## Decisión

CSS plano:

- `design/tokens.json` es la fuente única.
- `scripts/build-tokens.mjs` genera `src/styles/tokens.css`, versionado y verificado en CI con `--check`.
- Un `.css` por componente, con clases BEM.
- Temas claro y oscuro con `data-theme`.

## Alternativas

- **MUI 9**: más componentes listos, pero runtime CSS-in-JS y un look reconocible que cuesta quitar.
- **Tailwind 4**: excelente DX; mezcla diseño y markup y añade otra capa de configuración. Se puede agregar por proyecto sin romper la base, porque los tokens ya son variables CSS.

## Consecuencias

- Cero JS de estilos.
- Las marcas se aplican cambiando el JSON, no los componentes.
- Componentes complejos (combobox, datepicker, diálogos) se escriben o se traen por proyecto. Para eso, preferir primitivas headless accesibles (por ejemplo Radix o React Aria) sobre un kit completo.
