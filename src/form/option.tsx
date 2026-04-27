import styled from 'styled-components';
import { colors } from '../constants/colors';

export const Option = styled.span`
  padding: 0.3rem 0.5rem;
  color: ${colors.dark};
  font-size: 0.7rem;
  line-height: 0.7rem;
  white-space: nowrap;
  border: 1px solid ${colors.dark};
  border-radius: 3rem;
`;
