# Tooling de IA

El repo trae lo necesario para que Claude Code (y otros agentes) trabajen con las mismas reglas que una persona del equipo.

## Archivos

| Archivo                         | Para qué                                                                                                                          |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `CLAUDE.md`                     | Reglas del proyecto: stack, comandos, capas, convenciones, definición de terminado. Se carga en cada sesión.                      |
| `.claude/settings.json`         | Permisos del proyecto (scripts npm, Playwright, OpenSpec, git de lectura), deny de `.env` y `git push --force`, hook de formateo. |
| `.claude/hooks/format-file.mjs` | `PostToolUse` en Edit/Write: `eslint --fix` + `prettier` al archivo tocado. Nunca bloquea.                                        |
| `.mcp.json`                     | MCP del proyecto (ver abajo). Cada persona los aprueba la primera vez.                                                            |
| `openspec/`                     | Flujo spec-driven: `config.yaml` con el contexto del proyecto, `specs/` y `changes/`.                                             |

## Skills (`.claude/skills/`)

| Skill                    | Origen                               | Cuándo                                                         |
| ------------------------ | ------------------------------------ | -------------------------------------------------------------- |
| `new-page`               | propia                               | Página o ruta nueva: textos, vista, ruta, prerender, nav y e2e |
| `new-component`          | propia                               | Primitivo de UI: tsx + css + story + test                      |
| `new-feature`            | propia                               | Funcionalidad con datos siguiendo las capas                    |
| `react-router`           | oficial (`create-react-router`, MIT) | Referencias de framework mode, data mode y RSC                 |
| `openspec-*` + `/opsx:*` | generadas por `openspec init`        | propose → apply → archive de changes                           |

Las skills de marca (`design-system-alejandro-galaz`, etc.) **no** van en la base: se agregan por proyecto.

## MCP del proyecto (`.mcp.json`)

| Servidor     | Uso                                                                                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `context7`   | Docs actuales de librerías (React Router 8, Vite 8, zod 4…). Sin API key en el repo: tier público; para más cuota, configúrala en tu `~/.claude.json`. |
| `playwright` | Abrir el sitio, inspeccionar, capturar pantallas y depurar e2e desde el agente.                                                                        |

## Flujo recomendado

1. **Cambio grande o ambiguo**: `/opsx:propose "<idea>"`. Revisa proposal, design y tasks.
2. **Implementación**: `/opsx:apply`, o directo con las skills `new-page` / `new-feature` / `new-component`.
3. **Verificación**: `npm run check && npm run test:e2e`. Es la definición de terminado de `CLAUDE.md`.
4. **Cierre**: `/opsx:archive`. Commit con Conventional Commits.

## Actualizar

```bash
npx @fission-ai/openspec@latest update   # regenera skills y comandos de OpenSpec
npx create-react-router@latest tmp       # trae la skill react-router más reciente desde tmp/.agents/skills
```
