import * as React from 'react';
import styled from 'styled-components';
import { colors } from '@vojtechportes/react-query-builder';
import type { IColors } from '@vojtechportes/react-query-builder';
import type { ColorPath } from '../types/color-path';
import { getColorValue } from '../utils/get-color-value.util';
import { setColorValue } from '../utils/set-color-value.util';

const Root = styled.section`
  display: grid;
  gap: 1rem;
`;

const DisabledNote = styled.p`
  margin: 0;
  font-size: 0.82rem;
  line-height: 1.5;
  color: #64748b;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 0.95rem;
  color: #0f172a;
`;

const Grid = styled.div<{ $disabled?: boolean }>`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.7rem 0.9rem;
  opacity: ${({ $disabled }) => ($disabled ? 0.45 : 1)};
`;

const Row = styled.label<{ $disabled?: boolean }>`
  display: grid;
  grid-template-columns: 26px minmax(0, 1fr);
  align-items: center;
  gap: 0.7rem;
  font-size: 0.82rem;
  color: #475569;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
`;

const Input = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
`;

const Swatch = styled.span<{ $color: string }>`
  width: 26px;
  height: 26px;
  border-radius: 16px;
  border: 1px solid #cbd5e1;
  box-shadow: inset 0 0 0 3px ${colors.white};
  background: ${({ $color }) => $color};
`;

const controls: { label: string; name: ColorPath }[] = [
  { label: 'Primary', name: 'primary.default' },
  { label: 'Primary light', name: 'primary.light' },
  { label: 'Primary dark', name: 'primary.dark' },
  { label: 'Primary contrast', name: 'primary.contrastText' },
  { label: 'Secondary', name: 'secondary.default' },
  { label: 'Secondary light', name: 'secondary.light' },
  { label: 'Secondary dark', name: 'secondary.dark' },
  { label: 'Secondary contrast', name: 'secondary.contrastText' },
  { label: 'Grey 100', name: 'grey.100' },
  { label: 'Grey 200', name: 'grey.200' },
  { label: 'Grey 300', name: 'grey.300' },
  { label: 'Grey 400', name: 'grey.400' },
  { label: 'Grey 500', name: 'grey.500' },
  { label: 'Grey 600', name: 'grey.600' },
  { label: 'Grey 700', name: 'grey.700' },
  { label: 'Grey 800', name: 'grey.800' },
  { label: 'Grey 900', name: 'grey.900' },
  { label: 'Info primary', name: 'info.primary' },
  { label: 'Info light', name: 'info.light' },
  { label: 'Success primary', name: 'success.primary' },
  { label: 'Success light', name: 'success.light' },
  { label: 'Warning primary', name: 'warning.primary' },
  { label: 'Warning light', name: 'warning.light' },
  { label: 'Error primary', name: 'error.primary' },
  { label: 'Error light', name: 'error.light' },
  { label: 'White', name: 'white' },
];

export interface IThemeEditorProps {
  value: IColors;
  onChange: (colors: IColors) => void;
  disabled?: boolean;
  disabledMessage?: string;
}

export const ThemeEditor: React.FC<IThemeEditorProps> = ({
  value,
  onChange,
  disabled = false,
  disabledMessage,
}) => (
  <Root>
    <Title>Theme</Title>
    {disabled && disabledMessage ? (
      <DisabledNote>{disabledMessage}</DisabledNote>
    ) : null}
    <Grid $disabled={disabled}>
      {controls.map((control) => {
        const colorValue = getColorValue(value, control.name);

        return (
          <Row htmlFor={control.name} key={control.name} $disabled={disabled}>
            <Swatch $color={String(colorValue)} />
            <Input
              id={control.name}
              type="color"
              value={String(colorValue)}
              disabled={disabled}
              onChange={(event) =>
                onChange(setColorValue(value, control.name, event.target.value))
              }
            />
            <span>{control.label}</span>
          </Row>
        );
      })}
    </Grid>
  </Root>
);
