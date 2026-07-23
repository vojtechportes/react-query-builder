import type { IDocumentationPage } from './documentation-page';

export interface IDocumentationGroup {
  key: string;
  title: string;
  pages: IDocumentationPage[];
}
