import { addVersionPrefix } from '../../../shared/versioned-url';

export const createV2PublicPath = (url: string, basename?: string): string =>
  addVersionPrefix(url, 'v2', basename);
