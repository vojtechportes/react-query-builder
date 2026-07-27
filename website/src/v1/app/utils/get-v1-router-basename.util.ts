import { createV1PublicPath } from './create-v1-public-path.util';

export const getV1RouterBasename = (basename?: string): string =>
  createV1PublicPath('/', basename);
