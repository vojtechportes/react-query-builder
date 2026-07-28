import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import {
  BuilderContext,
  IBuilderContextProps,
} from '../../../../../builder/context';
import { strings } from '../../../../../shared/localization/locales/en-us';
import { AntdSelectMulti } from './antd-select-multi';

describe('#adapters/antd/shared/components/antd-select-multi', () => {
  it('renders its adapter behavior', () => {
    render(
      <BuilderContext.Provider value={{ strings } as IBuilderContextProps}>
        <AntdSelectMulti
          values={[{ value: 'active', label: 'Active' }]}
          selectedValue={['active']}
          onChange={jest.fn()}
          onDelete={jest.fn()}
        />
      </BuilderContext.Provider>
    );

    expect(screen.getByText('Active')).toBeInTheDocument();
  });
});
