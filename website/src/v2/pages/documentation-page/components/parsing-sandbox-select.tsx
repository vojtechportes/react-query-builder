import styled from 'styled-components';
import { siteTheme } from '../../../../constants/site-theme';

export const ParsingSandboxSelect = styled.select`
  min-width: 170px;
  padding: 0.8rem 2.4rem 0.8rem 0.95rem;
  border: 1px solid #dbe4f0;
  border-radius: 16px;
  background: #fff;
  color: #0f172a;
  font-size: 0.98rem;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2.5 4.5L6 8L9.5 4.5' stroke='%230f172a' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.95rem center;

  &:focus {
    outline: none;
    border-color: ${siteTheme.primaryLight};
    box-shadow: 0 0 0 3px ${siteTheme.primaryGlow};
  }
`;
