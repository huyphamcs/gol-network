import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { GolLogo } from '@/components/ui/gol-logo';
import { landingCopy, landingNavItems } from '@/content/landing';

const footerLinks = [
  { label: 'Explore', links: landingNavItems },
  {
    label: 'Build',
    links: [
      { href: '/tools', label: 'Tools' },
      { href: '/app', label: 'Prototype' },
      { href: '#faq', label: 'FAQ' },
    ],
  },
  {
    label: 'Network',
    links: [
      { href: '#boundary', label: 'Authority' },
      { href: '#markets', label: 'Markets' },
      { href: '#roadmap', label: 'Roadmap' },
    ],
  },
] as const;

const FOOTER_SKY_COLUMNS = 18;
const FOOTER_SKY_ROWS = 4;
const footerSkyHeights = [0, 1, 2, 2, 1, 0, 2, 3, 1, 2, 0, 1, 2, 3, 1, 0, 2, 1];
const footerSkyPixels = Array.from({ length: FOOTER_SKY_COLUMNS * FOOTER_SKY_ROWS }, (_, index) => {
  const column = index % FOOTER_SKY_COLUMNS;
  const row = Math.floor(index / FOOTER_SKY_COLUMNS);
  const height = footerSkyHeights[column] ?? 0;
  const body = row === FOOTER_SKY_ROWS - 1 || FOOTER_SKY_ROWS - row <= height;
  const floating = row === 0 && (column === 2 || column === 7 || column === 13 || column === 17);
  return { id: index, active: body || floating };
});

export function LandingFooter() {
  return (
    <footer className="relative isolate overflow-visible bg-primary text-ink-foreground">
      <div className="relative mx-auto flex min-h-[780px] max-w-landing flex-col border-x border-ink-foreground/15 bg-primary px-5 text-ink-foreground sm:px-8 lg:px-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-full z-10 grid h-56 grid-cols-[repeat(18,minmax(0,1fr))] grid-rows-4"
        >
          {footerSkyPixels.map((cell) => (
            <span key={cell.id} className={cell.active ? 'bg-primary' : 'bg-transparent'} />
          ))}
        </div>
        <div className="grid border-y border-ink-foreground/15 md:grid-cols-3">
          <section className="relative border-b border-ink-foreground/15 py-10 md:border-r md:border-b-0 md:py-14 md:pr-10">
            <span aria-hidden="true" className="absolute -top-1 -left-1 size-2 bg-ink-foreground" />
            <span
              aria-hidden="true"
              className="absolute -top-1 -right-1 size-2 bg-ink-foreground md:right-[-5px]"
            />
            <p className="font-mono text-xs font-semibold tracking-widest text-ink-foreground/80 uppercase">
              The account for autonomous money
            </p>
            <h2 className="mt-7 max-w-xl text-3xl leading-tight font-semibold tracking-tight text-ink-foreground sm:text-4xl">
              The product is not the promise. The product is proof.
            </h2>
            <p className="mt-6 max-w-md text-sm leading-copy text-ink-foreground/60">
              Gol keeps authority close to value and makes every refusal legible before the next
              move.
            </p>
          </section>

          <section className="border-b border-ink-foreground/15 py-10 md:border-r md:border-b-0 md:px-10 md:py-14">
            <p className="font-mono text-xs font-semibold tracking-widest text-ink-foreground/45 uppercase">
              Links
            </p>
            <nav className="mt-6 grid gap-1" aria-label="Footer links">
              {footerLinks[0].links.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex min-h-11 items-center text-sm text-ink-foreground/65 outline-none transition-colors hover:text-ink-foreground focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </section>

          <section className="py-10 md:py-14 md:pl-10">
            <p className="font-mono text-xs font-semibold tracking-widest text-ink-foreground/45 uppercase">
              Network
            </p>
            <nav className="mt-6 grid gap-1" aria-label="Network links">
              {footerLinks.slice(1).flatMap((group) =>
                group.links.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="inline-flex min-h-11 items-center text-sm text-ink-foreground/65 outline-none transition-colors hover:text-ink-foreground focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {item.label}
                    {item.href.startsWith('/') ? (
                      <ArrowUpRight aria-hidden="true" className="ml-2 size-3" />
                    ) : null}
                  </Link>
                )),
              )}
            </nav>
          </section>
        </div>

        <div className="mt-auto border-t border-ink-foreground/15 pt-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/"
              aria-label="Gol Network home"
              className="flex min-h-11 items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <GolLogo className="size-8 brightness-0 invert" />
              <span className="font-pixel-wordmark text-sm tracking-widest">GOL</span>
            </Link>
            <p className="font-mono text-xs tracking-widest text-ink-foreground/40 uppercase">
              Non-custodial by design
            </p>
          </div>
          <div className="mt-7 overflow-hidden border-b border-ink-foreground/15 pb-5">
            <p className="font-pixel-wordmark text-[clamp(7rem,24vw,22rem)] leading-[0.72] tracking-[-0.12em] text-ink-foreground/90">
              GOL
            </p>
          </div>
          <div className="flex flex-col gap-3 py-6 font-mono text-xs leading-copy text-ink-foreground/40 sm:flex-row sm:items-start sm:justify-between">
            <p>© {new Date().getFullYear()} Gol Network</p>
            <p className="max-w-xl sm:text-right">{landingCopy.status}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
