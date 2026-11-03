import type { Config } from '@react-router/dev/config';

import { getPrerenderPaths } from './src/app/routes/prerender';

/**
 * React Router framework mode, static output only.
 *
 * - `ssr: false`: there is no runtime server. The build writes plain files to `build/client/`
 *   that any static host (S3 + CloudFront, Netlify, Vercel static, nginx) can serve.
 * - `prerender`: every public URL is rendered to its own `index.html` at build time, so crawlers
 *   and link previews get the full HTML, `<title>`, meta tags and JSON-LD without running JS.
 *
 * `appDirectory` is `src/app`: root, route table and route modules. Pages live in `src/features`.
 *
 * Add a page: register it in `src/app/routes.ts` and list its URLs in `src/app/routes/prerender.ts`.
 */
export default {
  appDirectory: 'src/app',
  ssr: false,
  prerender: getPrerenderPaths,
} satisfies Config;
