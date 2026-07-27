import type * as React from 'react';

export interface IApiPage {
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
