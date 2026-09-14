import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  accountStats,
  authorityRoles,
  currentEvidence,
  currentGaps,
  enforcementLayers,
  executionSteps,
  insightCards,
  landingCopy,
  landingNavItems,
  marketCategories,
  receiptTypes,
  substrateComponents,
  systemLayers,
  versionLadder,
} from '@/content/landing';
import { publicOrigin } from '@/content/site';

describe('landing content boundaries', () => {
  it('leads with the PRD promise and an explicit prototype disclosure', () => {
    expect(landingCopy.headline).toBe('One account. Every market.');
    expect(landingCopy.lead).toContain('limits');
    expect(landingCopy.lead).toContain('refusal recorded');
    expect(landingCopy.boundary).toContain('server off');
    expect(landingCopy.status).toContain('nothing has shipped under the name Gol');
    expect(landingCopy.status).toContain('limited account and payment path');
  });

  it('keeps the owner, agent and venue trust boundaries distinct', () => {
    expect(authorityRoles).toHaveLength(3);
    expect(authorityRoles[0]?.detail).toContain('withdraw without Gol');
    expect(authorityRoles[1]?.detail).toContain('revocable lane');
    expect(authorityRoles[2]?.detail).toContain('never becomes one');
    expect(enforcementLayers.map((layer) => layer.title)).toEqual([
      'Prompt',
      'Framework',
      'Server',
      'Account policy',
    ]);
    expect(enforcementLayers.at(-1)?.state).toBe('binding');
  });

  it('maps the complete product vision without presenting it as shipped', () => {
    expect(accountStats).toHaveLength(3);
    expect(receiptTypes.map((receipt) => receipt.title)).toEqual(['Refused', 'Promised', 'Actual']);
    expect(marketCategories).toHaveLength(8);
    expect(executionSteps).toContain('Recover');
    expect(systemLayers).toHaveLength(7);
    expect(systemLayers.at(-1)?.title).toBe('Authority and state');
    expect(versionLadder.map((item) => item.version)).toEqual(['v0', 'v1', 'v2', 'v4']);
    expect(versionLadder.at(-1)?.detail).toContain('v4 to v6');
    expect(substrateComponents).toHaveLength(5);
    expect(insightCards).toHaveLength(3);
  });

  it('keeps current evidence separate from unestablished targets', () => {
    expect(currentEvidence.join(' ')).toContain('limited testnet account');
    expect(currentGaps.join(' ')).toContain('Nothing is integrated');
    expect(currentGaps.join(' ')).toContain('Production readiness');
    expect(currentEvidence.join(' ')).not.toMatch(/production readiness|security audit/i);
  });

  it('uses stable local navigation and the dated public origin', () => {
    expect(landingNavItems.map((item) => item.href)).toEqual([
      '#product',
      '#boundary',
      '#markets',
      '#roadmap',
    ]);
    expect(publicOrigin).toBe('https://gol.network');
    const metadataSources = ['app/layout.tsx', 'app/robots.ts', 'app/sitemap.ts']
      .map((file) => readFileSync(join(process.cwd(), file), 'utf8'))
      .join('\n');
    expect(metadataSources).not.toContain('https://gol.network');
    expect(metadataSources).not.toMatch(/process\.env|@\/server|publicConfigResult/);
  });

  it('keeps prohibited marketing claims out of rendered content', () => {
    const renderedContent = JSON.stringify({
      authorityRoles,
      currentEvidence,
      enforcementLayers,
      landingCopy,
      marketCategories,
      receiptTypes,
    });
    const prohibited = [
      /fully live/i,
      /live multi-market/i,
      /best price/i,
      /only platform/i,
      /guaranteed yield/i,
      /partnered with/i,
      /token (?:sale|launch)/i,
      /coming (?:soon|on)/i,
    ];
    for (const pattern of prohibited) expect(renderedContent).not.toMatch(pattern);
  });

  it('keeps privileged modules out and limits client code to interactive UI boundaries', () => {
    const componentDirectory = join(process.cwd(), 'src/components/landing');
    const sources = [
      readFileSync(join(process.cwd(), 'app/page.tsx'), 'utf8'),
      ...readdirSync(componentDirectory)
        .filter((file) => file.endsWith('.tsx'))
        .map((file) => readFileSync(join(componentDirectory, file), 'utf8')),
    ].join('\n');
    expect(sources).not.toMatch(/@\/server|@\/client|@\/wallet/);
    expect(sources).not.toMatch(
      /@privy|\bviem\b|@gol\/agent|@gol\/protocol|@react-three|\bthree\b|framer-motion/,
    );
    expect(sources.match(/['\"]use client['\"]/g)).toHaveLength(3);
    expect(readFileSync(join(componentDirectory, 'landing-motion.tsx'), 'utf8')).toContain(
      "from 'gsap'",
    );
    expect(sources).not.toMatch(/fetch\(|XMLHttpRequest|WebSocket/);
    expect(sources).not.toMatch(/[·—]/);
    expect(sources).not.toMatch(/<svg|linear-gradient|radial-gradient/);
  });
});
