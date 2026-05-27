import React, { FC, useCallback } from 'react';
import styled from 'styled-components';
import { IThemeProps } from '../../../theme-provider/theme-provider';
import { useTheme } from '../../../theme-provider/hooks/use-theme';
import { ITextModeInputProps } from '../types/text-mode-input-props';

const StyledTextModeInputRoot = styled.div<{
  $theme: Required<IThemeProps>;
}>`
  min-height: 10rem;
  border: 1px solid ${({ $theme }) => $theme.colors.grey['300']};
  border-radius: 4px;
  background: ${({ $theme }) => $theme.colors.white};
  overflow: hidden;
`;

const StyledTextModeInputField = styled.textarea`
  width: 100%;
  min-height: 10rem;
  margin: 0;
  border: 0;
  resize: vertical;
  background: transparent;
  outline: none;
`;

export const TextModeInput: FC<ITextModeInputProps> = ({
  value,
  onChange,
  className,
  inputClassName,
  disabled = false,
  readOnly = false,
  spellCheck = false,
  inputDataTest,
}) => {
  const theme = useTheme();

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(event.target.value);
    },
    [onChange]
  );

  return (
    <StyledTextModeInputRoot className={className} $theme={theme}>
      <StyledTextModeInputField
        value={value}
        onChange={handleChange}
        disabled={disabled}
        readOnly={readOnly}
        spellCheck={spellCheck}
        className={inputClassName}
        data-test={inputDataTest}
      />
    </StyledTextModeInputRoot>
  );
};
