import React, { ReactElement } from 'react';
import { fireEvent, render } from '@testing-library/react';
import {
  IBuilderComponentsProps,
  IBuilderFieldProps,
  defaultComponents,
} from '../builder';
import { BuilderContext } from '../builder-context';
import { Input } from './input';

const components: IBuilderComponentsProps = defaultComponents;
const fields: IBuilderFieldProps[] = [
  { field: 'MOCK_FIELD', label: 'Mock Field', type: 'TEXT' },
];
const data: any[] = [{ id: 'test', value: '' }];

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

describe('#components/Widgets/Input', () => {
  it('renders text and number variants in editable and read-only modes', () => {
    const editableText = renderWithContext(<Input id="test" value="" type="text" />);
    const editableNumber = renderWithContext(<Input id="test" value="" type="number" />);
    const readOnlyText = renderWithContext(<Input id="test" value="" type="text" />, {
      readOnly: true,
    });
    const readOnlyNumber = renderWithContext(<Input id="test" value="" type="number" />, {
      readOnly: true,
    });

    expect(editableText.container.firstChild).toBeTruthy();
    expect(editableNumber.container.firstChild).toBeTruthy();
    expect(readOnlyText.container.firstChild).toBeTruthy();
    expect(readOnlyNumber.container.firstChild).toBeTruthy();
  });

  it('renders a text input for interaction', () => {
    const { container } = renderWithContext(<Input id="test" value="" type="text" />);

    fireEvent.change(container.querySelector('input') as HTMLElement, {
      target: { value: 'next' },
    });

    expect(container.querySelector('input')).toBeTruthy();
  });

  it('falls back to the default form components when custom ones are unavailable', () => {
    const { container } = renderWithContext(<Input id="test" value="" type="text" />, {
      components: {} as IBuilderComponentsProps,
    });

    expect(container.querySelector('input')).toBeTruthy();
  });
});
