export function shouldShowAccountLoading(input: {
  forceLoading: boolean;
  accountEnabled: boolean;
  accountLoaded: boolean;
}): boolean {
  return input.forceLoading || (input.accountEnabled && !input.accountLoaded);
}
