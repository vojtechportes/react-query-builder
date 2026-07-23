import * as React from 'react';
import styled from 'styled-components';
import { ClientOnly } from '../../components/client-only';
import { findSeoPage } from '../../constants/seo-pages';
import { usePageMetadata } from '../../hooks/use-page-metadata';
import { loadDemoPlayground } from './load-demo-playground';

const Root = styled.section`
  display: grid;
  gap: 1rem;
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(2rem, 4vw, 3rem);
`;

const seoPage = findSeoPage('/demo');

export const DemoPage: React.FC = () => {
  usePageMetadata(seoPage.title, seoPage.description, seoPage);

  return (
    <Root>
      <Title>Demo</Title>
      <p>
        Configure fields, adapters, validation, text editing, localization, and
        query output in the interactive playground below.
      </p>
      <ClientOnly
        loader={loadDemoPlayground}
        label="Loading the interactive query builder playground..."
        minHeight="32rem"
      />
    </Root>
  );
};
