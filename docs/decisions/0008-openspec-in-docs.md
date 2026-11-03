# 0008. OpenSpec dentro de `docs/`

**Estado:** Aceptada · **Fecha:** 2026-11-02

## Contexto

Los specs y changes de OpenSpec son documentación del proyecto. En la raíz del repo, `openspec/` quedaba separado del resto de `docs/`.

La CLI de OpenSpec (1.13) no permite configurar la ruta. Las rutas `openspec/specs` y `openspec/changes` son fijas. La raíz se resuelve buscando un directorio `openspec/` desde el directorio actual hacia arriba.

## Decisión

- Mover `openspec/` a `docs/openspec/`. La raíz de OpenSpec pasa a ser `docs/`.
- Correr todo comando `openspec` desde `docs/` (`cd docs && openspec …`). `CLAUDE.md` lo indica para que las skills `openspec-*` resuelvan la raíz desde ahí.
- `openspec update` se sigue corriendo desde la raíz del repo, porque regenera `.claude/skills` y `.claude/commands`.

## Alternativas

- **Dejar `openspec/` en la raíz**: es lo que espera la CLI, sin reglas extra. Descartada: separa los specs del resto de la documentación.
- **Store registrado (`store:` en `openspec/config.yaml`)**: requiere registrar el store en cada máquina con `openspec store register`. Descartada: un clon nuevo no funcionaría sin ese paso.
- **Symlink `openspec` → `docs/openspec`**: frágil en Windows y en git.

## Consecuencias

- Toda la documentación queda bajo `docs/`.
- Un comando `openspec` corrido desde la raíz del repo no encuentra la raíz del proyecto. Puede resolver otro `openspec/` de un directorio superior, si existe.
- Si OpenSpec agrega una ruta configurable, se reemplaza esta regla por la configuración.
