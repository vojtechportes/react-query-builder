import React, { PropsWithChildren } from 'react';
import { renderHook } from '@testing-library/react';
import {
  BuilderContext,
  IBuilderContextProps,
} from '../../../../../builder/context';
import { strings } from '../../../../../shared/localization/locales/en-us';
import {
  getAntdCloneTitle,
  getAntdLockTitle,
  getAntdSelectPlaceholder,
  useAntdBuilderStrings,
} from './copy';

const wrapper = ({ children }: PropsWithChildren) =>
  React.createElement(
    BuilderContext.Provider,
    { value: { strings } as IBuilderContextProps },
    children
  );

describe('#adapters/antd/shared/components/copy', () => {
  it('resolves explicit copy and localized fallbacks', () => {
    expect(getAntdSelectPlaceholder('Choose', 'Fallback')).toBe('Choose');
    expect(getAntdSelectPlaceholder(undefined, 'Fallback')).toBe('Fallback');
    expect(getAntdCloneTitle('Duplicate', 'rule', strings)).toBe('Duplicate');
    expect(getAntdCloneTitle(undefined, 'rule', strings)).toBe(
      strings.rule!.clone
    );
    expect(getAntdLockTitle(undefined, 'group', 'unlocked', strings)).toBe(
      strings.group!.lock
    );
  });

  it('reads strings from the builder context', () => {
    const { result } = renderHook(useAntdBuilderStrings, { wrapper });

    expect(result.current).toBe(strings);
  });
});
