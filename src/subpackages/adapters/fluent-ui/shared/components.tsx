import React, { FC, useContext, useMemo } from 'react';
import {
  DefaultButton,
  Dropdown,
  getTheme,
  IconButton,
  IDropdownOption,
  IContextualMenuItem,
  initializeIcons,
  MessageBar,
  MessageBarType,
  PrimaryButton,
  Stack,
  Text,
  TextField,
  Toggle,
} from '@fluentui/react';
import { IAlertProps } from '../../../../builder/components/alert';
import { IButtonProps } from '../../../../builder/components/button';
import {
  IBuilderComponentsProps,
  IHistoryControlsProps,
} from '../../../../builder';
import { ITextModeInputProps } from '../../../../builder/text-mode/types/text-mode-input-props';
import { BuilderContext } from '../../../../builder/context';
import { ICloneButtonProps } from '../../../../builder/components/clone-button';
import { DropZone as CoreDropZone } from '../../../../builder/drag-and-drop/components/drop-zone';
import { EmptyGroupDropZone as CoreEmptyGroupDropZone } from '../../../../builder/drag-and-drop/components/empty-group-drop-zone';
import { IDropZoneProps } from '../../../../builder/drag-and-drop/components/drop-zone';
import { IEmptyGroupDropZoneProps } from '../../../../builder/drag-and-drop/components/empty-group-drop-zone';
import { IInputProps } from '../../../../builder/components/form-controls/input';
import { ISelectProps } from '../../../../builder/components/form-controls/select';
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
import { FluentUiGroup } from './components/fluent-ui-group';
import { FluentUiGroupHeaderOption } from './components/fluent-ui-group-header-option';
import { FluentUiRule } from './components/fluent-ui-rule';
import { FluentUiSelectMulti } from './components/fluent-ui-select-multi';
import { FluentUiTextModeToggleContent } from './components/fluent-ui-text-mode-toggle-content';

const theme = getTheme();
initializeIcons();

const useFluentUiBuilderStrings = () => useContext(BuilderContext).strings;

const getFluentUiSelectPlaceholder = (
  placeholder: string | undefined,
  fallback: string | undefined
) => placeholder || fallback || 'Select your value';

const getFluentUiCloneTitle = (
  title: string | undefined,
  nodeType: 'rule' | 'group',
  fallbackStrings: ReturnType<typeof useFluentUiBuilderStrings>
) => title || getCloneButtonTitle(fallbackStrings, nodeType);

const getFluentUiLockTitle = (
  title: string | undefined,
  nodeType: 'rule' | 'group',
  state: BuilderLockState,
  fallbackStrings: ReturnType<typeof useFluentUiBuilderStrings>
) => title || getLockToggleTitle(fallbackStrings, nodeType, state);

const resolveButtonContent = ({ children, label }: IButtonProps) =>
  children || label;

const buttonStyles = {
  root: {
    minHeight: '2rem',
    whiteSpace: 'nowrap',
  },
  label: {
    whiteSpace: 'nowrap',
  },
};

const CloneSvg: FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path
      fill="currentColor"
      d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"
    />
  </svg>
);

const LockStateSvg: FC<{ state: BuilderLockState }> = ({ state }) => {
  if (state === 'unlocked') {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <path
          fill="currentColor"
          d="M10 13C11.1 13 12 13.89 12 15C12 16.11 11.11 17 10 17S8 16.11 8 15 8.9 13 10 13M18 1C15.24 1 13 3.24 13 6V8H4C2.9 8 2 8.9 2 10V20C2 21.1 2.9 22 4 22H16C17.1 22 18 21.1 18 20V10C18 8.9 17.1 8 16 8H15V6C15 4.34 16.34 3 18 3S21 4.34 21 6V8H23V6C23 3.24 20.76 1 18 1M16 10V20H4V10H16Z"
        />
      </svg>
    );
  }

  if (state === 'self') {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <path
          fill="currentColor"
          d="M12,17C10.89,17 10,16.1 10,15C10,13.89 10.89,13 12,13A2,2 0 0,1 14,15A2,2 0 0,1 12,17M18,20V10H6V20H18M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V10C4,8.89 4.89,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"
        />
      </svg>
    );
  }

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"
      />
    </svg>
  );
};

export const FluentUiInput: FC<IInputProps> = ({
  type,
  value,
  onChange,
  className,
  disabled = false,
  id,
  name,
}) => (
  <TextField
    id={id}
    name={name}
    type={type}
    value={`${value}`}
    onChange={(_, nextValue) => onChange(nextValue || '')}
    className={className}
    disabled={disabled}
    styles={{
      root: { width: '100%' },
      fieldGroup: { minHeight: '32px' },
    }}
    data-test="Input"
  />
);

export const FluentUiSelect: FC<ISelectProps> = ({
  values,
  selectedValue,
  emptyValue,
  onChange,
  className,
  disabled = false,
  id,
}) => {
  const strings = useFluentUiBuilderStrings();
  const placeholder = getFluentUiSelectPlaceholder(
    emptyValue,
    strings.form?.selectYourValue
  );
  const options = useMemo<IDropdownOption[]>(
    () => values.map(({ value, label }) => ({ key: value, text: label })),
    [values]
  );

  return (
    <Dropdown
      id={id}
      selectedKey={selectedValue || undefined}
      options={options}
      placeholder={placeholder}
      onChange={(_, option) => {
        if (option) {
          onChange(String(option.key));
        }
      }}
      className={className}
      disabled={disabled}
      styles={{ root: { width: '100%' } }}
      data-test="SelectTrigger"
    />
  );
};

export const FluentUiSwitch: FC<ISwitchProps> = ({
  switched,
  onChange,
  disabled = false,
  className,
}) => (
  <Toggle
    checked={switched}
    onChange={(_, checked) => onChange?.(Boolean(checked))}
    disabled={disabled}
    className={className}
    onText=""
    offText=""
    inlineLabel
    styles={{ root: { marginBottom: 0 } }}
    data-test="Switch"
  />
);

export const FluentUiAlert: FC<IAlertProps> = ({
  children,
  className,
  severity = 'warning',
  'data-test': dataTest,
}) => {
  const messageBarType =
    severity === 'error'
      ? MessageBarType.error
      : severity === 'success'
        ? MessageBarType.success
        : severity === 'info'
          ? MessageBarType.info
          : MessageBarType.warning;

  return (
    <MessageBar
      className={className}
      messageBarType={messageBarType}
      isMultiline
      data-test={dataTest}
    >
      {children}
    </MessageBar>
  );
};

export const FluentUiAddButton: FC<IButtonProps> = (props) => (
  <PrimaryButton
    onClick={props.onClick}
    disabled={props.disabled}
    className={props.className}
    title={props.title}
    data-test={props['data-test']}
    styles={buttonStyles}
  >
    {resolveButtonContent(props)}
  </PrimaryButton>
);

export const FluentUiRemoveButton: FC<IButtonProps> = (props) => (
  <DefaultButton
    onClick={props.onClick}
    disabled={props.disabled}
    className={props.className}
    title={props.title}
    data-test={props['data-test']}
    styles={buttonStyles}
  >
    {resolveButtonContent(props)}
  </DefaultButton>
);

export const FluentUiOutlinedButton: FC<IButtonProps> = (props) => (
  <DefaultButton
    onClick={props.onClick}
    disabled={props.disabled}
    className={props.className}
    title={props.title}
    data-test={props['data-test']}
    styles={{
      ...buttonStyles,
      label: {
        textTransform: 'none',
        whiteSpace: 'nowrap',
      },
    }}
  >
    {resolveButtonContent(props)}
  </DefaultButton>
);

export const FluentUiCloneButton: FC<ICloneButtonProps> = ({
  nodeType,
  disabled = false,
  onClick,
  className,
  title,
  'data-test': dataTest,
}) => {
  const strings = useFluentUiBuilderStrings();
  const resolvedTitle = getFluentUiCloneTitle(title, nodeType, strings);

  return (
    <IconButton
      onClick={onClick}
      disabled={disabled}
      className={className}
      title={resolvedTitle}
      ariaLabel={resolvedTitle}
      data-test={dataTest}
    >
      <CloneSvg />
    </IconButton>
  );
};

export const FluentUiLockToggle: FC<ILockToggleProps> = ({
  state,
  nodeType,
  disabled = false,
  onChange,
  className,
  title,
  'data-test': dataTest,
}) => {
  const strings = useFluentUiBuilderStrings();
  const resolvedTitle = getFluentUiLockTitle(title, nodeType, state, strings);

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
      ariaLabel={resolvedTitle}
      data-test={dataTest}
      styles={{
        root: {
          color:
            state === 'unlocked'
              ? theme.palette.neutralSecondary
              : theme.palette.themePrimary,
          border: `1px solid ${
            state === 'unlocked'
              ? theme.palette.neutralLight
              : theme.palette.themePrimary
          }`,
        },
      }}
    >
      <LockStateSvg state={state} />
    </IconButton>
  );
};

export const FluentUiHistoryControls: FC<IHistoryControlsProps> = ({
  undoButton,
  redoButton,
  className,
}) => (
  <Stack horizontal tokens={{ childrenGap: 8 }} className={className}>
    {undoButton}
    {redoButton}
  </Stack>
);

export const FluentUiText: FC<{
  children?: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <Text as="span" className={className}>
    {children}
  </Text>
);

export const FluentUiDropZone: FC<IDropZoneProps> = (props) => (
  <CoreDropZone {...props} />
);

export const FluentUiEmptyGroupDropZone: FC<IEmptyGroupDropZoneProps> = (
  props
) => <CoreEmptyGroupDropZone {...props} />;

type PopoverItemElement = React.ReactElement<IPopoverItemProps>;

export const FluentUiPopover: FC<IPopoverProps> = ({
  label,
  children,
  className,
  'data-test': dataTest,
}) => {
  const items = useMemo<IContextualMenuItem[]>(
    () =>
      React.Children.toArray(children)
        .filter(React.isValidElement)
        .map((child, index) => {
          const element = child as PopoverItemElement;

          return {
            key: `${index}-${element.props.label}`,
            text: element.props.label,
            onClick: (event) =>
              element.props.onClick(
                event as unknown as React.MouseEvent<HTMLButtonElement>
              ),
          };
        }),
    [children]
  );

  return (
    <DefaultButton
      className={className}
      data-test={dataTest}
      styles={buttonStyles}
      menuProps={{ items }}
    >
      {label}
    </DefaultButton>
  );
};

export const FluentUiPopoverItem: FC<IPopoverItemProps> = () => null;

export const FluentUiTextModeInput: FC<ITextModeInputProps> = ({
  value,
  onChange,
  className,
  inputClassName,
  disabled = false,
  readOnly = false,
  spellCheck = false,
  inputDataTest,
}) => (
  <TextField
    value={value}
    onChange={(_, nextValue) => onChange(nextValue || '')}
    className={className}
    disabled={disabled}
    readOnly={readOnly}
    spellCheck={spellCheck}
    multiline
    resizable
    rows={6}
    inputClassName={inputClassName}
    data-test={inputDataTest}
    styles={{
      root: { width: '100%' },
      fieldGroup: { minHeight: '10rem' },
      field: {
        fontFamily: 'Consolas, "Courier New", monospace',
      },
    }}
  />
);

export const createFluentUiComponentSet = (): IBuilderComponentsProps => ({
  Alert: FluentUiAlert,
  form: {
    Input: FluentUiInput,
    Select: FluentUiSelect,
    SelectMulti: FluentUiSelectMulti,
    Switch: FluentUiSwitch,
  },
  Add: FluentUiAddButton,
  Remove: FluentUiRemoveButton,
  CloneButton: FluentUiCloneButton,
  OutlinedButton: FluentUiOutlinedButton,
  TextModeToggleContent: FluentUiTextModeToggleContent,
  TextModeInput: FluentUiTextModeInput,
  LockToggle: FluentUiLockToggle,
  HistoryControls: FluentUiHistoryControls,
  Rule: FluentUiRule,
  Group: FluentUiGroup,
  GroupHeaderOption: FluentUiGroupHeaderOption,
  Text: FluentUiText,
  DropZone: FluentUiDropZone,
  EmptyGroupDropZone: FluentUiEmptyGroupDropZone,
  Popover: FluentUiPopover,
  PopoverItem: FluentUiPopoverItem,
});

export {
  FluentUiGroup,
  FluentUiGroupHeaderOption,
  FluentUiRule,
  FluentUiSelectMulti,
  FluentUiTextModeToggleContent,
};
