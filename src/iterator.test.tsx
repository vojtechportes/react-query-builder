import React, { ReactElement } from 'react';
import { render } from '@testing-library/react';
import {
  IBuilderComponentsProps,
  IBuilderFieldProps,
  defaultComponents,
} from './builder';
import { BuilderContext } from './builder-context';
import { strings } from './constants/strings';
import { Iterator } from './iterator';
import { NormalizedQuery } from './utils/query-tree';

const components: IBuilderComponentsProps = defaultComponents;
const fields: IBuilderFieldProps[] = [
  {
    field: 'MOCK_FIELD',
    label: 'Mock Field',
    type: 'TEXT',
  },
];
const data: NormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    id: 'test-1',
    children: ['test-2', 'test-3'],
  },
  { field: 'MOCK_FIELD', value: '', id: 'test-2', parent: 'test-1' },
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    id: 'test-3',
    children: ['test-4'],
  },
  { field: 'MOCK_FIELD', value: '', id: 'test-4', parent: 'test-3' },
];

const filteredData: NormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    id: 'test-1',
    children: ['test-2', 'test-3'],
  },
];

const renderWithContext = (element: ReactElement) =>
  render(
    <BuilderContext.Provider
      value={{
        components,
        fields,
        data,
        strings,
        setData: jest.fn(),
        onChange: jest.fn(),
        readOnly: false,
      }}
    >
      {element}
    </BuilderContext.Provider>
  );

describe('#components/Iterator', () => {
  it('renders the iterator root', () => {
    const { container } = renderWithContext(
      <Iterator filteredData={[]} originalData={[]} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders nested rules from the original data', () => {
    const { container } = renderWithContext(
      <Iterator filteredData={filteredData} originalData={data} />
    );

    expect(container.querySelectorAll('[data-test="IteratorRule"]')).toHaveLength(2);
  });
});
