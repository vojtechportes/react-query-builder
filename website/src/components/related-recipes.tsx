import * as React from 'react';
import { SectionTitle, TextLink } from './docs-primitives';

export interface IRelatedRecipesProps {
  links?: { path: string; label: string }[];
}

export const RelatedRecipes: React.FC<IRelatedRecipesProps> = ({ links }) =>
  links?.length ? (
    <section>
      <SectionTitle>Related recipes</SectionTitle>
      <ul>
        {links.map((link) => (
          <li key={link.path}>
            <TextLink to={link.path}>{link.label}</TextLink>
          </li>
        ))}
      </ul>
    </section>
  ) : null;
