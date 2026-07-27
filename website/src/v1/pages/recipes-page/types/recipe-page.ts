import type { IRecipeFaq } from './recipe-faq';
import type { RecipeDemoLoader } from './recipe-demo-loader';

export interface IRecipePage {
  path: string;
  demoLoader: RecipeDemoLoader;
  title: string;
  summary: string;
  description: string;
  groupKey: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchText: string;
  relatedRecipePaths: string[];
  relatedDocPaths: string[];
  externalReferences?: { label: string; href: string }[];
  installCode: string;
  fieldsCode: string;
  builderCode: string;
  transformTitle: string;
  transformCode: string;
  expectedOutput?: string;
  illustrative?: boolean;
  capabilities: string[];
  safetyNotes: string[];
  productionNotes: string[];
  faqs: IRecipeFaq[];
}
