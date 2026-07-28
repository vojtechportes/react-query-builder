import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import {
  BuilderContext,
  IBuilderContextProps,
} from '../../../../../builder/context';
import { strings } from '../../../../../shared/localization/locales/en-us';
import { AntdSelect } from './antd-select';

describe('#adapters/antd/shared/components/antd-select', () => {
  it('renders its adapter behavior', () => {
    render(
      <BuilderContext.Provider value={{ strings } as IBuilderContextProps}>
        <AntdSelect
          values={[{ value: 'active', label: 'Active' }]}
          selectedValue="active"
          onChange={jest.fn()}
        />
      </BuilderContext.Provider>
    );

    expect(screen.getByText('Active')).toBeInTheDocument();
  });
});
