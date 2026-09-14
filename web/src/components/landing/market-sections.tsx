import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BarChart3, BookOpen, Braces, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { landingResources } from '@/content/landing';
import { BuilderTerminalSection } from './builder-terminal-section';
import { Eyebrow, LandingSection } from './landing-primitives';

const resourceIcons = [BookOpen, Braces, ShieldCheck, BarChart3] as const;

export function MarketSections() {
  return (
    <LandingSection id="markets" labelledBy="builder-title" className="p-0 lg:p-0">
      <BuilderTerminalSection />

      <nav
        data-motion-list
        className="grid border-t border-border sm:grid-cols-2 lg:grid-cols-4"
        aria-label="Resources"
      >
        {landingResources.map((resource, index) => {
          const Icon = resourceIcons[index] ?? BookOpen;
          return (
            <Link
              key={resource.title}
              href={resource.href}
              className="group flex min-h-28 items-center gap-4 border-b border-border p-5 outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring sm:border-l sm:first:border-l-0 lg:border-b-0 lg:p-6"
            >
              <Icon aria-hidden="true" className="size-6 shrink-0 text-primary" />
              <span className="min-w-0">
                <span className="block font-semibold">{resource.title}</span>
                <span className="mt-1 block text-xs leading-copy text-muted-foreground">
                  {resource.detail}
                </span>
              </span>
              <ArrowRight aria-hidden="true" className="ml-auto size-4 shrink-0 text-primary" />
            </Link>
          );
        })}
      </nav>

      <div className="grid overflow-hidden border-t border-border lg:grid-cols-5">
        <div className="px-5 py-12 sm:px-8 lg:col-span-3 lg:px-12 lg:py-14">
          <Eyebrow>For builders</Eyebrow>
          <h3 className="mt-4 text-3xl font-semibold tracking-tight">
            The Gol Network Builders Program
          </h3>
          <p className="mt-4 max-w-2xl leading-copy text-muted-foreground">
            A future path for builders to connect scoped agent products to the common authority and
            execution layer. The current prototype is the place to start.
          </p>
          <Button asChild size="lg" className="mt-6">
            <Link href="/app">
              Explore the prototype
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="relative min-h-64 bg-muted lg:col-span-2">
          <Image
            src="/gol-network-modules.png"
            alt=""
            width={1254}
            height={1254}
            data-motion-parallax
            className="absolute inset-0 size-full object-contain object-bottom"
          />
        </div>
      </div>
    </LandingSection>
  );
}
