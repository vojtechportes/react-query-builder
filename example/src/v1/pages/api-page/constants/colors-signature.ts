export const colorsSignature = `export interface IColorVariant {
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

export interface IColors {
  primary: IColorVariant;
  secondary: IColorVariant;
  grey: IGreyColorVariant;
  white: string;
}

export const colors: IColors;`;
