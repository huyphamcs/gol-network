import type { ReactNode } from 'react';
import { AsciiText } from '@/components/ui/ascii-text';
import { cn } from '@/lib/utils';

export function LandingSection({
  children,
  className,
  id,
  labelledBy,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      data-motion-section
      className={cn(
        'mx-auto max-w-landing border-b border-border bg-card px-5 py-16 sm:px-8 lg:px-12 lg:py-24',
        className,
      )}
    >
      {children}
    </section>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        'font-mono text-xs font-semibold tracking-widest text-primary uppercase',
        className,
      )}
    >
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  copy,
  id,
  className,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  id?: string;
  className?: string;
}) {
  return (
    <div className={cn('max-w-3xl', className)}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2
        id={id}
        className="mt-4 text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl"
      >
        <AsciiText>{title}</AsciiText>
      </h2>
      {copy ? (
        <p className="mt-5 max-w-2xl text-base leading-copy text-muted-foreground sm:text-lg">
          {copy}
        </p>
      ) : null}
    </div>
  );
}

export function SquareBullet() {
  return <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 bg-primary" />;
}
