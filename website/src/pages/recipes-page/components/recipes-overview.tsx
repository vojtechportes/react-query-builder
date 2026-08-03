import * as React from 'react';
import styled from 'styled-components';
import { Typography } from '../../../components/typography/typography';
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
              <Typography variant="h3" as="h6" fontWeight={700}>
                <TextLink to={page.path}>{page.title}</TextLink>
              </Typography>
              <Typography color="muted" mt={0.5}>
                {page.summary}
              </Typography>
            </Card>
          ))}
        </Grid>
      </section>
    ))}
  </>
);
