'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DotPattern } from '@/components/ui/dot-pattern';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const terminalSamples = {
  javascript: [
    { tone: 'comment', text: '// Interface sketch, not a shipped SDK' },
    { tone: 'plain', text: 'const mandate = {' },
    { tone: 'accent', text: "  limit: '100 USDC'," },
    { tone: 'accent', text: "  agent: 'revocable'," },
    { tone: 'plain', text: '};' },
    { tone: 'plain', text: 'account.request({ mandate, action });' },
  ],
  cli: [
    { tone: 'comment', text: '# Run the local bounded-payment prototype' },
    { tone: 'plain', text: '$ pnpm --filter @gol/web dev' },
    { tone: 'accent', text: '> local prototype ready' },
    { tone: 'plain', text: '$ open http://127.0.0.1:3000/app' },
    { tone: 'comment', text: '# Owner lane stays separate from agent requests' },
  ],
  python: [
    { tone: 'comment', text: '# Interface sketch, not a shipped SDK' },
    { tone: 'plain', text: 'mandate = {' },
    { tone: 'accent', text: "    'limit': '100 USDC'," },
    { tone: 'accent', text: "    'agent': 'revocable'," },
    { tone: 'plain', text: '}' },
    { tone: 'plain', text: 'account.request(mandate, action)' },
  ],
} as const;

const languages = [
  { value: 'javascript', label: 'JavaScript', detail: 'Shape an account request in TypeScript.' },
  { value: 'cli', label: 'CLI', detail: 'Run the current prototype from your terminal.' },
  { value: 'python', label: 'Python', detail: 'See the equivalent interface shape.' },
] as const;

type Language = (typeof languages)[number]['value'];

function TerminalContent({
  language,
  reduceMotion,
  isActive,
}: {
  language: keyof typeof terminalSamples;
  reduceMotion: boolean;
  isActive: boolean;
}) {
  const lines = terminalSamples[language];
  const [revealed, setRevealed] = useState(() => lines.map(() => 0));
  const [typingLine, setTypingLine] = useState(-1);

  useEffect(() => {
    if (!isActive) {
      setRevealed(lines.map(() => 0));
      setTypingLine(-1);
      return;
    }

    if (reduceMotion) {
      setRevealed(lines.map((line) => line.text.length));
      setTypingLine(-1);
      return;
    }

    setRevealed(lines.map(() => 0));
    let cancelled = false;
    let timeout = 0;

    const revealLine = (lineIndex: number) => {
      if (cancelled || lineIndex >= lines.length) {
        setTypingLine(-1);
        return;
      }
      const line = lines[lineIndex];
      if (!line) return;

      // "$" commands type out character by character; comments and command
      // output appear instantly, the way a real shell prints a result.
      if (line.tone !== 'plain') {
        setRevealed((prev) => prev.map((count, i) => (i === lineIndex ? line.text.length : count)));
        timeout = window.setTimeout(() => revealLine(lineIndex + 1), 260);
        return;
      }

      setTypingLine(lineIndex);
      let charCount = 0;
      const typeChar = () => {
        if (cancelled) return;
        charCount += 1;
        setRevealed((prev) => prev.map((count, i) => (i === lineIndex ? charCount : count)));
        if (charCount < line.text.length) {
          timeout = window.setTimeout(typeChar, 16 + Math.random() * 24);
        } else {
          timeout = window.setTimeout(() => revealLine(lineIndex + 1), 260);
        }
      };
      timeout = window.setTimeout(typeChar, 16);
    };

    timeout = window.setTimeout(() => revealLine(0), 220);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [isActive, reduceMotion, lines]);

  return (
    <TabsContent value={language} className="mt-0">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-1 font-mono text-xs leading-7 sm:text-sm"
      >
        {lines.map((line, index) => (
          <p
            key={`${language}-${index}`}
            className={
              line.tone === 'comment'
                ? 'text-terminal-muted'
                : line.tone === 'accent'
                  ? 'text-primary'
                  : 'text-terminal-foreground'
            }
          >
            {line.text.slice(0, revealed[index] ?? 0)}
            {typingLine === index ? (
              <span aria-hidden="true" className="animate-pulse">
                ▌
              </span>
            ) : null}
          </p>
        ))}
      </motion.div>
    </TabsContent>
  );
}

export function BuilderTerminalSection() {
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const [activeLanguage, setActiveLanguage] = useState<Language>('javascript');
  const reduceMotion = Boolean(useReducedMotion());

  useEffect(() => {
    let animationFrame = 0;

    const updateLanguage = () => {
      animationFrame = 0;
      const scrollTrack = scrollTrackRef.current;
      if (!scrollTrack || window.innerWidth < 1024) return;

      const bounds = scrollTrack.getBoundingClientRect();
      const stickyOffset = 64;
      const scrollRange = Math.max(1, bounds.height - window.innerHeight + stickyOffset);
      const progress = Math.min(1, Math.max(0, (stickyOffset - bounds.top) / scrollRange));
      const nextIndex = Math.min(languages.length - 1, Math.floor(progress * languages.length));
      const nextLanguage = languages[nextIndex];
      if (nextLanguage) setActiveLanguage(nextLanguage.value);
    };

    const queueUpdate = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(updateLanguage);
    };

    updateLanguage();
    window.addEventListener('resize', queueUpdate);
    window.addEventListener('scroll', queueUpdate, { passive: true });

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', queueUpdate);
      window.removeEventListener('scroll', queueUpdate);
    };
  }, []);

  return (
    <div ref={scrollTrackRef} className="relative lg:h-[240vh]">
      <Tabs
        value={activeLanguage}
        onValueChange={(value) => setActiveLanguage(value as Language)}
        className="grid min-h-192 lg:sticky lg:top-16 lg:h-[calc(100svh-4rem)] lg:min-h-160 lg:grid-cols-2 lg:overflow-hidden"
      >
        <div className="relative flex items-center justify-center overflow-hidden border-b border-border bg-muted p-6 sm:p-12 lg:border-r lg:border-b-0">
          <DotPattern width={22} height={22} cr={1.25} className="text-primary/20" />

          <Card className="relative w-full max-w-2xl overflow-hidden border-terminal-muted/40 bg-terminal text-terminal-foreground shadow-terminal">
            <CardHeader className="relative flex-row items-center border-b border-terminal-foreground/10 bg-terminal-titlebar px-4 py-3">
              <div aria-hidden="true" className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-destructive" />
                <span className="size-3 rounded-full bg-warning" />
                <span className="size-3 rounded-full bg-success" />
              </div>
              <div className="pointer-events-none absolute inset-x-20 flex items-center justify-center gap-2 text-terminal-muted">
                <Folder aria-hidden="true" className="size-4 text-primary" />
                <p className="truncate font-mono text-xs font-medium sm:text-sm">
                  gol-network / zsh / 76×36
                </p>
              </div>
            </CardHeader>
            <CardContent className="min-h-128 p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-2 font-mono text-xs sm:text-sm">
                <span className="text-success">➜</span>
                <span className="text-terminal-muted">gol-network</span>
              </div>
              <TerminalContent
                language="javascript"
                reduceMotion={reduceMotion}
                isActive={activeLanguage === 'javascript'}
              />
              <TerminalContent
                language="cli"
                reduceMotion={reduceMotion}
                isActive={activeLanguage === 'cli'}
              />
              <TerminalContent
                language="python"
                reduceMotion={reduceMotion}
                isActive={activeLanguage === 'python'}
              />
            </CardContent>
          </Card>
        </div>

        <div className="bg-card">
          <div className="flex min-h-192 flex-col px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
            <p className="font-mono text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              Installation
            </p>
            <h2
              id="builder-title"
              className="mt-10 text-5xl leading-none font-medium tracking-tighter text-balance sm:text-6xl lg:text-7xl"
            >
              Simple to integrate.
              <span className="mt-2 block">Unlock new workflows.</span>
            </h2>
            <Button
              asChild
              size="lg"
              className="mt-12 w-fit rounded-full bg-primary px-8 text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/app">
                Start building
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </Button>

            <TabsList className="mt-20 flex-col items-stretch border-l border-border lg:mt-auto">
              {languages.map((language) => (
                <TabsTrigger
                  key={language.value}
                  value={language.value}
                  className="group relative min-h-20 flex-col items-start bg-card/90 px-8 text-left text-2xl font-medium text-muted-foreground transition-colors duration-300 data-[state=active]:text-foreground motion-reduce:transition-none"
                >
                  {activeLanguage === language.value ? (
                    <motion.span
                      aria-hidden="true"
                      layoutId="builder-active-language"
                      className="absolute inset-y-0 -left-px w-0.5 bg-primary"
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : { type: 'spring', stiffness: 360, damping: 34 }
                      }
                    />
                  ) : null}
                  <span>{language.label}</span>
                  <span className="mt-2 hidden max-w-sm text-sm leading-copy font-normal text-muted-foreground group-data-[state=active]:block">
                    {language.detail}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
