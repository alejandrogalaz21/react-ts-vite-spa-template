import { type FeatureFlag, isEnabled } from './flags';

/**
 * Whether a flag is on, for components. Today it reads the build-time config; it is the single
 * seam to swap in runtime flags (remote config, A/B tests) without touching the callers.
 */
export function useFeatureFlag(flag: FeatureFlag): boolean {
  return isEnabled(flag);
}
