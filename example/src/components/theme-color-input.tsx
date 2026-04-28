import React, { FC, useCallback, useMemo } from 'react';
import { IColors, IColorVariant, IGreyColorVariant } from '../../../src/constants/colors';
import { isColorGroupKey } from './utils/is-color-group-key.util';
import styled from 'styled-components';

export const StyledLabel = styled.label`
  margin-left: 16px;
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
    const colorKey = parsedName[1] as keyof IColorVariant & keyof IGreyColorVariant;

    if (parsedName.length === 2 && isColorGroupKey(groupKey)) {
      return themeColors[groupKey][colorKey];
    }

    return '';
  }, [parsedName, themeColors]);

  return (
    <div>
      <input
        type="color"
        id={name}
        name={name}
        value={String(value)}
        onChange={handleChange}
      />
      <StyledLabel htmlFor={name}>{label}</StyledLabel>
    </div>
  );
};
