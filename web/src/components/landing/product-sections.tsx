import Link from 'next/link';
import { ArrowRight, Blocks, Building2, CreditCard, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { networkPillars } from '@/content/landing';
import { LandingSection, SectionHeading, SquareBullet } from './landing-primitives';

const pillarIcons = [Blocks, Building2, ShieldCheck, CreditCard] as const;

export function ProductSections() {
  return (
    <LandingSection id="product" labelledBy="product-title">
      <SectionHeading
        id="product-title"
        eyebrow="The partner network"
        title="A common account for every side of agent finance."
        copy="Builders, markets and service rails connect around one owner-controlled authority layer."
      />
      <div data-motion-list className="mt-12 grid gap-4 lg:grid-cols-2">
        {networkPillars.map((pillar, index) => {
          const Icon = pillarIcons[index] ?? Blocks;
          return (
            <Card key={pillar.title} className="rounded-lg shadow-none">
              <CardContent className="grid h-full gap-6 p-6 sm:grid-cols-[auto_1fr] lg:p-8">
                <span className="flex size-14 items-center justify-center rounded-lg border border-border bg-card">
                  <Icon aria-hidden="true" className="size-7 text-primary" />
                </span>
                <div className="flex min-w-0 flex-col">
                  <h3 className="text-xl font-semibold">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-copy text-muted-foreground">{pillar.detail}</p>
                  <ul className="mt-5 space-y-2">
                    {pillar.points.map((point) => (
                      <li key={point} className="flex gap-3 text-sm text-muted-foreground">
                        <SquareBullet />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={pillar.href}
                    className="mt-6 inline-flex min-h-11 w-fit items-center gap-2 rounded-md border border-border px-4 text-sm font-semibold text-primary outline-none transition-colors hover:border-primary focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {pillar.action}
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </LandingSection>
  );
}
