import * as React from 'react';
import { InlineCode, ItemTitle } from '../../../../components/docs-primitives';

export const BuilderCorePropsApiItems: React.FC = () => (
  <>
    <li>
      <ItemTitle>
        <InlineCode>fields</InlineCode>:
      </ItemTitle>{' '}
      Required. Defines the available fields, their types, allowed operators,
      and optional validation metadata.
    </li>
    <li>
      <ItemTitle>
        <InlineCode>data</InlineCode>:
      </ItemTitle>{' '}
      Required. The current denormalized query tree. The builder treats this as
      controlled input.
    </li>
    <li>
      <ItemTitle>Ref support:</ItemTitle> <InlineCode>Builder</InlineCode>{' '}
      supports React refs and can be paired with{' '}
      <InlineCode>useBuilderRef()</InlineCode> for imperative access.
    </li>
    <li>
      <ItemTitle>
        <InlineCode>components</InlineCode>:
      </ItemTitle>{' '}
      Optional overrides for internal UI pieces. Omitted entries fall back to
      default components.
    </li>
    <li>
      <ItemTitle>
        <InlineCode>strings</InlineCode>:
      </ItemTitle>{' '}
      Optional localized UI strings used by the built-in controls.
    </li>
    <li>
      <ItemTitle>
        <InlineCode>textMode</InlineCode>:
      </ItemTitle>{' '}
      Optional. Enables SQL text mode. Pass <InlineCode>true</InlineCode> for
      the default configuration or{' '}
      <InlineCode>IBuilderTextModeConfig</InlineCode> for explicit SQL text-mode
      settings.
    </li>
    <li>
      <ItemTitle>
        <InlineCode>defaultMode</InlineCode>:
      </ItemTitle>{' '}
      Optional. Controls whether the builder initially opens in{' '}
      <InlineCode>'builder'</InlineCode> or <InlineCode>'text'</InlineCode>{' '}
      mode. This only takes effect when text mode is enabled.
    </li>
    <li>
      <ItemTitle>
        <InlineCode>readOnly</InlineCode>:
      </ItemTitle>{' '}
      Defaults to <InlineCode>false</InlineCode>. Makes the whole builder
      non-editable.
    </li>
    <li>
      <ItemTitle>
        <InlineCode>readOnlyProtectsDelete</InlineCode>:
      </ItemTitle>{' '}
      Defaults to <InlineCode>true</InlineCode>. When enabled, groups cannot be
      deleted if that would indirectly remove read-only protected descendants.
      Set it to <InlineCode>false</InlineCode> to allow those parent-group
      deletes while keeping direct read-only node restrictions.
    </li>
    <li>
      <ItemTitle>
        <InlineCode>lockable</InlineCode>:
      </ItemTitle>{' '}
      Defaults to <InlineCode>false</InlineCode>. Renders lock controls for
      rules and groups and writes the resulting lock state back into emitted
      query data without discarding existing targeted{' '}
      <InlineCode>readOnly.targets</InlineCode> configurations.
    </li>
    <li>
      <ItemTitle>
        <InlineCode>cloneable</InlineCode>:
      </ItemTitle>{' '}
      Defaults to <InlineCode>false</InlineCode>. Renders clone controls for
      rules and groups and inserts the cloned node directly below the original.
    </li>
    <li>
      <ItemTitle>
        <InlineCode>draggable</InlineCode>:
      </ItemTitle>{' '}
      Defaults to <InlineCode>false</InlineCode>. Enables drag-and-drop
      reordering and movement of query nodes.
    </li>
  </>
);
