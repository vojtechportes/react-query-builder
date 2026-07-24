import { routerBasename } from '../../app/router-basename';
import { getV1RouterBasename } from './utils/get-v1-router-basename.util';

export const v1RouterBasename = getV1RouterBasename(routerBasename);
