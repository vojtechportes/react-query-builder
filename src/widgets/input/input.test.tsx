import React, { ReactElement } from 'react';
import '@testing-library/jest-dom';
import { readFileSync } from 'fs';
import { join } from 'path';
import { renderToString } from 'react-dom/server';
import { fireEvent, render } from '@testing-library/react';
import {
  IBuilderComponentsProps,
  IBuilderFieldProps,
  defaultComponents,
} from '../../builder';
import { BuilderContext } from '../../builder-context';
import { Input } from './input';
import styles from './input.module.css';

const components: IBuilderComponentsProps = defaultComponents;
const fields: IBuilderFieldProps[] = [
  { field: 'MOCK_FIELD', label: 'Mock Field', type: 'TEXT' },
];
const data: any[] = [{ id: 'test', value: '' }];

const renderWithContext = (
  element: ReactElement,
  overrides?: Partial<
    React.ComponentProps<typeof BuilderContext.Provider>['value']
  >
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
    const editableText = renderWithContext(
      <Input id="test" value="" type="text" />
    );
    const editableNumber = renderWithContext(
      <Input id="test" value="" type="number" />
    );
    const readOnlyText = renderWithContext(
      <Input id="test" value="" type="text" />,
      {
        readOnly: true,
      }
    );
    const readOnlyNumber = renderWithContext(
      <Input id="test" value="" type="number" />,
      {
        readOnly: true,
      }
    );

    expect(editableText.container.firstChild).toBeTruthy();
    expect(editableNumber.container.firstChild).toBeTruthy();
    expect(readOnlyText.container.firstChild).toBeTruthy();
    expect(readOnlyNumber.container.firstChild).toBeTruthy();
  });

  it('renders a text input for interaction', () => {
    const { container } = renderWithContext(
      <Input id="test" value="" type="text" />
    );

    fireEvent.change(container.querySelector('input') as HTMLElement, {
      target: { value: 'next' },
    });

    expect(container.querySelector('input')).toBeTruthy();
  });

  it('falls back to the default form components when custom ones are unavailable', () => {
    const { container } = renderWithContext(
      <Input id="test" value="" type="text" />,
      {
        components: {} as IBuilderComponentsProps,
      }
    );

    expect(container.querySelector('input')).toBeTruthy();
  });

  it('resets field-comparison rules back to literal mode in the non-dispatch path', () => {
    const onChange = jest.fn();
    const onFieldChange = jest.fn();
    const fieldComparisonData: any[] = [
      {
        id: 'test',
        field: 'MOCK_FIELD',
        operator: 'EQUAL',
        valueSource: 'field',
        valueField: 'OTHER_FIELD',
      },
    ];
    const { container } = renderWithContext(
      <Input id="test" value="" type="text" />,
      {
        data: fieldComparisonData,
        onChange,
        onFieldChange,
      }
    );

    fireEvent.change(container.querySelector('input') as HTMLElement, {
      target: { value: 'next' },
    });

    expect(onChange).toHaveBeenCalledWith([
      {
        id: 'test',
        field: 'MOCK_FIELD',
        operator: 'EQUAL',
        valueSource: 'value',
        value: 'next',
      },
    ]);
    expect(onFieldChange).toHaveBeenCalledWith(
      expect.objectContaining({
        previousValueSource: 'field',
        previousValueField: 'OTHER_FIELD',
        valueSource: 'value',
        value: 'next',
        data: [
          {
            field: 'MOCK_FIELD',
            operator: 'EQUAL',
            valueSource: 'value',
            value: 'next',
          },
        ],
      })
    );
  });
});

describe('#components/Widgets/Input range layout', () => {
  it('renders ordered range values with stable names and layout state', () => {
    const { container } = renderWithContext(
      <Input id="test" value={['2025-01-01', '2025-01-31']} type="date" />,
      {
        data: [
          {
            id: 'test',
            field: 'MOCK_FIELD',
            value: ['2025-01-01', '2025-01-31'],
          },
        ] as any,
      }
    );
    const range = container.querySelector('[data-range-inputs="true"]');
    const inputs = container.querySelectorAll('input');

    expect(range).toHaveClass(styles.rangeInputs);
    expect(inputs).toHaveLength(2);
    expect(inputs[0]).toHaveAttribute(
      'id',
      'query-builder-rule-test-value-start'
    );
    expect(inputs[0]).toHaveAttribute(
      'name',
      'query-builder-rule-test-value-start'
    );
    expect(inputs[0]).toHaveValue('2025-01-01');
    expect(inputs[1]).toHaveAttribute(
      'id',
      'query-builder-rule-test-value-end'
    );
    expect(inputs[1]).toHaveAttribute(
      'name',
      'query-builder-rule-test-value-end'
    );
    expect(inputs[1]).toHaveValue('2025-01-31');
  });

  it('updates each numeric boundary without changing callback order', () => {
    const dispatchAction = jest.fn();
    const onFieldChange = jest.fn();
    const rangeData: any[] = [
      {
        id: 'test',
        field: 'MOCK_FIELD',
        operator: 'BETWEEN',
        value: [1, 2],
      },
    ];
    const { container } = renderWithContext(
      <Input id="test" value={[1, 2]} type="number" />,
      { data: rangeData, dispatchAction, onFieldChange }
    );
    const inputs = container.querySelectorAll('input');

    fireEvent.change(inputs[0], { target: { value: '3' } });
    fireEvent.change(inputs[1], { target: { value: '4' } });

    expect(dispatchAction).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'replace-node',
        node: expect.objectContaining({ value: [3, 2], valueSource: 'value' }),
      })
    );
    expect(dispatchAction).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        type: 'replace-node',
        node: expect.objectContaining({ value: [1, 4], valueSource: 'value' }),
      })
    );
    expect(onFieldChange).toHaveBeenCalledTimes(2);
  });

  it('disables both range boundaries and guards their callbacks', () => {
    const dispatchAction = jest.fn();
    const { container } = renderWithContext(
      <Input id="test" value={['a', 'b']} type="text" disabled />,
      {
        data: [{ id: 'test', field: 'MOCK_FIELD', value: ['a', 'b'] }] as any,
        dispatchAction,
      }
    );
    const inputs = container.querySelectorAll('input');

    expect(inputs[0]).toBeDisabled();
    expect(inputs[1]).toBeDisabled();
    fireEvent.change(inputs[0], { target: { value: 'next' } });

    expect(dispatchAction).not.toHaveBeenCalled();
  });

  it('renders range inputs on the server without styled-components output', () => {
    const markup = renderToString(
      <BuilderContext.Provider
        value={{
          components,
          fields,
          data: [{ id: 'test', field: 'MOCK_FIELD', value: ['a', 'b'] }] as any,
          strings: {},
          setData: jest.fn(),
          onChange: jest.fn(),
          readOnly: false,
        }}
      >
        <Input id="test" value={['a', 'b']} type="text" />
      </BuilderContext.Provider>
    );

    expect(markup).toContain('data-range-inputs="true"');
    expect(markup).toContain(styles.rangeInputs);
    expect(markup).not.toContain('data-styled');
  });

  it('defines extracted range and responsive layout rules', () => {
    const css = readFileSync(join(__dirname, 'input.module.css'), 'utf8');

    expect(css).toContain('grid-auto-columns: minmax(0, 1fr)');
    expect(css).toContain('grid-auto-flow: column');
    expect(css).toContain('min-width: 0');
    expect(css).toContain('@media (max-width: 900px)');
    expect(css).toContain('grid-auto-flow: row');
  });
});
