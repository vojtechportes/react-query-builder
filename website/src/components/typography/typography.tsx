import * as React from 'react';
import styled from 'styled-components';
import { resolveTypographySpacingValue } from './utils/resolve-typography-spacing-value.util';

export interface ITypographyProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  'color'
> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2';
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2';
  component?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  color?: 'dark' | 'muted' | 'light' | 'success' | 'error' | 'warning' | 'info';
  fontSize?: string;
  fontWeight?: React.CSSProperties['fontWeight'];
  mb?: string | number;
  mt?: string | number;
  my?: string | number;
}

const typographyConfig = {
  colors: {
    dark: '#0f172a',
    muted: '#475569',
    light: '#fff',
    success: '#166534',
    info: '#002984',
    error: '#b91c1c',
    warning: '#9a3412',
  },
  variants: {
    h1: { fontSize: '3rem', fontWeight: 700, lineHeight: 1.1 },
    h2: { fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.1 },
    h3: { fontSize: '2rem', fontWeight: 700, lineHeight: 1.1 },
    h4: { fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.1 },
    h5: { fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.1 },
    h6: { fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.1 },
    body1: { fontSize: '1.1rem', fontWeight: 400, lineHeight: 1.6 },
    body2: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.6 },
  },
} as const;

const Root = styled.p<{
  $color: NonNullable<ITypographyProps['color']>;
  $fontSize?: string;
  $fontWeight?: React.CSSProperties['fontWeight'];
  $mb: string;
  $mt: string;
  $visualVariant: NonNullable<ITypographyProps['variant']>;
}>`
  margin-top: ${({ $mt }) => $mt};
  margin-bottom: ${({ $mb }) => $mb};
  color: ${({ $color }) => typographyConfig.colors[$color]};
  font-size: ${({ $fontSize, $visualVariant }) =>
    $fontSize ?? typographyConfig.variants[$visualVariant].fontSize};
  font-weight: ${({ $fontWeight, $visualVariant }) =>
    $fontWeight ?? typographyConfig.variants[$visualVariant].fontWeight};
  line-height: ${({ $visualVariant }) =>
    typographyConfig.variants[$visualVariant].lineHeight};
`;

export const Typography: React.FC<ITypographyProps> = ({
  variant = 'body2',
  as,
  component,
  color = 'dark',
  fontSize,
  fontWeight,
  mb,
  mt,
  my,
  ...htmlAttributes
}) => {
  const inferredComponent = variant.startsWith('h') ? variant : 'p';
  const resolvedComponent = component ?? inferredComponent;
  const visualVariant = as ?? variant;
  const verticalMargin = resolveTypographySpacingValue(my) ?? '0';
  const marginTop = resolveTypographySpacingValue(mt) ?? verticalMargin;
  const marginBottom = resolveTypographySpacingValue(mb) ?? verticalMargin;

  return (
    <Root
      as={resolvedComponent}
      $color={color}
      $fontSize={fontSize}
      $fontWeight={fontWeight}
      $mb={marginBottom}
      $mt={marginTop}
      $visualVariant={visualVariant}
      {...htmlAttributes}
    />
  );
};
