import type { IV2SourceLink } from '../types/v2-source-link';
import { V2_SOURCE_BASE_URL } from '../constants/v2-source-base-url';

export const createV2SourceLink = (path: string): IV2SourceLink => ({
  path,
  href: `${V2_SOURCE_BASE_URL}/${path}`,
});
