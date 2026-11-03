import type { ReactNode } from 'react';

import type { FeatureFlag } from './flags';

import { useFeatureFlag } from './use-feature-flag';

export interface FeatureGateProps {
  flag: FeatureFlag;
  children: ReactNode;
  /** Rendered when the flag is off. Nothing by default. */
  fallback?: ReactNode;
}

/** Renders `children` only when `flag` is on; otherwise `fallback`. */
export function FeatureGate({ flag, children, fallback = null }: FeatureGateProps) {
  return useFeatureFlag(flag) ? children : fallback;
}
