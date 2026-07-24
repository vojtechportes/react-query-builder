import { createV2PublicPath } from './create-v2-public-path.util';

export const getV2RouterBasename = (basename?: string): string =>
  createV2PublicPath('/', basename);
