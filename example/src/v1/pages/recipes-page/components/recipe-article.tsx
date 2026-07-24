import * as React from 'react';
import { AlertBox } from '../../../../components/alert-box';
import { CodeBlock } from '../../../../components/code-block';
import { List, SectionTitle } from '../../../../components/docs-primitives';
import type { IRecipePage } from '../types/recipe-page';
import { RecipeFaq } from './recipe-faq';
import { RecipeLiveDemo } from './recipe-live-demo';
import { RecipeRelatedLinks } from './recipe-related-links';

export interface IRecipeArticleProps {
  page: IRecipePage;
  pagesByPath: Map<string, IRecipePage>;
}

export const RecipeArticle: React.FC<IRecipeArticleProps> = ({
  page,
  pagesByPath,
}) => (
  <>
    {page.illustrative ? (
      <AlertBox title="This demo uses a mock service">
        <p>
          This interactive demo simulates the backend or AI provider. In your
          app, validate requests on your server and keep API keys and access
          checks there.
        </p>
      </AlertBox>
    ) : null}
    <SectionTitle>What this recipe builds</SectionTitle>
    <List>
      {page.capabilities.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </List>
    <RecipeLiveDemo loader={page.demoLoader} />
    <SectionTitle>Install and imports</SectionTitle>
    <CodeBlock
      code={page.installCode}
      language="bash"
      label="Install / imports"
    />
    <SectionTitle>Fields and initial query</SectionTitle>
    <CodeBlock code={page.fieldsCode} label="Typed field configuration" />
    <SectionTitle>Builder implementation</SectionTitle>
    <CodeBlock code={page.builderCode} label="React implementation" />
    <SectionTitle>{page.transformTitle}</SectionTitle>
    <CodeBlock code={page.transformCode} label={page.transformTitle} />
    {page.expectedOutput ? (
      <CodeBlock
        code={page.expectedOutput}
        language="json"
        label="Expected output"
      />
    ) : null}
    <SectionTitle>Validation and safety</SectionTitle>
    <List>
      {page.safetyNotes.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </List>
    <SectionTitle>Production notes</SectionTitle>
    <List>
      {page.productionNotes.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </List>
    <RecipeRelatedLinks page={page} pagesByPath={pagesByPath} />
    <RecipeFaq faqs={page.faqs} />
  </>
);
