import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { DM_Sans, JetBrains_Mono, Silkscreen } from 'next/font/google';
import { SiteTransition } from '@/components/site-transition';
import { publicOrigin } from '@/content/site';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const silkscreen = Silkscreen({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-silkscreen',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(publicOrigin),
  icons: {
    icon: [{ url: '/gol-mark-blue.svg', type: 'image/svg+xml' }],
    shortcut: '/gol-mark-blue.svg',
  },
  title: {
    default: 'Gol Network | One account. Every market.',
    template: '%s | Gol Network',
  },
  description:
    'One account where AI agents can act across markets inside owner-defined limits, with a record of every refused action.',
  other: {
    // Base Build domain-ownership verification for the canonical production origin.
    'base:app_id': '6aa1a55014c95246af9c958f',
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${jetBrainsMono.variable} ${silkscreen.variable}`}
    >
      <body>
        <SiteTransition>{children}</SiteTransition>
        <noscript>
          <style>{'[data-site-loader] { display: none !important; }'}</style>
        </noscript>
      </body>
    </html>
  );
}
