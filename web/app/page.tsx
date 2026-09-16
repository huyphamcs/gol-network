import type { Metadata } from 'next';
import { LandingPage } from '@/components/landing/landing-page';

export const metadata: Metadata = {
  description:
    'One account where AI agents can act across markets inside owner-defined limits, with a record of every refused action.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Gol Network',
    url: '/',
    title: 'Gol Network | One account. Every market.',
    description:
      'An agent that can act inside limits you set, with a record of everything it was refused.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gol Network | One account. Every market.',
    description:
      'An agent that can act inside limits you set, with a record of everything it was refused.',
  },
};

export default function Page() {
  return <LandingPage />;
}
