import * as React from 'react';
import type { IDocumentationPage } from '../../types/documentation-page';
import { ParsingAndFormattingSupportedFormatsDocumentationContent } from './components/parsing-and-formatting-supported-formats-documentation-content';

export const parsingAndFormattingSupportedFormatsDocumentationPage: IDocumentationPage =
  {
    path: '/documentation/parsing-and-formatting/supported-formats',
    title: 'Supported Formats',
    sectionKey: 'parsing',
    sectionTitle: 'Parsing and Formatting',
    summary: '',
    description:
      'Supported query conversion formats including SQL, Mongo, AQL, JSONata, JsonLogic, CEL, Elasticsearch, SpEL, Prisma, OData, RSQL, Dynamo, and Django.',
    searchText:
      'SQL Mongo AQL JSONata JsonLogic CEL Elasticsearch SpEL Prisma OData RSQL Dynamo Django supported formats parser formatter query builder',
    content: <ParsingAndFormattingSupportedFormatsDocumentationContent />,
  };
