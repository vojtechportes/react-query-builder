import * as React from 'react';
import { Link, SectionTitle } from '../../../../components/docs-primitives';
import type { IV1RelatedLink } from '../../../app/types/v1-related-link';

export interface IRecipeRelatedLinksProps {
  links: IV1RelatedLink[];
}

export const RecipeRelatedLinks: React.FC<IRecipeRelatedLinksProps> = ({
  links,
}) => (
  <section>
    <SectionTitle>Related guides</SectionTitle>
    <ul>
      {links.map((link) => (
        <li key={link.path}>
          <Link to={link.path} external={link.external}>
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </section>
);
