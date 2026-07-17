import * as React from 'react';
import { ThemeProvider } from '../../../../../src/theme-provider/theme-provider';
import { BuilderSurface } from '../../../components/builder-surface';
import { MuiBuilderSurface } from '../../../components/mui-builder-surface';
import { defaultTheme } from '../../../constants/demo-data';

export const RecipeBuilderSurface: React.FC<
  React.PropsWithChildren<{ adapter?: boolean }>
> = ({ adapter = false, children }) => {
  if (adapter) {
    return <MuiBuilderSurface>{children}</MuiBuilderSurface>;
  }

  return (
    <BuilderSurface>
      <ThemeProvider colors={defaultTheme.colors}>{children}</ThemeProvider>
    </BuilderSurface>
  );
};
