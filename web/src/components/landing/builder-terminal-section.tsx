'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
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

function TerminalContent({ language }: { language: keyof typeof terminalSamples }) {
  return (
    <TabsContent value={language} className="mt-0">
      <div className="space-y-1 font-mono text-xs leading-7 sm:text-sm">
        {terminalSamples[language].map((line, index) => (
          <p
            key={`${language}-${index}`}
            className={
              line.tone === 'comment'
                ? 'text-background/45'
                : line.tone === 'accent'
                  ? 'text-primary'
                  : 'text-background/85'
            }
          >
            {line.text}
          </p>
        ))}
      </div>
    </TabsContent>
  );
}

export function BuilderTerminalSection() {
  return (
    <Tabs defaultValue="cli" className="grid min-h-192 lg:grid-cols-2">
      <div className="relative flex items-center justify-center overflow-hidden border-b border-border bg-muted p-6 sm:p-12 lg:border-r lg:border-b-0">
        <DotPattern width={22} height={22} cr={1.25} className="text-primary/20" />

        <div className="relative w-full max-w-xl border border-border bg-card p-4">
          <span aria-hidden="true" className="absolute top-2 left-2 size-2 bg-foreground" />
          <span aria-hidden="true" className="absolute top-2 right-2 size-2 bg-foreground" />
          <span aria-hidden="true" className="absolute bottom-2 left-2 size-2 bg-foreground" />
          <span aria-hidden="true" className="absolute right-2 bottom-2 size-2 bg-foreground" />

          <Card className="overflow-hidden rounded-none border-foreground bg-foreground text-background shadow-none">
            <CardHeader className="flex-row items-center gap-3 border-b border-background/15 px-5 py-4">
              <Image
                src="/gol-mark-pixel.png"
                alt=""
                width={40}
                height={40}
                unoptimized
                className="size-8 [image-rendering:pixelated]"
              />
              <p className="font-mono text-sm font-semibold tracking-widest">GOL</p>
              <p className="ml-auto font-mono text-xs text-background/45">INTERFACE</p>
            </CardHeader>
            <CardContent className="min-h-128 p-6 sm:p-8">
              <TerminalContent language="javascript" />
              <TerminalContent language="cli" />
              <TerminalContent language="python" />
            </CardContent>
          </Card>
        </div>
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
            <span className="text-border">/</span> Simple to integrate.
            <span className="mt-2 block">
              Unlock new workflows. <span className="text-border">/</span>
            </span>
          </h2>
          <Button
            asChild
            size="lg"
            className="mt-12 w-fit rounded-none bg-foreground px-8 text-background hover:bg-foreground/90"
          >
            <Link href="/app">
              <span aria-hidden="true" className="size-2 bg-background" />
              Start building
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>

          <TabsList className="mt-20 flex-col items-stretch border-l border-border lg:mt-auto">
            {languages.map((language) => (
              <TabsTrigger
                key={language.value}
                value={language.value}
                className="group min-h-20 flex-col items-start border-l-2 border-transparent bg-card/90 px-8 text-left text-2xl font-medium text-muted-foreground transition-colors data-[state=active]:border-primary data-[state=active]:text-foreground"
              >
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
  );
}
