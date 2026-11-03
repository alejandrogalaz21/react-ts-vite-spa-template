---
name: new-feature
description: Crea o amplía una feature en src/features/<dominio> (types → api → hooks → components → views → index) y la conecta a una ruta. Úsala para formularios, integraciones con API, listados o cualquier funcionalidad con datos.
---

# Nueva feature

Una feature es una carpeta autocontenida en `src/features/<dominio>/`. Dentro de ella las dependencias van en un sentido: `views → components → hooks → api → types`. Fuera de ella solo puede usar `#shared/*`.

## Forma

```
src/features/<dominio>/
├─ types.ts          schema de zod + tipos inferidos
├─ api/              <dominio>.ts (async, puro) + <dominio>.mapper.ts + <dominio>.test.ts (MSW)
├─ hooks/            use-<algo>.ts: fachada para la vista
├─ components/       bloques de la feature (+ .css BEM, + test si tienen lógica)
├─ views/            <nombre>-view.tsx: compone componentes, sin lógica
├─ content/          <locale>.json, si la feature tiene contenido propio
├─ i18n/             es.ts (fuente del tipo <X>Text), en.ts, index.ts (<x>Text + use<X>Text)
└─ index.ts          API pública: lo que app/ puede importar
```

## Orden de trabajo

1. **Tipos** (`types.ts`): schema de zod + tipo inferido (`z.output<typeof schema>`). Mensajes de error como claves de `i18n/`, no como texto.
2. **API** (`api/<dominio>.ts`): funciones `async` puras que leen o escriben datos (`requestJson` de `#shared/lib/http`, o contenido de `content/`). Mapper si hay transformación. Test con MSW.
3. **Hooks** (`hooks/use-<algo>.ts`):
   - Datos del build (contenido, SEO): no uses hooks; llama la API desde el `loader` de la ruta.
   - Datos en vivo del cliente: `useQuery` con una fábrica de keys (`<dominio>Keys`).
   - Escrituras: `useMutation`, más `track()` de `#shared/analytics` para el resultado.
4. **Textos** (`i18n/`): `es.ts` exporta `es` y `type <X>Text = typeof es`; `en.ts` exporta `en: <X>Text`; `index.ts` exporta `<x>Text: LocaleTexts<<X>Text>` y `use<X>Text()` (envuelve `useLocaleText` de `#shared/i18n`). Copia `src/features/blog/i18n/`.
5. **Componentes** y **vista**: textos con `use<X>Text()`; `useI18n()` solo para `href`, `locale` o el chrome.
6. **`index.ts`**: exporta la vista, `<x>Text` (para `meta`) y lo que la ruta necesite (p. ej. `getPosts`). Nada más.
7. **Ruta**: ver skill `new-page`. La ruta importa de `#features/<dominio>`.

## Reglas

- Imports **relativos** dentro de la feature (`./`, `../`); `#shared/*` para lo compartido. ESLint rechaza `#app/*`, `#features/*` y `../../` desde una feature.
- ¿Dos features necesitan lo mismo? Muévelo a `src/shared/`. ¿Una página combina dos features? Compónlas en la ruta (`app/`).
- Variables nuevas `VITE_*`: `src/shared/config/env.schema.ts`, `.env.example` y `docs/configuration.md`. Usa `env` de `#shared/config/env`.
- Analytics: eventos en `snake_case`, parámetros planos, nunca datos personales.
- Errores de red: `HttpError` de `#shared/lib/http`; la vista muestra un mensaje de `i18n/` en una región `role="status"`.
- Si `app/routes/prerender.ts` necesita la API de la feature, importa `#features/<x>/api/<archivo>` directo (con `eslint-disable` y el motivo): react-router.config.ts no puede cargar vistas. Esa cadena no lleva JSX ni CSS.
- Para cambios grandes, propón primero con `/opsx:propose` (OpenSpec).
