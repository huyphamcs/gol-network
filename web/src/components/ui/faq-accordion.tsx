'use client';

import { useLayoutEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqAccordionItem {
  question: string;
  answer: string;
}

const asciiCharacters = '01<>/{}[]+=*#@';

function AsciiRevealText({ active, text }: { active: boolean; text: string }) {
  const [renderedText, setRenderedText] = useState(text);
  const [resolved, setResolved] = useState(true);

  useLayoutEffect(() => {
    if (!active) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRenderedText(text);
      setResolved(true);
      return;
    }

    const duration = Math.max(700, Math.min(1_250, text.length * 12));
    let animationFrame = 0;
    let startedAt: number | null = null;

    const scrambleText = (revealedCharacters: number, tick: number) =>
      Array.from(text, (character, index) => {
        if (character === ' ' || index < revealedCharacters) return character;
        return asciiCharacters[(index * 17 + tick * 11) % asciiCharacters.length] ?? '0';
      }).join('');

    const renderFrame = (now: number) => {
      startedAt ??= now;
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const revealedCharacters = Math.floor(text.length * eased);
      const tick = Math.floor((now - startedAt) / 42);

      setResolved(progress >= 1);
      setRenderedText(scrambleText(revealedCharacters, tick));

      if (progress < 1) animationFrame = requestAnimationFrame(renderFrame);
    };

    setResolved(false);
    setRenderedText(scrambleText(0, 0));
    animationFrame = requestAnimationFrame(renderFrame);
    return () => cancelAnimationFrame(animationFrame);
  }, [active, text]);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span
        aria-hidden="true"
        className={resolved ? 'text-muted-foreground' : 'font-mono text-primary'}
      >
        {renderedText}
      </span>
    </>
  );
}

export function FaqAccordion({ items }: { items: readonly FaqAccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div data-motion-list className="border-t border-border">
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <div key={item.question} className="border-b border-border">
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpenIndex(open ? null : index)}
              className="flex min-h-20 w-full items-center gap-5 text-left font-mono text-sm tracking-wide text-muted-foreground uppercase outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="w-8 shrink-0 text-primary/70">0{index + 1}</span>
              <span className="flex-1">{item.question}</span>
              <ChevronDown
                aria-hidden="true"
                className={`size-4 shrink-0 transition-transform ${
                  open ? 'rotate-180 text-primary' : ''
                }`}
              />
            </button>
            <div
              className={`grid transition-[grid-template-rows] ${
                open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              }`}
            >
              <div className="overflow-hidden">
                <p className="max-w-2xl pb-7 pl-13 text-base leading-copy text-muted-foreground">
                  <AsciiRevealText active={open} text={item.answer} />
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
