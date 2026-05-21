import styled from 'styled-components';
import { siteTheme } from '../../constants/site-theme';

export const InlineCode = styled.code`
  padding: 0.16rem 0.45rem;
  margin-right: 0.2rem;
  border: 1px solid #dbe4f0;
  border-radius: 10px;
  background: #f8fafc;
  color: ${siteTheme.primaryDark};
  font-size: 0.92em;
  font-weight: 400;
  white-space: nowrap;
`;
