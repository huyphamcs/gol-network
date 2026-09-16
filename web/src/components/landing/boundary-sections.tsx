import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Bot, Network, UserRound } from 'lucide-react';
import { AsciiText } from '@/components/ui/ascii-text';
import { BentoGridShowcase } from '@/components/ui/bento-product-features';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AsciiImage } from '@/components/ui/ascii-image';
import { DotPattern } from '@/components/ui/dot-pattern';
import { authorityRoles, completeStack, landingCopy, platformFeatures } from '@/content/landing';
import { Eyebrow, LandingSection, SectionHeading } from './landing-primitives';
import { StackFeatureCard } from './stack-feature-card';

const roleIcons = [UserRound, Bot, Network] as const;
export function BoundarySections() {
  const stackCards = completeStack.map((item, index) => (
    <StackFeatureCard
      key={item.title}
      title={item.title}
      detail={item.detail}
      image={item.image}
      label={item.label}
      layout={index === 0 ? 'tall' : index === 5 ? 'wide' : 'compact'}
    />
  ));

  return (
    <>
      <LandingSection id="boundary" labelledBy="primitives-title" className="p-0 lg:p-0">
        <div className="grid lg:grid-cols-5">
          <div className="px-5 py-16 sm:px-8 lg:col-span-3 lg:px-12 lg:py-20">
            <Eyebrow>Core primitives</Eyebrow>
            <h2
              id="primitives-title"
              className="mt-4 text-3xl leading-tight font-semibold tracking-tight sm:text-5xl"
            >
              <AsciiText>The primitives that power agent finance.</AsciiText>
            </h2>
            <p className="mt-5 max-w-xl leading-copy text-muted-foreground">
              Secure, coordinated and verifiable infrastructure behind one owner-controlled account.
            </p>
            <Image
              src="/gol-network-modules.png"
              alt=""
              width={1254}
              height={1254}
              data-motion-parallax
              className="mt-4 h-72 w-full object-contain"
            />
          </div>
          <ol
            data-motion-list
            className="space-y-4 border-t border-border bg-muted p-5 sm:p-8 lg:col-span-2 lg:border-t-0 lg:border-l lg:p-10"
          >
            {authorityRoles.map((role, index) => {
              const Icon = roleIcons[index] ?? Network;
              return (
                <li key={role.title}>
                  <Card className="rounded-lg shadow-none">
                    <CardContent className="grid gap-4 p-5 sm:grid-cols-[auto_1fr]">
                      <span className="flex size-11 items-center justify-center rounded-lg bg-accent">
                        <Icon aria-hidden="true" className="size-6 text-primary" />
                      </span>
                      <div>
                        <p className="font-mono text-xs font-semibold tracking-widest text-primary uppercase">
                          {role.eyebrow}
                        </p>
                        <h3 className="mt-2 text-lg font-semibold">{role.title}</h3>
                        <p className="mt-2 text-sm leading-copy text-muted-foreground">
                          {role.detail}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              );
            })}
          </ol>
        </div>
      </LandingSection>

      <LandingSection labelledBy="usage-title">
        <SectionHeading
          id="usage-title"
          eyebrow="Built for what comes next"
          title="A network layer built for real usage."
          copy="The same authority boundary supports policy, multi-network access and outcome-aware execution."
        />
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {platformFeatures.map((feature) => (
            <Card
              key={feature.title}
              tabIndex={0}
              data-platform-feature
              className="group flex min-h-128 flex-col overflow-hidden rounded-lg shadow-none outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20"
            >
              <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-muted p-6">
                <DotPattern width={20} height={20} fade className="text-primary/20" />
                <Image
                  src={feature.image}
                  alt=""
                  width={1254}
                  height={1254}
                  sizes="(min-width: 1024px) 30vw, 100vw"
                  data-platform-feature-art="detail"
                  className="size-full object-contain transition duration-300 ease-out group-hover:scale-105 group-hover:opacity-0 group-focus-visible:scale-105 group-focus-visible:opacity-0"
                />
                <AsciiImage
                  src={feature.image}
                  data-platform-feature-art="ascii"
                  className="absolute inset-6 size-[calc(100%-3rem)] scale-95 opacity-0 transition duration-300 ease-out group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100"
                />
              </div>
              <CardContent className="flex flex-1 flex-col p-6">
                <h3 className="text-2xl font-semibold transition-colors duration-300 group-hover:text-primary group-focus-visible:text-primary">
                  {feature.title}
                </h3>
                <p className="mt-3 translate-y-0 leading-copy text-muted-foreground opacity-100 transition duration-300 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-visible:translate-y-0 md:group-focus-visible:opacity-100">
                  {feature.detail}
                </p>
                <span className="mt-auto flex size-11 items-center justify-center rounded-full bg-accent text-primary">
                  <ArrowRight aria-hidden="true" className="size-5" />
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </LandingSection>

      <LandingSection labelledBy="stack-title">
        <SectionHeading
          id="stack-title"
          eyebrow="The complete stack"
          title="Everything an agent needs, already in one place."
          copy="From accounts to execution, Gol Network organizes the complete infrastructure around one authority model."
        />
        <BentoGridShowcase
          className="mt-12"
          integration={stackCards[0]}
          trackers={stackCards[1]}
          statistic={stackCards[2]}
          focus={stackCards[3]}
          productivity={stackCards[4]}
          shortcuts={stackCards[5]}
        />
      </LandingSection>

      <LandingSection labelledBy="boundary-title" className="p-0 lg:p-0">
        <div className="grid lg:grid-cols-2">
          <div className="px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
            <Eyebrow>From possibility to permission</Eyebrow>
            <h2
              id="boundary-title"
              className="mt-4 text-3xl leading-tight font-semibold tracking-tight sm:text-5xl"
            >
              <AsciiText>A limit only matters if it survives compromise.</AsciiText>
              <span className="mt-2 block text-primary">
                <AsciiText delay={120}>We make safe execution seamless.</AsciiText>
              </span>
            </h2>
            <Button asChild size="lg" className="mt-8">
              <Link href="/app">
                Start building
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="border-t border-border px-5 py-16 sm:px-8 lg:border-t-0 lg:border-l lg:px-12 lg:py-20">
            <div>
              <p className="font-mono text-xs font-semibold tracking-widest text-primary uppercase">
                For owners
              </p>
              <p className="mt-4 font-semibold">Faster access inside a binding boundary</p>
              <p className="mt-2 text-sm leading-copy text-muted-foreground">
                Move from intent to execution while the owner remains in control.
              </p>
            </div>
            <div className="mt-8 border-t border-border pt-8">
              <p className="font-mono text-xs font-semibold tracking-widest text-primary uppercase">
                For builders
              </p>
              <p className="mt-4 font-semibold">One integration, many market adapters</p>
              <p className="mt-2 text-sm leading-copy text-muted-foreground">
                Deploy agent workflows without moving policy into your server.
              </p>
            </div>
          </div>
        </div>
        <blockquote className="bg-ink px-5 py-10 text-center text-xl leading-snug font-semibold text-ink-foreground sm:px-8 sm:text-2xl lg:px-12">
          {landingCopy.boundary}
        </blockquote>
      </LandingSection>
    </>
  );
}
