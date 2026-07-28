import React, { PropsWithChildren } from 'react';
import { renderHook } from '@testing-library/react';
import {
  BuilderContext,
  IBuilderContextProps,
} from '../../../../../builder/context';
import { strings } from '../../../../../shared/localization/locales/en-us';
import {
  getMuiCloneTitle,
  getMuiLockTitle,
  getMuiSelectPlaceholder,
  useMuiBuilderStrings,
} from './copy';

const wrapper = ({ children }: PropsWithChildren) =>
  React.createElement(
    BuilderContext.Provider,
    { value: { strings } as IBuilderContextProps },
    children
  );

describe('#adapters/mui/shared/components/copy', () => {
  it('resolves explicit copy and localized fallbacks', () => {
    expect(getMuiSelectPlaceholder('Choose', 'Fallback')).toBe('Choose');
    expect(getMuiSelectPlaceholder(undefined, 'Fallback')).toBe('Fallback');
    expect(getMuiCloneTitle('Duplicate', 'rule', strings)).toBe('Duplicate');
    expect(getMuiCloneTitle(undefined, 'rule', strings)).toBe(
      strings.rule!.clone
    );
    expect(getMuiLockTitle(undefined, 'group', 'unlocked', strings)).toBe(
      strings.group!.lock
    );
  });

  it('reads strings from the builder context', () => {
    const { result } = renderHook(useMuiBuilderStrings, { wrapper });

    expect(result.current).toBe(strings);
  });
});
