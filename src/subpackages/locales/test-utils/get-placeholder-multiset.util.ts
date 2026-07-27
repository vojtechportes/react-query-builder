export const getPlaceholderMultiset = (value: string): string[] =>
  [...value.matchAll(/\{([^{}]+)\}/g)]
    .map(([, token]) => token)
    .sort((left, right) => left.localeCompare(right));
