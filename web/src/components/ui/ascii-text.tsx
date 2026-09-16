'use client';

import * as React from 'react';

const SCRAMBLE_CHARS = '01#$%&*+=-_/\\|<>[]{}ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function scrambleChar() {
  return SCRAMBLE_CHARS.charAt(Math.floor(Math.random() * SCRAMBLE_CHARS.length));
}

/**
 * Renders text that resolves from scrambled ASCII glyphs into its real characters,
 * left to right, once the element scrolls into view. Falls back to plain text
 * immediately under prefers-reduced-motion. The scrambled span is decorative;
 * a sr-only span carries the real text for assistive tech at all times.
 */
export function AsciiText({
  children,
  className,
  delay = 0,
  speed = 1,
}: {
  children: string;
  className?: string;
  delay?: number;
  speed?: number;
}) {
  const text = children;
  const ref = React.useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = React.useState(text);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setDisplay(text);
      return;
    }

    setDisplay(text.replace(/\S/g, () => scrambleChar()));

    let raf = 0;
    let timeout = 0;
    let cancelled = false;
    const duration = 320 / speed;

    const run = () => {
      const startedAt = performance.now();

      const tick = () => {
        if (cancelled) return;
        const elapsed = performance.now() - startedAt;
        const revealCount = Math.min(text.length, Math.floor((elapsed / duration) * text.length));

        let output = '';
        for (let i = 0; i < text.length; i += 1) {
          const char = text[i] ?? '';
          output += /\s/.test(char) || i < revealCount ? char : scrambleChar();
        }
        setDisplay(output);

        if (revealCount >= text.length) {
          setDisplay(text);
          return;
        }
        raf = window.requestAnimationFrame(tick);
      };

      raf = window.requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            observer.disconnect();
            timeout = window.setTimeout(run, delay);
          }
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);

    return () => {
      cancelled = true;
      observer.disconnect();
      window.cancelAnimationFrame(raf);
      window.clearTimeout(timeout);
    };
  }, [text, delay, speed]);

  return (
    <>
      <span ref={ref} aria-hidden="true" className={className}>
        {display}
      </span>
      <span className="sr-only">{text}</span>
    </>
  );
}
