import * as React from 'react';
import { ThemeProvider } from '../../../../../src/theme-provider/theme-provider';
import { BuilderSurface } from '../../../components/builder-surface';
import { defaultTheme } from '../../../constants/demo-data';

export const RecipeBuilderSurface: React.FC<
  React.PropsWithChildren<{ adapter?: boolean }>
> = ({ adapter = false, children }) => (
  <BuilderSurface>
    {adapter ? (
      children
    ) : (
      <ThemeProvider colors={defaultTheme.colors}>{children}</ThemeProvider>
    )}
  </BuilderSurface>
);
