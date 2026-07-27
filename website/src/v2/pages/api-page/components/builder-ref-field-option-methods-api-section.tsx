import * as React from 'react';
import {
  InlineCode,
  ItemTitle,
  List,
  SectionTitle,
} from '../../../../components/docs-primitives';

export const BuilderRefFieldOptionMethodsApiSection: React.FC = () => (
  <>
    <SectionTitle>Field Option Methods</SectionTitle>
    <List>
      <li>
        <ItemTitle>
          <InlineCode>setFieldOptions(field, options)</InlineCode>:
        </ItemTitle>{' '}
        Replaces the shared runtime option set for a field without changing the
        original <InlineCode>fields</InlineCode> prop.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>setFieldOptionsStatus(field, status)</InlineCode>:
        </ItemTitle>{' '}
        Stores a shared option loading state of <InlineCode>'idle'</InlineCode>,{' '}
        <InlineCode>'loading'</InlineCode>, <InlineCode>'success'</InlineCode>,
        or <InlineCode>'error'</InlineCode>.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>invalidateFieldOptions(field)</InlineCode>:
        </ItemTitle>{' '}
        Clears the shared runtime cache and falls back to the static options
        defined in <InlineCode>field.value</InlineCode>.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>reloadFieldOptions(field)</InlineCode>:
        </ItemTitle>{' '}
        Invalidates the shared runtime cache and then calls{' '}
        <InlineCode>onFieldOptionsReload(field)</InlineCode> so the surrounding
        app can trigger a refetch.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>clearFieldOptions(field)</InlineCode>:
        </ItemTitle>{' '}
        Removes the shared runtime option state entirely.
      </li>
    </List>
  </>
);
