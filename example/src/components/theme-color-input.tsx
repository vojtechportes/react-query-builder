import React, { FC, useCallback, useMemo } from 'react';
import {
  IColors,
  IColorVariant,
  IGreyColorVariant,
} from '@vojtechportes/react-query-builder';
import { isColorGroupKey } from './utils/is-color-group-key.util';
import styled from 'styled-components';
import { colors } from '@vojtechportes/react-query-builder';

const StyledRow = styled.label`
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr);
  align-items: center;
  gap: 0.55rem;
  font-size: 0.8rem;
  color: ${colors.grey['800']};
  cursor: pointer;
`;

const StyledInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

const StyledSwatch = styled.span<{ $color: string }>`
  display: block;
  width: 24px;
  height: 24px;
  border: 1px solid ${colors.grey['400']};
  box-shadow: inset 0 0 0 3px ${colors.white};
  background: ${({ $color }) => $color};
  border-radius: 2px;
`;

export const StyledLabel = styled.span`
  line-height: 1.2;
`;

export interface IThemeColorInputProps {
  name: string;
  label: string;
  themeColors: IColors;
  setThemeColors: React.Dispatch<React.SetStateAction<IColors>>;
}

export const ThemeColorInput: FC<IThemeColorInputProps> = ({
  name,
  label,
  themeColors,
  setThemeColors,
}) => {
  const parsedName = name.split('.');

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextValue = String(event.target.value);
      const groupKey = parsedName[0] as keyof IColors;

      if (parsedName.length === 1) {
        setThemeColors((value) => ({
          ...value,
          [groupKey]: nextValue,
        }));

        return;
      }

      if (parsedName.length === 2 && isColorGroupKey(groupKey)) {
        setThemeColors((value) => {
          return {
            ...value,
            [parsedName[0]]: {
              ...value[groupKey],
              [parsedName[1]]: nextValue,
            },
          };
        });
      }
    },
    [parsedName, setThemeColors]
  );

  const value = useMemo(() => {
    if (parsedName.length === 1) {
      const colorKey = parsedName[0] as keyof IColors;

      return themeColors[colorKey];
    }

    const groupKey = parsedName[0] as keyof IColors;
    const colorKey = parsedName[1] as keyof IColorVariant &
      keyof IGreyColorVariant;

    if (parsedName.length === 2 && isColorGroupKey(groupKey)) {
      return themeColors[groupKey][colorKey];
    }

    return '';
  }, [parsedName, themeColors]);

  return (
    <StyledRow htmlFor={name}>
      <StyledSwatch $color={String(value)} aria-hidden="true" />
      <StyledInput
        type="color"
        id={name}
        name={name}
        value={String(value)}
        onChange={handleChange}
      />
      <StyledLabel>{label}</StyledLabel>
    </StyledRow>
  );
};
