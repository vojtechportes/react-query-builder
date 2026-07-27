export const normalizeBasename = (basename?: string): string => {
  const withLeadingSlash = basename?.startsWith('/')
    ? basename
    : `/${basename ?? ''}`;

  return withLeadingSlash.replace(/\/+$/, '');
};
