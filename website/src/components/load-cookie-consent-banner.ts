export const loadCookieConsentBanner = () =>
  import('./cookie-consent-banner').then((module) => ({
    default: module.CookieConsentBanner,
  }));
