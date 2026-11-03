/**
 * Public API of the feature flags. `isEnabled`, `useFeatureFlag` and the types are part of it even
 * when the template itself does not use them yet (`@public` keeps knip from flagging them).
 */
export {
  /** @public */
  FeatureGate,
  /** @public */
  type FeatureGateProps,
} from './feature-gate';
export {
  /** @public */
  type FeatureFlag,
  /** @public */
  isEnabled,
  isPageEnabled,
  type PageName,
} from './flags';
/** @public */
export { useFeatureFlag } from './use-feature-flag';
