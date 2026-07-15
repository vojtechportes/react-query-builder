import * as React from 'react';
import type { RecipeDemoLoader } from '../types/recipe-demo-loader';

export interface IRecipeLiveDemoProps {
  loader: RecipeDemoLoader;
}

export const RecipeLiveDemo: React.FC<IRecipeLiveDemoProps> = ({ loader }) => {
  const Demo = React.useMemo(() => React.lazy(loader), [loader]);

  return (
    <React.Suspense fallback={<p role="status">Loading interactive demo...</p>}>
      <Demo />
    </React.Suspense>
  );
};
