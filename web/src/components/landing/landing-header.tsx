'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GolLogo } from '@/components/ui/gol-logo';
import { cn } from '@/lib/utils';
import { landingNavItems } from '@/content/landing';

const menuItems = [{ href: '#hero', label: 'Home' }, ...landingNavItems] as const;

const menuFacts = [
  'Owner-controlled authority',
  'Revocable agent lane',
  'Inspectable execution record',
] as const;

const curtainClasses = ['bg-primary', 'bg-ink', 'bg-accent', 'bg-primary'] as const;
const curtainDelays = ['delay-0', 'delay-100', 'delay-200', 'delay-300'] as const;
const factDelays = ['delay-700', 'delay-[760ms]', 'delay-[820ms]'] as const;
const menuDelays = [
  'delay-700',
  'delay-[760ms]',
  'delay-[820ms]',
  'delay-[880ms]',
  'delay-[940ms]',
] as const;

export function LandingHeader() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    const body = document.body;
    const previousOverflow = body.style.overflow;
    body.style.overflow = 'hidden';

    const close = () => setOpen(false);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('gol:navigation-start', close);
    return () => {
      body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('gol:navigation-start', close);
    };
  }, [open]);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only fixed top-3 left-3 z-50 rounded-md bg-foreground px-4 py-3 text-sm font-semibold text-background outline-none focus:not-sr-only focus:ring-2 focus:ring-ring"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="mx-auto grid h-16 max-w-landing grid-cols-[1fr_auto_1fr] items-center border-x border-border bg-card px-3 sm:px-8 lg:px-12">
          <Link
            href="/"
            aria-label="Gol Network home"
            className="flex min-h-11 w-fit shrink-0 items-center gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <GolLogo className="size-7" />
            <span className="hidden text-sm leading-none font-semibold sm:inline">Gol Network</span>
          </Link>

          <Button
            type="button"
            variant="ghost"
            aria-expanded={open}
            aria-controls="landing-menu"
            className="min-h-11 gap-3 px-2 font-mono text-xs font-semibold tracking-widest uppercase"
            onClick={() => setOpen((current) => !current)}
          >
            {open ? 'Close' : 'Menu'}
            <span aria-hidden="true" className="relative block h-2 w-5">
              <span
                className={cn(
                  'absolute inset-x-0 top-0 h-px bg-current transition-transform duration-300 motion-reduce:transition-none',
                  open && 'translate-y-1 rotate-45',
                )}
              />
              <span
                className={cn(
                  'absolute inset-x-0 bottom-0 h-px bg-current transition-transform duration-300 motion-reduce:transition-none',
                  open && '-translate-y-1 -rotate-45',
                )}
              />
            </span>
          </Button>

          <Button asChild size="sm" className="min-h-11 justify-self-end px-4">
            <Link href="/app">
              <span className="hidden sm:inline">Open prototype</span>
              <span className="sm:hidden">Open</span>
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>
        </div>
      </header>

      <Button
        type="button"
        variant="ghost"
        tabIndex={open ? 0 : -1}
        aria-label="Close navigation menu"
        onClick={() => setOpen(false)}
        className={cn(
          'fixed inset-0 z-20 size-auto rounded-none bg-ink/60 p-0 opacity-0 backdrop-blur-sm transition-opacity duration-500 hover:bg-ink/60 motion-reduce:transition-none',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none',
        )}
      />

      <div
        id="landing-menu"
        aria-hidden={!open}
        className={cn(
          'pointer-events-none fixed inset-x-0 top-16 bottom-0 z-30 overflow-hidden',
          open && 'pointer-events-auto',
        )}
      >
        {curtainClasses.map((color, index) => (
          <div
            key={`${color}-${index}`}
            aria-hidden="true"
            className={cn(
              'absolute inset-0 origin-top scale-y-0 transition-transform duration-700 ease-in-out will-change-transform motion-reduce:transition-none',
              color,
              curtainDelays[index],
              open && 'scale-y-100',
            )}
          />
        ))}

        <div
          className={cn(
            'absolute inset-0 overflow-y-auto bg-background px-5 py-12 text-foreground transition-[clip-path] duration-700 ease-in-out [clip-path:inset(0_0_100%_0)] sm:px-8 lg:px-12 lg:py-16 motion-reduce:transition-none',
            open && 'delay-500 [clip-path:inset(0_0_0_0)]',
          )}
        >
          <div className="mx-auto grid max-w-landing gap-12 lg:grid-cols-[1fr_2fr]">
            <aside className="flex flex-col gap-10 font-mono text-xs tracking-widest uppercase">
              <div className="overflow-hidden">
                <p
                  className={cn(
                    'text-primary transition-transform duration-700 motion-reduce:transition-none',
                    open ? 'delay-700 translate-y-0' : 'translate-y-full',
                  )}
                >
                  The Gol system
                </p>
              </div>
              <div className="space-y-3 text-muted-foreground">
                {menuFacts.map((fact, index) => (
                  <div key={fact} className="overflow-hidden">
                    <p
                      className={cn(
                        'transition-transform duration-700 motion-reduce:transition-none',
                        open ? ['translate-y-0', factDelays[index]] : 'translate-y-full',
                      )}
                    >
                      {fact}
                    </p>
                  </div>
                ))}
              </div>
            </aside>

            <nav aria-label="Landing page">
              <ul>
                {menuItems.map((item, index) => (
                  <li key={item.href} className="overflow-hidden">
                    <Link
                      href={item.href}
                      data-site-transition
                      tabIndex={open ? undefined : -1}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'block w-fit py-1 text-4xl leading-tight font-medium tracking-tight text-foreground outline-none transition-[color,transform] duration-700 hover:text-primary focus-visible:text-primary sm:text-5xl lg:text-6xl motion-reduce:transition-none',
                        open ? 'translate-y-0' : 'translate-y-full',
                        menuDelays[index],
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
