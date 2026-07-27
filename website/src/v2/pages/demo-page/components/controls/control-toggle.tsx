import * as React from 'react';
import styled from 'styled-components';

const ToggleRow = styled.label<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  color: #334155;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
`;

const Toggle = styled.input<{ $disabled?: boolean }>`
  width: 18px;
  height: 18px;
  margin: 0;
  accent-color: #2563eb;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  flex: 0 0 18px;

  &:disabled {
    opacity: 1;
  }
`;

export interface IControlToggleProps {
  checked: boolean;
  disabled?: boolean;
  label: React.ReactNode;
  onChange: (value: boolean) => void;
}

export const ControlToggle: React.FC<IControlToggleProps> = ({
  checked,
  disabled = false,
  label,
  onChange,
}) => (
  <ToggleRow $disabled={disabled}>
    <Toggle
      type="checkbox"
      checked={checked}
      disabled={disabled}
      $disabled={disabled}
      onChange={(event) => onChange(event.target.checked)}
    />
    <span>{label}</span>
  </ToggleRow>
);
