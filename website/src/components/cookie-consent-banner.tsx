import * as React from 'react';
import CookieConsent, { getCookieConsentValue } from 'react-cookie-consent';
import {
  GOOGLE_ANALYTICS_CONSENT_COOKIE,
  GOOGLE_ANALYTICS_CONSENT_DENIED,
  GOOGLE_ANALYTICS_CONSENT_GRANTED,
} from '../constants/google-analytics-consent';
import { isGoogleAnalyticsEnabled } from '../utils/is-google-analytics-enabled.util';
import { updateGoogleAnalyticsConsent } from '../utils/update-google-analytics-consent.util';
import {
  cookieConsentButtonStyle,
  cookieConsentContainerStyle,
  cookieConsentContentStyle,
  cookieConsentDeclineButtonStyle,
} from './cookie-consent-banner.styles';

const isAnalyticsEnabled = isGoogleAnalyticsEnabled(
  import.meta.env.VITE_SITE_URL
);

export const CookieConsentBanner: React.FC = () => {
  React.useEffect(() => {
    if (!isAnalyticsEnabled) {
      return;
    }

    const savedConsent = getCookieConsentValue(GOOGLE_ANALYTICS_CONSENT_COOKIE);

    if (savedConsent !== undefined) {
      updateGoogleAnalyticsConsent(
        savedConsent === GOOGLE_ANALYTICS_CONSENT_GRANTED
      );
    }
  }, []);

  if (!isAnalyticsEnabled) {
    return null;
  }

  return (
    <CookieConsent
      ariaAcceptLabel="Accept analytics cookies"
      ariaDeclineLabel="Decline analytics cookies"
      buttonStyle={cookieConsentButtonStyle}
      buttonText="Accept analytics"
      contentStyle={cookieConsentContentStyle}
      cookieName={GOOGLE_ANALYTICS_CONSENT_COOKIE}
      cookieValue={GOOGLE_ANALYTICS_CONSENT_GRANTED}
      customContainerAttributes={{
        'aria-label': 'Analytics cookie consent',
        role: 'region',
      }}
      declineButtonStyle={cookieConsentDeclineButtonStyle}
      declineButtonText="Decline"
      declineCookieValue={GOOGLE_ANALYTICS_CONSENT_DENIED}
      enableDeclineButton
      expires={365}
      location="bottom"
      onAccept={() => updateGoogleAnalyticsConsent(true)}
      onDecline={() => updateGoogleAnalyticsConsent(false)}
      sameSite="strict"
      style={cookieConsentContainerStyle}
    >
      We use optional analytics cookies to understand how the documentation is
      used and improve it. You can accept or decline them.
    </CookieConsent>
  );
};
