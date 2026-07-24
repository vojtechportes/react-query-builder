import { addVersionPrefix } from '../../../shared/versioned-url';

export const createV1PublicPath = (url: string, basename?: string): string =>
  addVersionPrefix(url, 'v1', basename);
