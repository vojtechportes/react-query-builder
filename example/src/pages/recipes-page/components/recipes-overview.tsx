import * as React from 'react';
import styled from 'styled-components';
import { SectionTitle, TextLink } from '../../../components/docs-primitives';
import type { IRecipeGroup } from '../types/i-recipe-group';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
`;

const Card = styled.article`
  padding: 1rem;
  border: 1px solid #dbe4f0;
  border-radius: 14px;
  background: #f8fafc;

  h3,
  p {
    margin: 0;
  }

  p {
    margin-top: 0.5rem;
    color: #475569;
    line-height: 1.6;
  }
`;

export interface IRecipesOverviewProps {
  groups: IRecipeGroup[];
}

export const RecipesOverview: React.FC<IRecipesOverviewProps> = ({
  groups,
}) => (
  <>
    {groups.map((group) => (
      <section key={group.key}>
        <SectionTitle>{group.title}</SectionTitle>
        <Grid>
          {group.pages.map((page) => (
            <Card key={page.path}>
              <h3>
                <TextLink to={page.path}>{page.title}</TextLink>
              </h3>
              <p>{page.summary}</p>
            </Card>
          ))}
        </Grid>
      </section>
    ))}
  </>
);
