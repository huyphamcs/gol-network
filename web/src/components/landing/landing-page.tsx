import { BoundarySections } from './boundary-sections';
import { LandingFooter } from './landing-footer';
import { LandingHeader } from './landing-header';
import { LandingHero } from './landing-hero';
import { LandingMotion } from './landing-motion';
import { MarketSections } from './market-sections';
import { ProductSections } from './product-sections';
import { RoadmapSections } from './roadmap-sections';

export function LandingPage() {
  return (
    <LandingMotion>
      <div className="min-h-screen overflow-x-clip bg-card text-landing-foreground">
        <LandingHeader />
        <main
          id="main-content"
          tabIndex={-1}
          className="mx-auto max-w-landing border-x border-border outline-none"
        >
          <LandingHero />
          <ProductSections />
          <MarketSections />
          <BoundarySections />
          <RoadmapSections />
        </main>
        <LandingFooter />
      </div>
    </LandingMotion>
  );
}
