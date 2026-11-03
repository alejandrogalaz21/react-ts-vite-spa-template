import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';

import { site } from '#shared/config/site';
import { FeatureGate, isPageEnabled, type PageName } from '#shared/feature-flags';
import { useTheme } from '#shared/hooks/use-theme';
import { LOCALES, localizePath, stripLocale, useI18n } from '#shared/i18n';
import { Icon } from '#shared/ui';

import './site-header.css';

/**
 * Primary navigation, in display order. Each item is also a page flag: pages that are off
 * (src/shared/config/features.ts) leave the menu. Home always stays, it is the way back.
 */
const NAV_ITEMS = [
  { path: '/', key: 'home' },
  { path: '/about', key: 'about' },
  { path: '/services', key: 'services' },
  { path: '/blog', key: 'blog' },
  { path: '/contact', key: 'contact' },
] as const satisfies readonly { path: string; key: PageName }[];

/** Sticky site header: brand, primary nav (collapsible on phones), locale switch and theme toggle. */
export function SiteHeader() {
  const { t, locale, href } = useI18n();
  const { pathname } = useLocation();
  const [theme, toggleTheme] = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const neutralPath = stripLocale(pathname);
  const navItems = NAV_ITEMS.filter((item) => item.key === 'home' || isPageEnabled(item.key));

  return (
    <header className="site-header">
      <a className="site-header__skip" href="#main">
        {t.nav.skipToContent}
      </a>
      <div className="site-header__inner container">
        <Link to={href('/')} className="site-header__brand" onClick={closeMenu}>
          {site.name}
        </Link>

        <button
          type="button"
          className="site-header__menu-button"
          aria-expanded={menuOpen}
          aria-controls="primary-nav"
          aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Icon name={menuOpen ? 'close' : 'menu'} />
        </button>

        <div className="site-header__panel" data-open={menuOpen}>
          <nav id="primary-nav" aria-label={t.nav.primary}>
            <ul className="site-header__nav">
              {navItems.map((item) => (
                <li key={item.key}>
                  <NavLink
                    to={href(item.path)}
                    end={item.path === '/'}
                    className="site-header__link"
                    onClick={closeMenu}
                  >
                    {t.nav[item.key]}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="site-header__tools">
            <FeatureGate flag="components.localeSwitch">
              <ul className="site-header__locales" aria-label={t.nav.language}>
                {LOCALES.map((code) => (
                  <li key={code}>
                    <Link
                      to={localizePath(neutralPath, code)}
                      hrefLang={code}
                      lang={code}
                      aria-current={code === locale ? 'true' : undefined}
                      className="site-header__locale"
                      onClick={closeMenu}
                    >
                      {code.toUpperCase()}
                    </Link>
                  </li>
                ))}
              </ul>
            </FeatureGate>
            <FeatureGate flag="components.themeToggle">
              <button
                type="button"
                className="site-header__icon-button"
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? t.theme.toLight : t.theme.toDark}
              >
                <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
              </button>
            </FeatureGate>
          </div>
        </div>
      </div>
    </header>
  );
}
