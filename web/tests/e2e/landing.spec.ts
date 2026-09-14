import { expect, test } from '@playwright/test';

const headline = 'One account. Every market.';

test.describe('public landing page', () => {
  test('renders the complete product story and honest status boundary', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1, name: headline })).toBeVisible();
    await expect(page.getByText('GOL', { exact: true }).first()).toBeVisible();
    await expect(page.locator('main > section')).toHaveCount(13);
    await expect(page.locator('[data-visual="network-field"]')).toBeVisible();
    await expect(page.locator('[data-gsap="landing-motion"]')).toHaveAttribute(
      'data-motion-ready',
      'true',
    );
    await expect(page.locator('[data-motion-hero-visual]')).toHaveAttribute('style', /transform/);
    await expect(page.getByText('Payment rails', { exact: true })).toBeVisible();
    await expect(page.getByText(/nothing has shipped under the name Gol/).first()).toBeVisible();
    const venueBoundary = page.getByText(/Gol routes to markets and never becomes one/);
    await venueBoundary.scrollIntoViewIfNeeded();
    await expect(venueBoundary).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  });

  test('renders the full story without client-side JavaScript', async ({ browser, baseURL }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      baseURL: baseURL ?? 'http://127.0.0.1:3100',
    });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1, name: headline })).toBeVisible();
    await expect(page.locator('[data-visual="network-field"]')).toBeVisible();
    await expect(page.getByText('Authority and state').first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Explore the prototype' }).first()).toBeVisible();
    await context.close();
  });

  test('supports skip navigation, section anchors and app routing', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main-content')).toBeFocused();

    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    const navigation = page.getByRole('navigation', { name: 'Landing page' });
    await navigation.getByRole('link', { name: 'Boundary' }).click();
    await expect(page).toHaveURL(/#boundary$/);
    await expect(
      page.getByRole('heading', { name: 'The primitives that power agent finance.' }),
    ).toBeVisible();

    await page.getByRole('banner').getByRole('link', { name: 'Open prototype' }).click();
    await expect(page).toHaveURL(/\/app$/);
    await expect(page.locator('main')).toBeVisible();
  });

  for (const viewport of [
    { width: 320, height: 800 },
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1024, height: 768 },
    { width: 1440, height: 900 },
  ]) {
    test(`has no clipped content at ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/');
      const overflow = await page
        .locator('html')
        .evaluate((element) => element.scrollWidth > element.clientWidth);
      expect(overflow).toBe(false);
      for (const label of ['Account policy', 'Refused', 'Authority and state']) {
        const box = await page.getByText(label, { exact: true }).first().boundingBox();
        expect(box?.width).toBeGreaterThan(0);
        expect(box?.height).toBeGreaterThan(0);
      }
    });
  }

  test('keeps every landing CTA at least 44 pixels tall on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const targets = await page
      .locator('main a, header a')
      .evaluateAll((elements) =>
        elements
          .map((element) => element.getBoundingClientRect().height)
          .filter((height) => height > 0),
      );
    expect(targets.length).toBeGreaterThan(0);
    expect(Math.min(...targets)).toBeGreaterThanOrEqual(44);
  });

  test('preserves content and contrast tokens in dark and forced-color modes', async ({ page }) => {
    await page.goto('/');
    await page.locator('html').evaluate((element) => element.classList.add('theme-dark'));
    await expect(page.getByRole('heading', { level: 1, name: headline })).toBeVisible();
    await expect(page.locator('footer')).toHaveCSS('color', 'rgb(248, 250, 255)');

    await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
    await page.reload();
    await expect(page.getByRole('heading', { level: 1, name: headline })).toBeVisible();
    const prototypeLink = page.getByRole('link', { name: 'Explore the prototype' }).first();
    await prototypeLink.focus();
    await expect(prototypeLink).toBeFocused();
  });

  test('reveals feature details and ASCII art on hover', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    const feature = page.locator('[data-platform-feature]').first();
    const detail = feature.getByText(
      'The account enforces what an agent may do where value moves.',
    );
    const detailedArt = feature.locator('[data-platform-feature-art="detail"]');
    const asciiArt = feature.locator('[data-platform-feature-art="ascii"]');

    await feature.scrollIntoViewIfNeeded();
    await expect(feature).toHaveCSS('opacity', '1');
    await expect(feature).toHaveCSS('visibility', 'visible');
    await expect(detail).toHaveCSS('opacity', '0');
    await expect(detailedArt).toHaveCSS('opacity', '1');
    await expect(asciiArt).toHaveAttribute('data-ascii-ready', 'true');
    await expect(asciiArt).toHaveCSS('opacity', '0');

    await feature.hover();
    await expect(detail).toHaveCSS('opacity', '1');
    await expect(detailedArt).toHaveCSS('opacity', '0');
    await expect(asciiArt).toHaveCSS('opacity', '1');
  });
});
