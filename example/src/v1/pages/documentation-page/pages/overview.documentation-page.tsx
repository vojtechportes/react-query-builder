import * as React from 'react';
import { AlertBox } from '../../../../components/alert-box';
import { List, TextLink } from '../../../../components/docs-primitives';
import type { IDocumentationPage } from '../types/documentation-page';

export const overviewDocumentationPage: IDocumentationPage = {
  path: '/documentation',
  title: 'Documentation Overview',
  sectionKey: 'overview',
  sectionTitle: 'Documentation',
  summary: '',
  description:
    'Documentation overview for installation, usage, parsing and formatting, customization, adapters, and localization.',
  searchText:
    'Documentation overview installation usage parsing formatting configuration theming localization adapters bootstrap demo query builder react library website',
  content: (
    <>
      <List>
        <li>
          Start with installation and the first controlled builder example.
        </li>
        <li>
          Use{' '}
          <TextLink to="/documentation/dynamic-field-options">
            Dynamic Field Options
          </TextLink>{' '}
          when list values need to come from async or dependent data sources.
        </li>
        <li>
          <TextLink to="/documentation/field-comparisons">
            Field Comparisons
          </TextLink>{' '}
          shows how to compare one field against another field.
        </li>
        <li>
          Move to parsing and formatting when you need interoperability with
          external query syntaxes.
        </li>
        <li>
          Visit <TextLink to="/documentation/adapters">Adapters</TextLink> if
          you want ready-made mappings for MUI, ANTD, Bootstrap, Mantine, Fluent
          UI, or Radix Themes.
        </li>
        <li>
          Use the <TextLink to="/api">API reference</TextLink> when you need
          prop, data-shape, or export-level details.
        </li>
      </List>
      <AlertBox title="Recommended path" variant="tip">
        If you are evaluating the library, visit the{' '}
        <TextLink to="/demo">Demo</TextLink> first and then continue with{' '}
        <TextLink to="/documentation/usage">Usage</TextLink>.
      </AlertBox>
    </>
  ),
};
