import { Dropdown, getTheme, IDropdownOption, Stack } from '@fluentui/react';
import React, { CSSProperties, FC, useContext, useMemo } from 'react';
import { BuilderContext } from '../../../../builder/context';
import { ISelectMultiProps } from '../../../../form/select-multi';
import { createSummary } from '../../../../widgets/select-multi/utils/create-summary.util';
import styles from './fluent-ui-select-multi.module.css';

const theme = getTheme();

export const FluentUiSelectMulti: FC<ISelectMultiProps> = ({
  onChange,
  onDelete,
  selectedValue,
  emptyValue,
  values,
  className,
  disabled = false,
  id,
}) => {
  const strings = useContext(BuilderContext).strings;
  const placeholder =
    emptyValue || strings.form?.selectYourValue || 'Select your value';
  const options = useMemo<IDropdownOption[]>(
    () => values.map(({ value, label }) => ({ key: value, text: label })),
    [values]
  );
  const selectedLabels = values
    .filter(({ value }) => selectedValue.includes(value))
    .map(({ label }) => label);
  const summary = createSummary(selectedLabels);
  const title = summary.text ? selectedLabels.join(', ') : placeholder;
  const badgeStyle = {
    '--fluent-ui-badge-background': theme.palette.themePrimary,
    '--fluent-ui-badge-color': theme.palette.white,
  } as CSSProperties;

  return (
    <Dropdown
      id={id}
      multiSelect
      selectedKeys={selectedValue}
      options={options}
      placeholder={placeholder}
      onChange={(_, option) => {
        if (!option) {
          return;
        }

        if (option.selected) {
          onChange(String(option.key));
          return;
        }

        onDelete(String(option.key));
      }}
      onRenderTitle={() =>
        summary.text ? (
          <Stack
            horizontal
            verticalAlign="center"
            tokens={{ childrenGap: 8 }}
            title={title}
            data-test="SelectMultiTrigger"
          >
            <span>{summary.text}</span>
            {summary.hiddenCount > 0 ? (
              <span
                className={styles.badge}
                style={badgeStyle}
                data-test="SelectMultiSummaryBadge"
              >
                +{summary.hiddenCount}
              </span>
            ) : null}
          </Stack>
        ) : (
          <span data-test="SelectMultiTrigger">{placeholder}</span>
        )
      }
      className={className}
      disabled={disabled}
      styles={{ root: { width: '100%' } }}
      data-test="SelectMultiTrigger"
    />
  );
};
