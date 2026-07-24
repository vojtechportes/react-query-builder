export const formatPathLabel = (path: string) =>
  path
    .split('/')
    .filter(Boolean)
    .slice(-1)[0]!
    .split('-')
    .map((word) => `${word[0].toUpperCase()}${word.slice(1)}`)
    .join(' ');
