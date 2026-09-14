'use client';

import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function LandingMotion({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    const media = gsap.matchMedia(root);
    media.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        desktop: '(min-width: 768px)',
      },
      (context) => {
        const conditions = context.conditions as { motion: boolean; desktop: boolean };
        root.dataset.motionReady = 'true';

        if (!conditions.motion) return;

        const select = gsap.utils.selector(root);
        const heroCopy = select('[data-motion-hero-copy] > *');
        const heroVisual = select('[data-motion-hero-visual]');
        const heroLabels = select('[data-motion-hero-label]');
        const heroPanel = select<HTMLElement>('[data-motion-hero-panel]')[0];

        const intro = gsap
          .timeline({ defaults: { duration: 0.75, ease: 'power3.out' } })
          .from(heroCopy, { autoAlpha: 0, stagger: 0.07, y: 24 })
          .from(heroVisual, { autoAlpha: 0 }, 0.12);
        if (heroLabels.length > 0) {
          intro.from(heroLabels, { autoAlpha: 0, scale: 0.9, stagger: 0.08 }, 0.35);
        }

        heroLabels.forEach((label, index) => {
          gsap.to(label, {
            duration: 2.8 + index * 0.25,
            ease: 'sine.inOut',
            repeat: -1,
            y: index % 2 === 0 ? -7 : 7,
            yoyo: true,
          });
        });

        const moveHeroX = heroVisual[0]
          ? gsap.quickTo(heroVisual[0], 'x', { duration: 0.65, ease: 'power3.out' })
          : null;
        const moveHeroY = heroVisual[0]
          ? gsap.quickTo(heroVisual[0], 'y', { duration: 0.65, ease: 'power3.out' })
          : null;
        const moveHero = (event: PointerEvent) => {
          if (!conditions.desktop || !heroPanel || !moveHeroX || !moveHeroY) return;
          const bounds = heroPanel.getBoundingClientRect();
          moveHeroX(((event.clientX - bounds.left) / bounds.width - 0.5) * 18);
          moveHeroY(((event.clientY - bounds.top) / bounds.height - 0.5) * 18);
        };
        const resetHero = () => {
          moveHeroX?.(0);
          moveHeroY?.(0);
        };

        heroPanel?.addEventListener('pointermove', moveHero);
        heroPanel?.addEventListener('pointerleave', resetHero);

        select('[data-motion-section]').forEach((section) => {
          gsap.from(section, {
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 88%',
              once: true,
            },
            y: 36,
          });
        });

        select('[data-motion-list]').forEach((list) => {
          gsap.from(Array.from(list.children), {
            duration: 0.65,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: list,
              start: 'top 84%',
              once: true,
            },
            stagger: 0.08,
            y: 28,
          });
        });

        if (conditions.desktop) {
          select('[data-motion-parallax]').forEach((visual) => {
            gsap.fromTo(
              visual,
              { yPercent: 6 },
              {
                ease: 'none',
                scrollTrigger: {
                  end: 'bottom top',
                  scrub: 0.8,
                  start: 'top bottom',
                  trigger: visual,
                },
                yPercent: -6,
              },
            );
          });
        }

        const networkCells = select('[data-motion-network-cell]');
        if (networkCells.length > 0) {
          gsap.fromTo(
            networkCells,
            { opacity: 0.16, scaleY: 0.35, transformOrigin: 'center center' },
            {
              duration: 0.75,
              ease: 'steps(2)',
              opacity: 1,
              repeat: -1,
              scaleY: 1,
              stagger: { amount: 2.2, from: 'random' },
              yoyo: true,
            },
          );
        }

        const transitionCells = select('[data-motion-transition-cell]');
        const transitionTrigger = transitionCells[0]?.parentElement;
        if (transitionCells.length > 0 && transitionTrigger) {
          gsap.fromTo(
            transitionCells,
            { opacity: 0, scaleY: 0, transformOrigin: 'center bottom' },
            {
              opacity: 1,
              scaleY: 1,
              duration: 0.8,
              ease: 'steps(1)',
              stagger: { amount: 1.4, from: 'random' },
              scrollTrigger: {
                trigger: transitionTrigger,
                start: 'top 88%',
                once: true,
              },
            },
          );
        }

        const ctaShutter = select('[data-motion-cta-shutter]')[0];
        const ctaShutterCells = select('[data-motion-cta-shutter-cell]');
        const ctaShutterTrigger = ctaShutter?.closest('[data-motion-section]') ?? ctaShutter;
        if (ctaShutter && ctaShutterTrigger && ctaShutterCells.length > 0) {
          const thresholds = ctaShutterCells.map((cell) =>
            Number(cell.getAttribute('data-motion-cta-threshold') ?? 1),
          );
          const reveal = (progress: number) => {
            const openProgress = Math.min(1, progress / 0.55);
            ctaShutterCells.forEach((cell, index) => {
              cell.style.opacity = openProgress > (thresholds[index] ?? 1) ? '0' : '1';
            });
          };

          gsap.set(ctaShutterCells, { opacity: 1 });
          ScrollTrigger.create({
            trigger: ctaShutterTrigger,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: 0.7,
            onRefresh: (self) => reveal(self.progress),
            onUpdate: (self) => reveal(self.progress),
          });
        }

        return () => {
          heroPanel?.removeEventListener('pointermove', moveHero);
          heroPanel?.removeEventListener('pointerleave', resetHero);
        };
      },
    );

    return () => media.revert();
  }, []);

  return (
    <div ref={rootRef} data-gsap="landing-motion">
      {children}
    </div>
  );
}
