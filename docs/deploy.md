# Deploy

El build produce archivos estáticos en `build/client/`. Cualquier host que cumpla el contrato de abajo sirve.

> `build/server/` también se genera (React Router lo usa para prerenderizar). **No se publica.**

## Contrato del host

| Petición                   | Respuesta                                                        |
| -------------------------- | ---------------------------------------------------------------- |
| `/about`                   | `about/index.html` (clean URLs)                                  |
| `/about/`                  | 301 a `/about`                                                   |
| `/en.data`, `/blog/x.data` | el archivo tal cual (datos de navegación cliente)                |
| `/assets/*`                | el archivo, `Cache-Control: public, max-age=31536000, immutable` |
| HTML y `.data`             | `Cache-Control: no-cache`                                        |
| cualquier ruta sin archivo | `404/index.html` con **status 404**                              |

`npm run preview` (`scripts/serve-static.mjs`) implementa este contrato en local y es lo que usa e2e.

## GitHub Actions

- `ci.yml` corre en PR y en `main`. Nunca toca la nube.
- `deploy.yml` corre en push a `main` cuando cambian archivos del sitio, o a mano. Tiene dos jobs:
  1. **build**: declara `environment: prod` para leer las `VITE_*`, compila y sube `build/client` como artifact. No tiene credenciales.
  2. **deploy-aws**: solo corre si la variable `DEPLOY_TARGET` vale `aws`. Asume un rol por OIDC (sin llaves guardadas) y ejecuta `scripts/deploy-aws.sh --skip-build`.

Una copia nueva del template compila en `main`, pero no publica nada hasta que configures un destino.

### Variables del environment `prod`

| Variable                 | Ejemplo                                 | Para                                                     |
| ------------------------ | --------------------------------------- | -------------------------------------------------------- |
| `DEPLOY_TARGET`          | `aws`                                   | Activa el job de deploy                                  |
| `AWS_REGION`             | `us-west-2`                             | Región del rol y de SSM                                  |
| `AWS_DEPLOY_ROLE_ARN`    | `arn:aws:iam::123:role/deploy-mi-sitio` | Rol OIDC (trust: `repo:<owner>/<repo>:environment:prod`) |
| `DEPLOY_SSM_PREFIX`      | `/base/prod/web/mi-sitio`               | SSM con `bucket_name` y `distribution_id`                |
| `VITE_SITE_URL`          | `https://mi-sitio.com`                  | Ver `docs/configuration.md`                              |
| `VITE_ALLOW_INDEXING`    | `true`                                  |                                                          |
| `VITE_GA_MEASUREMENT_ID` | `G-…`                                   |                                                          |
| `VITE_API_URL`           | `https://api.mi-sitio.com`              |                                                          |

## AWS: S3 + CloudFront

Infraestructura (en el repo de infra, no aquí):

- Bucket privado con Origin Access Control.
- CloudFront Function de clean URLs. Referencia en `infra/cloudfront/clean-urls.js`.
- Respuesta de error personalizada: 403/404 → `/404/index.html`, código 404.
- Parámetros SSM `bucket_name` y `distribution_id` bajo un prefijo.
- Rol IAM para OIDC. Solo necesita leer ese prefijo SSM, escribir el bucket e invalidar la distribución.

`scripts/deploy-aws.sh` publica en 4 pasadas, en este orden:

1. Assets con hash.
2. Archivos estáticos.
3. HTML y `.data`.
4. Prune.

El orden importa: ningún visitante recibe HTML que apunte a archivos aún no subidos. Luego invalida solo las rutas sin hash (cambia a `/*` si hay más de 500).

Uso local (con un perfil o sesión SSO):

```bash
DEPLOY_SSM_PREFIX=/base/prod/web/mi-sitio scripts/deploy-aws.sh --dry-run
```

## Otros hosts

- **Netlify / Cloudflare Pages:** publish dir `build/client`. Clean URLs nativas. Para el 404, `404.html` en la raíz: copia `404/index.html` en un paso extra del build.
- **Vercel:** output `build/client`, `cleanUrls: true` y `trailingSlash: false` en `vercel.json`.
- **nginx:** `try_files $uri $uri/index.html =404;` y `error_page 404 /404/index.html;`.
