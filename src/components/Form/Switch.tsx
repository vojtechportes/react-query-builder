import React from 'react';
import styled from 'styled-components';
import { colors } from '../../constants/colors';

const Knob = styled.div`
  position: absolute;
  width: 1.3rem;
  height: 1.3rem;
  background: white;
  border-radius: 50%;
  border: 1px solid ${colors.dark};
  box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.4);
`;

const StyledSwitch = styled.div<{ switched: boolean }>`
  width: 3rem;
  height: 1.65rem;
  position: relative;
  border-radius: 1.4rem;
  border: 1px solid ${colors.dark};
  background-color: ${({ switched }) =>
    switched ? colors.primary : colors.darker};
  transition: all 0.5s;
  cursor: pointer;

  ${Knob} {
    transition: all 0.5s;
    top: 0.1rem;
    left: ${({ switched }) => (switched ? '1.3rem' : '0.1rem')};
  }
`;

export interface SwitchProps {
  switched: boolean;
  onChange?: (value: boolean) => void;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  switched,
  onChange,
  className,
}) => {
  const handleClick = () => {
    if (onChange) {
      onChange(!switched);
    }
  };

  return (
    <StyledSwitch
      data-test="Switch"
      switched={switched}
      onClick={handleClick}
      className={className}
    >
      <Knob />
    </StyledSwitch>
  );
};
