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
      <Builder fields={fields} data={[]} onChange={onChange} />
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
      <Builder fields={fields} data={[]} onChange={onChange} />
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
});
