import { z } from 'zod';

/**
 * Shape of a blog post in src/features/blog/content/<locale>.json. The schema validates content at build
 * time (route loaders run during prerender), so a malformed entry fails the build, not the page.
 */
export const postSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be kebab-case'),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  publishedAt: z.iso.date(),
  readingMinutes: z.number().int().positive(),
  tags: z.array(z.string()).default([]),
  body: z.array(z.string()).min(1),
  draft: z.boolean().default(false),
});

export type Post = z.output<typeof postSchema>;

/** Post without its body: what list views need. */
export type PostSummary = Omit<Post, 'body'>;
