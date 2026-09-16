import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { AsciiText } from '@/components/ui/ascii-text';
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
        <div className="grid lg:grid-cols-[2fr_3fr]">
          <div className="flex items-center border-b border-border px-5 py-16 sm:px-8 lg:border-r lg:border-b-0 lg:px-14 lg:py-20">
            <SectionHeading
              id="roadmap-title"
              eyebrow="The product ladder"
              title="One account that absorbs the whole surface."
              copy="This is an absorption map, not a release schedule. Each stage adds capability without changing the authority model underneath."
              className="max-w-xl"
            />
          </div>

          <ol data-motion-list className="bg-card">
            {versionLadder.map((item, index) => (
              <li
                key={item.version}
                className="grid min-h-40 grid-cols-[5rem_minmax(0,1fr)] border-b border-border last:border-b-0 sm:min-h-44 sm:grid-cols-[7.5rem_minmax(0,1fr)]"
              >
                <div className="relative flex items-center border-r border-primary/30 px-5 sm:px-8">
                  <p className="font-mono text-3xl font-semibold tracking-tight text-primary uppercase sm:text-4xl">
                    {item.version}
                  </p>
                  <span
                    aria-hidden="true"
                    className={
                      index < 2
                        ? 'absolute top-1/2 right-0 size-3 -translate-y-1/2 translate-x-1/2 border-2 border-primary bg-primary ring-4 ring-card'
                        : 'absolute top-1/2 right-0 size-3 -translate-y-1/2 translate-x-1/2 border-2 border-primary bg-card ring-4 ring-card'
                    }
                  />
                </div>
                <div className="flex flex-col justify-center px-6 py-8 sm:px-10">
                  <h3 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                    {item.title}
                  </h3>
                  <span aria-hidden="true" className="mt-4 h-px w-10 bg-primary" />
                  <p className="mt-4 max-w-xl text-sm leading-copy text-muted-foreground sm:text-base">
                    {item.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
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
              <AsciiText>{landingCopy.closer}</AsciiText>
            </h2>
            <p className="mt-3 leading-copy text-foreground/70">
              Start with the limited payment path. See how owner authority and the agent lane remain
              separate.
            </p>
            <Button asChild size="lg" className="mt-6">
              <Link href="/app">
                Launch app
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
        <div className="sticky top-0 flex h-screen min-h-[680px] w-screen items-center justify-center overflow-hidden bg-card text-foreground">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-1/2 z-40 w-full max-w-landing -translate-x-1/2 border-x border-border"
          />
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
                Launch app
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
