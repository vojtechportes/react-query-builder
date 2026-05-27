import { IBuilderComponentsProps } from '../../../builder';
import { MuiAlertComponent } from './mui-alert';
import { MuiAddButton } from './mui-add-button';
import { MuiCloneButton } from './mui-clone-button';
import { MuiDropZone } from './mui-drop-zone';
import { MuiEmptyGroupDropZone } from './mui-empty-group-drop-zone';
import { MuiGroup } from './mui-group';
import { MuiGroupHeaderOption } from './mui-group-header-option';
import { MuiHistoryControls } from './mui-history-controls';
import { MuiInput } from './mui-input';
import { MuiLockToggle } from './mui-lock-toggle';
import { MuiOutlinedButton } from './mui-outlined-button';
import { MuiPopover } from './mui-popover';
import { MuiPopoverItem } from './mui-popover-item';
import { MuiRemoveButton } from './mui-remove-button';
import { MuiRule } from './mui-rule';
import { MuiSelect } from './mui-select';
import { MuiSelectMulti } from './mui-select-multi';
import { MuiSwitch } from './mui-switch';
import { MuiText } from './mui-text';
import { MuiTextModeInput } from './mui-text-mode-input';
import { MuiTextModeToggleContent } from './mui-text-mode-toggle-content';

export const createMuiComponentSet = (): IBuilderComponentsProps => ({
  Alert: MuiAlertComponent,
  form: {
    Input: MuiInput,
    Select: MuiSelect,
    SelectMulti: MuiSelectMulti,
    Switch: MuiSwitch,
  },
  Add: MuiAddButton,
  Remove: MuiRemoveButton,
  CloneButton: MuiCloneButton,
  OutlinedButton: MuiOutlinedButton,
  TextModeToggleContent: MuiTextModeToggleContent,
  TextModeInput: MuiTextModeInput,
  LockToggle: MuiLockToggle,
  HistoryControls: MuiHistoryControls,
  Rule: MuiRule,
  Group: MuiGroup,
  GroupHeaderOption: MuiGroupHeaderOption,
  Text: MuiText,
  DropZone: MuiDropZone,
  EmptyGroupDropZone: MuiEmptyGroupDropZone,
  Popover: MuiPopover,
  PopoverItem: MuiPopoverItem,
});
