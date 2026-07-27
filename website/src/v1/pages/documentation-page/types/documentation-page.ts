import type * as React from 'react';

export interface IDocumentationPage {
  path: string;
  title: string;
  depth?: number;
  sectionKey: string;
  sectionTitle: string;
  summary: string;
  description: string;
  searchText: string;
  content: React.ReactNode;
}
