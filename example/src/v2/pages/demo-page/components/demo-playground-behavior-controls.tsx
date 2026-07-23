import * as React from 'react';
import type { IDemoPlaygroundSettings } from '../types/demo-playground-settings';
import { ControlPanel } from './controls/control-panel';
import { ControlToggle } from './controls/control-toggle';

export interface IDemoPlaygroundBehaviorControlsProps {
  settings: IDemoPlaygroundSettings;
  onSettingChange: <K extends keyof IDemoPlaygroundSettings>(
    key: K,
    value: IDemoPlaygroundSettings[K]
  ) => void;
}

export const DemoPlaygroundBehaviorControls: React.FC<
  IDemoPlaygroundBehaviorControlsProps
> = ({ settings, onSettingChange }) => (
  <ControlPanel title="Behavior">
    <ControlToggle
      checked={settings.readOnly}
      label="Read-only mode"
      onChange={(value) => onSettingChange('readOnly', value)}
    />
    <ControlToggle
      checked={settings.lockable}
      label="Lock controls"
      onChange={(value) => onSettingChange('lockable', value)}
    />
    <ControlToggle
      checked={settings.readOnlyProtectsDelete}
      label="Read-only protects group delete"
      onChange={(value) => onSettingChange('readOnlyProtectsDelete', value)}
    />
    <ControlToggle
      checked={settings.cloneable}
      label="Clone controls"
      onChange={(value) => onSettingChange('cloneable', value)}
    />
    <ControlToggle
      checked={settings.draggable}
      label="Draggable nodes"
      onChange={(value) => onSettingChange('draggable', value)}
    />
    <ControlToggle
      checked={settings.allowGroupNegation}
      label="Allow group negation"
      onChange={(value) => onSettingChange('allowGroupNegation', value)}
    />
    <ControlToggle
      checked={settings.allowFieldComparisons}
      label="Allow field comparisons"
      onChange={(value) => onSettingChange('allowFieldComparisons', value)}
    />
    <ControlToggle
      checked={settings.history}
      label="Undo / redo history"
      onChange={(value) => onSettingChange('history', value)}
    />
    <ControlToggle
      checked={settings.showValidation}
      label="Show validation errors"
      onChange={(value) => onSettingChange('showValidation', value)}
    />
  </ControlPanel>
);
