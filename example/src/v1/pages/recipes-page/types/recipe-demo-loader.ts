import type { ComponentType } from 'react';

export type RecipeDemoLoader = () => Promise<{
  default: ComponentType;
}>;
