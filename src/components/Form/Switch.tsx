import React from 'react';
import styled from 'styled-components';
import { colors } from '../../constants/colors';

const Knob = styled.div`
  position: absolute;
  width: 1rem;
  height: 1rem;
  background: white;
  border-radius: 50%;
  border: 1px solid ${colors.medium};
`;

const StyledSwitch = styled.div<{ switched: boolean }>`
  width: 2.2rem;
  height: 1rem;
  position: relative;
  border-radius: 1.4rem;
  background-color: ${({ switched }) =>
    switched ? colors.enabled : colors.disabled};
  transition: all 0.5s;
  cursor: pointer;

  ${Knob} {
    transition: all 0.5s;
    left: ${({ switched }) => (switched ? '1.2rem' : '0rem')};
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
      switched={switched}
      onClick={handleClick}
      className={className}
    >
      <Knob />
    </StyledSwitch>
  );
};
