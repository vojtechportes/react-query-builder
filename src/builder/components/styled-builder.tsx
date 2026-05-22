import styled from 'styled-components';
import { IThemeProps } from '../../theme-provider/theme-provider';

export const StyledBuilder = styled.div<{
  $theme: Required<IThemeProps>;
}>`
  font-family: Arial, sans-serif;
  font-size: 16px;
  color: ${({ $theme }) => $theme.colors.grey['800']};
  padding: 1rem;
  background: ${({ $theme }) => $theme.colors.white};
  border: 1px solid ${({ $theme }) => $theme.colors.grey['100']};
`;
