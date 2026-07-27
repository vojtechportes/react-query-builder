import { describe, expect, it } from 'vitest';
import { isGoogleAnalyticsEnabled } from './is-google-analytics-enabled.util';

describe('isGoogleAnalyticsEnabled', () => {
  it('enables analytics only for the production website hostname', () => {
    expect(
      isGoogleAnalyticsEnabled('https://www.react-query-builder.com/docs')
    ).toBe(true);
    expect(isGoogleAnalyticsEnabled('https://react-query-builder.com')).toBe(
      false
    );
    expect(
      isGoogleAnalyticsEnabled(
        'https://vojtechportes.github.io/react-query-builder/'
      )
    ).toBe(false);
  });

  it('disables analytics for missing or invalid URLs', () => {
    expect(isGoogleAnalyticsEnabled(undefined)).toBe(false);
    expect(isGoogleAnalyticsEnabled('not a URL')).toBe(false);
  });
});
