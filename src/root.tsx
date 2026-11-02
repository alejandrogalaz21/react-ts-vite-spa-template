import { QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, useState } from 'react';
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from 'react-router';

import { site } from '~/config/site';
import { getDictionary, localeFromPathname } from '~/i18n';
import { createQueryClient } from '~/lib/query-client';

import type { Route } from './+types/root';

import '~/styles/tokens.css';
import '~/styles/global.css';

export const links: Route.LinksFunction = () => [
  { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
  { rel: 'icon', href: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
  { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
  { rel: 'manifest', href: '/site.webmanifest' },
];

/**
 * HTML document shell, shared by every route and by the root error boundary. The `lang`
 * attribute follows the URL, so the prerendered HTML is correct before any JS runs.
 */
export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const locale = localeFromPathname(pathname);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content={site.themeColor} />
        {/* Sets data-theme before first paint. External file: works under a strict CSP. */}
        <script src="/theme-init.js" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

/** App root: client-side providers. One QueryClient per app instance. */
export default function App() {
  const [queryClient] = useState(createQueryClient);
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}

/** Last-resort boundary (errors outside the site layout). Renders without the site chrome. */
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const { pathname } = useLocation();
  const t = getDictionary(localeFromPathname(pathname));
  const notFound = isRouteErrorResponse(error) && error.status === 404;

  return (
    <main id="main" className="container section stack">
      <h1 className="text-h2">{notFound ? t.notFound.title : t.error.title}</h1>
      <p>{notFound ? t.notFound.body : t.error.body}</p>
      <a href="/">{t.notFound.backHome}</a>
    </main>
  );
}
