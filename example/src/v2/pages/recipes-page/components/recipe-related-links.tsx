import * as React from 'react';
import { Link, SectionTitle } from '../../../../components/docs-primitives';
import type { IV2RelatedLink } from '../../../app/types/v2-related-link';

export interface IRecipeRelatedLinksProps {
  links: IV2RelatedLink[];
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
