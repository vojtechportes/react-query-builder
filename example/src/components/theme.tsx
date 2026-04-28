import React, { FC, useEffect, useRef, useState } from 'react';
import { colors } from '../../../src';
import { ThemeColorInput } from './theme-color-input';
import styled from 'styled-components';
import { IColors } from '../../../src/constants/colors';

const StyledTheme = styled.div`
  margin: 24px 0;
  padding: 24px;
  background: ${colors.grey['100']};
  border: 1px solid ${colors.grey['300']};
`;

const StyledTitle = styled.h3`
  margin: 0;
`;

const StyledContainer = styled.div`
  display: grid;
  grid-template-columns: max-content max-content max-content auto;
  gap: 32px;
`;

const StyledGreyContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 32px;
`;

const StyledColorGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export interface IThemeProps {
  onColorsChange: (colors: IColors) => void;
}

export const Theme: FC<IThemeProps> = ({ onColorsChange }) => {
  const [themeColors, setThemeColors] = useState(colors);
  const hasMounted = useRef(false);
  const onColorsChangeRef = useRef(onColorsChange);

  useEffect(() => {
    onColorsChangeRef.current = onColorsChange;
  }, [onColorsChange]);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    onColorsChangeRef.current(themeColors);
  }, [themeColors]);

  return (
    <>
      <StyledTheme>
        <StyledTitle>Theme</StyledTitle>

        <StyledContainer>
          <StyledColorGroup>
            <p>Primary</p>

            <ThemeColorInput
              themeColors={themeColors}
              setThemeColors={setThemeColors}
              label="Default"
              name="primary.default"
            />

            <ThemeColorInput
              themeColors={themeColors}
              setThemeColors={setThemeColors}
              label="Light"
              name="primary.light"
            />

            <ThemeColorInput
              themeColors={themeColors}
              setThemeColors={setThemeColors}
              label="Dark"
              name="primary.dark"
            />

            <ThemeColorInput
              themeColors={themeColors}
              setThemeColors={setThemeColors}
              label="Contrast text"
              name="primary.contrastText"
            />
          </StyledColorGroup>

          <StyledColorGroup>
            <p>Secondary</p>

            <ThemeColorInput
              themeColors={themeColors}
              setThemeColors={setThemeColors}
              label="Default"
              name="secondary.default"
            />

            <ThemeColorInput
              themeColors={themeColors}
              setThemeColors={setThemeColors}
              label="Light"
              name="secondary.light"
            />

            <ThemeColorInput
              themeColors={themeColors}
              setThemeColors={setThemeColors}
              label="Dark"
              name="secondary.dark"
            />

            <ThemeColorInput
              themeColors={themeColors}
              setThemeColors={setThemeColors}
              label="Contrast text"
              name="secondary.contrastText"
            />
          </StyledColorGroup>

          <StyledColorGroup>
            <p>Grey</p>

            <StyledGreyContainer>
              <StyledColorGroup>
                <ThemeColorInput
                  themeColors={themeColors}
                  setThemeColors={setThemeColors}
                  label="100"
                  name="grey.100"
                />

                <ThemeColorInput
                  themeColors={themeColors}
                  setThemeColors={setThemeColors}
                  label="200"
                  name="grey.200"
                />

                <ThemeColorInput
                  themeColors={themeColors}
                  setThemeColors={setThemeColors}
                  label="100"
                  name="grey.300"
                />
              </StyledColorGroup>

              <StyledColorGroup>
                <ThemeColorInput
                  themeColors={themeColors}
                  setThemeColors={setThemeColors}
                  label="400"
                  name="grey.400"
                />

                <ThemeColorInput
                  themeColors={themeColors}
                  setThemeColors={setThemeColors}
                  label="500"
                  name="grey.500"
                />

                <ThemeColorInput
                  themeColors={themeColors}
                  setThemeColors={setThemeColors}
                  label="600"
                  name="grey.600"
                />

                <ThemeColorInput
                  themeColors={themeColors}
                  setThemeColors={setThemeColors}
                  label="700"
                  name="grey.700"
                />
              </StyledColorGroup>

              <StyledColorGroup>
                <ThemeColorInput
                  themeColors={themeColors}
                  setThemeColors={setThemeColors}
                  label="800"
                  name="grey.800"
                />

                <ThemeColorInput
                  themeColors={themeColors}
                  setThemeColors={setThemeColors}
                  label="900"
                  name="grey.900"
                />

                <ThemeColorInput
                  themeColors={themeColors}
                  setThemeColors={setThemeColors}
                  label="White"
                  name="white"
                />
              </StyledColorGroup>
            </StyledGreyContainer>
          </StyledColorGroup>

          <div />
        </StyledContainer>
      </StyledTheme>
    </>
  );
};
