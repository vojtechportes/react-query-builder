import { GOOGLE_ANALYTICS_HOSTNAME } from '../constants/google-analytics-consent';

export const isGoogleAnalyticsEnabled = (
  siteUrl: string | undefined
): boolean => {
  try {
    return new URL(siteUrl ?? '').hostname === GOOGLE_ANALYTICS_HOSTNAME;
  } catch {
    return false;
  }
};
