import React, { FC } from 'react';
import { ITextModeInputProps } from '../../../builder/text-mode/types/text-mode-input-props';
import { antdControlStyle } from './styles';

export const AntdTextModeInput: FC<ITextModeInputProps> = ({
  value,
  onChange,
  className,
  inputClassName,
  disabled = false,
  readOnly = false,
  spellCheck = false,
  inputDataTest,
}) => (
  <textarea
    value={value}
    onChange={event => onChange(event.target.value)}
    className={['ant-input', className, inputClassName].filter(Boolean).join(' ')}
    disabled={disabled}
    readOnly={readOnly}
    spellCheck={spellCheck}
    rows={6}
    data-test={inputDataTest}
    style={{
      ...antdControlStyle,
      width: '100%',
    }}
  />
);
