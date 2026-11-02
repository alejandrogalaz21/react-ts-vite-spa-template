import { isRouteErrorResponse, Outlet } from 'react-router';

import { getDictionary, useI18n } from '~/i18n';
import { SiteShell } from '~/layout/site-shell';
import { ErrorView } from '~/sections/errors/views/error-view';

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
  const t = getDictionary(locale);
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  const stack = import.meta.env.DEV && error instanceof Error ? error.stack : undefined;

  return (
    <SiteShell>
      <ErrorView
        title={notFound ? t.notFound.title : t.error.title}
        body={notFound ? t.notFound.body : t.error.body}
        stack={stack}
      />
    </SiteShell>
  );
}
