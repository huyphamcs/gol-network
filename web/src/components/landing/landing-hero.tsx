import Link from 'next/link';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { AsciiText } from '@/components/ui/ascii-text';
import { Button } from '@/components/ui/button';
import { SonarGrid } from '@/components/ui/sonar-grid';
import { landingCopy } from '@/content/landing';

export function LandingHero() {
  return (
    <section
      id="hero"
      aria-labelledby="landing-title"
      data-visual="network-field"
      data-motion-hero-panel
      className="relative mx-auto flex min-h-[calc(100svh-4rem)] max-w-landing items-center justify-center overflow-hidden border-b border-border bg-card px-5 py-20 text-center sm:px-8 lg:px-12"
    >
      <SonarGrid
        data-motion-hero-visual
        aria-hidden="true"
        characters="acegmnopqsu0235689ABCDGHMNOQRSUVWXYZ#@%&amp;"
        cellSize={[12, 18]}
        dotRadius={1.35}
        baseOpacity={0.12}
        pingEvery={2.8}
        speed={240}
        ringWidth={84}
        amplitude={0}
        pingArea={[0.08, 0.12, 0.92, 0.88]}
        className="absolute inset-0 text-primary"
      />

      <div
        data-motion-hero-copy
        className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 py-8 sm:px-8"
      >
        <h1
          id="landing-title"
          className="text-shadow-hero max-w-4xl text-5xl leading-none font-semibold tracking-tighter text-balance sm:text-7xl lg:text-8xl"
        >
          <AsciiText delay={200}>{landingCopy.headline}</AsciiText>
        </h1>
        <p className="text-shadow-hero mt-7 text-xl font-medium text-muted-foreground sm:text-2xl">
          {landingCopy.lead}
        </p>
        <div className="mt-9 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <Button asChild size="lg" className="shadow-panel">
            <Link href="/app">
              Launch app
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="bg-card">
            <Link href="#product">
              See how Gol Network works
              <ArrowDown aria-hidden="true" className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
