import React, { FC } from 'react';
import { Select, Tag } from 'antd';
import { ISelectMultiProps } from '../../../form/select-multi';
import { createSummary } from '../../../widgets/select-multi/utils/create-summary.util';
import { getAntdSelectPlaceholder, useAntdBuilderStrings } from './copy';
import { antdControlStyle } from './styles';

export const AntdSelectMulti: FC<ISelectMultiProps> = ({
  onChange,
  onDelete,
  selectedValue,
  emptyValue,
  values,
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

  const handleChange = (nextValues: string[]) => {
    for (const removedValue of selectedValue.filter(
      value => !nextValues.includes(value)
    )) {
      onDelete(removedValue);
    }

    for (const addedValue of nextValues.filter(
      value => !selectedValue.includes(value)
    )) {
      onChange(addedValue);
    }
  };

  const selectedLabels = values
    .filter(({ value }) => selectedValue.includes(value))
    .map(({ label }) => label);
  const summary = createSummary(selectedLabels);
  const title = summary.text ? selectedLabels.join(', ') : placeholder;

  return (
    <Select
      mode="multiple"
      value={selectedValue}
      options={values}
      onChange={handleChange}
      className={className}
      disabled={disabled}
      placeholder={placeholder}
      style={{ ...antdControlStyle, width: '100%' }}
      data-test="SelectMultiTrigger"
      optionFilterProp="label"
      id={id}
      aria-label={name}
      title={title}
      maxTagCount={1}
      maxTagPlaceholder={omittedValues => (
        <Tag data-test="SelectMultiSummaryBadge">+{omittedValues.length}</Tag>
      )}
    />
  );
};
