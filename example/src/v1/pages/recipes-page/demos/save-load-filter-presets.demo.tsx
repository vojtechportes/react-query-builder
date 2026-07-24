import * as React from 'react';
import {
  Builder,
  type DenormalizedQuery,
  type IBuilderFieldProps,
} from '@vojtechportes/react-query-builder';
import { RecipeBuilderSurface } from '../components/recipe-builder-surface';
import { RecipeDemoFrame } from '../components/recipe-demo-frame';
import { RecipeDemoGroup } from '../components/recipe-demo-group';
import { RecipeDemoOutput } from '../components/recipe-demo-output';
import type { IRecipeFilterPreset } from '../types/recipe-filter-preset';
import { cloneRecipeQuery } from '../utils/clone-recipe-query.util';
import { isRecipeFilterPreset } from '../utils/is-recipe-filter-preset.util';

const storageKey = 'react-query-builder-recipe-presets-v1';
const fields: IBuilderFieldProps[] = [
  {
    field: 'region',
    label: 'Region',
    type: 'LIST',
    operators: ['EQUAL', 'NOT_EQUAL'],
    value: [
      { label: 'Europe', value: 'EU' },
      { label: 'United States', value: 'US' },
      { label: 'Canada', value: 'CA' },
    ],
  },
  {
    field: 'revenue',
    label: 'Revenue',
    type: 'NUMBER',
    operators: ['EQUAL', 'LARGER_EQUAL', 'SMALLER_EQUAL'],
  },
];
const presetQueryValidation = {
  allowedFields: ['region', 'revenue'],
  allowedOperators: ['EQUAL', 'NOT_EQUAL', 'LARGER_EQUAL', 'SMALLER_EQUAL'],
} as const;
const initialQuery: DenormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: [{ field: 'region', operator: 'EQUAL', value: 'EU' }],
  },
];

export const SaveLoadFilterPresetsDemo: React.FC = () => {
  const [query, setQuery] = React.useState(() =>
    cloneRecipeQuery(initialQuery)
  );
  const [name, setName] = React.useState('European customers');
  const [selectedId, setSelectedId] = React.useState('');
  const [message, setMessage] = React.useState('No preset action yet.');
  const [presets, setPresets] = React.useState<IRecipeFilterPreset[]>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return [];
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed)
        ? parsed.filter((value) =>
            isRecipeFilterPreset(value, presetQueryValidation)
          )
        : [];
    } catch {
      return [];
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(presets));
    } catch {
      setMessage('Browser storage is unavailable.');
    }
  }, [presets]);

  const save = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setMessage('Enter a preset name.');
      return;
    }
    const preset: IRecipeFilterPreset = {
      id: `${Date.now()}`,
      name: trimmedName,
      version: 1,
      query: cloneRecipeQuery(query),
    };
    setPresets((current) => [...current, preset]);
    setSelectedId(preset.id);
    setMessage(`Saved "${trimmedName}".`);
  };

  const load = () => {
    const preset = presets.find((item) => item.id === selectedId);
    if (!preset || !isRecipeFilterPreset(preset, presetQueryValidation)) {
      setMessage('Choose a valid preset to load.');
      return;
    }
    setQuery(cloneRecipeQuery(preset.query));
    setName(preset.name);
    setMessage(`Loaded "${preset.name}".`);
  };

  const rename = () => {
    const trimmedName = name.trim();
    if (!selectedId || !trimmedName) {
      setMessage('Choose a preset and enter its new name.');
      return;
    }
    setPresets((current) =>
      current.map((preset) =>
        preset.id === selectedId ? { ...preset, name: trimmedName } : preset
      )
    );
    setMessage(`Renamed preset to "${trimmedName}".`);
  };

  const remove = () => {
    if (!selectedId) return;
    setPresets((current) =>
      current.filter((preset) => preset.id !== selectedId)
    );
    setSelectedId('');
    setMessage('Deleted the selected preset.');
  };

  return (
    <RecipeDemoFrame
      title="Filter presets saved in this browser"
      note="This demo validates presets before saving them in your browser. They are not uploaded or shared across devices."
      actions={
        <>
          <button type="button" onClick={save}>
            Save new
          </button>
          <button type="button" onClick={load} disabled={!selectedId}>
            Load
          </button>
          <button type="button" onClick={rename} disabled={!selectedId}>
            Rename
          </button>
          <button type="button" onClick={remove} disabled={!selectedId}>
            Delete
          </button>
        </>
      }
    >
      <RecipeDemoGroup>
        <label htmlFor="recipe-preset-name">Preset name</label>
        <input
          id="recipe-preset-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </RecipeDemoGroup>
      <RecipeDemoGroup>
        <label htmlFor="recipe-preset-select">Saved presets</label>
        <select
          id="recipe-preset-select"
          value={selectedId}
          onChange={(event) => setSelectedId(event.target.value)}
        >
          <option value="">Choose a preset</option>
          {presets.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.name}
            </option>
          ))}
        </select>
      </RecipeDemoGroup>
      <RecipeDemoGroup>
        <RecipeBuilderSurface>
          <Builder
            fields={fields}
            data={query}
            onChange={setQuery}
            showValidation
          />
        </RecipeBuilderSurface>
      </RecipeDemoGroup>
      <RecipeDemoGroup>
        <RecipeDemoOutput label="Preset status" value={message} />
      </RecipeDemoGroup>
    </RecipeDemoFrame>
  );
};

export default SaveLoadFilterPresetsDemo;
