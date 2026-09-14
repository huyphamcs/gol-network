import Image from 'next/image';
import { ArrowRight, Globe2, Link2, Network, ShieldCheck, Users } from 'lucide-react';
import { insightCards, substrateComponents } from '@/content/landing';
import { LandingSection, SectionHeading } from './landing-primitives';

const substrateIcons = [ShieldCheck, Network, Link2, Users, Globe2] as const;

export function SubstrateStrip() {
  return (
    <LandingSection className="py-14 lg:py-16" labelledBy="substrate-title">
      <p className="font-mono text-xs font-semibold tracking-widest text-primary uppercase">
        Existing substrate
      </p>
      <h2 id="substrate-title" className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
        Built from systems already in motion.
      </h2>
      <ul
        data-motion-list
        className="mt-10 grid gap-y-6 border-y border-border py-7 sm:grid-cols-3 lg:grid-cols-5"
      >
        {substrateComponents.map((item, index) => {
          const Icon = substrateIcons[index] ?? Network;
          return (
            <li key={item} className="flex items-center gap-3 sm:px-4 sm:first:pl-0">
              <Icon aria-hidden="true" className="size-5 shrink-0 text-primary" />
              <span className="text-sm font-semibold">{item}</span>
            </li>
          );
        })}
      </ul>
    </LandingSection>
  );
}

export function InsightSections() {
  return (
    <>
      <LandingSection id="insights" labelledBy="insights-title">
        <SectionHeading eyebrow="Insights" title="Latest from Gol." id="insights-title" />
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
