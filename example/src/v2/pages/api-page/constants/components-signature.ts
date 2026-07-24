export const componentsSignature = `export interface IBuilderComponentsProps {
  Alert?: React.ComponentType<IAlertProps>;
  form?: {
    Select?: React.ComponentType<ISelectProps>;
    SelectMulti?: React.ComponentType<ISelectMultiProps>;
    Switch?: React.ComponentType<ISwitchProps>;
    Input?: React.ComponentType<IInputProps>;
  };
  Remove?: React.ComponentType<IButtonProps>;
  Add?: React.ComponentType<IButtonProps>;
  OutlinedButton?: React.ComponentType<IButtonProps>;
  TextModeToggleContent?: React.ComponentType<ITextModeToggleContentProps>;
  TextModeEditor?: React.ComponentType<ITextModeEditorProps>;
  TextModeInput?: React.ComponentType<ITextModeInputProps>;
  CloneButton?: React.ComponentType<ICloneButtonProps>;
  LockToggle?: React.ComponentType<ILockToggleProps>;
  HistoryControls?: React.ComponentType<IHistoryControlsProps>;
  Rule?: React.ComponentType<IRuleContainerProps>;
  Group?: React.ComponentType<IGroupContainerProps>;
  GroupHeaderOption?: React.ComponentType<IGroupHeaderOptionProps>;
  Text?: React.ComponentType<React.ComponentProps<typeof Text>>;
  DropZone?: React.ComponentType<IDropZoneProps>;
  EmptyGroupDropZone?: React.ComponentType<IEmptyGroupDropZoneProps>;
  Popover?: React.ComponentType<IPopoverProps>;
  PopoverItem?: React.ComponentType<IPopoverItemProps>;
}`;
