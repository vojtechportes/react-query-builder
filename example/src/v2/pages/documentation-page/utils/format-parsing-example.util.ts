import type { DenormalizedQuery } from '@vojtechportes/react-query-builder';
import { demoFields } from '../../demo-page/constants/demo-fields';
import type { SupportedQueryFormat } from '../../demo-page/types/supported-query-format';
import { formatQueryText } from '../../demo-page/utils/format-query-text.util';

export const formatParsingExample = (
  query: DenormalizedQuery,
  format: SupportedQueryFormat
) => formatQueryText(query, format, demoFields);
