import { apiPages } from '../constants/api-pages';

export const findApiPage = (pathname: string) => {
  const normalizedPath = pathname.replace(/\/+$/, '') || '/';

  return apiPages.find((page) => page.path === normalizedPath) ?? apiPages[0];
};
