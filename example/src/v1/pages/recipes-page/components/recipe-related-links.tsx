import * as React from 'react';
import { Link, SectionTitle } from '../../../../components/docs-primitives';
import type { IRecipePage } from '../types/recipe-page';
import { formatPathLabel } from '../utils/format-path-label.util';

export interface IRecipeRelatedLinksProps {
  page: IRecipePage;
  pagesByPath: Map<string, IRecipePage>;
}

export const RecipeRelatedLinks: React.FC<IRecipeRelatedLinksProps> = ({
  page,
  pagesByPath,
}) => (
  <section>
    <SectionTitle>Related guides</SectionTitle>
    <ul>
      {page.relatedDocPaths.map((path) => (
        <li key={path}>
          <Link to={path}>{formatPathLabel(path)}</Link>
        </li>
      ))}
      {page.relatedRecipePaths.map((path) => (
        <li key={path}>
          <Link to={path}>{pagesByPath.get(path)?.title ?? path}</Link>
        </li>
      ))}
      {page.externalReferences?.map((reference) => (
        <li key={reference.href}>
          <Link to={reference.href} external>
            {reference.label}
          </Link>
        </li>
      ))}
    </ul>
  </section>
);
