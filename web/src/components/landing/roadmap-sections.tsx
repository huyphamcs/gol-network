import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HandsCtaVisual } from '@/components/ui/hands-cta-visual';
import { landingCopy, versionLadder } from '@/content/landing';
import { FaqSections } from './faq-sections';
import { LandingSection, SectionHeading } from './landing-primitives';
import { InsightSections } from './insight-sections';
import { NetworkPixelBand } from './network-pixel-band';

const CTA_SHUTTER_COLUMNS = 22;
const CTA_SHUTTER_ROWS = 12;
const ctaTileHash = (column: number, row: number) => {
  const value = Math.sin(column * 127.1 + row * 311.7) * 43758.5453;
  return value - Math.floor(value);
};
const ctaShutterTiles = Array.from(
  { length: CTA_SHUTTER_COLUMNS * CTA_SHUTTER_ROWS },
  (_, index) => {
    const column = index % CTA_SHUTTER_COLUMNS;
    const row = Math.floor(index / CTA_SHUTTER_COLUMNS);
    const fromCenter = Math.abs((column + 0.5) / CTA_SHUTTER_COLUMNS - 0.5) * 2;
    return {
      id: index,
      threshold: Math.min(1, fromCenter * 0.78 + ctaTileHash(column, row) * 0.26),
    };
  },
);

export function RoadmapSections() {
  return (
    <>
      <LandingSection id="roadmap" labelledBy="roadmap-title" className="p-0 lg:p-0">
        <div className="relative overflow-hidden px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
          <Image
            src="/gol-network-globe.png"
            alt=""
            width={1254}
            height={1254}
            data-motion-parallax
            className="pointer-events-none absolute top-0 right-0 hidden size-96 translate-x-1/4 -translate-y-1/4 opacity-15 lg:block"
          />
          <SectionHeading
            id="roadmap-title"
            eyebrow="The product ladder"
            title="One account that absorbs the whole surface."
            copy="This is an absorption map, not a release schedule. Each stage adds capability without changing the authority model underneath."
          />
        </div>
        <ol
          data-motion-list
          className="grid px-5 pb-16 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:px-12 lg:pb-24"
        >
          {versionLadder.map((item, index) => (
            <li
              key={item.version}
              className="relative min-h-64 border-t border-primary py-8 pr-6 sm:pl-6 sm:first:pl-0"
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className={
                    index < 2
                      ? 'absolute -top-2 left-0 size-4 rounded-full border-2 border-card bg-primary ring-1 ring-primary sm:left-6 sm:first:left-0'
                      : 'absolute -top-2 left-0 size-4 rounded-full border-2 border-primary bg-card sm:left-6 sm:first:left-0'
                  }
                />
                <p className="font-mono text-xs font-semibold text-primary uppercase">
                  {item.version}
                </p>
              </div>
              <h3 className="mt-8 text-lg font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm leading-copy text-muted-foreground">{item.detail}</p>
            </li>
          ))}
        </ol>
      </LandingSection>

      <InsightSections />

      <NetworkPixelBand />

      <FaqSections />

      <LandingSection
        labelledBy="closer-title"
        className="relative isolate overflow-hidden border-border bg-ascii-canvas p-0 text-foreground lg:p-0"
      >
        <div className="relative z-10 mx-auto flex min-h-176 w-full max-w-landing flex-col px-5 py-20 sm:px-8 lg:min-h-224 lg:px-12 lg:py-24">
          <div className="relative z-20">
            <p className="font-mono text-xs font-semibold tracking-widest text-ink-foreground/55 uppercase">
              One click from the prototype
            </p>
          </div>

          <HandsCtaVisual className="mt-10 lg:absolute lg:inset-x-0 lg:top-24 lg:mt-0" />

          <div className="relative z-20 mt-auto max-w-lg border border-foreground/15 bg-ascii-canvas/90 p-6 backdrop-blur-sm sm:p-8 lg:ml-auto">
            <p className="font-mono text-xs font-semibold tracking-widest text-foreground uppercase">
              Authority engine
            </p>
            <h2
              id="closer-title"
              className="mt-4 text-3xl leading-tight font-semibold tracking-tight"
            >
              {landingCopy.closer}
            </h2>
            <p className="mt-3 leading-copy text-foreground/70">
              Start with the limited payment path. See how owner authority and the agent lane remain
              separate.
            </p>
            <Button asChild size="lg" className="mt-6">
              <Link href="/app">
                Explore the prototype
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </LandingSection>

      <LandingSection
        id="ready"
        labelledBy="ready-title"
        className="relative isolate left-1/2 -ml-[50vw] h-[190vh] min-h-0 w-screen border-border bg-primary p-0 text-foreground lg:p-0"
      >
        <div className="sticky top-0 flex h-screen min-h-[680px] w-screen items-center justify-center overflow-hidden bg-muted text-foreground">
          <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-5 text-center sm:px-8">
            <p className="font-mono text-xs font-semibold tracking-[0.35em] text-muted-foreground uppercase">
              Ready when you are
            </p>
            <h2
              id="ready-title"
              className="mt-10 max-w-6xl text-[clamp(3.4rem,10.5vw,10rem)] leading-[0.84] font-semibold tracking-[-0.07em] text-balance uppercase"
            >
              Every move.
              <br />
              Bounded. Verifiable.
            </h2>
            <Button asChild size="lg" className="mt-12">
              <Link href="/app">
                Open the prototype
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </Button>
          </div>

          <div
            aria-hidden="true"
            data-motion-cta-shutter
            className="pointer-events-none absolute inset-0 z-30 grid grid-cols-[repeat(22,minmax(0,1fr))] grid-rows-[repeat(12,minmax(0,1fr))] motion-reduce:hidden"
          >
            {ctaShutterTiles.map((tile) => (
              <span
                key={tile.id}
                data-motion-cta-shutter-cell
                data-motion-cta-threshold={tile.threshold}
                className="bg-primary"
              />
            ))}
          </div>
        </div>
      </LandingSection>
    </>
  );
}
