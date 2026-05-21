import { css } from 'styled-components';
import { IThemeProps } from '../theme-provider/theme-provider';

type InputStyleProps = {
  $theme: Required<IThemeProps>;
};

export const inputTypographyStyles = css<InputStyleProps>`
  color: ${({ $theme }) => $theme.colors.grey['800']};
  font-family: inherit;
  font-size: 0.8rem;
  font-weight: inherit;
  line-height: calc(2rem - 2px);
`;

export const inputControlStyles = css<InputStyleProps>`
  box-sizing: border-box;
  appearance: none;
  width: var(--query-builder-control-width, 160px);
  min-width: var(--query-builder-control-min-width, 160px);
  max-width: 100%;
  height: 2rem;
  border: 1px solid ${({ $theme }) => $theme.colors.grey['500']};
  border-radius: 3px;
  background: ${({ $theme }) => $theme.colors.white};
  ${inputTypographyStyles}

  &:disabled {
    background: ${({ $theme }) => $theme.colors.grey['100']};
    cursor: not-allowed;
  }
`;
