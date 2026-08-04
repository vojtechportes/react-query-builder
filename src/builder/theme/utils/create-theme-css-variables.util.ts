import { CSSProperties } from 'react';
import { IThemeProps } from '../components/theme-provider/theme-provider';
import type { ThemeColorOverrides } from '../types/theme-color-overrides';

export const createThemeCssVariables = ({
  colors,
}: IThemeProps<ThemeColorOverrides>): CSSProperties => {
  const variables = {
    '--query-builder-color-primary-default': colors?.primary?.default,
    '--query-builder-color-primary-light': colors?.primary?.light,
    '--query-builder-color-primary-dark': colors?.primary?.dark,
    '--query-builder-color-primary-contrast-text':
      colors?.primary?.contrastText,
    '--query-builder-color-secondary-default': colors?.secondary?.default,
    '--query-builder-color-secondary-light': colors?.secondary?.light,
    '--query-builder-color-secondary-dark': colors?.secondary?.dark,
    '--query-builder-color-secondary-contrast-text':
      colors?.secondary?.contrastText,
    '--query-builder-color-grey-100': colors?.grey?.['100'],
    '--query-builder-color-grey-200': colors?.grey?.['200'],
    '--query-builder-color-grey-300': colors?.grey?.['300'],
    '--query-builder-color-grey-400': colors?.grey?.['400'],
    '--query-builder-color-grey-500': colors?.grey?.['500'],
    '--query-builder-color-grey-600': colors?.grey?.['600'],
    '--query-builder-color-grey-700': colors?.grey?.['700'],
    '--query-builder-color-grey-800': colors?.grey?.['800'],
    '--query-builder-color-grey-900': colors?.grey?.['900'],
    '--query-builder-color-info-primary': colors?.info?.primary,
    '--query-builder-color-info-light': colors?.info?.light,
    '--query-builder-color-success-primary': colors?.success?.primary,
    '--query-builder-color-success-light': colors?.success?.light,
    '--query-builder-color-warning-primary': colors?.warning?.primary,
    '--query-builder-color-warning-light': colors?.warning?.light,
    '--query-builder-color-error-primary': colors?.error?.primary,
    '--query-builder-color-error-light': colors?.error?.light,
    '--query-builder-color-background': colors?.white,
  };

  return Object.fromEntries(
    Object.entries(variables).filter(([, value]) => value !== undefined)
  ) as CSSProperties;
};
