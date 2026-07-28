import { configure } from '@testing-library/dom';
import { act } from 'react';

export const configureReact19TestingLibrary = (): void => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

  configure({
    asyncWrapper: async (callback) => {
      let result: Awaited<ReturnType<typeof callback>>;

      await act(async () => {
        result = await callback();
      });

      return result!;
    },
    eventWrapper: (callback) => {
      let result: ReturnType<typeof callback>;

      act(() => {
        result = callback();
      });

      return result!;
    },
  });
};
