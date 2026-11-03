import { FeatureGate } from '#shared/feature-flags';

import { CtaBand } from '../components/cta-band';
import { Features } from '../components/features';
import { Hero } from '../components/hero';
import { Stats } from '../components/stats';

/** Home page body. A view only composes its section components; it holds no logic. */
export function HomeView() {
  return (
    <>
      <Hero />
      <Features />
      <FeatureGate flag="components.homeStats">
        <Stats />
      </FeatureGate>
      <CtaBand />
    </>
  );
}
