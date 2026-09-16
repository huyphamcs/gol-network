import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { insightCards } from '@/content/landing';
import { LandingSection, SectionHeading } from './landing-primitives';

export function InsightSections() {
  return (
    <>
      <LandingSection id="insights" labelledBy="insights-title">
        <SectionHeading eyebrow="Insights" title="Latest from Gol Network." id="insights-title" />
        <div data-motion-list className="mt-12 grid gap-6 lg:grid-cols-3">
          {insightCards.map((item) => (
            <article key={item.title}>
              <Image
                src={item.image}
                alt=""
                width={1672}
                height={941}
                loading="eager"
                className="aspect-video w-full rounded-lg border border-border object-cover"
              />
              <p className="mt-5 font-mono text-xs font-semibold tracking-widest text-primary uppercase">
                {item.category}
              </p>
              <h3 className="mt-3 text-2xl leading-tight font-semibold tracking-tight">
                {item.title}
              </h3>
              <p className="mt-4 text-sm leading-copy text-muted-foreground">{item.detail}</p>
              <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                Product note
                <ArrowRight aria-hidden="true" className="size-4" />
              </p>
            </article>
          ))}
        </div>
      </LandingSection>
    </>
  );
}
