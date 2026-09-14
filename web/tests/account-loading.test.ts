import { describe, expect, it } from 'vitest';
import { shouldShowAccountLoading } from '@/client/account-loading';

describe('account loading state', () => {
  it('does not remain loading when the authenticated session has no connected owner wallet', () => {
    expect(
      shouldShowAccountLoading({
        forceLoading: false,
        accountEnabled: false,
        accountLoaded: false,
      }),
    ).toBe(false);
  });

  it('loads while an enabled account request is pending', () => {
    expect(
      shouldShowAccountLoading({
        forceLoading: false,
        accountEnabled: true,
        accountLoaded: false,
      }),
    ).toBe(true);
  });

  it('preserves the explicit loading preview', () => {
    expect(
      shouldShowAccountLoading({
        forceLoading: true,
        accountEnabled: false,
        accountLoaded: true,
      }),
    ).toBe(true);
  });
});
