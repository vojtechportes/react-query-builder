import styled from 'styled-components';
import { IThemeProps } from '../../theme-provider/theme-provider';

export const StyledBuilder = styled.div<{
  $theme: Required<IThemeProps>;
}>`
  font-family: var(--query-builder-font-family, Arial, sans-serif);
  font-size: var(--query-builder-font-size, 16px);
  line-height: var(--query-builder-line-height, normal);
  color: var(
    --query-builder-color-grey-800,
    ${({ $theme }) => $theme.colors.grey['800']}
  );
  padding: var(--query-builder-root-padding, 1rem);
  background: var(
    --query-builder-color-white,
    ${({ $theme }) => $theme.colors.white}
  );
  border: 1px solid
    var(
      --query-builder-color-grey-100,
      ${({ $theme }) => $theme.colors.grey['100']}
    );
  border-radius: var(--query-builder-root-radius, 0);
  box-shadow: var(--query-builder-shadow-root, none);
`;
