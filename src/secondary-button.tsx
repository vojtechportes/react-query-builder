import styled from 'styled-components';
import { Button, ButtonProps } from './button';
import { colors } from './constants/colors';

export const SecondaryButton = styled(Button)<ButtonProps>`
  background-color: ${colors.tertiary};
`;
