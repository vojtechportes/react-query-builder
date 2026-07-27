import React, { FC, useContext, useMemo } from 'react';
import { CopyIcon, LockClosedIcon, LockOpen1Icon } from '@radix-ui/react-icons';
import {
  Button,
  DropdownMenu,
  IconButton,
  Switch,
  Text,
  TextArea,
  TextField,
} from '@radix-ui/themes';
import { IButtonProps } from '../../../../builder/components/button';
import { IBuilderComponentsProps } from '../../../../builder';
import { ITextModeInputProps } from '../../../../builder/text-mode/types/text-mode-input-props';
import { BuilderContext } from '../../../../builder/context';
import { ICloneButtonProps } from '../../../../builder/components/clone-button';
import { DropZone as CoreDropZone } from '../../../../builder/drag-and-drop/components/drop-zone';
import { EmptyGroupDropZone as CoreEmptyGroupDropZone } from '../../../../builder/drag-and-drop/components/empty-group-drop-zone';
import { IEmptyGroupDropZoneProps } from '../../../../builder/drag-and-drop/components/empty-group-drop-zone';
import { IDropZoneProps } from '../../../../builder/drag-and-drop/components/drop-zone';
import { IInputProps } from '../../../../builder/components/form-controls/input';
import { ISwitchProps } from '../../../../builder/components/form-controls/switch';
import { ILockToggleProps } from '../../../../builder/components/lock-toggle';
import { IPopoverItemProps } from '../../../../builder/components/popover-item';
import { IPopoverProps } from '../../../../builder/components/popover';
import {
  BuilderLockState,
  getNextGroupLockState,
  getNextRuleLockState,
} from '../../../../builder/read-only/utils/lock-state.util';
import { getCloneButtonTitle } from '../../../../builder/utils/get-clone-button-title.util';
import { getLockToggleTitle } from '../../../../builder/utils/get-lock-toggle-title.util';
import { RadixAlert } from './components/radix-alert';
import { RadixGroup } from './components/radix-group';
import { RadixGroupHeaderOption } from './components/radix-group-header-option';
import { RadixHistoryControls } from './components/radix-history-controls';
import { RadixRule } from './components/radix-rule';
import { RadixSelect } from './components/radix-select';
import { RadixSelectMulti } from './components/radix-select-multi';
import { RadixTextModeToggleContent } from './components/radix-text-mode-toggle-content';

export {
  RadixAlert,
  RadixGroup,
  RadixGroupHeaderOption,
  RadixHistoryControls,
  RadixRule,
  RadixSelect,
  RadixSelectMulti,
  RadixTextModeToggleContent,
};

const useRadixBuilderStrings = () => useContext(BuilderContext).strings;

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
      onChange={(event) => onChange(event.currentTarget.value)}
      disabled={disabled}
    />
  </TextField.Root>
);

export const RadixSwitch: FC<ISwitchProps> = ({
  switched,
  onChange,
  disabled = false,
  className,
}) => (
  <Switch
    checked={switched}
    onCheckedChange={(checked) => onChange?.(checked)}
    disabled={disabled}
    className={className}
    data-test="Switch"
  />
);

export const RadixAddButton: FC<IButtonProps> = (props) => (
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

export const RadixRemoveButton: FC<IButtonProps> = (props) => (
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

export const RadixOutlinedButton: FC<IButtonProps> = (props) => (
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

export const RadixText: FC<{
  children?: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <Text as="span" className={className}>
    {children}
  </Text>
);

export const RadixDropZone: FC<IDropZoneProps> = (props) => (
  <CoreDropZone {...props} />
);

export const RadixEmptyGroupDropZone: FC<IEmptyGroupDropZoneProps> = (
  props
) => <CoreEmptyGroupDropZone {...props} />;

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
        .map((child) => child as PopoverItemElement),
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
            onClick={(event) =>
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
    onChange={(event) => onChange(event.currentTarget.value)}
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
