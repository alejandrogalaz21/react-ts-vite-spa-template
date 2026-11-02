# 0005. i18n sin librería, locale en la URL

**Estado:** Aceptada · **Fecha:** 2026-11-02

## Contexto

- `kettuimx` cambia de idioma en estado de React: una sola URL, sin hreflang y con la `description` fija en español.
- `alejandrogalaz.space` usa el locale en la URL, pero castea los JSON (`as ISiteContent`) y reparte la lógica de locales en cinco lugares.

## Decisión

- El locale va en la URL (default sin prefijo, los demás con `/<código>`).
- La fuente única es `src/i18n/config.ts`.
- Los diccionarios son TS: `es.ts` define `Dictionary`, y los demás se tipan con él.
- `routes.ts` monta cada página por locale con `id` propio, sin `:lang?`.
- No hay provider: `useI18n()` lee la URL.

## Alternativas

- **react-i18next / FormatJS**: pluralización e ICU completos; más peso y configuración. Agregables por proyecto si hacen falta.
- **Segmento opcional `:lang?`**: probado y descartado. `/404` y cualquier segmento suelto caen en la ruta de idioma, y el prerender falla.

## Consecuencias

- Cada idioma es indexable, con hreflang recíproco validado en el build.
- Falta una traducción: error de compilación.
- No hay pluralización ICU; para casos simples basta con claves separadas.
