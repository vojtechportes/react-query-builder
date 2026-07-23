import { describe, expect, it } from 'vitest';
import type { BuilderProps } from '@vojtechportes/react-query-builder';
import { formatQuery } from '@vojtechportes/react-query-builder/formatQuery';
import { strings } from '@vojtechportes/react-query-builder/locale/en-US';
import { parseQuery } from '@vojtechportes/react-query-builder/parseQuery';

describe('selected package runtime', () => {
  it('loads representative test subpath exports', () => {
    const rootTypeSmoke: Pick<BuilderProps, 'fields'> = { fields: [] };

    expect(rootTypeSmoke.fields).toEqual([]);
    expect(parseQuery).toBeTypeOf('function');
    expect(formatQuery).toBeTypeOf('function');
    expect(strings).toBeTypeOf('object');
  });
});
