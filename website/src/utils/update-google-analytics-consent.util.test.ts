/* @vitest-environment jsdom */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { updateGoogleAnalyticsConsent } from './update-google-analytics-consent.util';

type GoogleTagWindow = Window & {
  gtag?: ReturnType<typeof vi.fn>;
};

afterEach(() => {
  delete (window as GoogleTagWindow).gtag;
});

describe('updateGoogleAnalyticsConsent', () => {
  it.each([
    [true, 'granted'],
    [false, 'denied'],
  ] as const)('updates analytics storage to %s', (isGranted, value) => {
    const gtag = vi.fn();
    (window as GoogleTagWindow).gtag = gtag;

    updateGoogleAnalyticsConsent(isGranted);

    expect(gtag).toHaveBeenCalledWith('consent', 'update', {
      analytics_storage: value,
    });
  });

  it('does nothing when Google Tag Manager is unavailable', () => {
    expect(() => updateGoogleAnalyticsConsent(true)).not.toThrow();
  });
});
