import { mount } from 'enzyme';
import React from 'react';
import { Builder, IBuilderFieldProps } from './builder';

export const fields: IBuilderFieldProps[] = [
  {
    field: 'MOCK_FIELD',
    label: 'Mock Field',
    type: 'TEXT',
    operators: ['EQUAL', 'NOT_EQUAL'],
  },
  {
    field: 'MOCK_NUMBER',
    label: 'Mock Number',
    type: 'NUMBER',
    operators: ['EQUAL', 'NOT_EQUAL'],
  },
];

describe('#components/Builder', () => {
  it('Test full functionality', () => {
    const onChange = jest.fn();

    mount(<Builder fields={fields} data={[]} onChange={onChange} />);

    expect(onChange).not.toHaveBeenCalled();
  });

  it('Updates rendered criteria when data prop changes', () => {
    const wrapper = mount(
      <Builder fields={fields} data={[]} onChange={jest.fn()} />
    );

    expect(wrapper.find('[data-test="IteratorRule"]').hostNodes().length).toEqual(0);

    wrapper.setProps({
      data: [
        {
          type: 'GROUP',
          value: 'AND',
          isNegated: false,
          children: [{ field: 'MOCK_FIELD', value: '', operator: 'EQUAL' }],
        },
      ],
    });
    wrapper.update();

    expect(wrapper.find('[data-test="IteratorRule"]').hostNodes().length).toEqual(1);
  });

  it('Only renders drag handles when draggable is enabled', () => {
    const wrapper = mount(
      <Builder
        fields={fields}
        data={[
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [{ field: 'MOCK_FIELD', value: '', operator: 'EQUAL' }],
          },
        ]}
        onChange={jest.fn()}
      />
    );

    expect(wrapper.find('[data-test="DragHandle"]').hostNodes().length).toEqual(0);

    wrapper.setProps({ draggable: true });
    wrapper.update();

    expect(wrapper.find('[data-test="DragHandle"]').hostNodes().length).toBeGreaterThan(0);
  });

  it('Adds a group at the root level', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <Builder
        fields={fields}
        data={[]}
        singleRootGroup={false}
        onChange={onChange}
      />
    );

    wrapper.find('[data-test="AddRootGroup"]').first().simulate('click');
    wrapper.update();

    expect(onChange).toHaveBeenLastCalledWith([
      expect.objectContaining({ type: 'GROUP' }),
      expect.objectContaining({ type: 'GROUP' }),
    ]);
  });

  it('Adds a rule at the root level', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <Builder
        fields={fields}
        data={[]}
        singleRootGroup={false}
        onChange={onChange}
      />
    );

    wrapper.find('[data-test="AddRootRule"]').first().simulate('click');
    wrapper.update();

    expect(onChange).toHaveBeenLastCalledWith([
      expect.objectContaining({ type: 'GROUP' }),
      expect.objectContaining({ field: '' }),
    ]);
  });

  it('Allows deleting a group at the root level', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <Builder
        fields={fields}
        data={[
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [],
          },
        ]}
        singleRootGroup={false}
        onChange={onChange}
      />
    );

    wrapper.find('[data-test="Remove"]').first().simulate('click');
    wrapper.update();

    expect(onChange).toHaveBeenLastCalledWith([]);
    expect(wrapper.find('[data-test="Remove"]').hostNodes().length).toEqual(0);
    expect(wrapper.find('[data-test="AddRootGroup"]').hostNodes().length).toEqual(1);
  });

  it('Omits modifiers from groups when groupTypes is without-modifiers', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <Builder
        fields={fields}
        data={[]}
        groupTypes="without-modifiers"
        singleRootGroup={false}
        onChange={onChange}
      />
    );

    wrapper.find('[data-test="AddRootGroup"]').first().simulate('click');
    wrapper.update();

    const emittedData = onChange.mock.calls[onChange.mock.calls.length - 1][0];

    expect(emittedData).toHaveLength(2);
    expect(emittedData[0]).toMatchObject({
      type: 'GROUP',
      children: [],
    });
    expect(emittedData[1]).toMatchObject({
      type: 'GROUP',
      children: [],
    });
    expect('value' in emittedData[0]).toEqual(false);
    expect('isNegated' in emittedData[0]).toEqual(false);
    expect('value' in emittedData[1]).toEqual(false);
    expect('isNegated' in emittedData[1]).toEqual(false);
  });

  it('Renders a group-type popover when groupTypes is both', () => {
    const wrapper = mount(
      <Builder
        fields={fields}
        data={[]}
        groupTypes="both"
        singleRootGroup={false}
        onChange={jest.fn()}
      />
    );

    expect(wrapper.find('[data-test="AddRootGroup"]').length).toBeGreaterThan(0);
    expect(wrapper.find('[data-test="AddRootGroupWithModifiers"]').length).toEqual(0);
    expect(wrapper.find('[data-test="AddRootGroupWithoutModifiers"]').length).toEqual(0);

    wrapper
      .find('button')
      .filterWhere(node => node.text() === 'Add Group')
      .first()
      .simulate('click');
    wrapper.update();

    expect(
      wrapper.find('button').filterWhere(node => node.text() === 'With Modifiers')
        .length
    ).toBeGreaterThan(0);
    expect(
      wrapper.find('button').filterWhere(node => node.text() === 'Without Modifiers')
        .length
    ).toBeGreaterThan(0);
  });

  it('Does not render modifier controls for modifierless groups', () => {
    const wrapper = mount(
      <Builder
        fields={fields}
        data={[
          {
            type: 'GROUP',
            children: [{ field: 'MOCK_FIELD', value: '', operator: 'EQUAL' }],
          },
        ]}
        groupTypes="without-modifiers"
        onChange={jest.fn()}
      />
    );

    expect(wrapper.find('[data-test="Option[not]"]').length).toEqual(0);
    expect(wrapper.find('[data-test="Option[and]"]').length).toEqual(0);
    expect(wrapper.find('[data-test="Option[or]"]').length).toEqual(0);
  });

  it('Locks the builder to a single undeletable root group', () => {
    const wrapper = mount(
      <Builder
        fields={fields}
        data={[{ field: 'MOCK_FIELD', value: '', operator: 'EQUAL' }]}
        singleRootGroup
        draggable
        onChange={jest.fn()}
      />
    );

    expect(wrapper.find('[data-test="AddRootRule"]').length).toEqual(0);
    expect(wrapper.find('[data-test="AddRootGroup"]').length).toEqual(0);
    expect(wrapper.find('[data-test="IteratorRule"]').hostNodes().length).toEqual(1);
    expect(
      wrapper.find('button').filterWhere((node) => node.text() === 'Delete').length
    ).toEqual(1);
    expect(wrapper.find('[data-test="DragHandle"]').hostNodes().length).toEqual(1);
  });

  it('Emits numeric values for number fields', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <Builder
        fields={fields}
        data={[
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [{ field: 'MOCK_NUMBER', value: 0, operator: 'EQUAL' }],
          },
        ]}
        onChange={onChange}
      />
    );

    wrapper.find('input[type="number"]').first().simulate('change', {
      target: { value: '42.5' },
    });
    wrapper.update();

    expect(onChange).toHaveBeenLastCalledWith([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [{ field: 'MOCK_NUMBER', value: 42.5, operator: 'EQUAL' }],
      },
    ]);
  });

  it('Emits validation state and renders validation issues when enabled', async () => {
    const onStateChange = jest.fn();
    const wrapper = mount(
      <Builder
        fields={[
          {
            field: 'REQUIRED_TEXT',
            label: 'Required Text',
            type: 'TEXT',
            operators: ['EQUAL'],
            validation: {
              required: true,
            },
          },
        ]}
        data={[
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [{ field: 'REQUIRED_TEXT', value: '', operator: 'EQUAL' }],
          },
        ]}
        showValidation
        onStateChange={onStateChange}
      />
    );

    await Promise.resolve();
    wrapper.update();

    expect(onStateChange).toHaveBeenCalled();
    expect(onStateChange.mock.calls[onStateChange.mock.calls.length - 1][0]).toMatchObject({
      isValid: false,
      validation: {
        isValid: false,
      },
    });
    expect(wrapper.text()).toContain('This value is required');
  });

  it('Does not render field validation errors for placeholder rules without a selected field', async () => {
    const wrapper = mount(
      <Builder
        fields={fields}
        data={[
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [{ field: '' }],
          },
        ]}
        showValidation
      />
    );

    await Promise.resolve();
    wrapper.update();

    expect(wrapper.text()).not.toContain('Field "" is not defined');
  });

  it('Does not render field validation errors for placeholder rules with missing field values', async () => {
    const wrapper = mount(
      <Builder
        fields={fields}
        data={[
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [{} as never],
          },
        ]}
        showValidation
      />
    );

    await Promise.resolve();
    wrapper.update();

    expect(wrapper.text()).not.toContain('is not defined');
  });
});
