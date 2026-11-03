/** Length of the abbreviated commit hash, the same `git log --oneline` prints. */
const SHORT_SHA = 7;

/**
 * Label that identifies a build: `v0.1.0 · f32f543`, or `v0.1.0` when the commit is unknown
 * (local builds).
 */
export function formatBuildLabel(version: string, commit?: string): string {
  const sha = commit?.trim().slice(0, SHORT_SHA);
  return sha ? `v${version} · ${sha}` : `v${version}`;
}
