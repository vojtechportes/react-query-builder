import { css } from 'styled-components';
import { siteTheme } from '../../../../constants/site-theme';

export const recipeDemoButtonStyles = css`
  min-height: 2.5rem;
  padding: 0.55rem 0.9rem;
  border: 1px solid ${siteTheme.primaryBorder};
  border-radius: 8px;
  background: ${siteTheme.primarySurface};
  color: ${siteTheme.primaryDark};
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
  transition:
    background 140ms ease,
    border-color 140ms ease,
    box-shadow 140ms ease,
    transform 140ms ease;

  &:hover:not(:disabled) {
    border-color: ${siteTheme.primary};
    background: ${siteTheme.primarySurfaceStrong};
    box-shadow: 0 3px 8px rgba(63, 81, 181, 0.18);
  }

  &:focus-visible {
    outline: 3px solid ${siteTheme.primaryGlow};
    outline-offset: 2px;
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
    box-shadow: 0 1px 3px rgba(63, 81, 181, 0.16);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    box-shadow: none;
  }
`;
