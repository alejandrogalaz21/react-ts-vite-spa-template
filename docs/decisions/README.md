# Decisiones de arquitectura (ADR)

Cada decisión que no es obvia leyendo el código queda aquí: contexto, decisión, alternativas y consecuencias. Una decisión nueva que reemplaza a otra la marca como `Reemplazada por NNNN`.

| #                                      | Decisión                                                   | Estado             |
| -------------------------------------- | ---------------------------------------------------------- | ------------------ |
| [0001](0001-react-router-prerender.md) | React Router 8 framework mode con `ssr: false` + prerender | Aceptada           |
| [0002](0002-css-tokens.md)             | CSS plano con design tokens, sin UI kit                    | Aceptada           |
| [0003](0003-vitest.md)                 | Vitest en lugar de Jest                                    | Aceptada           |
| [0004](0004-lint-and-format.md)        | ESLint 10 flat + jsx-a11y-x + Prettier                     | Aceptada           |
| [0005](0005-i18n-in-url.md)            | i18n sin librería, locale en la URL                        | Aceptada           |
| [0006](0006-typescript-6.md)           | TypeScript 6.0, no 7.0                                     | Aceptada (revisar) |
| [0007](0007-deploy-agnostic.md)        | Deploy agnóstico, AWS opcional                             | Aceptada           |

Plantilla para una nueva: copia cualquiera y cambia número y título.
