import type { IV1SourceLink } from '../types/v1-source-link';
import { V1_SOURCE_BASE_URL } from '../constants/v1-source-base-url';

export const createV1SourceLink = (path: string): IV1SourceLink => ({
  path,
  href: `${V1_SOURCE_BASE_URL}/${path}`,
});
