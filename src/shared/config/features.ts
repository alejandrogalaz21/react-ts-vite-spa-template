/**
 * Feature flags, resolved at build time. Flip a value and rebuild:
 *
 * - `pages.<name>: false` keeps the URL alive but renders the "coming soon" view with `noindex`,
 *   hides the page from the navigation and leaves it out of sitemap.xml.
 * - `components.<name>: false` hides every `<FeatureGate flag="components.<name>">` block.
 *
 * Flags ship in the public bundle: use them to release work, never to protect content or data.
 * src/app/routes/prerender.ts loads this file at build time: import only `#` aliases or relative paths.
 */
export const features = defineFeatures({
  pages: {
    home: true,
    about: true,
    blog: true,
    contact: true,
    privacy: true,
    services: false,
  },
  components: {
    localeSwitch: true,
    themeToggle: true,
    homeStats: true,
  },
});

/**
 * Keeps the flag names as literal types (`'pages.blog'`) but types every value as `boolean`, so
 * flipping a flag never changes a type and `if (flag)` checks are not flagged as constant.
 */
function defineFeatures<const T extends Record<string, Record<string, boolean>>>(
  config: T,
): { [Group in keyof T]: Record<keyof T[Group], boolean> } {
  return config;
}
