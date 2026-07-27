import styled from 'styled-components';
import { siteTheme } from '../../constants/site-theme';

export const List = styled.ul`
  margin: 0 0 1rem;
  padding-left: 1.2rem;
  line-height: 1.7;

  li::marker {
    color: ${siteTheme.marker};
    font-size: 0.8em;
  }

  li + li {
    margin-top: 0.65rem;
  }
`;
