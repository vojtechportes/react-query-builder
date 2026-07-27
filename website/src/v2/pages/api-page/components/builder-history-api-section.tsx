import * as React from 'react';
import {
  InlineCode,
  ItemTitle,
  List,
  SectionTitle,
} from '../../../../components/docs-primitives';

export const BuilderHistoryApiSection: React.FC = () => (
  <>
    <SectionTitle>History config</SectionTitle>
    <List>
      <li>
        <ItemTitle>
          <InlineCode>maxEntries</InlineCode>:
        </ItemTitle>{' '}
        Optional limit for how many undo steps are retained.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>controls</InlineCode>:
        </ItemTitle>{' '}
        Optional toggle for rendering the built-in Undo and Redo buttons inside
        the builder UI.
      </li>
    </List>
  </>
);
