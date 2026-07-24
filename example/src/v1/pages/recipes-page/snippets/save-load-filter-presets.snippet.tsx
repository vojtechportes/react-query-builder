import React from 'react';
import {
  Builder,
  type DenormalizedQuery,
  type IBuilderFieldProps,
} from '@vojtechportes/react-query-builder';

interface IFilterPreset {
  id: string;
  name: string;
  version: 1;
  query: DenormalizedQuery;
}

const fields: IBuilderFieldProps[] = [
  { field: 'region', label: 'Region', type: 'TEXT' },
  { field: 'revenue', label: 'Revenue', type: 'NUMBER' },
];

const emptyQuery: DenormalizedQuery = [
  { type: 'GROUP', value: 'AND', isNegated: false, children: [] },
];

const storageKey = 'filter-presets';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isQueryNode = (value: unknown): boolean => {
  if (!isRecord(value)) return false;
  if (value.type === 'GROUP') {
    return (
      (value.value === 'AND' || value.value === 'OR') &&
      Array.isArray(value.children) &&
      value.children.every(isQueryNode)
    );
  }
  return typeof value.field === 'string' && typeof value.operator === 'string';
};

const validatePreset = (value: unknown): IFilterPreset | undefined => {
  if (
    !isRecord(value) ||
    typeof value.id !== 'string' ||
    typeof value.name !== 'string' ||
    value.version !== 1 ||
    !Array.isArray(value.query) ||
    !value.query.every(isQueryNode)
  ) {
    return undefined;
  }
  return value as unknown as IFilterPreset;
};

const readPresets = (): IFilterPreset[] => {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
    return Array.isArray(value)
      ? value
          .map(validatePreset)
          .filter((item): item is IFilterPreset => !!item)
      : [];
  } catch {
    return [];
  }
};

export const PresetFilter = () => {
  const [query, setQuery] = React.useState(emptyQuery);
  const [name, setName] = React.useState('My filter');
  const [selectedId, setSelectedId] = React.useState('');
  const [presets, setPresets] = React.useState(readPresets);

  const updatePresets = (next: IFilterPreset[]) => {
    localStorage.setItem(storageKey, JSON.stringify(next));
    setPresets(next);
  };

  const save = () => {
    const preset: IFilterPreset = {
      id: crypto.randomUUID(),
      name: name.trim(),
      version: 1,
      query,
    };

    updatePresets([...presets, preset]);
    setSelectedId(preset.id);
  };

  const load = () => {
    const preset = presets.find((item) => item.id === selectedId);
    if (preset) setQuery(preset.query);
  };

  const rename = () =>
    updatePresets(
      presets.map((preset) =>
        preset.id === selectedId ? { ...preset, name: name.trim() } : preset
      )
    );

  const remove = () => {
    updatePresets(presets.filter((preset) => preset.id !== selectedId));
    setSelectedId('');
  };

  return (
    <>
      <input value={name} onChange={(event) => setName(event.target.value)} />
      <select
        value={selectedId}
        onChange={(event) => setSelectedId(event.target.value)}
      >
        <option value="">Choose preset</option>
        {presets.map((preset) => (
          <option key={preset.id} value={preset.id}>
            {preset.name}
          </option>
        ))}
      </select>
      <button onClick={save}>Save new</button>
      <button onClick={load} disabled={!selectedId}>
        Load
      </button>
      <button onClick={rename} disabled={!selectedId || !name.trim()}>
        Rename
      </button>
      <button onClick={remove} disabled={!selectedId}>
        Delete
      </button>
      <Builder fields={fields} data={query} onChange={setQuery} />
    </>
  );
};
