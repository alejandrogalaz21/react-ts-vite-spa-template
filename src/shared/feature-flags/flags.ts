import { features } from '#shared/config/features';

type Features = typeof features;

/** Every flag in src/shared/config/features.ts as `group.name`: `'pages.blog'`, `'components.themeToggle'`. */
export type FeatureFlag = {
  [Group in keyof Features]: `${Group}.${Extract<keyof Features[Group], string>}`;
}[keyof Features];

/** Name of a page flag without its group: `'pages.blog'` → `'blog'`. */
export type PageName = FeatureFlag extends infer Flag
  ? Flag extends `pages.${infer Name}`
    ? Name
    : never
  : never;

/**
 * Whether a flag is on. Pure and synchronous, so `meta`, `loader` and prerender.ts can call it.
 * Inside components prefer {@link useFeatureFlag} or `<FeatureGate>`.
 */
export function isEnabled(flag: FeatureFlag): boolean {
  const [group, name] = flag.split('.') as [keyof Features, string];
  const values: Record<string, boolean> = features[group];
  return values[name] ?? false;
}

/** Whether a page is on: `isPageEnabled('blog')`. */
export function isPageEnabled(page: PageName): boolean {
  return isEnabled(`pages.${page}`);
}
