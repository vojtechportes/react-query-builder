import { documentationPages } from '../constants/documentation-pages';

export const findDocumentationPage = (pathname: string) => {
  const normalizedPath = pathname.replace(/\/+$/, '') || '/';

  return (
    documentationPages.find((page) => page.path === normalizedPath) ??
    documentationPages[0]
  );
};
