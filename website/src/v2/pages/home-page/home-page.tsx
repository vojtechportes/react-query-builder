import * as React from 'react';
import styled from 'styled-components';
import { findV2RouteRecord } from '../../app/utils/find-v2-route-record.util';
import { useV2PageMetadata } from '../../seo/hooks/use-v2-page-metadata';
import { createV2PageMetadataOptions } from '../../seo/utils/create-v2-page-metadata-options.util';
import { findV2SeoPage } from '../../seo/utils/find-v2-seo-page.util';
import { HomeCapabilities } from './components/home-capabilities';
import { HomeHero } from './components/home-hero';
import { HomeIntegrations } from './components/home-integrations';
import { HomeQuickStart } from './components/home-quick-start';

const Root = styled.div`
  display: grid;
  gap: 42px;
`;

const seoPage = findV2SeoPage('/');
const route = findV2RouteRecord('/');

export const HomePage: React.FC = () => {
  useV2PageMetadata(
    seoPage.title,
    seoPage.description,
    createV2PageMetadataOptions(seoPage, route)
  );

  return (
    <Root>
      <HomeHero />
      <HomeCapabilities />
      <HomeQuickStart />
      <HomeIntegrations />
    </Root>
  );
};
