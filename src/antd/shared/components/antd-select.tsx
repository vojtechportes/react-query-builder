import React, { FC } from 'react';
import { Select } from 'antd';
import { ISelectProps } from '../../../form/select';
import { getAntdSelectPlaceholder, useAntdBuilderStrings } from './copy';
import { antdControlStyle } from './styles';

export const AntdSelect: FC<ISelectProps> = ({
  values,
  selectedValue,
  emptyValue,
  onChange,
  className,
  disabled = false,
  id,
  name,
}) => {
  const strings = useAntdBuilderStrings();
  const placeholder = getAntdSelectPlaceholder(
    emptyValue,
    strings.form?.selectYourValue
  );

  return (
    <Select
      value={selectedValue || undefined}
      options={values}
      onChange={value => onChange(value)}
      className={className}
      disabled={disabled}
      placeholder={placeholder}
      style={{ ...antdControlStyle, width: '100%' }}
      data-test="SelectTrigger"
      optionFilterProp="label"
      id={id}
      aria-label={name}
    />
  );
};
