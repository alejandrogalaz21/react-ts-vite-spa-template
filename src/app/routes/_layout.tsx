import { isRouteErrorResponse, Outlet } from 'react-router';

import { SiteShell } from '#app/layout/site-shell';
import { ErrorView, NotFoundView, statusText } from '#features/status';
import { useI18n } from '#shared/i18n';

import type { Route } from './+types/_layout';

/** Layout route: wraps every page in the site chrome. */
export default function SiteLayout() {
  return (
    <SiteShell>
      <Outlet />
    </SiteShell>
  );
}

/** Errors inside a page keep the header and footer, so the visitor can navigate away. */
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const { locale } = useI18n();
  const t = statusText[locale];
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  const stack = import.meta.env.DEV && error instanceof Error ? error.stack : undefined;

  return (
    <SiteShell>
      {notFound ? <NotFoundView /> : <ErrorView title={t.error.title} body={t.error.body} stack={stack} />}
    </SiteShell>
  );
}
