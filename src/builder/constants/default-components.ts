import { Alert } from '../../alert';
import { Button } from '../../button';
import { CloneButton } from '../../clone-button';
import { DropZone } from '../../drop-zone';
import { EmptyGroupDropZone } from '../../empty-group-drop-zone';
import { Input } from '../../form/input';
import { Select } from '../../form/select';
import { SelectMulti } from '../../form/select-multi';
import { Switch } from '../../form/switch';
import { Group } from '../../group/group-container';
import { Option as GroupHeaderOption } from '../../group/option';
import { LockToggle } from '../../lock-toggle';
import { OutlinedButton } from '../../outlined-button';
import { Popover } from '../../popover';
import { PopoverItem } from '../../popover-item';
import { Rule } from '../../rule/rule-container';
import { SecondaryButton } from '../../secondary-button';
import { Text } from '../../text';
import { HistoryControls } from '../components/history-controls';
import { TextModeToggleContent } from '../components/text-mode-toggle-content';
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
