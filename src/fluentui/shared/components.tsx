import React, { FC, useContext, useMemo } from 'react';
import styled from 'styled-components';
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
import { BuilderLockState, getNextGroupLockState, getNextRuleLockState } from '../../utils/lock-state';
import { getCloneButtonTitle } from '../../utils/get-clone-button-title.util';
import { getLockToggleTitle } from '../../utils/get-lock-toggle-title.util';
import { createSummary } from '../../widgets/select-multi/utils/create-summary.util';

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

const StyledBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.35rem;
  border-radius: 999px;
  background: ${theme.palette.themePrimary};
  color: ${theme.palette.white};
  font-size: 0.75rem;
  line-height: 1;
`;

const RuleContainer = styled.div`
  display: grid;
  margin-top: 0.5rem;
  border: 1px solid ${theme.palette.neutralLight};
  background: ${theme.palette.white};
`;

const RuleBody = styled.div<{ $hasControls: boolean }>`
  min-width: 0;
  padding: 0.875rem;
  padding-right: ${({ $hasControls }) => ($hasControls ? '0' : '0.875rem')};
`;

const RuleControls = styled.div`
  display: grid;
  grid-auto-columns: min-content;
  grid-auto-flow: column;
  gap: 0.5rem;
  align-self: start;
  padding: 0.875rem;

  @media (max-width: 900px) {
    padding-left: 0.5rem;
  }
`;

const GroupContainer = styled.div`
  display: grid;
  margin-top: 0.5rem;
  border: 1px solid ${theme.palette.neutralLight};
  background: ${theme.palette.neutralLighterAlt};
`;

const GroupBody = styled.div`
  position: relative;
  padding: 0.875rem;
`;

const GroupHeader = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: minmax(0, 1fr) auto;
  padding-bottom: 0.875rem;
  border-bottom: 1px solid ${theme.palette.neutralLight};

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
    ${({ $right }) =>
      $right
        ? `
      grid-auto-flow: row;
      grid-template-columns: repeat(3, minmax(0, max-content));
    `
        : ''}
  }
`;

const ConnectedGroupButton = styled.button<{
  $selected: boolean;
  $disabled: boolean;
}>`
  position: relative;
  min-width: 4.75rem;
  min-height: 2rem;
  padding: 0 0.9rem;
  margin: 0;
  border: 1px solid
    ${({ $selected, $disabled }) =>
      $disabled
        ? $selected
          ? theme.palette.neutralSecondary
          : theme.palette.neutralTertiary
        : theme.palette.neutralPrimary};
  border-right-width: ${({ $selected }) => ($selected ? '1px' : '0')};
  background: ${({ $selected, $disabled }) =>
    $disabled
      ? $selected
        ? theme.palette.neutralQuaternaryAlt
        : theme.palette.neutralLight
      : $selected
        ? theme.palette.themePrimary
        : theme.palette.neutralTertiary};
  color: ${({ $selected, $disabled }) =>
    $disabled
      ? $selected
        ? theme.palette.neutralPrimary
        : theme.palette.neutralTertiaryAlt
      : theme.palette.white};
  font-size: 0.7rem;
  font-weight: 700;
  line-height: 1;
  text-transform: uppercase;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  z-index: ${({ $selected }) => ($selected ? 2 : 0)};
  transition:
    background-color 120ms ease,
    border-color 120ms ease,
    color 120ms ease;

  &:first-child {
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }

  &:last-child {
    border-right-width: 1px;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
  }

  &:not(:first-child) {
    margin-left: -1px;
  }

  &:hover {
    background: ${({ $selected, $disabled }) =>
      $disabled
        ? $selected
          ? theme.palette.neutralQuaternaryAlt
          : theme.palette.neutralLight
        : $selected
          ? theme.palette.themeDark
          : theme.palette.neutralSecondary};
    z-index: ${({ $selected }) => ($selected ? 2 : 1)};
  }

  &:focus-visible {
    z-index: 2;
    outline: 2px solid ${theme.palette.themeLight};
    outline-offset: -2px;
  }

`;

const CloneSvg: FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      fill="currentColor"
      d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"
    />
  </svg>
);

const LockStateSvg: FC<{ state: BuilderLockState }> = ({ state }) => {
  if (state === 'unlocked') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M10 13C11.1 13 12 13.89 12 15C12 16.11 11.11 17 10 17S8 16.11 8 15 8.9 13 10 13M18 1C15.24 1 13 3.24 13 6V8H4C2.9 8 2 8.9 2 10V20C2 21.1 2.9 22 4 22H16C17.1 22 18 21.1 18 20V10C18 8.9 17.1 8 16 8H15V6C15 4.34 16.34 3 18 3S21 4.34 21 6V8H23V6C23 3.24 20.76 1 18 1M16 10V20H4V10H16Z"
        />
      </svg>
    );
  }

  if (state === 'self') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M12,17C10.89,17 10,16.1 10,15C10,13.89 10.89,13 12,13A2,2 0 0,1 14,15A2,2 0 0,1 12,17M18,20V10H6V20H18M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V10C4,8.89 4.89,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"
        />
      </svg>
    );
  }

  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
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
  const strings = useFluentUiBuilderStrings();
  const placeholder = getFluentUiSelectPlaceholder(
    emptyValue,
    strings.form?.selectYourValue
  );
  const options = useMemo<IDropdownOption[]>(
    () => values.map(({ value, label }) => ({ key: value, text: label })),
    [values]
  );
  const selectedLabels = values
    .filter(({ value }) => selectedValue.includes(value))
    .map(({ label }) => label);
  const summary = createSummary(selectedLabels);
  const title = summary.text ? selectedLabels.join(', ') : placeholder;

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
              <StyledBadge data-test="SelectMultiSummaryBadge">
                +{summary.hiddenCount}
              </StyledBadge>
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

export const FluentUiAddButton: FC<IButtonProps> = props => (
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

export const FluentUiRemoveButton: FC<IButtonProps> = props => (
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

export const FluentUiOutlinedButton: FC<IButtonProps> = props => (
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

export const FluentUiRule: FC<IRuleProps> = ({
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

export const FluentUiGroup: FC<IGroupProps> = ({
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

export const FluentUiGroupHeaderOption: FC<IOptionProps> = ({
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
    $disabled={disabled}
  >
    {children}
  </ConnectedGroupButton>
);

export const FluentUiText: FC<{
  children?: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <Text as="span" className={className}>
    {children}
  </Text>
);

export const FluentUiDropZone: FC<IDropZoneProps> = props => (
  <CoreDropZone {...props} />
);

export const FluentUiEmptyGroupDropZone: FC<IEmptyGroupDropZoneProps> = props => (
  <CoreEmptyGroupDropZone {...props} />
);

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
            onClick: event =>
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

export const FluentUiTextModeToggleContent: FC<ITextModeToggleContentProps> = ({
  mode,
  label,
}) => (
  <TextModeToggleContentContainer>
    {mode === 'text' ? <BuilderModeIcon /> : <TextModeIcon />}
    <span>{label}</span>
  </TextModeToggleContentContainer>
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
