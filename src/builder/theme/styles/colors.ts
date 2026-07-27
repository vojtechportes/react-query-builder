export interface IColorVariant {
  light: string;
  dark: string;
  default: string;
  contrastText: string;
}

export interface IGreyColorVariant {
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface IAlertColorVariant {
  primary: string;
  light: string;
}

export interface IColors {
  primary: IColorVariant;
  secondary: IColorVariant;
  grey: IGreyColorVariant;
  info: IAlertColorVariant;
  success: IAlertColorVariant;
  warning: IAlertColorVariant;
  error: IAlertColorVariant;
  white: string;
}

export const colors: IColors = {
  primary: {
    default: '#3f51b5',
    light: '#757de8',
    dark: '#002984',
    contrastText: '#ffffff',
  },
  secondary: {
    default: '#f44336',
    light: '#ff7961',
    dark: '#ba000d',
    contrastText: '#ffffff',
  },
  grey: {
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  info: {
    primary: '#2563eb',
    light: '#8fb2ff',
  },
  success: {
    primary: '#2f8f4e',
    light: '#8fd3a3',
  },
  warning: {
    primary: '#dc7a1e',
    light: '#f7b578',
  },
  error: {
    primary: '#d14343',
    light: '#f2a0a0',
  },
  white: '#ffffff',
};
