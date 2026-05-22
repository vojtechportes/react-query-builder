import React, { ReactElement } from 'react';
import { fireEvent, render } from '@testing-library/react';
import {
  IBuilderComponentsProps,
  IBuilderFieldProps,
  defaultComponents,
} from '../builder';
import { BuilderContext } from '../builder-context';
import { Boolean } from './boolean';

const components: IBuilderComponentsProps = defaultComponents;
const fields: IBuilderFieldProps[] = [
  { field: 'MOCK_FIELD', label: 'Mock Field', type: 'BOOLEAN' },
];
const data: any[] = [{ id: 'test', value: false }];

const renderWithContext = (
  element: ReactElement,
  overrides?: Partial<React.ComponentProps<typeof BuilderContext.Provider>['value']>
) =>
  render(
    <BuilderContext.Provider
      value={{
        components,
        fields,
        data,
        strings: {},
        setData: jest.fn(),
        onChange: jest.fn(),
        readOnly: false,
        ...overrides,
      }}
    >
      {element}
    </BuilderContext.Provider>
  );

describe('#components/Widgets/Boolean', () => {
  it('renders in editable and read-only modes', () => {
    const editable = renderWithContext(
      <Boolean id="test" selectedValue={false} />
    );
    const readOnly = renderWithContext(
      <Boolean id="test" selectedValue={false} />,
      { readOnly: true }
    );

    expect(editable.container.firstChild).toBeTruthy();
    expect(readOnly.container.firstChild).toBeTruthy();
  });

  it('toggles the switch', () => {
    const { container } = renderWithContext(
      <Boolean id="test" selectedValue={false} />
    );

    fireEvent.click(container.querySelector('[data-test="Switch"]') as HTMLElement);

    expect(container.firstChild).toBeTruthy();
  });

  it('falls back to the default form components when custom ones are unavailable', () => {
    const { container } = renderWithContext(
      <Boolean id="test" selectedValue={false} />,
      { components: {} as IBuilderComponentsProps }
    );

    expect(container.querySelector('[data-test="Switch"]')).toBeTruthy();
  });
});
