import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { siteTheme } from '../../constants/site-theme';

export const TextLink = styled(Link)`
  color: ${siteTheme.primary};
  font-weight: 600;
`;
