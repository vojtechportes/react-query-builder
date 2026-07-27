import { describe, expectTypeOf, it } from 'vitest';
import type {
  DenormalizedQuery,
  IBuilderComponentsProps,
  IBuilderFieldProps,
  IBuilderProps,
} from '@vojtechportes/react-query-builder';
import type { formatQuery } from '@vojtechportes/react-query-builder/formatQuery';
import type { parseQuery } from '@vojtechportes/react-query-builder/parseQuery';

type AntdAdapterComponents =
  (typeof import('@vojtechportes/react-query-builder/antd/v6'))['components'];
type BootstrapAdapterComponents =
  (typeof import('@vojtechportes/react-query-builder/bootstrap/v5'))['components'];
type FluentUiAdapterComponents =
  (typeof import('@vojtechportes/react-query-builder/fluentui/v8'))['components'];
type MantineAdapterComponents =
  (typeof import('@vojtechportes/react-query-builder/mantine/v9'))['components'];
type MuiAdapterComponents =
  (typeof import('@vojtechportes/react-query-builder/mui/v9'))['components'];
type RadixAdapterComponents =
  (typeof import('@vojtechportes/react-query-builder/radix/v1'))['components'];
type MonacoFactory =
  (typeof import('@vojtechportes/react-query-builder/monaco'))['createMonacoComponents'];

describe('v2 API package bindings', () => {
  it('binds core signatures and query conversion exports to the local v2 target', () => {
    expectTypeOf<IBuilderProps['fields']>().toEqualTypeOf<
      IBuilderFieldProps[]
    >();
    expectTypeOf<IBuilderProps['data']>().toEqualTypeOf<DenormalizedQuery>();
    expectTypeOf<typeof formatQuery>().toBeFunction();
    expectTypeOf<typeof parseQuery>().toBeFunction();
  });

  it('binds every documented adapter and Monaco entry to the local v2 target', () => {
    expectTypeOf<AntdAdapterComponents>().toMatchTypeOf<IBuilderComponentsProps>();
    expectTypeOf<BootstrapAdapterComponents>().toMatchTypeOf<IBuilderComponentsProps>();
    expectTypeOf<FluentUiAdapterComponents>().toMatchTypeOf<IBuilderComponentsProps>();
    expectTypeOf<MantineAdapterComponents>().toMatchTypeOf<IBuilderComponentsProps>();
    expectTypeOf<MuiAdapterComponents>().toMatchTypeOf<IBuilderComponentsProps>();
    expectTypeOf<RadixAdapterComponents>().toMatchTypeOf<IBuilderComponentsProps>();
    expectTypeOf<MonacoFactory>().toBeFunction();
  });
});
