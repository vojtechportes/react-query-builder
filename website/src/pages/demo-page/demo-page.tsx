import * as React from 'react';
import styled from 'styled-components';
import { Typography } from '../../components/typography/typography';
import { ClientOnly } from '../../components/client-only';
import { findSeoPage } from '../../constants/seo-pages';
import { usePageMetadata } from '../../hooks/use-page-metadata';
import { loadDemoPlayground } from './load-demo-playground';

const Root = styled.section`
  display: grid;
  gap: 1rem;
`;

const seoPage = findSeoPage('/demo');

export const DemoPage: React.FC = () => {
  usePageMetadata(seoPage.title, seoPage.description, seoPage);

  return (
    <Root>
      <Typography variant="h1" fontSize="clamp(2rem, 4vw, 3rem)">
        Demo
      </Typography>
      <Typography color="muted">
        Configure fields, adapters, validation, text editing, localization, and
        query output in the interactive playground below.
      </Typography>
      <ClientOnly
        loader={loadDemoPlayground}
        label="Loading the interactive query builder playground..."
        minHeight="32rem"
      />
    </Root>
  );
};
