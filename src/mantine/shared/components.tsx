import React, { FC, useContext, useMemo } from 'react';
import styled from 'styled-components';
import {
  ActionIcon,
  Alert as MantineAlert,
  Button,
  Group,
  Menu,
  MultiSelect,
  Paper,
  Select,
  Switch,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';
import { IAlertProps } from '../../alert';
import { IButtonProps } from '../../button';
import {
  IBuilderComponentsProps,
  IHistoryControlsProps,
  ITextModeToggleContentProps,
} from '../../builder';
import { BuilderModeIcon } from '../../builder/components/builder-mode-icon';
import { TextModeIcon } from '../../builder/components/text-mode-icon';
import { ITextModeInputProps } from '../../builder/text-mode/types/text-mode-input-props';
import { BuilderContext } from '../../builder-context';
import { ICloneButtonProps } from '../../clone-button';
import { DropZone as CoreDropZone } from '../../drop-zone';
import { EmptyGroupDropZone as CoreEmptyGroupDropZone } from '../../empty-group-drop-zone';
import { IDropZoneProps } from '../../drop-zone';
import { IEmptyGroupDropZoneProps } from '../../empty-group-drop-zone';
import { IInputProps } from '../../form/input';
import { ISelectProps } from '../../form/select';
import { ISelectMultiProps } from '../../form/select-multi';
import { ISwitchProps } from '../../form/switch';
import { IGroupProps } from '../../group/group-container';
import { IOptionProps } from '../../group/option';
import { ILockToggleProps } from '../../lock-toggle';
import { IPopoverItemProps } from '../../popover-item';
import { IPopoverProps } from '../../popover';
import { IRuleProps } from '../../rule/rule-container';
import {
  BuilderLockState,
  getNextGroupLockState,
  getNextRuleLockState,
} from '../../utils/lock-state';
import { getCloneButtonTitle } from '../../utils/get-clone-button-title.util';
import { getLockToggleTitle } from '../../utils/get-lock-toggle-title.util';

const useMantineBuilderStrings = () => useContext(BuilderContext).strings;

const getMantineSelectPlaceholder = (
  placeholder: string | undefined,
  fallback: string | undefined
) => placeholder || fallback || 'Select your value';

const getMantineCloneTitle = (
  title: string | undefined,
  nodeType: 'rule' | 'group',
  fallbackStrings: ReturnType<typeof useMantineBuilderStrings>
) => title || getCloneButtonTitle(fallbackStrings, nodeType);

const getMantineLockTitle = (
  title: string | undefined,
  nodeType: 'rule' | 'group',
  state: BuilderLockState,
  fallbackStrings: ReturnType<typeof useMantineBuilderStrings>
) => title || getLockToggleTitle(fallbackStrings, nodeType, state);

const resolveButtonContent = ({ children, label }: IButtonProps) =>
  children || label;

const TextModeToggleContentContainer = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  line-height: 1;

  svg {
    display: block;
    flex-shrink: 0;
  }

  span {
    display: block;
    line-height: 1;
  }
`;

const CloneSvg: FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"
    />
  </svg>
);

const LockStateSvg: FC<{ state: BuilderLockState }> = ({ state }) => {
  if (state === 'unlocked') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M10 13C11.1 13 12 13.89 12 15C12 16.11 11.11 17 10 17S8 16.11 8 15 8.9 13 10 13M18 1C15.24 1 13 3.24 13 6V8H4C2.9 8 2 8.9 2 10V20C2 21.1 2.9 22 4 22H16C17.1 22 18 21.1 18 20V10C18 8.9 17.1 8 16 8H15V6C15 4.34 16.34 3 18 3S21 4.34 21 6V8H23V6C23 3.24 20.76 1 18 1M16 10V20H4V10H16Z"
        />
      </svg>
    );
  }

  if (state === 'self') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12,17C10.89,17 10,16.1 10,15C10,13.89 10.89,13 12,13A2,2 0 0,1 14,15A2,2 0 0,1 12,17M18,20V10H6V20H18M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V10C4,8.89 4.89,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"
        />
      </svg>
    );
  }

  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"
      />
    </svg>
  );
};

const renderSelectOption = ({ option }: { option: { label: string } }) =>
  option.label;

export const MantineInput: FC<IInputProps> = ({
  type,
  value,
  onChange,
  className,
  disabled = false,
  id,
  name,
}) => (
  <TextInput
    id={id}
    name={name}
    type={type}
    value={`${value}`}
    onChange={event => onChange(event.currentTarget.value)}
    className={className}
    disabled={disabled}
    data-test="Input"
  />
);

export const MantineSelect: FC<ISelectProps> = ({
  values,
  selectedValue,
  emptyValue,
  onChange,
  className,
  disabled = false,
  id,
  name,
}) => {
  const strings = useMantineBuilderStrings();
  const placeholder = getMantineSelectPlaceholder(
    emptyValue,
    strings.form?.selectYourValue
  );

  return (
    <Select
      id={id}
      name={name}
      value={selectedValue || null}
      data={values}
      onChange={value => onChange(value || '')}
      className={className}
      disabled={disabled}
      placeholder={placeholder}
      searchable
      renderOption={renderSelectOption}
      comboboxProps={{ withinPortal: false }}
      data-test="SelectTrigger"
    />
  );
};

export const MantineSelectMulti: FC<ISelectMultiProps> = ({
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
  const strings = useMantineBuilderStrings();
  const placeholder = getMantineSelectPlaceholder(
    emptyValue,
    strings.form?.selectYourValue
  );

  return (
    <MultiSelect
      id={id}
      name={name}
      value={selectedValue}
      data={values}
      onChange={nextValues => {
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
      }}
      className={className}
      disabled={disabled}
      placeholder={placeholder}
      searchable
      renderOption={renderSelectOption}
      comboboxProps={{ withinPortal: false }}
      data-test="SelectMultiTrigger"
    />
  );
};

export const MantineSwitch: FC<ISwitchProps> = ({
  switched,
  onChange,
  disabled = false,
  className,
}) => (
  <Switch
    checked={switched}
    onChange={event => onChange?.(event.currentTarget.checked)}
    disabled={disabled}
    className={className}
    data-test="Switch"
  />
);

const severityColorMap: Record<NonNullable<IAlertProps['severity']>, string> = {
  info: 'blue',
  success: 'green',
  warning: 'yellow',
  error: 'red',
};

export const MantineAlertComponent: FC<IAlertProps> = ({
  children,
  className,
  severity = 'warning',
  variant = 'outlined',
  'data-test': dataTest,
}) => (
  <MantineAlert
    className={className}
    color={severityColorMap[severity]}
    variant={variant === 'filled' ? 'filled' : 'outline'}
    data-test={dataTest}
  >
    {children}
  </MantineAlert>
);

export const MantineAddButton: FC<IButtonProps> = props => (
  <Button
    onClick={props.onClick}
    disabled={props.disabled}
    className={props.className}
    title={props.title}
    data-test={props['data-test']}
    size="sm"
  >
    {resolveButtonContent(props)}
  </Button>
);

export const MantineRemoveButton: FC<IButtonProps> = props => (
  <Button
    onClick={props.onClick}
    disabled={props.disabled}
    className={props.className}
    title={props.title}
    data-test={props['data-test']}
    variant="default"
    size="sm"
  >
    {resolveButtonContent(props)}
  </Button>
);

export const MantineOutlinedButton: FC<IButtonProps> = props => (
  <Button
    onClick={props.onClick}
    disabled={props.disabled}
    className={props.className}
    title={props.title}
    data-test={props['data-test']}
    variant="outline"
    size="sm"
  >
    {resolveButtonContent(props)}
  </Button>
);

export const MantineCloneButton: FC<ICloneButtonProps> = ({
  nodeType,
  disabled = false,
  onClick,
  className,
  title,
  'data-test': dataTest,
}) => {
  const strings = useMantineBuilderStrings();
  const resolvedTitle = getMantineCloneTitle(title, nodeType, strings);

  return (
    <ActionIcon
      onClick={onClick}
      disabled={disabled}
      className={className}
      title={resolvedTitle}
      aria-label={resolvedTitle}
      data-test={dataTest}
      variant="default"
      size="lg"
    >
      <CloneSvg />
    </ActionIcon>
  );
};

export const MantineLockToggle: FC<ILockToggleProps> = ({
  state,
  nodeType,
  disabled = false,
  onChange,
  className,
  title,
  'data-test': dataTest,
}) => {
  const strings = useMantineBuilderStrings();
  const resolvedTitle = getMantineLockTitle(title, nodeType, state, strings);

  return (
    <ActionIcon
      onClick={() => {
        if (!disabled) {
          onChange?.(
            nodeType === 'group'
              ? getNextGroupLockState(state)
              : getNextRuleLockState(state)
          );
        }
      }}
      disabled={disabled}
      className={className}
      title={resolvedTitle}
      aria-label={resolvedTitle}
      data-test={dataTest}
      variant={state === 'unlocked' ? 'default' : 'filled'}
      color={state === 'all' ? 'blue' : state === 'self' ? 'indigo' : undefined}
      size="lg"
    >
      <LockStateSvg state={state} />
    </ActionIcon>
  );
};

export const MantineHistoryControls: FC<IHistoryControlsProps> = ({
  undoButton,
  redoButton,
  className,
}) => (
  <Group gap="xs" className={className}>
    {undoButton}
    {redoButton}
  </Group>
);

export const MantineRule: FC<IRuleProps> = ({
  children,
  controls,
  dragHandle,
  className,
  'data-test': dataTest,
}) => {
  const hasControls = React.Children.toArray(controls).length > 0;

  return (
    <Paper
      withBorder
      className={className}
      data-test={dataTest}
      mt="sm"
      style={{
        display: 'grid',
        overflow: 'hidden',
        gridTemplateColumns: hasControls
          ? dragHandle
            ? 'auto minmax(0, 1fr) auto'
            : 'minmax(0, 1fr) auto'
          : dragHandle
            ? 'auto minmax(0, 1fr)'
            : 'minmax(0, 1fr)',
      }}
    >
      {dragHandle}
      <div
        style={{
          minWidth: 0,
          padding: '0.85rem',
          paddingRight: hasControls ? 0 : '0.85rem',
        }}
      >
        {children}
      </div>
      {hasControls ? (
        <div
          style={{
            display: 'grid',
            gridAutoColumns: 'min-content',
            gridAutoFlow: 'column',
            gap: '0.5rem',
            alignSelf: 'start',
            padding: '0.85rem',
          }}
        >
          {controls}
        </div>
      ) : null}
    </Paper>
  );
};

export const MantineGroup: FC<IGroupProps> = ({
  controlsLeft,
  controlsRight,
  children,
  dragHandle,
  className,
  contentOverlay,
}) => {
  const hasControlsLeft = React.Children.toArray(controlsLeft).length > 0;
  const hasControlsRight = React.Children.toArray(controlsRight).length > 0;
  const hasHeader = hasControlsLeft || hasControlsRight;

  return (
    <Paper
      withBorder
      className={className}
      mt="sm"
      bg="gray.0"
      style={{
        display: 'grid',
        overflow: 'hidden',
        gridTemplateColumns: dragHandle ? 'auto minmax(0, 1fr)' : 'minmax(0, 1fr)',
      }}
    >
      {dragHandle}
      <div style={{ position: 'relative', padding: '0.85rem' }}>
        {hasHeader ? (
          <div
            style={{
              display: 'grid',
              gap: '1rem',
              gridTemplateColumns: 'minmax(0, 1fr) auto',
              paddingBottom: '0.75rem',
              borderBottom: '1px solid var(--mantine-color-gray-3, #dee2e6)',
            }}
          >
            {hasControlsLeft ? (
              <div
                style={{
                  display: 'grid',
                  gridAutoColumns: 'min-content',
                  gridAutoFlow: 'column',
                  alignSelf: 'end',
                  justifySelf: 'start',
                }}
              >
                {controlsLeft}
              </div>
            ) : null}
            {hasControlsRight ? (
              <div
                style={{
                  display: 'grid',
                  gridAutoColumns: 'min-content',
                  gridAutoFlow: 'column',
                  gap: '0.5rem',
                  justifySelf: 'end',
                }}
              >
                {controlsRight}
              </div>
            ) : null}
          </div>
        ) : null}
        {contentOverlay}
        {children}
      </div>
    </Paper>
  );
};

export const MantineGroupHeaderOption: FC<IOptionProps> = ({
  children,
  value,
  onClick,
  disabled,
  isSelected,
  className,
}) => (
  <Button
    type="button"
    className={className}
    disabled={disabled}
    onClick={() => {
      if (!disabled) {
        onClick(value);
      }
    }}
    variant={isSelected ? 'filled' : 'default'}
    size="xs"
    radius={0}
  >
    {children}
  </Button>
);

export const MantineText: FC<{
  children?: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <Text component="span" className={className}>
    {children}
  </Text>
);

export const MantineDropZone: FC<IDropZoneProps> = props => (
  <CoreDropZone {...props} />
);

export const MantineEmptyGroupDropZone: FC<IEmptyGroupDropZoneProps> = props => (
  <CoreEmptyGroupDropZone {...props} />
);

type PopoverItemElement = React.ReactElement<IPopoverItemProps>;

export const MantinePopover: FC<IPopoverProps> = ({
  label,
  children,
  className,
  'data-test': dataTest,
}) => {
  const items = useMemo(
    () =>
      React.Children.toArray(children)
        .filter(React.isValidElement)
        .map(child => child as PopoverItemElement),
    [children]
  );

  return (
    <Menu withinPortal={false} position="bottom-start">
      <Menu.Target>
        <Button className={className} data-test={dataTest} size="sm">
          {label}
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        {items.map((item, index) => (
          <Menu.Item
            key={`${index}-${item.props.label}`}
            onClick={event =>
              item.props.onClick(
                event as unknown as React.MouseEvent<HTMLButtonElement>
              )
            }
          >
            {item.props.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};

export const MantinePopoverItem: FC<IPopoverItemProps> = () => null;

export const MantineTextModeInput: FC<ITextModeInputProps> = ({
  value,
  onChange,
  className,
  inputClassName,
  disabled = false,
  readOnly = false,
  spellCheck = false,
  inputDataTest,
}) => (
  <Textarea
    value={value}
    onChange={event => onChange(event.currentTarget.value)}
    className={className}
    classNames={inputClassName ? { input: inputClassName } : undefined}
    disabled={disabled}
    readOnly={readOnly}
    spellCheck={spellCheck}
    minRows={6}
    autosize={false}
    data-test={inputDataTest}
    styles={{
      input: {
        minHeight: '10rem',
        fontFamily: 'Consolas, "Courier New", monospace',
      },
    }}
  />
);

export const MantineTextModeToggleContent: FC<ITextModeToggleContentProps> = ({
  mode,
  label,
}) => (
  <TextModeToggleContentContainer>
    {mode === 'text' ? <BuilderModeIcon /> : <TextModeIcon />}
    <span>{label}</span>
  </TextModeToggleContentContainer>
);

export const createMantineComponentSet = (): IBuilderComponentsProps => ({
  Alert: MantineAlertComponent,
  form: {
    Input: MantineInput,
    Select: MantineSelect,
    SelectMulti: MantineSelectMulti,
    Switch: MantineSwitch,
  },
  Add: MantineAddButton,
  Remove: MantineRemoveButton,
  CloneButton: MantineCloneButton,
  OutlinedButton: MantineOutlinedButton,
  TextModeToggleContent: MantineTextModeToggleContent,
  TextModeInput: MantineTextModeInput,
  LockToggle: MantineLockToggle,
  HistoryControls: MantineHistoryControls,
  Rule: MantineRule,
  Group: MantineGroup,
  GroupHeaderOption: MantineGroupHeaderOption,
  Text: MantineText,
  DropZone: MantineDropZone,
  EmptyGroupDropZone: MantineEmptyGroupDropZone,
  Popover: MantinePopover,
  PopoverItem: MantinePopoverItem,
});
