import { Alert } from '../components/alert';
import { Button } from '../components/button';
import { CloneButton } from '../components/clone-button';
import { DropZone } from '../drag-and-drop/components/drop-zone';
import { EmptyGroupDropZone } from '../drag-and-drop/components/empty-group-drop-zone';
import { Input } from '../components/form-controls/input';
import { Select } from '../components/form-controls/select';
import { SelectMulti } from '../components/form-controls/select-multi';
import { Switch } from '../components/form-controls/switch';
import { Group } from '../components/group/components/group-container';
import { Option as GroupHeaderOption } from '../components/group/components/option';
import { LockToggle } from '../components/lock-toggle';
import { OutlinedButton } from '../components/outlined-button';
import { Popover } from '../components/popover';
import { PopoverItem } from '../components/popover-item';
import { Rule } from '../components/rule/rule-container';
import { SecondaryButton } from '../components/secondary-button';
import { Text } from '../components/text';
import { HistoryControls } from '../history/components/history-controls';
import { TextModeToggleContent } from '../text-mode/components/text-mode-toggle-content';
import { TextModeEditor } from '../text-mode/components/text-mode-editor';
import { TextModeInput } from '../text-mode/components/text-mode-input';
import { IResolvedBuilderComponentsProps } from '../types';

export const defaultComponents: IResolvedBuilderComponentsProps = {
  Alert,
  form: {
    Input,
    Select,
    SelectMulti,
    Switch,
  },
  Remove: SecondaryButton,
  Add: Button,
  OutlinedButton,
  TextModeToggleContent,
  TextModeEditor,
  TextModeInput,
  CloneButton,
  LockToggle,
  HistoryControls,
  Rule,
  Group,
  GroupHeaderOption,
  Text,
  DropZone,
  EmptyGroupDropZone,
  Popover,
  PopoverItem,
};
