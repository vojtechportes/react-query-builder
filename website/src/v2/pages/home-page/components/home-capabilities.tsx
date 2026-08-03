import * as React from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';
import { ClientOnly } from '../../../../components/client-only';
import { Typography } from '../../../../components/typography/typography';
import { siteTheme } from '../../../../constants/site-theme';
import { HomeShowcase } from './home-showcase';

const loadTextModeDemo = () =>
  import('./home-text-mode-demo').then(({ HomeTextModeDemo }) => ({
    default: HomeTextModeDemo,
  }));

const loadMuiAdapterDemo = () =>
  import('./home-mui-adapter-demo').then(({ HomeMuiAdapterDemo }) => ({
    default: HomeMuiAdapterDemo,
  }));

const Root = styled.section`
  display: grid;
  gap: 42px;

  .home-capability-overview {
    display: grid;
    gap: 1.5rem;
  }

  .home-section-heading {
    max-width: 48rem;
  }

  .home-capability-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }

  .home-capability-card {
    padding: 1.5rem;
    border: 1px solid #dbe4f0;
    border-radius: 16px;
    background: #fff;
  }

  .home-capability-card a {
    color: ${siteTheme.primary};
    font-weight: 700;
  }

  .home-showcase-list {
    display: grid;
    gap: 42px;
  }

  @media (max-width: 720px) {
    .home-capability-grid {
      grid-template-columns: 1fr;
    }
  }
`;

const SectionTitle = styled(Typography)`
  font-size: clamp(1.8rem, 3vw, 2.5rem);
  letter-spacing: -0.03em;
`;

export const HomeCapabilities: React.FC = () => (
  <Root aria-labelledby="home-capabilities-title">
    <div className="home-capability-overview">
      <div className="home-section-heading">
        <SectionTitle id="home-capabilities-title" variant="h2" mb={0.75}>
          Build and convert complex queries
        </SectionTitle>
        <Typography color="muted">
          Configure fields and editing behavior, let users build queries
          visually or as text, and convert the result for your API or database.
        </Typography>
      </div>
      <div className="home-capability-grid">
        <article className="home-capability-card">
          <Typography variant="h3" as="h6" mb={0.65}>
            Add the query builder to your app
          </Typography>
          <Typography color="muted" mb={0.8}>
            Define fields, manage query state, validate input, and control how
            users edit each query.
          </Typography>
          <Link to="/documentation/usage">Read the usage guide</Link>
        </article>
        <article className="home-capability-card">
          <Typography variant="h3" as="h6" mb={0.65}>
            Convert queries for your stack
          </Typography>
          <Typography color="muted" mb={0.8}>
            Convert query data to and from SQL, MongoDB, Prisma, Elasticsearch,
            OData, RSQL, and other supported formats.
          </Typography>
          <Link to="/documentation/parsing-and-formatting/supported-formats">
            View supported formats
          </Link>
        </article>
      </div>
    </div>
    <div className="home-showcase-list">
      <HomeShowcase
        actionLabel="Explore text mode"
        description="Let users switch between the visual builder and SQL text mode while validation and protected query segments remain in place."
        title="Edit queries visually or as text"
        to="/documentation/text-mode"
        tone="dark"
      >
        <ClientOnly
          label="Loading the text mode query builder..."
          loader={loadTextModeDemo}
          minHeight="15rem"
        />
      </HomeShowcase>
      <HomeShowcase
        actionLabel="See more UI adapters"
        description="Use the default components or ready-made adapters for MUI, Ant Design, Bootstrap, Mantine, Fluent UI, and Radix Themes."
        reverse
        title="Match your design system"
        to="/documentation/adapters"
      >
        <ClientOnly
          label="Loading the MUI query builder..."
          loader={loadMuiAdapterDemo}
          minHeight="12rem"
        />
      </HomeShowcase>
    </div>
  </Root>
);
