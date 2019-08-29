import { shallow } from 'enzyme';
import React from 'react';
import { Button } from '../../src/components/Button';

describe('#components/Button', () => {
  it('Tests Snapshot', () => {
    expect(
      shallow(<Button onClick={jest.fn()} label={'Test'} />)
    ).toMatchSnapshot();
  });
});
