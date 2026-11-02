---
name: new-feature
description: Implementa una funcionalidad con datos siguiendo las capas del template (types → actions → hooks → components → view → route). Úsala para formularios, integraciones con API, listados o cualquier cosa que lea o escriba datos.
---

# Nueva funcionalidad por capas

Las dependencias van en un solo sentido: `route → view → hooks → actions → lib`. Ninguna capa importa de una superior.

## Orden de trabajo

1. **Tipos** (`src/types/<dominio>.ts`): schema de zod + tipo inferido (`z.output<typeof schema>`). Mensajes de error como claves del diccionario, no como texto.
2. **Acciones** (`src/actions/<dominio>.ts`): funciones `async` puras que leen o escriben datos (`requestJson` de `~/lib/http`, o contenido local). Mapper en `<dominio>.mapper.ts` si hay transformación. Test con MSW en `<dominio>.test.ts`.
3. **Hooks** (`src/sections/<dominio>/hooks/use-<algo>.ts`): fachada para la vista.
   - Datos del build (contenido, SEO): no uses hooks; llama la acción en el `loader` de la ruta.
   - Datos en vivo del cliente: `useQuery` con una fábrica de keys (`<dominio>Keys`).
   - Escrituras: `useMutation`, más `track()` de analytics para el resultado.
4. **Componentes** (`src/sections/<dominio>/components/`): presentación de la funcionalidad, con textos de `useI18n()`.
5. **Vista** (`src/sections/<dominio>/views/`): compone componentes, sin lógica.
6. **Ruta**: ver skill `new-page`.

## Reglas

- Variables nuevas `VITE_*`: agrégalas a `src/config/env.schema.ts`, `.env.example` y `docs/configuration.md`. Nunca leas `import.meta.env` directo: usa `env` de `~/config/env`.
- Analytics: eventos en `snake_case`, parámetros planos, nunca datos personales.
- Errores de red: `HttpError` de `~/lib/http`; la vista muestra un mensaje del diccionario en una región `role="status"`.
- Para cambios grandes, propón primero con `/opsx:propose` (OpenSpec).
