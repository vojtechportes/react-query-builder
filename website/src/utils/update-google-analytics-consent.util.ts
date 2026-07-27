type GoogleTagWindow = Window & {
  gtag?: (
    command: 'consent',
    action: 'update',
    consent: { analytics_storage: 'denied' | 'granted' }
  ) => void;
};

export const updateGoogleAnalyticsConsent = (isGranted: boolean): void => {
  (window as GoogleTagWindow).gtag?.('consent', 'update', {
    analytics_storage: isGranted ? 'granted' : 'denied',
  });
};
