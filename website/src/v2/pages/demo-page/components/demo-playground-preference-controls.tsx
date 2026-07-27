import * as React from 'react';
import { localeOptions } from '../constants/locale-options';
import type { IDemoPlaygroundSettings } from '../types/demo-playground-settings';
import type { LocaleId } from '../types/locale-id';
import { ControlPanel } from './controls/control-panel';
import { ControlSelect } from './controls/control-select';

export interface IDemoPlaygroundPreferenceControlsProps {
  settings: IDemoPlaygroundSettings;
  onSettingChange: <K extends keyof IDemoPlaygroundSettings>(
    key: K,
    value: IDemoPlaygroundSettings[K]
  ) => void;
}

export const DemoPlaygroundPreferenceControls: React.FC<
  IDemoPlaygroundPreferenceControlsProps
> = ({ settings, onSettingChange }) => (
  <ControlPanel title="Preferences">
    <ControlSelect
      label="New node placement"
      value={settings.newNodePlacement}
      onChange={(value) =>
        onSettingChange(
          'newNodePlacement',
          value as IDemoPlaygroundSettings['newNodePlacement']
        )
      }
    >
      <option value="append">Append to end</option>
      <option value="prepend">Prepend to start</option>
    </ControlSelect>
    <ControlSelect
      label="Locale"
      value={settings.locale}
      onChange={(value) => onSettingChange('locale', value as LocaleId)}
    >
      {localeOptions.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </ControlSelect>
  </ControlPanel>
);
