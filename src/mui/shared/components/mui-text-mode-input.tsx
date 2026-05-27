import React, { FC, useState } from 'react';
import { alpha, styled } from '@mui/material/styles';
import { ITextModeInputProps } from '../../../builder/text-mode/types/text-mode-input-props';

const Root = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '100%',
  minHeight: '10rem',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${alpha(theme.palette.common.black, 0.23)}`,
  backgroundColor: theme.palette.background.paper,
  transition: theme.transitions.create(['border-color', 'box-shadow'], {
    duration: theme.transitions.duration.shorter,
  }),
  '&:hover': {
    borderColor: theme.palette.text.primary,
  },
  '&[data-disabled="true"]': {
    backgroundColor: theme.palette.action.disabledBackground,
    borderColor: theme.palette.action.disabled,
  },
  '&[data-focused="true"]': {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 1px ${theme.palette.primary.main}`,
  },
}));

const Textarea = styled('textarea')({
  width: '100%',
  minHeight: '10rem',
  margin: 0,
  border: 0,
  resize: 'vertical',
  background: 'transparent',
  outline: 'none',
});

export const MuiTextModeInput: FC<ITextModeInputProps> = ({
  value,
  onChange,
  className,
  inputClassName,
  disabled = false,
  readOnly = false,
  spellCheck = false,
  inputDataTest,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Root
      className={className}
      data-disabled={disabled ? 'true' : 'false'}
      data-focused={isFocused ? 'true' : 'false'}
    >
      <Textarea
        value={value}
        onChange={event => onChange(event.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={inputClassName}
        disabled={disabled}
        readOnly={readOnly}
        spellCheck={spellCheck}
        rows={6}
        data-test={inputDataTest}
      />
    </Root>
  );
};
