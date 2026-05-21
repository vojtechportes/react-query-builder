import { css } from 'styled-components';

export const compactBuilderBreakpoint = '900px';

export const compactBuilderMedia = (
  strings: Parameters<typeof css>[0],
  ...interpolations: Array<Parameters<typeof css>[number]>
) => css`
  @media (max-width: ${compactBuilderBreakpoint}) {
    ${css(strings, ...interpolations)}
  }
`;
