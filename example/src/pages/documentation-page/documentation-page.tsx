import * as React from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { ContentArticle } from '../../components/content-article';
import { DocumentationSidebar } from '../../components/documentation-sidebar';
import { ParsingSandbox } from '../../components/parsing-sandbox';
import { usePageMetadata } from '../../hooks/use-page-metadata';
import {
  documentationGroups,
  documentationOverviewPage,
  findDocumentationPage,
} from './pages/documentation-content';

const Layout = styled.div`
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 1.5rem;

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`;

const SectionLabel = styled.span`
  font-size: 0.8rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #64748b;
`;

const Title = styled.h1`
  margin: 0;
  margin-bottom: 1rem;
  font-size: clamp(2rem, 4vw, 3rem);
`;

const Summary = styled.p`
  font-size: 1.05rem;
  margin-top: 0.55rem;
`;

export const DocumentationPage: React.FC = () => {
  const location = useLocation();
  const page = findDocumentationPage(location.pathname);
  usePageMetadata(page.title, page.description);

  return (
    <Layout>
      <DocumentationSidebar
        title="Documentation"
        overviewPage={documentationOverviewPage}
        groups={documentationGroups}
      />
      <ContentArticle>
        <SectionLabel>{page.sectionTitle}</SectionLabel>
        <Title>{page.title}</Title>
        {page.summary ? <Summary>{page.summary}</Summary> : null}
        {page.content}
        {page.path === '/documentation/parsing-and-formatting' ? (
          <ParsingSandbox />
        ) : null}
      </ContentArticle>
    </Layout>
  );
};
