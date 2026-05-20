import * as React from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { DocumentationSidebar } from '../../components/documentation-sidebar';
import { usePageMetadata } from '../../hooks/use-page-metadata';
import {
  apiGroups,
  apiOverviewPage,
  findApiPage,
} from './pages/api-content';

const Layout = styled.div`
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 1.5rem;

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`;

const Article = styled.article`
  padding: 2rem;
  border: 1px solid #dbe4f0;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 28px 70px rgba(15, 23, 42, 0.08);

  > * + * {
    margin-top: 1rem;
  }

  > p {
    margin: 0;
    color: #334155;
    line-height: 1.8;
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

export const ApiPage: React.FC = () => {
  const location = useLocation();
  const page = findApiPage(location.pathname);
  usePageMetadata(page.title, page.description);

  return (
    <Layout>
      <DocumentationSidebar
        title="API"
        overviewPage={apiOverviewPage}
        groups={apiGroups}
      />
      <Article>
        <SectionLabel>{page.sectionTitle}</SectionLabel>
        <Title>{page.title}</Title>
        {page.summary ? <Summary>{page.summary}</Summary> : null}
        {page.content}
      </Article>
    </Layout>
  );
};
