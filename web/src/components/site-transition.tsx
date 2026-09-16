'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { GolLogo } from '@/components/ui/gol-logo';

const TILE_COLUMNS = 26;
const TILE_ROWS = 14;
const NAVIGATION_TIMEOUT = 8_000;
const LOADER_MINIMUM_MS = 1_900;

const loaderTags = [
  'Owner-controlled account',
  'Policy-native execution',
  'Every refusal recorded',
] as const;

const tiles = Array.from({ length: TILE_COLUMNS * TILE_ROWS }, (_, index) => ({
  column: index % TILE_COLUMNS,
  index,
  row: Math.floor(index / TILE_COLUMNS),
}));

function tileHash(column: number, row: number, seed: number) {
  const value = Math.sin(column * 127.1 + row * 311.7 + seed) * 43_758.5453;
  return value - Math.floor(value);
}

function LoaderWordmark() {
  return (
    <div className="grid justify-items-center">
      <div className="overflow-hidden pb-2">
        <div
          data-loader-rise
          className="flex items-center gap-5 will-change-transform"
          style={{ transform: 'translateY(110%)' }}
        >
          <GolLogo className="size-20 brightness-0 invert sm:size-28" />
          <span className="font-pixel-wordmark text-6xl leading-none tracking-tight sm:text-8xl">
            GOL NETWORK
          </span>
        </div>
      </div>
      <p className="mt-5 overflow-hidden text-center font-mono text-xs tracking-widest uppercase sm:text-sm">
        <span
          data-loader-rise
          className="inline-block will-change-transform"
          style={{ transform: 'translateY(110%)' }}
        >
          One account. Every market.
        </span>
      </p>
    </div>
  );
}

function LoaderLayer({
  layerRef,
  position,
}: {
  layerRef: React.RefObject<HTMLDivElement | null>;
  position: 'over' | 'under';
}) {
  return (
    <div
      ref={layerRef}
      data-loader-layer={position}
      aria-hidden="true"
      className="fixed inset-0 grid h-svh w-screen place-items-center bg-primary text-primary-foreground will-change-transform"
    >
      <LoaderWordmark />
    </div>
  );
}

function InitialLoader({ onFinished }: { onFinished: () => void }) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const overRef = React.useRef<HTMLDivElement>(null);
  const underRef = React.useRef<HTMLDivElement>(null);
  const hudRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const root = rootRef.current;
    const over = overRef.current;
    const under = underRef.current;
    const hud = hudRef.current;
    if (!root || !over || !under || !hud) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let introDone = false;
    let ready = document.readyState === 'complete';
    let exited = false;
    const startedAt = performance.now();

    const finish = () => {
      onFinished();
      window.dispatchEvent(new Event('resize'));
    };

    const open = () => {
      if (!introDone || !ready || exited) return;
      exited = true;

      if (reduceMotion) {
        gsap.to(root, { autoAlpha: 0, duration: 0.15, onComplete: finish });
        return;
      }

      const wait = Math.max(0, LOADER_MINIMUM_MS - (performance.now() - startedAt));
      gsap
        .timeline({ defaults: { ease: 'power4.inOut' }, onComplete: finish })
        .to(hud, { autoAlpha: 0, duration: 0.25, ease: 'power2.out' }, 0)
        .set(over, { clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }, 0.12)
        .set(under, { clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)' }, 0.12)
        .to(over, { yPercent: -50, duration: 0.9 }, wait / 1000 + 0.12)
        .to(under, { yPercent: 50, duration: 0.9 }, wait / 1000 + 0.12);
    };

    const markReady = () => {
      ready = true;
      open();
    };

    window.addEventListener('load', markReady, { once: true });
    const waitCeiling = window.setTimeout(markReady, 2_500);

    const context = gsap.context(() => {
      const underContent = Array.from(under.querySelectorAll('[data-loader-rise]'));
      const overContent = Array.from(over.querySelectorAll('[data-loader-rise]'));
      const tagContent = Array.from(hud.querySelectorAll('[data-loader-tag]'));

      gsap.set(underContent, { y: '0%' });

      if (reduceMotion) {
        gsap.set([...overContent, ...tagContent], { y: '0%' });
        introDone = true;
        open();
        return;
      }

      gsap
        .timeline({
          defaults: { ease: 'power4.out' },
          delay: 0.18,
          onComplete: () => {
            introDone = true;
            open();
          },
        })
        .to(overContent, { y: '0%', duration: 0.72, stagger: 0.1 }, 0)
        .to(tagContent, { y: '0%', duration: 0.7, stagger: 0.06 }, 0.28)
        .to(tagContent, { y: '110%', duration: 0.55, stagger: 0.04 }, 1.48);
    }, root);

    if (ready) markReady();

    return () => {
      context.revert();
      window.removeEventListener('load', markReady);
      window.clearTimeout(waitCeiling);
    };
  }, [onFinished]);

  return (
    <div
      ref={rootRef}
      data-site-loader
      role="status"
      aria-label="Loading Gol Network"
      className="fixed inset-0 z-50"
    >
      <LoaderLayer layerRef={underRef} position="under" />
      <LoaderLayer layerRef={overRef} position="over" />
      <div
        ref={hudRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-10 font-mono text-xs font-semibold tracking-widest text-primary-foreground uppercase"
      >
        {loaderTags.map((tag, index) => (
          <p
            key={tag}
            className={
              index === 0
                ? 'absolute top-[14%] left-[8%] overflow-hidden sm:left-[15%]'
                : index === 1
                  ? 'absolute bottom-[18%] left-[8%] overflow-hidden sm:left-[24%]'
                  : 'absolute right-[14%] bottom-[28%] hidden overflow-hidden lg:block'
            }
          >
            <span
              data-loader-tag
              className="inline-block will-change-transform"
              style={{ transform: 'translateY(110%)' }}
            >
              {tag}
            </span>
          </p>
        ))}
      </div>
    </div>
  );
}

export function SiteTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [initialVisible, setInitialVisible] = React.useState(true);
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const tileRefs = React.useRef<Array<HTMLSpanElement | null>>([]);
  const busyRef = React.useRef(false);
  const pendingPathRef = React.useRef<string | null>(null);
  const timeoutRef = React.useRef(0);
  const navigationTimelineRef = React.useRef<gsap.core.Timeline | null>(null);

  const finishInitial = React.useCallback(() => setInitialVisible(false), []);

  React.useEffect(() => {
    if (!initialVisible) return;
    const html = document.documentElement;
    const previousOverflow = html.style.overflow;
    window.scrollTo(0, 0);
    html.style.overflow = 'hidden';
    return () => {
      html.style.overflow = previousOverflow;
    };
  }, [initialVisible]);

  const reveal = React.useCallback(() => {
    const overlay = overlayRef.current;
    const tileElements = tileRefs.current.filter(Boolean) as HTMLSpanElement[];
    if (!overlay || tileElements.length === 0) return;

    window.clearTimeout(timeoutRef.current);
    navigationTimelineRef.current?.kill();
    const timeline = gsap.timeline({
      onComplete: () => {
        gsap.set(overlay, { pointerEvents: 'none' });
        pendingPathRef.current = null;
        busyRef.current = false;
      },
    });
    tileElements.forEach((tile, index) => {
      const { column, row } = tiles[index] ?? { column: 0, row: 0 };
      const horizontal = 1 - column / (TILE_COLUMNS - 1);
      const delay = horizontal * 0.3 + tileHash(column, row, 7.3) * 0.22;
      timeline.to(tile, { opacity: 0, duration: 0.14, ease: 'none' }, delay);
    });
    navigationTimelineRef.current = timeline;
  }, []);

  React.useEffect(() => {
    if (pendingPathRef.current === pathname) {
      const frame = window.requestAnimationFrame(reveal);
      return () => window.cancelAnimationFrame(frame);
    }
  }, [pathname, reveal]);

  React.useEffect(() => {
    const startNavigation = (url: URL, sectionOnly: boolean) => {
      if (busyRef.current) return;
      window.dispatchEvent(new Event('gol:navigation-start'));

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        if (sectionOnly) {
          window.history.pushState(null, '', url.hash);
          document.querySelector(url.hash)?.scrollIntoView();
        } else {
          router.push(`${url.pathname}${url.search}${url.hash}`);
        }
        return;
      }

      const overlay = overlayRef.current;
      const tileElements = tileRefs.current.filter(Boolean) as HTMLSpanElement[];
      if (!overlay || tileElements.length === 0) return;
      busyRef.current = true;
      gsap.set(overlay, { pointerEvents: 'auto' });
      gsap.set(tileElements, { opacity: 0 });

      navigationTimelineRef.current?.kill();
      const timeline = gsap.timeline({
        onComplete: () => {
          if (sectionOnly) {
            window.history.pushState(null, '', url.hash);
            document.querySelector(url.hash)?.scrollIntoView();
            window.requestAnimationFrame(reveal);
            return;
          }

          pendingPathRef.current = url.pathname;
          router.push(`${url.pathname}${url.search}${url.hash}`);
          timeoutRef.current = window.setTimeout(reveal, NAVIGATION_TIMEOUT);
        },
      });
      tileElements.forEach((tile, index) => {
        const { column, row } = tiles[index] ?? { column: 0, row: 0 };
        const horizontal = column / (TILE_COLUMNS - 1);
        const delay = horizontal * 0.3 + tileHash(column, row, 0) * 0.22;
        timeline.to(tile, { opacity: 1, duration: 0.14, ease: 'none' }, delay);
      });
      navigationTimelineRef.current = timeline;
    };

    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest<HTMLAnchorElement>('a[href]');
      if (
        !anchor ||
        anchor.hasAttribute('download') ||
        anchor.dataset.noTransition !== undefined ||
        (anchor.target && anchor.target !== '_self')
      ) {
        return;
      }

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname.startsWith('/api/')) return;

      const current = window.location;
      const sameDocument = url.pathname === current.pathname && url.search === current.search;
      const sectionOnly =
        sameDocument && Boolean(url.hash) && anchor.dataset.siteTransition !== undefined;
      const routeChange = !sameDocument;
      if (!sectionOnly && !routeChange) return;

      event.preventDefault();
      startNavigation(url, sectionOnly);
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [reveal, router]);

  React.useEffect(
    () => () => {
      navigationTimelineRef.current?.kill();
      window.clearTimeout(timeoutRef.current);
    },
    [],
  );

  return (
    <>
      {children}
      {initialVisible ? <InitialLoader onFinished={finishInitial} /> : null}
      <div
        ref={overlayRef}
        data-route-transition
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-50 grid grid-cols-[repeat(26,minmax(0,1fr))] grid-rows-[repeat(14,minmax(0,1fr))]"
      >
        {tiles.map((tile) => (
          <span
            key={tile.index}
            ref={(node) => {
              tileRefs.current[tile.index] = node;
            }}
            className="bg-primary opacity-0"
          />
        ))}
      </div>
    </>
  );
}
