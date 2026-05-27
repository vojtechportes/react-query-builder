import React, { FC } from 'react';
import styled from 'styled-components';
import { useTheme } from './theme-provider/hooks/use-theme';
import { IThemeProps } from './theme-provider/theme-provider';
import { IAlertColorVariant } from './constants/colors';

export type AlertSeverity = 'info' | 'success' | 'warning' | 'error';
export type AlertVariant = 'outlined' | 'filled';

export interface IAlertProps {
  children?: React.ReactNode;
  className?: string;
  severity?: AlertSeverity;
  variant?: AlertVariant;
  'data-test'?: string;
}

const getAlertColors = (
  theme: Required<IThemeProps>,
  severity: AlertSeverity,
  variant: AlertVariant
): { background: string; border: string; color: string } => {
  const severityColors: IAlertColorVariant = theme.colors[severity];

  if (variant === 'filled') {
    return {
      background: severityColors.primary,
      border: severityColors.primary,
      color: theme.colors.white,
    };
  }

  return {
    background: `color-mix(in srgb, ${severityColors.primary} 5%, ${theme.colors.white} 95%)`,
    border: severityColors.light,
    color: severityColors.primary,
  };
};

const StyledAlert = styled.div<{
  $theme: Required<IThemeProps>;
  $severity: AlertSeverity;
  $variant: AlertVariant;
}>`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: 1px solid
    ${({ $theme, $severity, $variant }) =>
      getAlertColors($theme, $severity, $variant).border};
  border-radius: 6px;
  background: ${({ $theme, $severity, $variant }) =>
    getAlertColors($theme, $severity, $variant).background};
  color: ${({ $theme, $severity, $variant }) =>
    getAlertColors($theme, $severity, $variant).color};
  font-size: 0.875rem;
  line-height: 1.4;
`;

const AlertIcon = styled.span`
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  line-height: 1;
`;

const AlertContent = styled.div`
  min-width: 0;
`;

const getAlertIcon = (severity: AlertSeverity) => {
  switch (severity) {
    case 'success':
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm-1.1 14.3-4.2-4.2 1.4-1.4 2.8 2.8 5.7-5.7 1.4 1.4Z" />
        </svg>
      );
    case 'error':
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 15h-2v-2h2Zm0-4h-2V7h2Z" />
        </svg>
      );
    case 'info':
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 15h-2v-6h2Zm0-8h-2V7h2Z" />
        </svg>
      );
    case 'warning':
    default:
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M1 21h22L12 2Zm12-3h-2v-2h2Zm0-4h-2v-4h2Z" />
        </svg>
      );
  }
};

export const Alert: FC<IAlertProps> = ({
  children,
  className,
  severity = 'warning',
  variant = 'outlined',
  'data-test': dataTest,
}) => {
  const theme = useTheme();

  return (
    <StyledAlert
      className={className}
      data-test={dataTest}
      $theme={theme}
      $severity={severity}
      $variant={variant}
    >
      <AlertIcon aria-hidden="true">{getAlertIcon(severity)}</AlertIcon>
      <AlertContent>{children}</AlertContent>
    </StyledAlert>
  );
};
