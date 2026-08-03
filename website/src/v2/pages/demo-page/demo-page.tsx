import * as React from 'react';
import styled from 'styled-components';
import { Typography } from '../../../components/typography/typography';
import { ClientOnly } from '../../../components/client-only';
import { useV2PageMetadata } from '../../seo/hooks/use-v2-page-metadata';
import { createV2PageMetadataOptions } from '../../seo/utils/create-v2-page-metadata-options.util';
import { findV2SeoPage } from '../../seo/utils/find-v2-seo-page.util';
import { findV2RouteRecord } from '../../app/utils/find-v2-route-record.util';
import { loadDemoPlayground } from './load-demo-playground';

const Root = styled.section`
  display: grid;
  gap: 1rem;
`;

const seoPage = findV2SeoPage('/demo');
const route = findV2RouteRecord('/demo');

export const DemoPage: React.FC = () => {
  useV2PageMetadata(
    seoPage.title,
    seoPage.description,
    createV2PageMetadataOptions(seoPage, route)
  );

  return (
    <Root>
      <Typography variant="h1" fontSize="clamp(2rem, 4vw, 3rem)">
        Demo
      </Typography>
      <ClientOnly
        loader={loadDemoPlayground}
        label="Loading the interactive query builder playground..."
        minHeight="32rem"
      />
    </Root>
  );
};
