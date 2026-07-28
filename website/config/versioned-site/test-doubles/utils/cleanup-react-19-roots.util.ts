import { act } from 'react';
import { mountedReact19Roots } from '../constants/mounted-react-19-roots';

export const cleanupReact19Roots = (): void => {
  for (const [container, root] of mountedReact19Roots) {
    act(() => root.unmount());
    container.remove();
  }

  mountedReact19Roots.clear();
};
