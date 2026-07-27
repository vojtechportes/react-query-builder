import * as React from 'react';
import type { IDocumentationPage } from '../../types/documentation-page';
import { ParsingAndFormattingDocumentationContent } from './components/parsing-and-formatting-documentation-content';

export const parsingAndFormattingDocumentationPage: IDocumentationPage = {
  path: '/documentation/parsing-and-formatting',
  title: 'Overview',
  sectionKey: 'parsing',
  sectionTitle: 'Parsing and Formatting',
  summary: '',
  description:
    'Overview of parsing and formatting query data across supported external formats.',
  searchText:
    'Parsing formatting SQL Mongo AQL JSONata JsonLogic CEL Elasticsearch SpEL Prisma OData RSQL Dynamo Django parseQuery formatQuery interoperability sandbox',
  content: <ParsingAndFormattingDocumentationContent />,
};
