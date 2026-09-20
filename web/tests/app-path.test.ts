import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { APP_BASE_PATH, appPath, stripAppBasePath } from '@/lib/app-path';

describe('application base path', () => {
  it('keeps application routes inside the public app namespace', () => {
    expect(APP_BASE_PATH).toBe('/app');
    expect(appPath('/')).toBe('/app');
    expect(appPath('/api/health')).toBe('/app/api/health');
    expect(appPath('/tokenized-stocks')).toBe('/app/tokenized-stocks');
  });

  it('normalizes browser paths for client navigation state', () => {
    expect(stripAppBasePath('/app')).toBe('/');
    expect(stripAppBasePath('/app/tools')).toBe('/tools');
    expect(stripAppBasePath('/unrelated')).toBe('/unrelated');
  });

  it('configures Next.js and container health checks for the same base path', () => {
    const root = join(process.cwd(), '..');
    const nextConfig = readFileSync(join(process.cwd(), 'next.config.ts'), 'utf8');
    const compose = readFileSync(join(root, 'deploy/docker-compose.yml'), 'utf8');
    expect(nextConfig).toContain("basePath: '/app'");
    expect(compose).toContain('http://127.0.0.1:3000/app/api/health');
  });
});
