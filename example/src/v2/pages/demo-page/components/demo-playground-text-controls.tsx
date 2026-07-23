import * as React from 'react';
import type { IDemoPlaygroundSettings } from '../types/demo-playground-settings';
import { ControlPanel } from './controls/control-panel';
import { ControlToggle } from './controls/control-toggle';

export interface IDemoPlaygroundTextControlsProps {
  settings: IDemoPlaygroundSettings;
  onSettingChange: <K extends keyof IDemoPlaygroundSettings>(
    key: K,
    value: IDemoPlaygroundSettings[K]
  ) => void;
}

export const DemoPlaygroundTextControls: React.FC<
  IDemoPlaygroundTextControlsProps
> = ({ settings, onSettingChange }) => (
  <ControlPanel title="Builder modes">
    <ControlToggle
      checked={settings.textMode}
      disabled={!settings.singleRootGroup}
      label={
        <>
          Text editor mode
          {!settings.singleRootGroup ? ' (requires single root group)' : ''}
        </>
      }
      onChange={(value) => onSettingChange('textMode', value)}
    />
    <ControlToggle
      checked={settings.defaultMode === 'text'}
      disabled={!settings.textMode}
      label={
        <>
          Open in text mode
          {!settings.textMode ? ' (requires text editor mode)' : ''}
        </>
      }
      onChange={(value) =>
        onSettingChange('defaultMode', value ? 'text' : 'builder')
      }
    />
    <ControlToggle
      checked={settings.useMonacoTextEditor}
      disabled={!settings.textMode}
      label={
        <>
          Monaco text editor
          {!settings.textMode ? ' (requires text editor mode)' : ''}
        </>
      }
      onChange={(value) => onSettingChange('useMonacoTextEditor', value)}
    />
    <ControlToggle
      checked={settings.singleRootGroup}
      label="Single root group"
      onChange={(value) => onSettingChange('singleRootGroup', value)}
    />
  </ControlPanel>
);
