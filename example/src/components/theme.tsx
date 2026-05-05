import React, { FC, useEffect, useRef, useState } from 'react';
import { colors } from '../../../src';
import { ThemeColorInput } from './theme-color-input';
import styled from 'styled-components';
import { IColors } from '../../../src/constants/colors';

const StyledTheme = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StyledTitle = styled.h3`
  margin: 0;
  font-size: 0.9rem;
`;

const StyledContainer = styled.div`
  display: grid;
  gap: 0.75rem;
`;

const StyledGreyContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.6rem 0.9rem;
`;

const StyledColorGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StyledSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 0.75rem;
  background: ${colors.white};
  border: 1px solid ${colors.grey['300']};
`;

const StyledSectionTitle = styled.h4`
  margin: 0;
  font-size: 0.85rem;
  color: ${colors.grey['900']};
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
    <StyledTheme>
      <StyledTitle>Theme</StyledTitle>

      <StyledContainer>
        <StyledSection>
          <StyledSectionTitle>Primary</StyledSectionTitle>
          <StyledColorGroup>
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
        </StyledSection>

        <StyledSection>
          <StyledSectionTitle>Secondary</StyledSectionTitle>
          <StyledColorGroup>
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
        </StyledSection>

        <StyledSection>
          <StyledSectionTitle>Grey</StyledSectionTitle>
          <StyledGreyContainer>
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
              label="300"
              name="grey.300"
            />

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
          </StyledGreyContainer>
        </StyledSection>
      </StyledContainer>
    </StyledTheme>
  );
};
