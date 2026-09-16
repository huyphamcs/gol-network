'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NetworkLayerDiagram } from '@/components/ui/network-layer-diagram';
import { networkPillars } from '@/content/landing';
import { cn } from '@/lib/utils';

const layers = [
  {
    ...networkPillars[0],
    detail: 'The owner sets limits. Builders give the agent a way to request actions.',
    action: 'Open the app',
    kind: 'owner',
  },
  {
    title: 'GOL Account',
    detail: 'The account holds funds and checks requests against the owner’s mandate.',
    points: [
      'Authority stays with the owner',
      'Agent access is scoped',
      'Permissions can be revoked',
    ],
    action: 'Open the app',
    href: '/app',
    kind: 'account',
  },
  {
    ...networkPillars[2],
    detail: 'Check each request against the mandate. Keep a record when an action is refused.',
    action: 'View the policy model',
    kind: 'policy',
  },
  {
    ...networkPillars[1],
    detail: 'Connect a venue through an adapter, without changing who authorizes the action.',
    action: 'View market adapters',
    kind: 'adapters',
  },
  {
    ...networkPillars[3],
    detail: 'Payment and service providers connect through adapters with defined permissions.',
    action: 'View the roadmap',
    kind: 'rails',
  },
] as const;

export function PartnerNetworkMap() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [scrollReady, setScrollReady] = useState(false);
  const activeRef = useRef(0);
  const reduceMotion = Boolean(useReducedMotion());
  const selected = layers[active] ?? layers[0];

  useEffect(() => {
    let frame = 0;
    setScrollReady(true);

    const update = () => {
      frame = 0;
      const track = trackRef.current;
      if (!track) return;

      const bounds = track.getBoundingClientRect();
      const range = Math.max(1, bounds.height - window.innerHeight + 64);
      const progress = Math.min(1, Math.max(0, (64 - bounds.top) / range));
      const next = Math.min(layers.length - 1, Math.floor(progress * layers.length));
      if (next !== activeRef.current) {
        setDirection(next > activeRef.current ? 1 : -1);
        activeRef.current = next;
        setActive(next);
      }
    };

    const queue = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    queue();
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', queue);
      window.removeEventListener('resize', queue);
    };
  }, []);

  const selectLayer = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const bounds = track.getBoundingClientRect();
    const range = Math.max(1, bounds.height - window.innerHeight + 64);
    const progress = (index + 0.5) / layers.length;
    window.scrollTo({
      top: window.scrollY + bounds.top - 64 + range * progress,
      behavior: reduceMotion ? 'instant' : 'smooth',
    });
  };

  return (
    <div
      ref={trackRef}
      data-partner-network
      className={cn('relative mt-12', scrollReady && 'h-[300svh] lg:h-[360svh]')}
    >
      <div className="sticky top-16 grid min-h-[calc(100svh-4rem)] items-center gap-3 bg-card py-2 sm:gap-5 sm:py-4 lg:h-[calc(100svh-4rem)] lg:grid-cols-2 lg:gap-16 lg:py-6">
        <div className="min-w-0 self-center">
          <NetworkLayerDiagram
            layers={layers}
            active={active}
            onSelect={selectLayer}
            className="mx-auto h-[24svh] max-w-lg sm:h-[38svh] lg:h-[calc(100svh-10rem)] lg:max-h-192"
          />
        </div>

        <div className="min-w-0 self-center">
          <div id="network-layer-content" className="relative sm:min-h-56 lg:min-h-64">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={selected.kind}
                initial={reduceMotion ? false : { opacity: 0, y: direction * 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: direction * -16 }}
                transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3 className="text-3xl leading-tight font-semibold tracking-tight sm:text-4xl lg:text-6xl">
                  {selected.title}
                </h3>
                <p className="mt-4 max-w-md text-base leading-copy text-muted-foreground lg:mt-6 lg:text-lg">
                  {selected.detail}
                </p>
                <Button
                  asChild
                  variant="ghost"
                  className="mt-4 min-h-11 justify-start rounded-md px-0 text-primary hover:bg-transparent lg:mt-6"
                >
                  <Link href={selected.href}>
                    {selected.action}
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                </Button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <noscript>
        <div className="bg-card py-6">
          {layers.map((layer) => (
            <section key={layer.kind} className="py-4">
              <h3 className="text-xl font-semibold">{layer.title}</h3>
              <p className="mt-2 text-sm leading-copy text-muted-foreground">{layer.detail}</p>
              <Button asChild variant="ghost" className="mt-2 text-primary">
                <Link href={layer.href}>{layer.action}</Link>
              </Button>
            </section>
          ))}
        </div>
      </noscript>
    </div>
  );
}
