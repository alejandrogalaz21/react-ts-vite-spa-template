# Design system

CSS plano con tokens. Sin UI kit ni framework de utilidades (ver `docs/decisions/0002-css-tokens.md`).

## Tokens

`design/tokens.json` → `npm run tokens` → `src/styles/tokens.css`.

| Grupo            | Variables CSS                                                                                              | Ejemplo                                           |
| ---------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| Color (por tema) | `--color-<nombre>`                                                                                         | `--color-ink`, `--color-accent`, `--color-danger` |
| Fuente           | `--font-sans`, `--font-mono`                                                                               |                                                   |
| Espacio          | `--space-1` … `--space-7`                                                                                  | `--space-7` es fluido (padding de sección)        |
| Radio            | `--radius-sm/md/lg/pill`                                                                                   |                                                   |
| Layout           | `--layout-content-max`, `--layout-prose-max`, `--layout-gutter`, `--layout-touch-target`                   |                                                   |
| Tipografía       | clases `.text-display`, `.text-h2`, `.text-h3`, `.text-lead`, `.text-body`, `.text-small`, `.text-eyebrow` |                                                   |

Cada color del JSON lleva `usage`: es la guía de cuándo usarlo. Los pares texto/fondo cumplen WCAG AA en ambos temas, y `e2e/a11y.spec.ts` lo verifica.

## Temas

- **Claro y oscuro** vía `<html data-theme>`.
- **`public/theme-init.js`** lo fija antes del primer pintado (preferencia guardada o `prefers-color-scheme`). Así no hay parpadeo, y como archivo externo funciona con una CSP estricta.
- **`useTheme()`** lo lee y lo cambia.

## Componentes (`src/components/ui`)

| Componente                     | Notas                                                                                                   |
| ------------------------------ | ------------------------------------------------------------------------------------------------------- |
| `Button` + `buttonClassName()` | `type="button"` por defecto. Para enlaces con aspecto de botón: `<Link className={buttonClassName()}>`. |
| `Card`                         | `headingLevel` configurable para mantener el outline.                                                   |
| `SectionHeader`                | eyebrow + heading + lead; `as="h1"` en la página dueña.                                                 |
| `TextField`                    | Label visible, `aria-invalid` y `aria-describedby` para hint y error, `multiline`.                      |
| `Icon`                         | SVG inline, siempre `aria-hidden`. Agrega íconos al mapa `PATHS`.                                       |

## Reglas de estilo

- **Valores de diseño solo vía `var(--…)`**: nada de hex ni números mágicos en componentes.
- **Clases BEM** (`.card__title`, `.button--primary`). Un `.css` por componente, importado desde su `.tsx`.
- **Mobile first.** Breakpoints con `min-width` en `rem`.
- **Objetivo táctil ≥ 44px** (`--layout-touch-target`).
- **Foco visible global** (`:focus-visible` en `global.css`); no lo quites.
- **`prefers-reduced-motion`** respetado globalmente.
- **Fuente self-hosted** (Inter variable, solo subset latin) con `font-display: swap`.

## Imágenes

- **Hero / LCP**: `width` y `height` explícitos, `fetchPriority="high"`, sin `loading="lazy"`.
- **Bajo el pliegue**: `loading="lazy"` y dimensiones explícitas.
- **Formatos**: preferir SVG para ilustraciones y WebP/AVIF para fotos.
