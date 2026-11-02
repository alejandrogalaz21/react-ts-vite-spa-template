import type { Config } from '@react-router/dev/config';

import { getPrerenderPaths } from './src/routes/prerender';

/**
 * React Router framework mode, static output only.
 *
 * - `ssr: false`: there is no runtime server. The build writes plain files to `build/client/`
 *   that any static host (S3 + CloudFront, Netlify, Vercel static, nginx) can serve.
 * - `prerender`: every public URL is rendered to its own `index.html` at build time, so crawlers
 *   and link previews get the full HTML, `<title>`, meta tags and JSON-LD without running JS.
 *
 * Add a page: register it in `src/routes.ts` and, when it has dynamic params, list its values in
 * `src/routes/prerender.ts`.
 */
export default {
  appDirectory: 'src',
  ssr: false,
  prerender: getPrerenderPaths,
} satisfies Config;
