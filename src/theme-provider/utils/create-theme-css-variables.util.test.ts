import { colors } from '../../constants/colors';
import { IThemeProps } from '../theme-provider';
import type { ThemeColorOverrides } from '../types/theme-color-overrides';
import { createThemeCssVariables } from './create-theme-css-variables.util';

describe('#utils/createThemeCssVariables', () => {
  it('maps every supported theme color to a canonical CSS variable', () => {
    expect(createThemeCssVariables({ colors })).toEqual({
      '--query-builder-color-primary-default': '#3f51b5',
      '--query-builder-color-primary-light': '#757de8',
      '--query-builder-color-primary-dark': '#002984',
      '--query-builder-color-primary-contrast-text': '#ffffff',
      '--query-builder-color-secondary-default': '#f44336',
      '--query-builder-color-secondary-light': '#ff7961',
      '--query-builder-color-secondary-dark': '#ba000d',
      '--query-builder-color-secondary-contrast-text': '#ffffff',
      '--query-builder-color-grey-100': '#f5f5f5',
      '--query-builder-color-grey-200': '#eeeeee',
      '--query-builder-color-grey-300': '#e0e0e0',
      '--query-builder-color-grey-400': '#bdbdbd',
      '--query-builder-color-grey-500': '#9e9e9e',
      '--query-builder-color-grey-600': '#757575',
      '--query-builder-color-grey-700': '#616161',
      '--query-builder-color-grey-800': '#424242',
      '--query-builder-color-grey-900': '#212121',
      '--query-builder-color-info-primary': '#2563eb',
      '--query-builder-color-info-light': '#8fb2ff',
      '--query-builder-color-success-primary': '#2f8f4e',
      '--query-builder-color-success-light': '#8fd3a3',
      '--query-builder-color-warning-primary': '#dc7a1e',
      '--query-builder-color-warning-light': '#f7b578',
      '--query-builder-color-error-primary': '#d14343',
      '--query-builder-color-error-light': '#f2a0a0',
      '--query-builder-color-white': '#ffffff',
    });
  });

  it('does not serialize defaults when no theme values are provided', () => {
    expect(createThemeCssVariables({})).toEqual({});
  });

  it('serializes only provided runtime overrides', () => {
    const partialTheme: IThemeProps<ThemeColorOverrides> = {
      colors: {
        primary: {
          default: '#123456',
        },
        grey: {
          300: '#abcdef',
        },
      },
    };

    expect(createThemeCssVariables(partialTheme)).toEqual({
      '--query-builder-color-primary-default': '#123456',
      '--query-builder-color-grey-300': '#abcdef',
    });
  });

  it('does not mutate the provided theme', () => {
    const theme: IThemeProps = { colors };
    const snapshot = JSON.parse(JSON.stringify(theme));

    createThemeCssVariables(theme);

    expect(theme).toEqual(snapshot);
  });
});
