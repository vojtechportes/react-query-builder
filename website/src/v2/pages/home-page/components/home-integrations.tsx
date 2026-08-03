import * as React from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';
import { Button } from '../../../../components/button';
import { Typography } from '../../../../components/typography/typography';

const Root = styled.section`
  display: grid;
  gap: 1.5rem;

  ul {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.8rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  ul a {
    display: block;
    height: 100%;
    padding: 1rem 1.1rem;
    border: 1px solid #dbe4f0;
    border-radius: 12px;
    background: #fff;
    color: #0f172a;
    font-weight: 700;
  }

  @media (max-width: 760px) {
    ul {
      grid-template-columns: 1fr;
    }
  }
`;

const SectionTitle = styled(Typography)`
  font-size: clamp(1.8rem, 3vw, 2.5rem);
  letter-spacing: -0.03em;
`;

export const HomeIntegrations: React.FC = () => (
  <Root aria-labelledby="home-integrations-title">
    <SectionTitle id="home-integrations-title" variant="h2">
      Use it in real applications
    </SectionTitle>
    <Typography color="muted" mt={-0.75}>
      Follow complete recipes for tables, forms, URLs, databases, and
      server-side filtering.
    </Typography>
    <ul>
      <li>
        <Link to="/recipes/prisma-filter-ui">Build a Prisma filter UI</Link>
      </li>
      <li>
        <Link to="/recipes/tanstack-table-filtering">
          Filter a TanStack Table
        </Link>
      </li>
      <li>
        <Link to="/recipes/mui-datagrid-advanced-filtering">
          Filter MUI DataGrid
        </Link>
      </li>
      <li>
        <Link to="/recipes/react-hook-form-query-builder">
          Use React Hook Form
        </Link>
      </li>
      <li>
        <Link to="/recipes/sql-where-to-react-query-builder">
          Import a SQL WHERE clause
        </Link>
      </li>
      <li>
        <Link to="/recipes/server-side-filtering">
          Add server-side filtering
        </Link>
      </li>
    </ul>
    <Button component="a" size="small" to="/recipes" variant="outlined">
      Browse all recipes
    </Button>
  </Root>
);
