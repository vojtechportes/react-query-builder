import * as React from 'react';
import { ClientOnly } from '../../../components/client-only';
import type { RecipeDemoLoader } from '../types/recipe-demo-loader';

export interface IRecipeLiveDemoProps {
  loader: RecipeDemoLoader;
}

export const RecipeLiveDemo: React.FC<IRecipeLiveDemoProps> = ({ loader }) => (
  <ClientOnly
    loader={loader}
    label="Loading the interactive recipe demo..."
    minHeight="24rem"
  />
);
