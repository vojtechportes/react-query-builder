import { Button, ButtonProps } from './Button';
import styled from 'styled-components';
import { colors } from '../constants/colors';

export const SecondaryButton = styled(Button)<ButtonProps>`
  background-color: ${colors.tertiary};
`;
