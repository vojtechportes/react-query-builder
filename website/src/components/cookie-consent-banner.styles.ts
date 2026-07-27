import type { CSSProperties } from 'react';
import { siteTheme } from '../constants/site-theme';

export const cookieConsentContainerStyle: CSSProperties = {
  alignItems: 'center',
  background: '#0f172a',
  boxShadow: '0 -12px 36px rgba(15, 23, 42, 0.18)',
  color: '#f8fafc',
  gap: '1rem',
  padding: '0.85rem max(1rem, calc((100vw - 1320px) / 2 + 1.5rem))',
};

export const cookieConsentContentStyle: CSSProperties = {
  flex: '1 1 420px',
  margin: 0,
};

export const cookieConsentButtonStyle: CSSProperties = {
  background: siteTheme.primaryLight,
  border: 0,
  borderRadius: '999px',
  color: '#ffffff',
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: '0.95rem',
  fontWeight: 700,
  margin: '0.35rem',
  padding: '0.7rem 1rem',
};

export const cookieConsentDeclineButtonStyle: CSSProperties = {
  ...cookieConsentButtonStyle,
  background: 'transparent',
  border: '1px solid #94a3b8',
  color: '#f8fafc',
};
