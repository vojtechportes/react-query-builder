import * as React from 'react';
import styled from 'styled-components';
import { ClientOnly } from '../../../components/client-only';
import { useV1PageMetadata } from '../../seo/hooks/use-v1-page-metadata';
import { createV1PageMetadataOptions } from '../../seo/utils/create-v1-page-metadata-options.util';
import { findV1SeoPage } from '../../seo/utils/find-v1-seo-page.util';
import { findV1RouteRecord } from '../../app/utils/find-v1-route-record.util';
import { loadDemoPlayground } from './load-demo-playground';

const Root = styled.section`
  display: grid;
  gap: 1rem;
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(2rem, 4vw, 3rem);
`;

const seoPage = findV1SeoPage('/demo');
const route = findV1RouteRecord('/demo');

export const DemoPage: React.FC = () => {
  useV1PageMetadata(
    seoPage.title,
    seoPage.description,
    createV1PageMetadataOptions(seoPage, route)
  );

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
