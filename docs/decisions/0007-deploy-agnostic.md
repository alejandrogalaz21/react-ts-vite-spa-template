# 0007. Deploy agnóstico, AWS opcional

**Estado:** Aceptada · **Fecha:** 2026-11-02

## Contexto

Los dos repos de referencia publican en S3 + CloudFront con OIDC y SSM, con prefijos, regiones y rutas fijos en el código. Una base no puede asumir el host.

## Decisión

- El contrato del host está documentado (`docs/deploy.md`) e implementado en local por `scripts/serve-static.mjs`, que es lo que usa e2e.
- `deploy.yml` siempre compila; el job de AWS solo corre con `vars.DEPLOY_TARGET == 'aws'`.
- `scripts/deploy-aws.sh` se parametriza por entorno (`DEPLOY_SSM_PREFIX` o `DEPLOY_BUCKET`/`DEPLOY_DISTRIBUTION_ID`, `AWS_REGION`). Conserva las 4 pasadas y la invalidación dirigida de los repos originales.
- La notificación (Telegram/SNS de `alejandrogalaz21/github-workflows`) **no** va en la base: depende de un repo privado.

## Consecuencias

- Un clon nuevo compila en CI sin credenciales ni variables.
- Otro host (Netlify, Vercel, nginx) solo necesita un job nuevo con su `if`.
