import * as React from 'react';
import { List, SectionTitle } from '../../../../components/docs-primitives';
import { BuilderCorePropsApiItems } from './builder-core-props-api-items';
import { BuilderBehaviorPropsApiItems } from './builder-behavior-props-api-items';

export const BuilderPropsApiSection: React.FC = () => (
  <>
    <SectionTitle>Props</SectionTitle>
    <List>
      <BuilderCorePropsApiItems />
      <BuilderBehaviorPropsApiItems />
    </List>
  </>
);
