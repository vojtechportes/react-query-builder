import * as React from 'react';
import styled from 'styled-components';
import { DemoPlayground } from '../../components/demo-playground';
import { usePageMetadata } from '../../hooks/use-page-metadata';

const Root = styled.section`
  display: grid;
  gap: 1rem;
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(2rem, 4vw, 3rem);
`;

export const DemoPage: React.FC = () => {
  usePageMetadata(
    'Demo',
    'Interactive demo of React Query Builder with configuration toggles, undo and redo history, theme editing, and output previews.'
  );

  return (
    <Root>
      <Title>Demo</Title>
      <DemoPlayground />
    </Root>
  );
};
