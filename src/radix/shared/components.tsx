import React, { FC, useContext, useMemo } from 'react';
import styled from 'styled-components';
import {
  CopyIcon,
  LockClosedIcon,
  LockOpen1Icon,
} from '@radix-ui/react-icons';
import {
  Button,
  DropdownMenu,
  IconButton,
  Select,
  Switch,
  Text,
  TextArea,
  TextField,
} from '@radix-ui/themes';
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
import { IEmptyGroupDropZoneProps } from '../../empty-group-drop-zone';
import { IDropZoneProps } from '../../drop-zone';
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
import { createSummary } from '../../widgets/select-multi/utils/create-summary.util';

const useRadixBuilderStrings = () => useContext(BuilderContext).strings;

const getRadixSelectPlaceholder = (
  placeholder: string | undefined,
  fallback: string | undefined
) => placeholder || fallback || 'Select your value';

const getRadixCloneTitle = (
  title: string | undefined,
  nodeType: 'rule' | 'group',
  fallbackStrings: ReturnType<typeof useRadixBuilderStrings>
) => title || getCloneButtonTitle(fallbackStrings, nodeType);

const getRadixLockTitle = (
  title: string | undefined,
  nodeType: 'rule' | 'group',
  state: BuilderLockState,
  fallbackStrings: ReturnType<typeof useRadixBuilderStrings>
) => title || getLockToggleTitle(fallbackStrings, nodeType, state);

const resolveButtonContent = ({ children, label }: IButtonProps) =>
  children || label;

const HiddenInput = styled.input`
  display: none;
`;

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

const AlertContainer = styled.div<{ $severity: NonNullable<IAlertProps['severity']> }>`
  display: grid;
  gap: 0.4rem;
  padding: 0.85rem 1rem;
  border: 1px solid
    ${({ $severity }) =>
      $severity === 'error'
        ? 'var(--red-7, #e5484d)'
        : $severity === 'success'
          ? 'var(--green-7, #30a46c)'
          : $severity === 'info'
            ? 'var(--blue-7, #3e63dd)'
            : 'var(--amber-7, #f5a524)'};
  border-radius: max(var(--radius-3, 10px), 10px);
  background:
    ${({ $severity }) =>
      $severity === 'error'
        ? 'var(--red-2, #fff7f7)'
        : $severity === 'success'
          ? 'var(--green-2, #f6fef9)'
          : $severity === 'info'
            ? 'var(--blue-2, #f5f8ff)'
            : 'var(--amber-2, #fffcf2)'};
  color:
    ${({ $severity }) =>
      $severity === 'error'
        ? 'var(--red-11, #d13438)'
        : $severity === 'success'
          ? 'var(--green-11, #18794e)'
          : $severity === 'info'
            ? 'var(--blue-11, #2050c7)'
            : 'var(--amber-11, #946800)'};
`;

const RuleContainer = styled.div`
  display: grid;
  margin-top: 0.75rem;
  overflow: hidden;
  border: 1px solid var(--gray-6, #d9d9e0);
  border-radius: max(var(--radius-3, 10px), 10px);
  background: var(--color-panel-solid, #fff);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
`;

const RuleBody = styled.div<{ $hasControls: boolean }>`
  min-width: 0;
  padding: 0.9rem;
  padding-right: ${({ $hasControls }) => ($hasControls ? '0' : '0.9rem')};
`;

const RuleControls = styled.div`
  display: grid;
  grid-auto-columns: min-content;
  grid-auto-flow: column;
  gap: 0.5rem;
  align-self: start;
  padding: 0.9rem;
`;

const GroupContainer = styled.div`
  display: grid;
  margin-top: 0.75rem;
  overflow: hidden;
  border: 1px solid var(--gray-6, #d9d9e0);
  border-radius: max(var(--radius-4, 14px), 14px);
  background:
    linear-gradient(
      180deg,
      var(--gray-1, #fcfcfd) 0%,
      var(--gray-2, #f8f8fb) 100%
    );
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
`;

const GroupBody = styled.div`
  position: relative;
  padding: 1rem;
`;

const GroupHeader = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: minmax(0, 1fr) auto;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid var(--gray-6, #d9d9e0);

  @media (max-width: 900px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 0.75rem;
  }
`;

const GroupHeaderSide = styled.div<{ $right?: boolean }>`
  display: grid;
  grid-auto-columns: min-content;
  grid-auto-flow: column;
  gap: ${({ $right }) => ($right ? '0.5rem' : '0')};
  justify-self: ${({ $right }) => ($right ? 'end' : 'start')};
  align-self: ${({ $right }) => ($right ? 'start' : 'end')};

  @media (max-width: 900px) {
    justify-self: start;
  }
`;

const HistoryControlsContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`;

const ConnectedGroupButton = styled.button<{
  $selected: boolean;
  $disabled: boolean;
}>`
  min-width: 4.75rem;
  min-height: 2rem;
  padding: 0 0.9rem;
  margin: 0;
  border: 1px solid
    ${({ $selected, $disabled }) =>
      $disabled
        ? $selected
          ? 'var(--gray-8, #8d8d98)'
          : 'var(--gray-6, #d9d9e0)'
        : $selected
          ? 'var(--accent-9, #3e63dd)'
          : 'var(--gray-7, #c8c7d0)'};
  border-right-width: ${({ $selected }) => ($selected ? '1px' : '0')};
  background:
    ${({ $selected, $disabled }) =>
      $disabled
        ? $selected
          ? 'var(--gray-4, #ececf0)'
          : 'var(--gray-3, #f3f3f6)'
        : $selected
          ? 'var(--accent-9, #3e63dd)'
          : 'var(--color-panel-solid, #fff)'};
  color:
    ${({ $selected, $disabled }) =>
      $disabled
        ? 'var(--gray-9, #8b8d98)'
        : $selected
          ? 'white'
          : 'var(--gray-12, #1c2024)'};
  font-size: 0.72rem;
  font-weight: 700;
  line-height: 1;
  text-transform: uppercase;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};

  &:first-child {
    border-top-left-radius: max(var(--radius-2, 8px), 8px);
    border-bottom-left-radius: max(var(--radius-2, 8px), 8px);
  }

  &:last-child {
    border-right-width: 1px;
    border-top-right-radius: max(var(--radius-2, 8px), 8px);
    border-bottom-right-radius: max(var(--radius-2, 8px), 8px);
  }

  &:not(:first-child) {
    margin-left: -1px;
  }
`;

const SelectTriggerText = styled.span`
  display: inline-flex;
  align-items: center;
  min-width: 0;
  gap: 0.4rem;
`;

const SelectSummaryBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.35rem;
  border-radius: 999px;
  background: var(--accent-9, #3e63dd);
  color: white;
  font-size: 0.75rem;
  line-height: 1;
`;

const buttonStyle = {
  minHeight: '2rem',
  whiteSpace: 'nowrap' as const,
};

const addActionButtonStyle = {
  ...buttonStyle,
  minWidth: '5.5rem',
};

export const RadixInput: FC<IInputProps> = ({
  type,
  value,
  onChange,
  className,
  disabled = false,
  id,
  name,
}) => (
  <TextField.Root
    className={className}
    style={{ width: '100%' }}
    data-test="Input"
  >
    <TextField.Input
      id={id}
      name={name}
      type={type}
      value={`${value}`}
      onChange={event => onChange(event.currentTarget.value)}
      disabled={disabled}
    />
  </TextField.Root>
);

export const RadixSelect: FC<ISelectProps> = ({
  values,
  selectedValue,
  emptyValue,
  onChange,
  className,
  disabled = false,
  id,
  name,
}) => {
  const strings = useRadixBuilderStrings();
  const placeholder = getRadixSelectPlaceholder(
    emptyValue,
    strings.form?.selectYourValue
  );

  return (
    <Select.Root
      value={selectedValue || undefined}
      onValueChange={value => onChange(value)}
      disabled={disabled}
      name={name}
      size="2"
    >
      <HiddenInput
        type="hidden"
        id={id}
        name={name}
        value={selectedValue || ''}
        readOnly
      />
      <Select.Trigger
        className={className}
        data-test="SelectTrigger"
        variant="classic"
        radius="medium"
        style={{ width: '100%' }}
        {...({ placeholder } as { placeholder: string })}
      />
      <Select.Content variant="solid" highContrast position="popper">
        {values.map(({ value, label }) => (
          <Select.Item key={value} value={value}>
            {label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
};

export const RadixSelectMulti: FC<ISelectMultiProps> = ({
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
  const strings = useRadixBuilderStrings();
  const placeholder = getRadixSelectPlaceholder(
    emptyValue,
    strings.form?.selectYourValue
  );
  const selectedLabels = values
    .filter(({ value }) => selectedValue.includes(value))
    .map(({ label }) => label);
  const summary = createSummary(selectedLabels);
  const title = summary.text ? selectedLabels.join(', ') : placeholder;

  return (
    <>
      <HiddenInput
        type="hidden"
        id={id}
        name={name}
        value={selectedValue.join(',')}
        readOnly
      />
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button
            type="button"
            variant="classic"
            className={className}
            data-test="SelectMultiTrigger"
            title={title}
            disabled={disabled}
            radius="medium"
            style={{
              ...buttonStyle,
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            <SelectTriggerText>
              <span>{summary.text || placeholder}</span>
              {summary.hiddenCount > 0 ? (
                <SelectSummaryBadge data-test="SelectMultiSummaryBadge">
                  +{summary.hiddenCount}
                </SelectSummaryBadge>
              ) : null}
            </SelectTriggerText>
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          {values.map(({ value, label }) => (
            <DropdownMenu.CheckboxItem
              key={value}
              checked={selectedValue.includes(value)}
              onCheckedChange={checked => {
                if (checked) {
                  onChange(value);
                  return;
                }

                onDelete(value);
              }}
            >
              {label}
            </DropdownMenu.CheckboxItem>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  );
};

export const RadixSwitch: FC<ISwitchProps> = ({
  switched,
  onChange,
  disabled = false,
  className,
}) => (
  <Switch
    checked={switched}
    onCheckedChange={checked => onChange?.(checked)}
    disabled={disabled}
    className={className}
    data-test="Switch"
  />
);

export const RadixAlert: FC<IAlertProps> = ({
  children,
  className,
  severity = 'warning',
  'data-test': dataTest,
}) => (
  <AlertContainer
    className={className}
    $severity={severity}
    data-test={dataTest}
  >
    {children}
  </AlertContainer>
);

export const RadixAddButton: FC<IButtonProps> = props => (
  <Button
    onClick={props.onClick}
    disabled={props.disabled}
    className={props.className}
    title={props.title}
    data-test={props['data-test']}
    variant="solid"
    style={addActionButtonStyle}
  >
    {resolveButtonContent(props)}
  </Button>
);

export const RadixRemoveButton: FC<IButtonProps> = props => (
  <Button
    onClick={props.onClick}
    disabled={props.disabled}
    className={props.className}
    title={props.title}
    data-test={props['data-test']}
    variant="surface"
    color="gray"
    style={buttonStyle}
  >
    {resolveButtonContent(props)}
  </Button>
);

export const RadixOutlinedButton: FC<IButtonProps> = props => (
  <Button
    onClick={props.onClick}
    disabled={props.disabled}
    className={props.className}
    title={props.title}
    data-test={props['data-test']}
    variant="classic"
    color="gray"
    style={buttonStyle}
  >
    {resolveButtonContent(props)}
  </Button>
);

export const RadixCloneButton: FC<ICloneButtonProps> = ({
  nodeType,
  disabled = false,
  onClick,
  className,
  title,
  'data-test': dataTest,
}) => {
  const strings = useRadixBuilderStrings();
  const resolvedTitle = getRadixCloneTitle(title, nodeType, strings);

  return (
    <IconButton
      onClick={onClick}
      disabled={disabled}
      className={className}
      title={resolvedTitle}
      aria-label={resolvedTitle}
      data-test={dataTest}
      variant="surface"
      color="gray"
    >
      <CopyIcon width={16} height={16} />
    </IconButton>
  );
};

export const RadixLockToggle: FC<ILockToggleProps> = ({
  state,
  nodeType,
  disabled = false,
  onChange,
  className,
  title,
  'data-test': dataTest,
}) => {
  const strings = useRadixBuilderStrings();
  const resolvedTitle = getRadixLockTitle(title, nodeType, state, strings);

  return (
    <IconButton
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
      variant={state === 'unlocked' ? 'surface' : 'classic'}
      color={state === 'all' ? 'blue' : state === 'self' ? 'indigo' : 'gray'}
    >
      {state === 'unlocked' ? (
        <LockOpen1Icon width={16} height={16} />
      ) : (
        <LockClosedIcon width={16} height={16} />
      )}
    </IconButton>
  );
};

export const RadixHistoryControls: FC<IHistoryControlsProps> = ({
  undoButton,
  redoButton,
  className,
}) => (
  <HistoryControlsContainer className={className}>
    {undoButton}
    {redoButton}
  </HistoryControlsContainer>
);

export const RadixRule: FC<IRuleProps> = ({
  children,
  controls,
  dragHandle,
  className,
  'data-test': dataTest,
}) => {
  const hasControls = React.Children.toArray(controls).length > 0;

  return (
    <RuleContainer
      className={className}
      data-test={dataTest}
      style={{
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
      <RuleBody $hasControls={hasControls}>{children}</RuleBody>
      {hasControls ? <RuleControls>{controls}</RuleControls> : null}
    </RuleContainer>
  );
};

export const RadixGroup: FC<IGroupProps> = ({
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
    <GroupContainer
      className={className}
      style={{
        gridTemplateColumns: dragHandle ? 'auto minmax(0, 1fr)' : 'minmax(0, 1fr)',
      }}
    >
      {dragHandle}
      <GroupBody>
        {hasHeader ? (
          <GroupHeader>
            {hasControlsLeft ? <GroupHeaderSide>{controlsLeft}</GroupHeaderSide> : null}
            {hasControlsRight ? (
              <GroupHeaderSide $right>{controlsRight}</GroupHeaderSide>
            ) : null}
          </GroupHeader>
        ) : null}
        {contentOverlay}
        {children}
      </GroupBody>
    </GroupContainer>
  );
};

export const RadixGroupHeaderOption: FC<IOptionProps> = ({
  children,
  value,
  onClick,
  disabled,
  isSelected,
  className,
}) => (
  <ConnectedGroupButton
    type="button"
    className={className}
    disabled={disabled}
    onClick={() => {
      if (!disabled) {
        onClick(value);
      }
    }}
    $selected={isSelected}
    $disabled={Boolean(disabled)}
  >
    {children}
  </ConnectedGroupButton>
);

export const RadixText: FC<{
  children?: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <Text as="span" className={className}>
    {children}
  </Text>
);

export const RadixDropZone: FC<IDropZoneProps> = props => (
  <CoreDropZone {...props} />
);

export const RadixEmptyGroupDropZone: FC<IEmptyGroupDropZoneProps> = props => (
  <CoreEmptyGroupDropZone {...props} />
);

type PopoverItemElement = React.ReactElement<IPopoverItemProps>;

export const RadixPopover: FC<IPopoverProps> = ({
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
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button
          className={className}
          data-test={dataTest}
          variant="solid"
          style={addActionButtonStyle}
        >
          {label}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {items.map((item, index) => (
          <DropdownMenu.Item
            key={`${index}-${item.props.label}`}
            onClick={event =>
              item.props.onClick(
                event as unknown as React.MouseEvent<HTMLButtonElement>
              )
            }
          >
            {item.props.label}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export const RadixPopoverItem: FC<IPopoverItemProps> = () => null;

export const RadixTextModeInput: FC<ITextModeInputProps> = ({
  value,
  onChange,
  className,
  inputClassName,
  disabled = false,
  readOnly = false,
  spellCheck = false,
  inputDataTest,
}) => (
  <TextArea
    value={value}
    onChange={event => onChange(event.currentTarget.value)}
    className={`${className || ''} ${inputClassName || ''}`.trim() || undefined}
    disabled={disabled}
    readOnly={readOnly}
    spellCheck={spellCheck}
    data-test={inputDataTest}
    style={{
      minHeight: '10rem',
      width: '100%',
      fontFamily: 'Consolas, "Courier New", monospace',
    }}
  />
);

export const RadixTextModeToggleContent: FC<ITextModeToggleContentProps> = ({
  mode,
  label,
}) => (
  <TextModeToggleContentContainer>
    {mode === 'text' ? <BuilderModeIcon /> : <TextModeIcon />}
    <span>{label}</span>
  </TextModeToggleContentContainer>
);

export const createRadixComponentSet = (): IBuilderComponentsProps => ({
  Alert: RadixAlert,
  form: {
    Input: RadixInput,
    Select: RadixSelect,
    SelectMulti: RadixSelectMulti,
    Switch: RadixSwitch,
  },
  Add: RadixAddButton,
  Remove: RadixRemoveButton,
  CloneButton: RadixCloneButton,
  OutlinedButton: RadixOutlinedButton,
  TextModeToggleContent: RadixTextModeToggleContent,
  TextModeInput: RadixTextModeInput,
  LockToggle: RadixLockToggle,
  HistoryControls: RadixHistoryControls,
  Rule: RadixRule,
  Group: RadixGroup,
  GroupHeaderOption: RadixGroupHeaderOption,
  Text: RadixText,
  DropZone: RadixDropZone,
  EmptyGroupDropZone: RadixEmptyGroupDropZone,
  Popover: RadixPopover,
  PopoverItem: RadixPopoverItem,
});
