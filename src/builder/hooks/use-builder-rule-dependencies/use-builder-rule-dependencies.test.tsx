import React, { FC } from 'react';
import { render } from '@testing-library/react';
import { BuilderRef } from '../use-builder-ref/types';
import { useBuilderRuleDependencies } from './use-builder-rule-dependencies';

interface IRuleDependenciesConsumerProps {
  builderRef: BuilderRef;
  dependencyFields: string[];
}

const RuleDependenciesConsumer: FC<IRuleDependenciesConsumerProps> = ({
  builderRef,
  dependencyFields,
}) => {
  useBuilderRuleDependencies(builderRef, 'country', dependencyFields);

  return null;
};

describe('useBuilderRuleDependencies', () => {
  it('resubscribes only when dependency field contents change and cleans up', () => {
    const unsubscribe = jest.fn();
    const subscribeToRuleDependencies = jest.fn(() => unsubscribe);
    const builderRef = {
      subscribeToRuleDependencies,
    } as unknown as BuilderRef;
    const { rerender, unmount } = render(
      <RuleDependenciesConsumer
        builderRef={builderRef}
        dependencyFields={['region', 'tenant']}
      />
    );

    expect(subscribeToRuleDependencies).toHaveBeenCalledTimes(1);

    rerender(
      <RuleDependenciesConsumer
        builderRef={builderRef}
        dependencyFields={['region', 'tenant']}
      />
    );

    expect(subscribeToRuleDependencies).toHaveBeenCalledTimes(1);
    expect(unsubscribe).not.toHaveBeenCalled();

    rerender(
      <RuleDependenciesConsumer
        builderRef={builderRef}
        dependencyFields={['region', 'organization']}
      />
    );

    expect(unsubscribe).toHaveBeenCalledTimes(1);
    expect(subscribeToRuleDependencies).toHaveBeenCalledTimes(2);
    expect(subscribeToRuleDependencies).toHaveBeenLastCalledWith(
      'country',
      ['region', 'organization'],
      expect.any(Function)
    );

    unmount();

    expect(unsubscribe).toHaveBeenCalledTimes(2);
  });
});
