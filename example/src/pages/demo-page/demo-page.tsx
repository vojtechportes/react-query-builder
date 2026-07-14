import * as React from 'react';
import styled from 'styled-components';
import { DemoPlayground } from '../../components/demo-playground';
import { findSeoPage } from '../../constants/seo-pages';
import { usePageMetadata } from '../../hooks/use-page-metadata';

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
      <DemoPlayground />
    </Root>
  );
};
